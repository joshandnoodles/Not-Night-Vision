/*
 * File:    servo.c
 * Author:  joshua
 * Created: March 25, 2016, 7:48 PM
 */

#include <p24FJ128GB202.h>
#include "servo.h"
#include "hardware_config.h"

volatile unsigned *initServo( 
        volatile unsigned *ppsReg, unsigned ppsMask, 
        unsigned ppsOutFunc,
        volatile unsigned *ocxcon1Reg, volatile unsigned *ocxcon2Reg, 
        volatile unsigned *ocxrsReg, volatile unsigned *ocxrReg,
        unsigned initDuty ) {
    // readies servo to run
    // steps detailed in section 15.3 p.219 of PIC24FJ128GB204 FAMILY user guide
    
    // reset PWM configuration options
    *ocxcon1Reg = 0x0000;
    *ocxcon2Reg = 0x0000;
    
    // 1. configure OCx output for one of the available PPS pins
    *ppsReg |= (ppsMask & ppsOutFunc);  // set PPS pin to correct PWM
    
    // 2. calculate desired duty cycle
    // ...and load into OCxR register
    *ocxrReg = initDuty;                          
    
    // 3. calculate desired period   
    //    (PWM period) = ( PRy + 1 ) * Tcy * (Timer prescale value)   
    // ...and load into OCxRS register
    *ocxrsReg = ( (10/1000) / (1/FCY) / (8) - 1 );    // 10ms (20ms SG90 servo spec)
    
    // 4. select current OCx as sync source by writing 0x1F to SYNCSEL<4:0> bits
    //    (i.e. OCxCON2<4:0>) and zero to the OCTRIG bit (i.e. OCxCON2<7>)
    //*ocxcon2Reg |= 0x001F;              // trigger/sync src select this OC 
    //                                    // module and sync w/ src
    *ocxcon2Reg |= 0x000F;              // trigger/syn w/ Timer 5
    
    // 5. select clock source using OCTSEL<2:0> (OCxCON1<12:10)
    //*ocxcon1Reg |= 0x1C00;              // Peripheral Clock (FCY)
    *ocxcon1Reg |= 0x0C00;              // Timer5
    
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
    T5CON = 0x0000;                     // reset timer bits
    T5CONbits.TCKPS = 1;                // 1:8 pre-scalar 
    T5CONbits.TON = 1;                  // enable timer
    
    return ocxrReg;                     // return reference to duty cycle reg
}  

void setServoAngle( 
        volatile unsigned *servoDuty, unsigned servoAngleRange,
        unsigned servoDutyBase, unsigned servoDutyRange,
        float angle ) {
    
    // update servo position based on data we are being told about specific servo
    *servoDuty = (unsigned)( (float)(angle/servoAngleRange) * servoDutyRange + servoDutyBase );  
    
    // !update! to properly round angle if needed
    
    return;
}