/*
 * File:    delay.c
 * Author:  joshua
 * Created: April 9, 2016, 11:05 PM
 */

#include <p24FJ128GB202.h>
#include "hardware_config.h"
#include "delay.h"

unsigned int FCYuHz;

void initDelay( void ) {
    
    // initialize timer
    T4CON = 0x0000;         // this does most everything we want
    T4CONbits.T32 = 0;      // set this if we want to make 32-bit timer using T5
    T4CONbits.TON = 1;      // turn timer on, no need to have it off (except power)
    
    // pre-calculate variables delay component variables
    FCYuHz = (FCY/1000000);
    
}

void delay_us( unsigned int delayus ) {
    
    // zero out timer's register
    TMR4 = 0;
    
    // special case for 1us
    if (delayus==1) return;
    
    // calculate cycle time we need ( with as small as possible overhead)
    unsigned int counts = FCYuHz*(delayus-1);
    
    // wait here
    while ( TMR4<counts );
    
    return;
}

void delay_ms( unsigned int delayms ) {
    
    while ( --delayms )
        delay_us( 1000 );
    
}