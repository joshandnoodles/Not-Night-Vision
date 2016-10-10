/*
 * File:    usb_status_led.c
 * Author:  joshua
 * Created: April 14, 2016, 9:15 PM
 * Descr:   LED is off in suspend mode
 *          LED blinks fast when USB is configured
 *          LED blinks slow when not configured
 */

#include "usb_device.h"

#include "usb_status_led.h"

void initUSBStatusLED( void ) {
    
    // turn off pin at start
    mUSB_STATUS_LED_OFF();
    
    return;
}

void updateUSBStatusLED( void ) {
    
    static unsigned int ledCount = 0;

    if( USBGetSuspendState() ) {
        
        // turn off LED if in suspend
        mUSB_STATUS_LED_OFF();
        
        return;
    }

    switch( USBGetDeviceState() ) {
        
        case CONFIGURED_STATE:
            // blink fast if we are configured
            
            if (ledCount==1) {
                mUSB_STATUS_LED_ON();               // turn on
            } else if (ledCount==USB_LED_FAST_START) {
                mUSB_STATUS_LED_OFF();              // turn off
            } else if (ledCount>USB_LED_FAST_END) {
                ledCount = 0;                       // reset count
            }
            
            break;

        default:
            // blink slow if we are not configured
            
            if (ledCount==1) {
                mUSB_STATUS_LED_ON();               // turn on
            } else if (ledCount==USB_LED_SLOW_START) {
                mUSB_STATUS_LED_OFF();              // turn off
            } else if (ledCount>USB_LED_SLOW_END) {
                ledCount = 0;                       // reset count
            }
            
            break;
    }

    // bump the loop counter
    ledCount++;
    
    return;
}
