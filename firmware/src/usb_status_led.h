/* 
 * File:    usb_status_led.h
 * Author:  joshua
 * Created: April 13, 2016, 9:14 PM
 */

#ifndef USB_STATUS_LED_H
#define USB_STATUS_LED_H

#ifdef	__cplusplus
extern "C" {
#endif

// hardware configuration for USB status LED
#define USB_LED_LAT         LATB            // port latch register
#define USB_LED_TRIS        TRISB           // port TRIS I/O buffer register
#define USB_LED_PORT        PORTB           // port digitital I/O pin (for reading)
#define USB_LED_MASK        (1<<7)          // RB7, pin 16

// define blink rates for configured and not configured
#define USB_LED_FAST_START  75              // 50% fast duty cycle
#define USB_LED_FAST_END    150
#define USB_LED_SLOW_START  50              // 5% slow duty cycle
#define USB_LED_SLOW_END    950
    
// macros for changing LED
#define mUSB_STATUS_LED_OFF()   USB_LED_TRIS&=~USB_LED_MASK;\
                                USB_LED_LAT&=~USB_LED_MASK;
#define mUSB_STATUS_LED_ON()    USB_LED_TRIS&=~USB_LED_MASK;\
                                USB_LED_LAT|=USB_LED_MASK;

// function prototypes
void initUSBStatusLED( void );
void updateUSBStatusLED( void );

#ifdef	__cplusplus
}
#endif

#endif	/* USB_STATUS_LED_H */

