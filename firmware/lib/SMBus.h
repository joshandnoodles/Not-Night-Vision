/* 
 * File:    SMBus.h
 * Author:  Melexis
 * Created: April 8, 2016, 10:13 PM
 * Source:  Melexis Application Note - SMBus communication with MLX90614 
 *          http://www.generationrobots.com/media/SMBus-communication-with-MLX90614.pdf
 */

#ifndef SMBUS_H
#define	SMBUS_H

#ifdef	__cplusplus
extern "C" {
#endif

// define SCL hardware configuration
#define _SCL_TRIS       TRISB       // port TRIS I/O buffer register
#define _SCL_LAT        LATB        // port latch register
#define _SCL_MASK       (1<<8)      // RB8, pin 17

// define SDA hardware configuration
#define _SDA_TRIS       TRISB       // port TRIS I/O buffer register
#define _SDA_LAT        LATB        // port latch register
#define _SDA_ANS        ANSB        // port analog function select register
#define _SDA_PORT       PORTB       // necessary b/c we shouldn't read latch
#define _SDA_MASK       (1<<9)      // RB9, pin 18

// SMBus control signals
#define mSDA_HIGH()     _SDA_TRIS|=_SDA_MASK;       // Sets SDA line, =1
#define mSDA_LOW()      _SDA_LAT&=~_SDA_MASK;\
                        _SDA_TRIS&=~_SDA_MASK;      // Clears SDA line, =0, =0
#define mSCL_HIGH()     _SCL_LAT|=_SCL_MASK;\
                        _SCL_TRIS&=~_SCL_MASK;      // Sets SCL line, =1, =0
#define mSCL_LOW()      _SCL_LAT&=~_SCL_MASK;\
                        _SCL_TRIS&=~_SCL_MASK;      // Clears SCL line, =0, =0

// high and Low clock period
#define HIGHLEV 6
#define LOWLEV 6

// delay constants
#define TBUF 5
    
// function prototypes
void initSMBus( void );
void START_bit( void );
void STOP_bit( void );
unsigned char TX_byte( unsigned char Tx_buffer );
void send_bit( unsigned char bit_out );
unsigned char RX_byte( unsigned char ack_nack );
unsigned char Receive_bit( void );

#ifdef	__cplusplus
}
#endif

#endif	/* SMBUS_H */

