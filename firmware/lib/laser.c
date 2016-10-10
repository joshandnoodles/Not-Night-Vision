/*
 * File:    laser.c
 * Author:  joshua
 * Created: March 31, 2016, 1:06 AM
 */

#include <p24FJ128GB202.h>
#include "laser.h"

// global variable to store register locations controlling duty cycles
volatile unsigned *laserDuty;

void initLaser( void ) {
    
    // ready laser by starting up the PWM it is connected to and setting 
    // arbitrary duty cycle values which we will modify later to change the 
    // laser intensity
    laserDuty = initLaserPWM( 
            &LASER_PPS, LASER_PPS_MASK, LASER_PPS_OUT_FUNC,
            &LASER_OCxCON1, &LASER_OCxCON2,
            &LASER_OCxRS, &LASER_OCxR );
    
    return;
}
    
volatile unsigned *initLaserPWM( 
        volatile unsigned *ppsReg, unsigned ppsMask, unsigned ppsOutFunc,
        volatile unsigned *ocxcon1Reg, volatile unsigned *ocxcon2Reg, 
        volatile unsigned *ocxrsReg, volatile unsigned *ocxrReg ) {
    // readies laser to lase
    // steps detailed in section 15.3 p.219 of PIC24FJ128GB204 FAMILY user guide
    
    // reset PWM configuration options
    *ocxcon1Reg = 0x0000;
    *ocxcon2Reg = 0x0000;
    
    // 1. configure OCx output for one of the available PPS pins
    *ppsReg |= (ppsMask & ppsOutFunc);  // set PPS pin to correct PWM
    
    // 2. calculate desired duty cycle
    // ...and load into OCxR register
    *ocxrReg = 0x000;                          
    
    // 3. calculate desired period   
    //    (PWM period) = ( PRy + 1 ) * Tcy * (Timer prescale value)   
    // ...and load into OCxRS register
    *ocxrsReg = 100;                    // should be arbitrary, will change by set func
    
    // 4. select current OCx as sync source by writing 0x1F to SYNCSEL<4:0> bits
    //    (i.e. OCxCON2<4:0>) and zero to the OCTRIG bit (i.e. OCxCON2<7>)
    *ocxcon2Reg |= 0x001F;              // trigger/sync src select this OC 
                                        // module and sync w/ src
            
    // 5. select clock source using OCTSEL<2:0> (OCxCON1<12:10)
    *ocxcon1Reg |= 0x1C00;              // peripheral clock (FCY)

    // 6. enable interrupts for the timer & output compare modules (needed for
    //    PWM Fault pin utilization)
    // not necessary for our uses here
    
    // 7. select desired PWM mode in the OCM<2:0> bits (i.e. OCxCON1<2:0>)
    *ocxcon1Reg |= 0x0006;              // edge-aligned PWM mode
    
    // 8. enable Fault inputs using ENFLT<2:0> as interrupts
    // not necessary for our uses here
            
    // 9. select the timer prescale value (the the timer's prescaler output 
    //    would be used as the clock input for the OCx timer and not the 
    //    selected timer output)
    // not necessary here since we are not using a timer as a source
    
    return ocxrReg;                     // return reference to duty cycle reg
}  

void setLaserPower( unsigned char laserPower ) {

    // update laser intensity position based on user entered integer value
    *laserDuty = laserPower;
    
    // !update! to factor duty cycle and period for maximum update
    
    return;
}

unsigned char getLaserPower( void ) {

    // return value of register
    return *laserDuty;
    
    // !update! to factor duty cycle and period for maximum update
}
