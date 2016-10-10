/* 
 * File:    hardware_config.h
 * Author:  joshua
 * Created: March 31, 2016, 12:53 AM
 */

#ifndef HARDWARE_CONFIG_H
#define	HARDWARE_CONFIG_H

#ifdef	__cplusplus
extern "C" {
#endif

// clock speed characteristic
#define FOSC            (32000000ul)            // Hz (1/s)
#define FCY             (FOSC/2)                // Hz (1/s)

// hardware configuration for debug LED
#define DEBUG_LED_LAT       LATA                // port latch register
#define DEBUG_LED_TRIS      TRISA               // port TRIS I/O buffer register
#define DEBUG_LED_PORT      PORTA               // port digitital I/O pin (for reading)
#define DEBUG_LED_MASK      (1<<2)              // RA2, pin 9

// hardware configuration for pan servo
#define SERVOX_PPS          RPOR1               // PPS output register
#define SERVOX_PPS_MASK     (0b00111111<<0)     // RP2Rx, pin 6
#define SERVOX_PPS_OUT_FUNC (13<<0)             // use Output Compare/PWM 1 (OC1)
#define SERVOX_OCxCON1      OC1CON1             // output compare control reg 1
#define SERVOX_OCxCON2      OC1CON2             // output compare control reg 2
#define SERVOX_OCxRS        OC1RS               // PWM period control reg
#define SERVOX_OCxR         OC1R                // PWM duty cycle control reg
#define SERVOX_DUTY_MIN     1350
#define SERVOX_DUTY_MAX     4800
#define SERVOX_DUTY_RNG     SERVOX_DUTY_MAX-SERVOX_DUTY_MIN
#define SERVOX_ANGLE_RNG    180                 //  assuming a 180 degree servo

// hardware configuration for tilt servo
#define SERVOY_PPS          RPOR1               // PPS output register
#define SERVOY_PPS_MASK     (0b00111111<<8)     // RP3Rx, pin 7
#define SERVOY_PPS_OUT_FUNC (14<<8)             // use Output Compare/PWM 2 (OC2)
#define SERVOY_OCxCON1      OC2CON1             // output compare control reg 1
#define SERVOY_OCxCON2      OC2CON2             // output compare control reg 2
#define SERVOY_OCxRS        OC2RS               // PWM period control reg
#define SERVOY_OCxR         OC2R                // PWM duty cycle control reg
#define SERVOY_DUTY_MIN     1250
#define SERVOY_DUTY_MAX     4900
#define SERVOY_DUTY_RNG     SERVOY_DUTY_MAX-SERVOY_DUTY_MIN
#define SERVOY_ANGLE_RNG    180                 //  assuming a 180 degree servo


#ifdef	__cplusplus
}
#endif

#endif	/* HARDWARE_CONFIG_H */

