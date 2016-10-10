/* 
 * File:    delay.h
 * Author:  joshua
 * Created: April 9, 2016, 11:03 PM
 */

#ifndef DELAY_H
#define	DELAY_H

#ifdef	__cplusplus
extern "C" {
#endif

void initDelay( void );
void delay_us( unsigned int delayus );
void delay_ms( unsigned int delayms );

#ifdef	__cplusplus
}
#endif

#endif	/* DELAY_H */

