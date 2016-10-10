/* 
 * File:    servo.h
 * Author:  joshua
 * Created: March 25, 2016, 7:49 PM
 */

#ifndef SERVO_H
#define	SERVO_H

#ifdef	__cplusplus
extern "C" {
#endif

// function prototypes
volatile unsigned *initServo( 
        volatile unsigned *ppsReg, unsigned ppsMask, 
        unsigned ppsOutFunc,
        volatile unsigned *ocxcon1Reg, volatile unsigned *ocxcon2Reg, 
        volatile unsigned *ocxrsReg, volatile unsigned *ocxrReg,
        unsigned initDuty );
void setServoAngle( 
        volatile unsigned *servoDuty, unsigned servoAngleRange,
        unsigned servoDutyBase, unsigned servoDutyRange,
        float angle );

#ifdef	__cplusplus
}
#endif

#endif	/* SERVO_H */

