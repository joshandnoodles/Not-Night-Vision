/*
 * File:    main.c
 * Author:  joshua
 * Created: March 21, 2016, 11:24 AM
 */

#include <p24FJ128GB202.h>
#include "config.h"
#include "hardware_config.h"

#include "delay.h"
#include "piezo.h"
#include "laser.h"
#include "gimbal.h"
#include "mlx.h"
#include "SMBus.h"

#include "system.h"
#include "system_config.h"
#include "usb.h"
#include "usb_device_hid.h"

#include "usb_status_led.h"
#include "usb_comm.h"

//#define USB_POLLING 1
    
// macros for changing debug LED
#define mDEBUG_LED_OFF()    DEBUG_LED_TRIS&=~DEBUG_LED_MASK;\
                            DEBUG_LED_LAT&=~DEBUG_LED_MASK;
#define mDEBUG_LED_ON()     DEBUG_LED_TRIS&=~DEBUG_LED_MASK;\
                            DEBUG_LED_LAT|=DEBUG_LED_MASK;
#define mDEBUG_LED_TOGGLE() DEBUG_LED_TRIS&=~DEBUG_LED_MASK;\
                            DEBUG_LED_LAT^=DEBUG_LED_MASK;

// function prototypes




/*******************************************************************
 * Function:        bool USER_USB_CALLBACK_EVENT_HANDLER(
 *                        USB_EVENT event, void *pdata, uint16_t size)
 *
 * PreCondition:    None
 *
 * Input:           USB_EVENT event - the type of event
 *                  void *pdata - pointer to the event data
 *                  uint16_t size - size of the event data
 *
 * Output:          None
 *
 * Side Effects:    None
 *
 * Overview:        This function is called from the USB stack to
 *                  notify a user application that a USB event
 *                  occured.  This callback is in interrupt context
 *                  when the USB_INTERRUPT option is selected.
 *
 * Note:            None
 *******************************************************************/
bool USER_USB_CALLBACK_EVENT_HANDLER( USB_EVENT event, void *pdata, uint16_t size )
{
    
    switch((int)event)
    {
        case EVENT_TRANSFER:
            break;

        case EVENT_SOF:
            /* We are using the SOF as a timer to time the LED indicator.  Call
             * the LED update function here. */
            updateUSBStatusLED();
            break;

        case EVENT_SUSPEND:
            /* Update the LED status for the suspend event. */
            updateUSBStatusLED();

            //Call the hardware platform specific handler for suspend events for
            //possible further action (like optionally going reconfiguring the application
            //for lower power states and going to sleep during the suspend event).  This
            //would normally be done in USB compliant bus powered applications, although
            //no further processing is needed for purely self powered applications that
            //don't consume power from the host.
            SYSTEM_Initialize(SYSTEM_STATE_USB_SUSPEND);
            break;

        case EVENT_RESUME:
            /* Update the LED status for the resume event. */
            updateUSBStatusLED();

            //Call the hardware platform specific resume from suspend handler (ex: to
            //restore I/O pins to higher power states if they were changed during the 
            //preceding SYSTEM_Initialize(SYSTEM_STATE_USB_SUSPEND) call at the start
            //of the suspend condition.
            SYSTEM_Initialize(SYSTEM_STATE_USB_RESUME);
            break;

        case EVENT_CONFIGURED:
            /* When the device is configured, we can (re)initialize the demo
             * code. */
            initUSBComm();
            break;

        case EVENT_SET_DESCRIPTOR:
            break;

        case EVENT_EP0_REQUEST:
            /* We have received a non-standard USB request.  The HID driver
             * needs to check to see if the request was for it. */
            USBCheckHIDRequest();
            break;

        case EVENT_BUS_ERROR:
            break;

        case EVENT_TRANSFER_TERMINATED:
            break;

        default:
            break;
    }
    return true;
}

/*******************************************************************************
 End of File
*/


void wait( void ) {
    unsigned idx1, idx2;
    for ( idx1=0; idx1<30; idx1++ )
        for ( idx2=0; idx2<30000; idx2++ )
            Nop();
}

int main( void ) {
    
    int idx1,
        idx2,
        idx3;
    
    // setup clock, FOSC=32MHz w/ 96MHz PLL for USB
    OSCCONbits.NOSC = 1;        // fast RC Oscillator w/ postscaler & prescaler
    OSCCONbits.OSWEN = 1;       // initiate switch
    CLKDIVbits.CPDIV = 0;       // don't touch the speed
    CLKDIVbits.RCDIV = 0;       // get down to 4MHz
    CLKDIVbits.PLLEN = 1;       // turn that bad boy on
    
    // wait for PLL lock
    #ifndef __MPLAB_SIM
    while(_LOCK != 1);
    #endif
    
    // set up debug LED
    mDEBUG_LED_OFF();
    
    mDEBUG_LED_ON();
    
    mDEBUG_LED_OFF();
    
    
    initDelay();
    
    initPiezo();
    
    initGimbal();
    initLaser();
    
    //beepMulti(2);
    
    Nop();
    Nop();
    Nop();
    Nop();
    Nop();
    Nop();
    
    //setGimbalPanTilt( 45,45 );
    //
    
    //setLaserPower( 20 );
    
    
    
    
    
    initMLX();
    
    // start up USB stack
    initUSBStatusLED();
    SYSTEM_Initialize( SYSTEM_STATE_USB_START );
    USBDeviceInit();
    USBDeviceAttach();
    
    unsigned int reg;
    
    while (1) {
         
        SYSTEM_Tasks();

        #if defined(USB_POLLING)
            // Interrupt or polling method.  If using polling, must call
            // this function periodically.  This function will take care
            // of processing and responding to SETUP transactions
            // (such as during the enumeration process when you first
            // plug in).  USB hosts require that USB devices should accept
            // and process SETUP packets in a timely fashion.  Therefore,
            // when using polling, this function should be called
            // regularly (such as once every 1.8ms or faster** [see
            // inline code comments in usb_device.c for explanation when
            // "or faster" applies])  In most cases, the USBDeviceTasks()
            // function does not take very long to execute (ex: <100
            // instruction cycles) before it returns.
            USBDeviceTasks();
        #endif

        /* If the USB device isn't configured yet, we can't really do anything
         * else since we don't have a host to talk to.  So jump back to the
         * top of the while loop. */
        if( USBGetDeviceState() < CONFIGURED_STATE )
        {
            /* Jump back to the top of the while loop. */
            continue;
        }

        /* If we are currently suspended, then we need to see if we need to
         * issue a remote wakeup.  In either case, we shouldn't process any
         * keyboard commands since we aren't currently communicating to the host
         * thus just continue back to the start of the while loop. */
        if( USBIsDeviceSuspended() )
        {
            /* Jump back to the top of the while loop. */
            continue;
        }
        
        
        // temporary...you have 10 beeps to plug usb into computer
        //for ( idx1=0; idx1<10; idx1++ ) {
        //    delay_ms( 1000 );
        //    beep();
        //}
        
            
        while(1) {
            doUSBComm();
        }
        
        //Application specific tasks
        float pan;
        float tilt;
        
        /*for ( tilt=80-13.33+0.833; tilt<93.33; tilt+=0.833 ) {
            for ( pan=90-20+0.833; pan<110; pan+=0.833 ) {
                setGimbalPanTilt( pan, tilt );
                delay_ms( 50 );
                reg = _readRAM( 0x07 );
                mDEBUG_LED_TOGGLE();
                delay_ms( 50 );
                //sendUSB( reg );
            }
        }*/
               
        
     }
    
    return 0;
}


