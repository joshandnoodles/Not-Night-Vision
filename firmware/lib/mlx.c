/*
 * File:    mlx.c
 * Author:  joshua
 * Created: March 26, 2016, 11:27 PM
 * Ref:     Melexis Application Note - SMBus communication with MLX90614   
 *          http://www.generationrobots.com/media/SMBus-communication-with-MLX90614.pdf
 *          http://www.smbus.org/specs/        
 */

#include <p24FJ128GB202.h>
#include "delay.h"
#include "SMBus.h"
#include "mlx.h"

// Note: no PPS needed for I2C (SDA/SCL) b/c it is a non-pin peripheral and is 
//       always available on the default pins (as long as it is active and not 
//       conflicting w/ another peripheral)

// Commands needed for MLX90614 communication:
//   Note *: address of the cell to access
//   Note **: like read command but allows for checking of PEC after 1st
//            byte w/o having to use a repeated start bit
// 
// RAM Access       -> 000x xxxx* 
// EEPROM Access    -> 001x xxxx*
// Read Flags       -> 1111 0000**
// Enter SLEEP mode -> 1111 1111

void initMLX( void ) {
    
    // initialize anything from SMBus
    initSMBus();
    
    // wake module up from sleep
    mSCL_HIGH();            // set SCL line
    delay_us( 3 );          // wait 3us
    mSDA_LOW();             // clear SDA line
    delay_ms( 90 );         // wait 90ms
    mSDA_HIGH();            // set SDA line
    delay_ms( 2 );          // wait 2ms
            
    // SMBus initialization to idle mode
    mSDA_HIGH();            // set SDA line
    mSCL_HIGH();            // set SCL line
    
    // output valid after POR
    //delay_ms( 180 );      // assume setup has taken that long
    
    // send request to switch module in SMBus mode
    mSCL_LOW();             // clear SCL line
    delay_ms( 30 );         // wait a bit
    mSCL_HIGH();            // set SCL line
    
    return;
}

unsigned int getTOBJ1( void ) {
    // get ram contents for the register we need and return
    return _readRAM( TOBJ1 ); 
}

unsigned int getTOBJ2( void ) {
    // get ram contents for the register we need and return
    return _readRAM( TOBJ2 ); 
}

unsigned int getTAMB( void ) {
    // get ram contents for the register we need and return
    return _readRAM( TAMB );    
}

float regToTemp( unsigned int reg ) {
    // conversion is the same for both T objects and T ambient
    return (float)( (float)(reg)/50 - 273.15 );     // return Celsius temp
}

unsigned int _readRAM( unsigned char ramReg ) {
    // Read a MLX90614 RAM register (steps 1-9)...
    
    unsigned char dataByteLow;
    unsigned char dataByteHigh;
    unsigned char ackBit;
    unsigned char pec;
    
    // 1. Send START bit
    START_bit();
    
    // 2. Send Slave Address & Rd\-Wr bit (latter has no use for MLX90614) 
    TX_byte( SLAVE_ADDR );      // defined slave address w/ read mode = 1
    
    // 3. Send Command detailing which RAM register to read
    TX_byte( ramReg );            // 0x07 is linearized object 1 temp (Tobj1)
    
    // 4. Send Repeated START_bit
    START_bit();
    
    // 5. Send Slave Address & Rd\-Wr bit (latter has no use for MLX90614)
    ackBit = TX_byte( SLAVE_ADDR );   // defined slave address w/ read mode = 1
    
    // 6. Read Data Byte Low (master must send ACK bit)
    dataByteLow = RX_byte( ackBit );
    
    // 7. Read Data Byte High (master must send ACK bit)
    dataByteHigh = RX_byte( 0x00 );
    
    // 8. Read PEC (master can send ACK or NACK)
    pec = RX_byte( 0x00 );
    
    // 9. Send STOP bit
    STOP_bit();
    
    // combine data bytes and return
    return (unsigned int)( (dataByteHigh<<8) | dataByteLow );
}