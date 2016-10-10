/*
 * File:    SMBus.c
 * Author:  Melexis
 * Created: April 8, 2016, 10:07 PM
 * Source:  Melexis Application Note - SMBus communication with MLX90614 
 *          http://www.generationrobots.com/media/SMBus-communication-with-MLX90614.pdf
 */

#include <p24FJ128GB202.h>
#include <delay.h>
#include "SMBus.h"

void initSMBus( void ) {
    
    // turn off that nasty analog select for our SDA pin
    _SDA_ANS &= ~_SDA_MASK;
    
    return;
}

//***********************************************************************************************************
// START CONDITION ON SMBus
//***********************************************************************************************************
//Name: START_bit
//Function: Generates START condition on SMBus
//Parameters: No
//Return: No
//Comments: Refer to "System Managment BUS(SMBus) specification Version 2.0"
//***********************************************************************************************************
void START_bit( void ) {
    mSDA_HIGH();        // Set SDA line
    delay_us( TBUF );   // Wait a few microseconds
    mSCL_HIGH();        // Set SCL line
    delay_us( TBUF );   // Generate bus free time between Stop
                        // and Start condition (Tbuf=4.7us min)
    mSDA_LOW();         // Clear SDA line
    delay_us( TBUF );   // Hold time after (Repeated) Start Condition. After 
                        // this period, the first clock is generated. 
                        // (Thd:sta=4.0us min)
    mSCL_LOW();         // Clear SCL line
    delay_us( TBUF );   // Wait a few microseconds
} 

//************************************************************************************************************
// STOP CONDITION ON SMBus
//************************************************************************************************************
//Name: STOP_bit
//Function: Generates STOP condition on SMBus
//Parameters: No
//Return: No
//Comments: Refer to "System Managment BUS(SMBus) specification Version 2.0"
//***********************************************************************************************************
void STOP_bit( void ) {
    mSCL_LOW();         // Clear SCL line
    delay_us( TBUF );   // Wait a few microseconds
    mSDA_LOW();         // Clear SDA line
    delay_us( TBUF );   // Wait a few microseconds
    mSCL_HIGH();        // Set SCL line
    delay_us( TBUF );   // Stop condition setup time (Tsu:sto=4.0us min)
    mSDA_HIGH();        // Set SDA line
}

//************************************************************************************************************
// TRANSMIT DATA ON SMBus
//************************************************************************************************************
//Name: TX_byte
//Function: Sends a byte on SMBus
//Parameters: unsigned char TX_buffer ( the byte which will be send on the SMBus )
//Return: unsigned char Ack_bit (acknowledgment bit)
// 0 - ACK
// 1 - NACK
//Comments: Sends MSbit first
//***********************************************************************************************************
unsigned char TX_byte( unsigned char Tx_buffer ) {
    
    unsigned char Bit_counter;
    unsigned char Ack_bit;
    unsigned char bit_out;
    
    for( Bit_counter=8; Bit_counter; Bit_counter-- ) {
        if(Tx_buffer&0x80) {
            bit_out=1;      // If the current bit of Tx_buffer is 1 set bit_out
        }else{
            bit_out=0;      // else clear bit_out
        }
        send_bit(bit_out);  // Send the current bit on SDA
        Tx_buffer<<=1;      // Get next bit for checking
    }

    Ack_bit=Receive_bit();  // Get acknowledgment bit

    return Ack_bit;
} // End of TX_byte()
//------------------------------------------------------------------------------------------------------------------------------
void send_bit( unsigned char bit_out ) {
    
    if( bit_out==0 ) {  // Check bit
        mSDA_LOW();     // Set SDA if bit_out=1
    }else{
        mSDA_HIGH();    // Clear SDA if bit_out=0
    }
    delay_us(1);        // Tsu:dat = 250ns minimum
    mSCL_HIGH();        // Set SCL line
    delay_us( HIGHLEV );// High Level of Clock Pulse
    mSCL_LOW();         // Clear SCL line
    delay_us( LOWLEV ); // Low Level of Clock Pulse
    //mSDA_HIGH();        // Master release SDA line ,
   return;
} //End of send_bit()

//************************************************************************************************************
// RECEIVE DATA ON SMBus
//************************************************************************************************************
//Name: RX_byte
//Function: Receives a byte on SMBus
//Parameters: unsigned char ack_nack (acknowledgment bit)
// 0 - master sends ACK
// 1 - master sends NACK
//Return: unsigned char RX_buffer (Received byte)
//Comments: MSbit is received first
//************************************************************************************************************
unsigned char RX_byte( unsigned char ack_nack ) {
    
    unsigned char RX_buffer;
    unsigned char Bit_Counter;

    for( Bit_Counter=8; Bit_Counter; Bit_Counter-- ) {
        if(Receive_bit()) {         // Read a bit from the SDA line
            RX_buffer <<= 1;        // If the bit is HIGH save 1 in RX_buffer
            RX_buffer |=0b00000001;
        }else{
            RX_buffer <<= 1;        // If the bit is LOW save 0 in RX_buffer
            RX_buffer &=0b11111110;
        }
    }

    send_bit(ack_nack);             // Send acknowledgment bit

    return RX_buffer;
} // End of RX_byte() 
//------------------------------------------------------------------------------------------------------------------------------
unsigned char Receive_bit( void ) {
    
    unsigned char bit;

    _SDA_TRIS|=_SDA_MASK;       // SDA-input    
    mSCL_HIGH();                // Set SCL line
    delay_us( HIGHLEV );        // High Level of Clock Pulse
    if(_SDA_PORT&_SDA_MASK) {   // Read bit, save it in bit
        bit=1;
    }else{
        bit=0;
    }

    mSCL_LOW(); // Clear SCL line
    delay_us( LOWLEV ); // Low Level of Clock Pulse
    
    return bit;
} //End of Receive_bit()
//------------------------------------------------------------------------------------------------------------------------------ 