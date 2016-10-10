/* 
 * File:    laser.h
 * Author:  joshua
 * Created: March 31, 2016, 12:52 AM
 */

#ifndef LASER_H
#define	LASER_H

#ifdef	__cplusplus
extern "C" {
#endif

// hardware configuration for laser
#define LASER_PPS           RPOR3               // PPS output register
#define LASER_PPS_MASK      (0b00111111<<0)     // RP6Rx, pin 3
#define LASER_PPS_OUT_FUNC  (16<<0)             // use Output Compare/PWM 4 (OC4)
#define LASER_OCxCON1       OC4CON1             // output compare control reg 1
#define LASER_OCxCON2       OC4CON2             // output compare control reg 2
#define LASER_OCxRS         OC4RS               // PWM period control reg
#define LASER_OCxR          OC4R                // PWM duty cycle control reg

// function prototypes
void initLaser( void );
volatile unsigned *initLaserPWM( 
        volatile unsigned *ppsReg, unsigned ppsMask, unsigned ppsOutFunc,
        volatile unsigned *ocxcon1Reg, volatile unsigned *ocxcon2Reg, 
        volatile unsigned *ocxrsReg, volatile unsigned *ocxrReg );
void setLaserPower( unsigned char laserPower );
unsigned char getLaserPower( void );

#ifdef	__cplusplus
}
#endif

#endif	/* LASER_H */

