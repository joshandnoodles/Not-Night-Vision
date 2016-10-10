/* 
 * File:    piezo.h
 * Author:  joshua
 * Created: March 26, 2016, 1:56 PM
 */

#ifndef PIEZO_H
#define	PIEZO_H

#ifdef	__cplusplus
extern "C" {
#endif

// hardware configuration for piezo-electric speaker
#define PIEZO_LAT         LATB              // port latch register
#define PIEZO_TRIS        TRISB             // port TRIS I/O buffer register
#define PIEZO_MASK        (1<<5)            // RA5, pin 14
    
// definitions for beep sounds length, pause, etc.
#define BEEP_FREQ           500             // frequency of beep emitted (in Hz)
                                            // AC-1205G rated for 2.4kHz
#define BEEP_LENGTH         100ul           // duration of beep (in ms)
#define BEEP_PAUSE          500             // duration between beeps (in us)

// function prototypes
void initPiezo( void );
void initPiezoPWM( volatile unsigned *latchReg, volatile unsigned *trisReg,
                unsigned mask );
void beep( void );
void beepMulti( unsigned int );
void beepLong( void );
void beepLongMulti( unsigned int );
void beepByte( unsigned char );

#ifdef	__cplusplus
}
#endif

#endif	/* PIEZO_H */

