/* 
 * File:    usb_comm.h
 * Author:  joshua
 * Created: April 15, 2016, 1:02 AM
 */

#ifndef USB_COMM_H
#define USB_COMM_H

#ifdef	__cplusplus
extern "C" {
#endif

// define important constants
#define BUF_SIZE    64      // buffer size (in bytes) for tx & rx comm

// function prototypes
void initUSBComm( void );
void doUSBComm( void );
unsigned char readUSB( void );
void sendUSB( void );
void _insertTxBufUnsigned( unsigned char );
void insertTxBufUnsignedChar( unsigned char );
void insertTxBufUnsignedInt( unsigned int );
void insertTxBufUnsignedLong( unsigned long );

#ifdef	__cplusplus
}
#endif

#endif	/* USB_COMM_H */
