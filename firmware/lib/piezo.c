/*
 * File:    piezo.c
 * Author:  joshua
 * Created: March 26, 2016, 1:43 PM
 */

#include <p24FJ128GB202.h>
#include "delay.h"
#include "piezo.h"

// global variables to store register locations controlling piezo operation]
volatile unsigned *piezoLatch;
unsigned piezoMask;

void initPiezo( void ) {
    
    initPiezoPWM( &PIEZO_LAT, &PIEZO_TRIS, PIEZO_MASK );
            
    return;
}

void initPiezoPWM( volatile unsigned *latchReg, volatile unsigned *trisReg,
                unsigned mask ) {
    // set up debug piezo-electric speaker
    
    // make pin output
    *trisReg &= ~mask;           // clears mask from register
            
    // turn off pin at start
    //latchReg |= mask          // set mask to register
    *latchReg &= ~mask;          // clears mask from register

    piezoLatch = latchReg;      // store for later use
    piezoMask = mask;           // we'll also need this
    
    return;
}

void beep( void ) {
    // simply blocking function to emit buzz from speaker (used for debugging)
    
    unsigned long waitInUs = 1000000/BEEP_FREQ/2;
    unsigned long loops = BEEP_LENGTH*1000/waitInUs;
    unsigned long idx1;
    
    // buzz
    for ( idx1=0; idx1<loops; idx1++ ) {
        *piezoLatch ^= piezoMask;       // toggle latch for buzzer
        delay_us( waitInUs );           // wait
    }
    
    return;
}

void beepMulti( unsigned int numBeeps ) {
    
    unsigned int idx1;
    
    // beep as many times as function specifies
    for ( idx1=0; idx1<numBeeps; idx1++ ) {
        beep();                     // beep once
        delay_ms( BEEP_PAUSE );     // pause
    }
    
    return;
}

void beepLong( void ) {
    
    // beep twice to emulate twice as long beep
    beep(); beep();
    
    return;
}

void beepLongMulti( unsigned int numBeeps ) {
    
    unsigned int idx1;
    
    // beep as many times as function specifies
    for ( idx1=0; idx1<numBeeps; idx1++ ) {
        beepLong();                 // beep once
        delay_ms( BEEP_PAUSE );     // pause
    }
    
    return;
}

void beepByte( unsigned char byte ) {
    
    unsigned char testBit = 1;
    unsigned char idx1;
    
    // start signal
    //beepTriple();
    
    // say the byte out loud
    for ( idx1=0; idx1<8; idx1++ )
        if ( (testBit<<idx1) & byte ) {
            beep();                     // beep for one
            delay_ms( BEEP_PAUSE );     // pause for zero
        } else {
            delay_ms( BEEP_PAUSE );     // pause for zero
        }
    
    // end signal
    //beepTriple();
    
    return;
}