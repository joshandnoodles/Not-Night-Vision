function Gimbal() {
  // constructor for gimbal class
  
  // initialize any variables
  this.panRngLim = Gimbal.DEFAULT_PAN_RNG    // strict limits imposed on movement
  this.tiltRngLim = Gimbal.DEFAULT_TILT_RNG  // strict limits imposed on movement
  this.panRng = Gimbal.DEFAULT_PAN_RNG    // loose limits imposed on movement
  this.tiltRng = Gimbal.DEFAULT_TILT_RNG  // loose limits imposed on movement
  this.pan = (this.panRng[1]-this.panRng[0])/2  // assume middle
  this.tilt = this.tiltRng[0]                   // assume lowest (flat)
  this.panMcu = null            // contain actual gimbal values as told by MCU
  this.tiltMcu = null           // contain actual gimbal values as told by MCU
  this.panBytes = null          // byte representation of pan value
  this.tiltBytes = null         // byte representation of tilt value
  this.scanPanIdx = null        // index used for real-time scanning tracking
  this.scanTiltIdx = null       // index used for real-time scanning tracking
  this.scanStepSize = 2         // degrees to move per step (approximate)
  this.scanStepFunc = Gimbal.DEFAULT_SCAN_STEP_FUNC
  
  // debug elements
  this.counter = 0
  
  return
}

// loose limits imposed on movement
Gimbal.DEFAULT_PAN_RNG = [ 0, 180 ]
Gimbal.DEFAULT_TILT_RNG = [ 0, 90 ]

// default variables/functions
Gimbal.DEFAULT_SCAN_STEP_FUNC = 'scanStepSprinkler'

Gimbal.prototype.set = function( panTilt ) {
  
  // update pan/tilt degree variables (assuring that new ones
  // are reasonable
  if ( panTilt[0] < this.panRngLim[0] )
    this.pan = this.panRngLim[0]
  else if ( panTilt[0] > this.panRngLim[1] )
    this.pan = this.panRngLim[1]
  else
    this.pan = panTilt[0]
  if ( panTilt[1] < this.tiltRng[0] )
    gimbal.tilt = this.tiltRngLim[0]
  else if ( panTilt[1] > this.tiltRngLim[1] )
    gimbal.tilt = this.tiltRngLim[1]
  else
    gimbal.tilt = panTilt[1]
  
  // byte values that are needed when sending to device
  this._calcBytes()
  
  //console.log( 'Setting gimbal pan to ' + (this.pan) + ' degrees.' )
  //console.log( 'Setting gimbal tilt to ' + (gimbal.tilt) + ' degrees.' )
  
  // finally, after this function is called, the variables containing 
  // our byte values need to be sent out to the USB handler using something
  // similar to this (but definitely not exactly, this is application dependent
  // [ gimbal.panBytes>>8,
  //   gimbal.panBytes>>0,
  //   gimbal.tiltBytes>>8,
  //   gimbal.tiltBytes>>0,
  // ]
  
  return
}

Gimbal.prototype._calcBytes = function() {
  
  // compute pan and tilt values to send to device
  this.panBytes = this.pan * ((1<<16)-1) / 360
  this.tiltBytes = this.tilt * ((1<<16)-1) / 360
  
  return
}

Gimbal.prototype._locToPanTilt = function( loc, heatmap ) {
  
  // use much trickery to anaylze hex grid structure to retrieve appropriate
  // pan/tilt location (notice that the offest of hex rows need to be taken into
  // consideration)
  var tilt = ( this.tiltRngLim[1] - this.tiltRngLim[0] ) * ( loc[0] / (heatmap.dim[0]-1) ) + this.tiltRngLim[0]
  var pan
  if ( loc[0] % 2 )
    pan = ( this.panRngLim[1] - this.panRngLim[0] ) * ( (loc[1]) / (heatmap.dim[1]-0.5) ) + this.panRngLim[0]
  else
    pan = ( this.panRngLim[1] - this.panRngLim[0] ) * ( (loc[1]+0.5) / (heatmap.dim[1]-0.5) ) + this.panRngLim[0]
  
  return [ pan, tilt ]
}

Gimbal.prototype.scanStep = function() {
  
  this[this.scanStepFunc]()
  
  return
}

Gimbal.prototype.scanStepSprinkler = function() {
  
  if ( this.scanPanIdx==0 && this.scanTiltIdx==0 ) {
    this.set( [
      this.panRng[0],
      this.tiltRng[0] 
    ] )
    this.scanPanIdx++
    return
  }
  
  if ( ( this.pan + this.scanStepSize ) > this.panRng[1] ) {
    if ( ( this.tilt + this.scanStepSize ) > this.tiltRng[1] ) {
      this.set( [ 
        this.panRng[0],
        this.tiltRng[0]
      ] )
      this.scanPanIdx = 0
      this.scanTiltIdx = 0
    } else {
      this.set( [ 
        this.panRng[0],
        this.tilt + this.scanStepSize,
      ] )
      this.scanTiltIdx++
    }
  } else {
    this.set( [ 
      this.pan + this.scanStepSize,
      this.tilt
    ] )
    this.scanPanIdx++
  }
  
  return
}

Gimbal.prototype.scanStepSnake = function() {
  console.log( 'Not scanStepSnake!' )
}

Gimbal.prototype.scanStepCircular = function( direction='cw' ) {
  console.log( 'Not Implemented!' )
}
