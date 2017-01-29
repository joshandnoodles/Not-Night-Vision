/*
 * File:    gimbal.c
 * Author:  joshua
 * Created: March 25, 2016, 7:40 PM
 */

#include <p24FJ128GB202.h>
#include "hardware_config.h"
#include "servo.h"          // another abstraction layer not specific to gimbal

#include "gimbal.h"

// global variables to store register locations controlling duty cycles
volatile unsigned *servoXDuty;
volatile unsigned *servoYDuty;

void initGimbal( void ) { 
    
    // ready servos by starting up the PWMs they are connected to setting their
    // initial position while storing the register controlling their duty cycles
    // so we can modify their position later
    servoXDuty = initServo( 
            &SERVOX_PPS, SERVOX_PPS_MASK, SERVOX_PPS_OUT_FUNC,
            &SERVOX_OCxCON1, &SERVOX_OCxCON2, &SERVOX_OCxRS, &SERVOX_OCxR,
            (SERVOX_DUTY_MIN+SERVOX_DUTY_MAX)/2 );
    servoYDuty = initServo( 
            &SERVOY_PPS, SERVOY_PPS_MASK, SERVOY_PPS_OUT_FUNC,
            &SERVOY_OCxCON1, &SERVOY_OCxCON2, &SERVOY_OCxRS, &SERVOY_OCxR,
            (SERVOY_DUTY_MIN) );
    
    return;    
}

void setGimbalPanTilt( float angleX, float angleY ) {
    
    // update pan & tilt servos to locations based on information we know about
    // servo characteristics being used and desired pan & tilt angles
    setServoAngle( 
        servoXDuty, SERVOX_ANGLE_RNG,
        SERVOX_DUTY_MIN, SERVOX_DUTY_RNG,
        (SERVOX_ANGLE_RNG-angleX) );
    setServoAngle( 
        servoYDuty, SERVOY_ANGLE_RNG,
        SERVOY_DUTY_MIN, SERVOY_DUTY_RNG,
        angleY );
    
    return;
}

void setGimbalPan( float angle ) {
    
    // update pan servos to locations based on information we know about
    // servo characteristics being used and desired pan angles
    setServoAngle( 
        servoXDuty, SERVOX_ANGLE_RNG,
        SERVOX_DUTY_MIN, SERVOX_DUTY_RNG,
        (SERVOX_ANGLE_RNG-angle) );
    
    return;
}

float getGimbalPan( void ) {
    
    // using what we know about the servo's characteristics, figure out what
    // angle the servo is set at
    float angle = SERVOX_ANGLE_RNG - getServoAngle( 
        servoXDuty, SERVOX_ANGLE_RNG,
        SERVOX_DUTY_MIN, SERVOX_DUTY_RNG );
    
    return angle;
}

void setGimbalTilt( float angle ) {
    
    // update tilt servos to locations based on information we know about
    // servo characteristics being used and desired tilt angles
    setServoAngle( 
        servoYDuty, SERVOY_ANGLE_RNG,
        SERVOY_DUTY_MIN, SERVOY_DUTY_RNG,
        angle );
    
    return;
}

float getGimbalTilt( void ) {
    // using what we know about the servo's characteristics, figure out what
    // angle the servo is set at
    
    float angle = getServoAngle( 
        servoYDuty, SERVOY_ANGLE_RNG,
        SERVOY_DUTY_MIN, SERVOY_DUTY_RNG );
    
    return angle;
}