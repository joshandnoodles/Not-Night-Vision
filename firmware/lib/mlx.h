/* 
 * File:    mlx.h
 * Author:  joshua
 * Created: March 26, 2016, 11:25 PM
 * Ref:     Melexis Application Note - SMBus communication with MLX90614
 *          http://www.generationrobots.com/media/SMBus-communication-with-MLX90614.pdf
 *          http://www.smbus.org/specs/
 */

#ifndef MLX_H
#define	MLX_H

#ifdef	__cplusplus
extern "C" {
#endif

// hardware configuration for MLX thermometer sensor
#define SLAVE_ADDR      (0x5A<<1)   // factory default slave address is 5A, 
                                    // but any MLX90614 will respond to 00
                                    // (unused but w/ read mode = 1)

// Important RAM registers for MLX90614
#define TAMB_RAW    0x03    // Ambient sensor data              -> 0x03
#define TOBJ1_RAW   0x04    // IR sensor 1 raw data             -> 0x04
#define TOBJ2_RAW   0x05    // IR sensor 2 raw data             -> 0x05
#define TAMB        0x06    // Linearized ambient temp          -> 0x06
#define TOBJ1       0x07    // Linearized object 1 temp (Tobj1) -> 0x07
#define TOBJ2       0x08    // Linearized object 2 temp (Tobj2) -> 0x08

// function prototypes
void initMLX( void );
unsigned int _readRAM( unsigned char );
unsigned int getTOBJ1( void );
unsigned int getTOBJ2( void );
unsigned int getTAMB( void );
float regToTemp( unsigned int );


#ifdef	__cplusplus
}
#endif

#endif	/* MLX_H */

