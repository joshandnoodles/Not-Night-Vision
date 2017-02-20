var CMDS = {
    // 0x1* debugging commands
  'CMD_BEEP': {
    address:  0x10,
    rxBytes:  0,
    txBytes:  1
    },
  'CMD_BEEP_LONG': {
    address:  0x11,
    rxBytes:  0,
    txBytes:  1
    },   
  'CMD_BEEP_BYTE': {
    address:  0x12,
    rxBytes:  0,
    txBytes:  1
    },
  'CMD_LED_TOG': {
    address:  0x15,
    rxBytes:  1,
    txBytes:  0
    },
  'CMD_LED_SET': {
    address:  0x16,
    rxBytes:  0,
    txBytes:  1
    },
  'CMD_LED_GET': {
    address:  0x17,
    rxBytes:  1,
    txBytes:  0
    },
  // 0x3* temperature sensor commands
  'CMD_TOBJ1_GET': {
    address:  0x30,
    rxBytes:  2+2+2+6,
    txBytes:  0
    },
  'CMD_TOBJ2_GET': {
    address:  0x31,
    rxBytes:  2+2+2+6,
    txBytes:  0
    },
  'CMD_TAMB_GET': {
    address:  0x32,
    rxBytes:  2+6,
    txBytes:  0
    },
  // 0x4* timer commands
  'CMD_TIME_SET': {
    address:  0x40,
    rxBytes:  0,
    txBytes:  4
    },
  'CMD_TIME_GET': {
    address:  0x41,
    rxBytes:  4+2,
    txBytes:  0
    },
  // 0x6* servo commands
  'CMD_PAN_SET': {
    address:  0x60,
    rxBytes:  0,
    txBytes:  2
    },
  'CMD_PAN_GET': {
    address:  0x61,
    rxBytes:  2,
    txBytes:  0
    },  
  'CMD_TILT_SET': {
    address:  0x62,
    rxBytes:  0,
    txBytes:  2
    },
  'CMD_TILT_GET': {
    address:  0x63,
    rxBytes:  2,
    txBytes:  0
    },
  // 0x7* laser activities
  'CMD_LSR_TOG': {
    address:  0x70,
    rxBytes:  1,
    txBytes:  0
    },
  'CMD_LSR_SET': {
    address:  0x71,
    rxBytes:  0,
    txBytes:  1
    },
  'CMD_LSR_GET': {
    address:  0x72,
    rxBytes:  1,
    txBytes:  0
    },
  // 0x8* delay commands
  'CMD_DELAY_US': {
    address:  0x80,
    rxBytes:  0,
    txBytes:  2
    },
  'CMD_DELAY_MS': {
    address:  0x81,
    rxBytes:  0,
    txBytes:  2
    },
  // 0xe*
  'CMD_MEAS_FLAG': {
    address:  0x90,
    rxBytes:  0,
    txBytes:  0
    },
  'CMD_SCAN_FLAG': {
    address:  0x91,
    rxBytes:  0,
    txBytes:  0
    },
  'CMD_MEAS_SCAN_FLAG': {
    address:  0x92,
    rxBytes:  0,
    txBytes:  0
    },
  // 0xE* error identifiers
  
}

var CONTROLS = [
  [ 'Main', 'Go',
    startMeasureScan ],
  [ 'Main', 'Stop',
    stopMeasureScan ],
  [ 'Sub-Main', 'Start Scanning - Sprinkler',
    function() { startScan( 'scanStepSprinkler' ) } ],
  [ 'Sub-Main', 'Start Scanning - Snake',
    function() { startScan( 'scanStepSnake' ) } ],
  [ 'Sub-Main', 'Start Scanning - Circular',
    function() { startScan( 'scanStepCircular' ) } ],
  [ 'Sub-Main', 'Stop Scanning',
    stopScan ],
  [ 'Sub-Main', 'Start Measuring',
    startMeasure ],
  [ 'Sub-Main', 'Stop Measuring',
    stopMeasure ],
  [ 'Sub-Main', 'Start Graph Scrolling',
    startTickTock ],
  [ 'Sub-Main', 'Stop Graph Scrolling',
    stopTickTock ],
  [ 'Sub-Main', 'Recolorize Heatmaps',
     recolorizeHeatmaps ],
  [ 'Measure', 'TOBJ1',
    function() { sendHandler( [ CMDS['CMD_TOBJ1_GET'].address ] ) } ],
  [ 'Measure', 'TOBJ2',
    function() { sendHandler( [ CMDS['CMD_TOBJ2_GET'].address ] ) } ],
  [ 'Measure', 'TAMB',
    function() { sendHandler( [ CMDS['CMD_TAMB_GET'].address ] ) } ],
  [ 'Gimbal', 'Pan -5°', function() { 
      gimbal.set( [ gimbal.pan-5, gimbal.tilt+0 ] )
      sendHandler( SCAN_CMD_PKT() )
    } ],
  [ 'Gimbal', 'Pan -1°',
    function() { 
      gimbal.set( [ gimbal.pan-1, gimbal.tilt+0 ] )
      sendHandler( SCAN_CMD_PKT() )
    } ],
  [ 'Gimbal', 'Pan +1°',
    function() { 
      gimbal.set( [ gimbal.pan+1, gimbal.tilt+0 ] )
      sendHandler( SCAN_CMD_PKT() )
    } ],
  [ 'Gimbal', 'Pan +5°',
    function() { 
      gimbal.set( [ gimbal.pan+5, gimbal.tilt+0 ] )
      sendHandler( SCAN_CMD_PKT() )
    } ],
  [ 'Gimbal', 'Tilt -5°',
    function() { 
      gimbal.set( [ gimbal.pan+0, gimbal.tilt-5 ] )
      sendHandler( SCAN_CMD_PKT() )
    } ],
  [ 'Gimbal', 'Tilt -1°',
    function() { 
      gimbal.set( [ gimbal.pan+0, gimbal.tilt-1 ] )
      sendHandler( SCAN_CMD_PKT() )
    } ],
  [ 'Gimbal', 'Tilt +1°',
    function() { 
      gimbal.set( [ gimbal.pan+0, gimbal.tilt+1 ] )
      sendHandler( SCAN_CMD_PKT() )
    } ],
  [ 'Gimbal', 'Tilt +5°',
    function() { 
      gimbal.set( [ gimbal.pan+0, gimbal.tilt+5 ] )
      sendHandler( SCAN_CMD_PKT() )
    } ],
  [ 'Gimbal', 'Set As Pan Min',
    function() { gimbal.panRng = [ gimbal.pan, gimbal.panRng[1] ] } ],
  [ 'Gimbal', 'Set As Pan Max',
    function() { gimbal.panRng = [ gimbal.panRng[0], gimbal.pan ] } ],
  [ 'Gimbal', 'Set As Tilt Min',
    function() { gimbal.tiltRng = [ gimbal.tiltRng[0], gimbal.tilt ] } ],
  [ 'Gimbal', 'Set As Tilt Max',
    function() { gimbal.tiltRng = [ gimbal.tilt, gimbal.tiltRng[1] ] } ],
  [ 'Gimbal', 'Origin',
    function() { 
      gimbal.set( [ (gimbal.panRngLim[1]-gimbal.panRngLim[0])/2+gimbal.panRngLim[0],
                    gimbal.tiltRngLim[0] ] )
      sendHandler( SCAN_CMD_PKT() )
    } ],
  [ 'Gimbal', 'Get Pan',
    function() { sendHandler( [ CMDS['CMD_PAN_GET'].address ] ) } ],
  [ 'Gimbal', 'Get Tilt',
    function() { sendHandler( [ CMDS['CMD_TILT_GET'].address ] ) } ],
  [ 'HID USB', 'Connect',
    hidConnect ],
  [ 'HID USB', 'Disconnect',
    hidDisconnect ],
  [ 'Debug', 'Beep',
    function() { sendHandler( [ CMDS['CMD_BEEP'].address ] ) } ],
  [ 'Debug', 'Beep Long',
    function() { sendHandler( [ CMDS['CMD_BEEP_LONG'].address ] ) } ],
  [ 'Debug', 'LED',
    function() { sendHandler( [ CMDS['CMD_LED_TOG'].address ] ) } ],
  [ 'Debug', 'Laser',
    function() { sendHandler( [ CMDS['CMD_LSR_TOG'].address ] ) } ],
]

// initalize underlying magic  ...

// ... behavior/dynamics of existing DOM elements
initBase()

// ... our DOM grid
var graphContainerDiv = document.getElementById( 'graphs' )
var heatmapContainerDiv = document.getElementById( 'heatmaps' )
var controlsContainerDiv = document.getElementById( 'rightSidebarToolbox1' )
var terminalContainerDiv = document.getElementById( 'rightSidebarToolbox2' )
var otherContainerDiv = document.getElementById( 'rightSidebarToolbox3' )

// ... gimbal helper class
var gimbal = new Gimbal()


// inialize USB ...

// ... HID object
var hid = new Hid( receiveHandler, hidConnect, hidDisconnect )
hidConnect()

// ... flags for continuous operations of the MCU
var measureFlag = false
var scanFlag = false

// ... generic command packets for common tasks (use as building blocks
// for larger queries
var MEAS_CMD_PKT = ( function() { return [
  CMDS['CMD_TOBJ1_GET'].address,
  CMDS['CMD_TOBJ2_GET'].address,
  CMDS['CMD_TAMB_GET'].address,
] } )
var SCAN_CMD_PKT = ( function(){ return [
  CMDS['CMD_PAN_SET'].address,
    (Math.round(gimbal.panBytes)>>8)%256,
    (Math.round(gimbal.panBytes)>>0)%256,
  CMDS['CMD_TILT_SET'].address,
    (Math.round(gimbal.tiltBytes)>>8)%256,
    (Math.round(gimbal.tiltBytes)>>0)%256,
] } )
var DEFAULT_MCU_PKT = ( function() { return [
  CMDS['CMD_PAN_GET'].address,
  CMDS['CMD_TILT_GET'].address,
  CMDS['CMD_LSR_GET'].address,
  CMDS['CMD_LED_GET'].address,
] } )

// ... helper functions (most of which would have issues with scope)
function hidConnect() {
  
  // try to connect to USB device, define callbacks to run if 
  // success/failure
  hid.connect( null, successFunc=function() {
  
    // set our status bar to show that device is connected
    setStatusBar( 'active' )
    
    // now that we are connected to our MCU, we should set it up to 
    // defaults we have specified
    sendHandler( DEFAULT_MCU_PKT() )
    
    // reset our flags
    measureFlag = false
    scanFlag = false
    
    return
    
  }, function() {
    
    // set our status bar to show that we were unable to connect
    setStatusBar( '' )
    
    return
  } )
  
  return
}
function hidDisconnect() { 
  
  // stop macro packet sending
  stopMeasure()
  stopScan()
  
  // attempt to disconnect from USB device, define callbacks to
  // run if success/failure
  if ( hid.connection )
    hid.disconnect( hid.hidDeviceInfo.deviceId, function() {
    
      // set our status bar to show that device is disconnected
      setStatusBar( 'inactive' )
      
      return
    }, function() {
      
      // set our status bar to show that device was unable to be
      // disconnected
      setStatusBar( '' )
      
      return
    } )
  else
    setStatusBar( '' )
  
  return
}
function recolorizeHeatmaps() {
  heatmaps.forEach( function( heatmap ) { heatmap.fitRng() } )
}


// initialize any objects we want at the start ...

// ... graphs
var graphs = []
var newGraph = ( function( varargin ) {
  graphs.push( new Graph( graphContainerDiv, varargin ) )
  return graphs[graphs.length-1] 
} )
var graphTObj1 = newGraph( { 
 xLabelText: 'OBJ1 Temp (°C)'
} )
var graphTObj2 = newGraph( ( {
  xLabelText: 'OBJ2  Temp (°C)',
  xRng: [-30*1000,5*1000]
} ) )
var graphTObj1Long = newGraph( ( {
  xLabelText: 'OBJ1 Temp (°C)',
  xRng: [-30*1000,5*1000]
} ) )
var graphTAmb = newGraph( ( {
  xLabelText: 'AMB Temp (°C)',
  xRng: [-30*1000,5*1000]
} ) )

// ... heatmaps
var heatmaps = []
var newHeatmap = ( function( varargin ) {
  heatmaps.push( new Heatmap( heatmapContainerDiv, varargin ) )
  return heatmaps[heatmaps.length-1] 
} )
var heatmapTObj1 = newHeatmap()

// ... terminal
var terminal = new Log( terminalContainerDiv )
terminal.terminal( onEnter=sendHandler, cmdHash=CMDS )

// ... controls
var controls = new Controls( controlsContainerDiv )
CONTROLS.forEach( function( control ) {
  controls.addControl( control[0], control[1], control[2] )
} )


// setup callback for directing gimbal based on interaction with 
// heatmap(s)
Heatmap.MOUSE_OVER_CB = function( data ) {
  // ** This currently only supports the first heatmap to use as reference.
  // A small rewrite is needed to figure out which heatmap was triggered.
  // compute pan and tilt values using a heatmap for reference...
  // ...and then send all at once, how nice!
  gimbal.set( gimbal._locToPanTilt( data.loc, heatmaps[0] ) )
  sendHandler( SCAN_CMD_PKT() )
  
  return
}


// at this point everything should look okay, hide the loading curtain
hideCurtain()


function startMeasureScan() {
  
  // simply call both pieces to get real-time measuring and scanning up
  startMeasure()
  startScan()
  
  return
}

function stopMeasureScan() {
  
  // simply call both pieces to take down real-time measuring and scanning
  stopMeasure()
  stopScan()
  
  return
}

function startMeasure() {
  
  // only should be doing this if we are connected to USB device
  if ( !hid.connection )
    return
  
  // enable flag to tell receive handler to recall same calling
  // of command packet once we receive data from previous packet
  measureFlag = true
  
  // have graphs updated nicely and scroll appropriately
  startTickTock()
    
  // send first command packet to device, once the device sends a
  // response for this packet, the same command packet will be sent
  // again (assuming flag is still set ),
  // however, if other active flags are set, setting the flag will be
  // enough to update this new behavior on next iteration
  if ( !scanFlag )
    sendHandler( MEAS_CMD_PKT().concat( CMDS['CMD_MEAS_FLAG'].address ) )
  
  return
}

function stopMeasure() {
  
  // first things first, turn off the flag for recursive
  // sending of command packet
  measureFlag = false
  
  // stop graphs from updating nicely and scrolling
  stopTickTock()
  
  return
}

function startScan( scanMethod=null ) {
  
  // only should be doing this if we are connected to USB device
  if ( !hid.connection )
    return
  
  // choose correct scanning operation based on function inputs
  if ( scanMethod!=null && gimbal[scanMethod]!=undefined )
    gimbal.scanStepFunc = scanMethod
  
  // set inital state of gimbal before we start scanning
  gimbal.scanPanIdx = 0
  gimbal.scanTiltIdx = 0
  
  // enable flag to tell receive handler to recall same calling
  // of command packet once we receive data from previous packet
  scanFlag = true
  
  // send first command packet to device, once the device sends a
  // response for this packet, the same command packet will be sent
  // again (assuming flag is still set ),
  // however, if other active flags are set, setting the flag will be
  // enough to update this new behavior on next iteration
  if ( !measureFlag )
    sendHandler( SCAN_CMD_PKT().concat( CMDS['CMD_SCAN_FLAG'].address ) )
  
  return
}

function stopScan() {
  
  // first things first, turn off the flag for recursive
  // sending of command packet
  scanFlag = false
  
  // um...and that's enough for this one
  
  return
}


var fitYRngH = []
function startTickTock() {
  
  // start ticking (only if graph already isn't ticking)
  graphs.forEach( function( graph ) {
    if ( !graph.tickTockRunning )
      graph.tickTock( false, 1500, 'bounce' )
  } )
  
  // also scale y axis of each graph once every x range
  fitYRngH.forEach( function( h ) { window.clearInterval( h ) } )  // clear first
  fitYRngH = []
  fitYRngH = graphs.map( function( graph ) {                   // then (re)set
    fitYRngH.push( window.setInterval(
      graph.fitYRng.bind(graph),
      graph.xRng[1]-graph.xRng[0]
    ) )
  } )
  
  return
}

function stopTickTock() {
  
  // stop ticking (only if graph is already ticking)
  graphs.forEach( function( graph ) {
      if ( graph.tickTockRunning )
        graph.tickTockStop = true
    } )
  
  // also clear y axis update handlers
  fitYRngH.forEach( function( h ) { window.clearInterval( h ) } )
  fitYRngH = []
  
  return
}

function sendHandler( dataArr, logId=null ) {
  // handler function that can encode and send data to the device
  
  // make sure are array isn't too big
  if ( dataArr.length > Hid.BUF_SIZE ) {
    console.log( 'Data array to send exceeds buffer size.' )
    return
  }
  
  // take data and store it in a buffer
  var bytes = new Uint8Array( Hid.BUF_SIZE )
  dataArr.forEach( function( val, idx ) { 
    if ( typeof( val ) == 'object' ) {
      console.log( 'You should not be sending objects to send handler. Like this one...' )
      console.log( val )
    }
    bytes[idx] = val
  } )
  
  // send data over usb
  //var id = terminal.addPersistent( 'Sending...' )
  var waitForCon = window.setInterval( function() {
    
    // wait here till our connection is good
    if ( hid.connection ) {
      
      clearInterval( waitForCon )
      
      chrome.hid.send( hid.connection.connectionId, 0, bytes.buffer, function() {
      
        // first check chrome for runtime errors (i.e. transfer errors)
        if ( chrome.runtime.lastError )
          console.log( chrome.runtime.lastError )
        
        // assume success at this point
        //id.innerHTML = id.innerHTML + 'Sent. '
        
      } ) 
    
    }
    
    return
  }, 100 )
  
  return
}

function receiveHandler( dataBuf ) {
  // handler function that can decode data from the device
  
  // quick conversion to make data usable
  var dataArr = new Uint8Array( dataBuf )
  
  // don't trust sender, check data to see if it is the right size
  if ( dataArr.length !== Hid.BUF_SIZE ) {
    console.log( 'Data array received is not the expected size.' )
    return
  }
  
  var idx = 0
  while ( idx<dataArr.length ) {
    
    // each data packet is (one byte plus number of data bytes) long
    // header --> data(msb) --> ... --> data(lsb)
    var headerByte = dataArr[idx++]
    function getDataBytes( cmdId ) {
      // get data from packet
      var dataBytes = []
      for ( var idx2=0; idx2<CMDS[cmdId].rxBytes; idx2++ ) 
        dataBytes[idx2] = dataArr[idx++] 
      //console.log( headerByte + ': ' + dataBytes )
      return dataBytes
    }
    
    // check to see if we still have data left
    if ( !headerByte ) return
    
    // this is the heart of the rx handler...
    // the concept is simple, each packet we receive from the host should
    // have sent the same identifier header, we can use this header to 
    // determine what to do with the following data
    switch ( headerByte ) {
      
      case CMDS['CMD_MEAS_SCAN_FLAG'].address:
      case CMDS['CMD_MEAS_FLAG'].address:
      case CMDS['CMD_SCAN_FLAG'].address:
        
        // if it looks like the program wants us to (flag(s) set),
        // re-run correct command packets
        if ( measureFlag && scanFlag ) {
          gimbal.scanStep()
          sendHandler( 
            MEAS_CMD_PKT().concat( 
            SCAN_CMD_PKT() ).concat( 
            CMDS['CMD_MEAS_SCAN_FLAG'].address )
          )
        } else if ( measureFlag ) {
          sendHandler( 
            MEAS_CMD_PKT().concat( 
            CMDS['CMD_MEAS_FLAG'].address )
          )
        } else if ( scanFlag ) {
          gimbal.scanStep()
          sendHandler( 
            SCAN_CMD_PKT().concat( 
            CMDS['CMD_SCAN_FLAG'].address )
          )
        }
        
        break
        
      case CMDS['CMD_TOBJ1_GET'].address:
        
        // extract data bytes from packet
        // and send to helper function for processing and displaying
        tObjProcessFunc( 
          getDataBytes( 'CMD_TOBJ1_GET' ),
          [ graphTObj1, graphTObj1Long ],
          [ heatmapTObj1 ],
          true
        )
        
        break
          
      case CMDS['CMD_TOBJ2_GET'].address:
        
        // extract data bytes from packet
        // and send to helper function for processing and displaying
        tObjProcessFunc( 
          getDataBytes( 'CMD_TOBJ2_GET' ),
          [ graphTObj2 ],
          [],
          true
        )
        
        break
        
      case CMDS['CMD_TAMB_GET'].address:
      
        // extract data bytes from packet
        // and send to helper function for processing and displaying
        tObjProcessFunc( 
          getDataBytes( 'CMD_TAMB_GET' ),
          [ graphTAmb ],
          [],
          false
        )
        
        break
      
      case CMDS['CMD_TIME_GET'].address:
        
        // extract data bytes from packet
        var dataBytes = getDataBytes( 'CMD_GET_TIME' )
        
        // convert data to time information
        var unixTimestamp = bytesToUnsignedLong( dataBytes.slice(0,4) )
        var ms = bytesToUnsignedInt( dataBytes.slice(4,6) )
        console.log( unixTimestamp + '.' + ms )
        
        break
        
      case CMDS['CMD_TIME_SET'].address:
        
        // no data here, but set flag to let app know that
        // all clocking is now being handled on board (PIC-side)
        // this currently includes but is not limited to expectations
        // that timestamps received from temperature object calls are
        // accurate
        var onBoardClocking = true
        
        break
        
      case CMDS['CMD_PAN_GET'].address:
        
        // extract data bytes from packet
        var dataBytes = getDataBytes( 'CMD_PAN_GET' )
        
        // build up 16-bit register contents
        var gimbalReg = bytesToUnsignedInt( dataBytes.slice(0,2) )
        
        // calculate angle from knowledge of transmione of angles
        var angle = gimbalReg / ((1<<16)-1)* 360 
        
        
        // update value field in control
        controls.controlsByGroup["Gimbal"]["Get Pan"].querySelector( '#value' ).innerHTML = " - " + angle.toFixed(3) + "&deg;"
        
        break
        
      case CMDS['CMD_TILT_GET'].address:
        
        // extract data bytes from packet
        var dataBytes = getDataBytes( 'CMD_TILT_GET' )
        
        // build up 16-bit register contents
        var gimbalReg = bytesToUnsignedInt( dataBytes.slice(0,2) )
        
        // calculate angle from knowledge of transmione of angles
        var angle = gimbalReg * 360 / ((1<<16)-1)
        
        // graphically update value field in control
        controls.controlsByGroup["Gimbal"]["Get Tilt"].querySelector( '#value' ).innerHTML = " - " + angle.toFixed(3) + "&deg;"
        
        break
        
      case CMDS['CMD_LSR_GET'].address:
      case CMDS['CMD_LSR_TOG'].address:
        
        // extract data bytes from packet
        var dataBytes = getDataBytes( 'CMD_LSR_GET' )
        
        // graphically update value field in control
        controls.controlsByGroup["Debug"]["Laser"].querySelector( '#value' ).innerHTML = " - " + dataBytes[0]
        
        break
      
      case CMDS['CMD_LED_GET'].address:
      case CMDS['CMD_LED_TOG'].address:
      
        // extract data bytes from packet
        var dataBytes = getDataBytes( 'CMD_LED_GET' )
        
        // graphically update value field in control
        controls.controlsByGroup["Debug"]["LED"].querySelector( '#value' ).innerHTML = " - " + dataBytes[0]
        
        break
        
      default:
        
        // don't recognize this header identifier, assume that we simply
        // do not care about handling this case, i.e. it may be a return
        // for a command we sent that we don't need confirmation for
        //console.log( 'Unrecognized header in received packet: ' + headerByte )
        
    }
  
  }
  
  //temps.push( ((data[0]<<8)+data[1])/50 - 273.15 )
  //addPoint( graphObjTOBJ1, temps[temps.length-1] )
  //addHeatmapHex( heatmapObjTOBJ1, temps[temps.length-1] )
  // temps[temps.length-1]
  
  return
}

function bytesToUnsignedInt( bytes ) {
  return ( ((bytes[0]<<8)) + 
           ((bytes[1]<<0)) )
}
function bytesToUnsignedLong( bytes ) {
  return ( ((bytes[0]<<24)) + 
           ((bytes[1]<<16)) + 
           ((bytes[2]<<8)) + 
           ((bytes[3]<<0)) )
}

// experimentk for fast data collectoin
var timeTH
function timeT() {
  timeTH=window.setInterval( function() { sendHandler( [
  CMDS['CMD_TOBJ1_GET'].address,
  CMDS['CMD_TOBJ1_GET'].address,
  CMDS['CMD_TOBJ1_GET'].address,
  CMDS['CMD_TOBJ1_GET'].address,
  CMDS['CMD_TOBJ1_GET'].address,
  CMDS['CMD_TOBJ1_GET'].address,
  CMDS['CMD_TOBJ1_GET'].address,
  CMDS['CMD_TOBJ1_GET'].address,
  ] ) }, 10 )
  window.setTimeout( function() {
    graphTObj1.tickTock()
    window.clearInterval(timeTH)
  }, 110 )
  return
}

function tObjProcessFunc( dataBytes, graphs, heatmaps, coords=null ) {
  
  // build up 16-bit register contents
  var tempReg = bytesToUnsignedInt( dataBytes.slice(0,2) )
  
  // convert register to degrees C
  var temp = tempReg/50 - 273.15
  
  // get time information
  var unixTimestamp = bytesToUnsignedLong( dataBytes.slice(6,10) )
  var ms = bytesToUnsignedInt( dataBytes.slice(10,12) )
  
  // handle whether we think on board time information is good
  if ( hid.onBoardClocking )
    var timeWithMs = unixTimestamp + (ms/1000)
  else
    var timeWithMs = Date.now()// + (ms/1000)
  
  // add point to graph object(s)
  graphs.forEach( function( graph) { graph.addPoint( temp ) } )
  
  heatmaps.forEach( function( heatmap ) { 
    
    // use either local pan/tilt values or ones sent by MCU
    if ( coords ) {
      panReg = bytesToUnsignedInt( dataBytes.slice(2,4) )
      pan = panReg / ((1<<16)-1)* 360
      tiltReg = bytesToUnsignedInt( dataBytes.slice(4,6 ) )
      tilt = tiltReg / ((1<<16)-1)* 360
    }
    
    // compute details needed for heatmap placement
    if ( tilt == 0 )
      locTilt = 0
    else
      locTilt = Math.round( (heatmap.dim[0]-1) * ( tilt - gimbal.tiltRngLim[0] ) / ( gimbal.tiltRngLim[1] - gimbal.tiltRngLim[0] ) )
    if ( pan == 0 ) {
      locPan = 0
    } else {
      if ( locTilt % 2 )
        locPan = Math.round( (heatmap.dim[1]-0.5) * ( pan - gimbal.panRngLim[0] ) / ( gimbal.panRngLim[1] - gimbal.panRngLim[0] ) )
      else
        locPan = Math.round( (heatmap.dim[1]-0.5) * ( pan - gimbal.panRngLim[0] ) / ( gimbal.panRngLim[1] - gimbal.panRngLim[0] ) - 0.5 )
    }
    
    // add point to heatmap object(s)
    heatmap.colorize( [locTilt,locPan], temp )
  } )
  
  return
}
