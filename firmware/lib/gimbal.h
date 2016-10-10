/* 
 * File:    gimbal.h
 * Author:  joshua
 * Created: March 25, 2016, 6:10 PM
 */

#ifndef GIMBAL_H
#define	GIMBAL_H

#ifdef	__cplusplus
extern "C" {
#endif

// function prototypes
void initGimbal( void );
void setGimbalPanTilt( float angleX, float angleY );
void setGimbalPan( float angle );
void setGimbalTilt( float angle );

#ifdef	__cplusplus
}
#endif

#endif	/* GIMBAL_H */

    
    