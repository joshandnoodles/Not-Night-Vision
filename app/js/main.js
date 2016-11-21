var CMDS = {
  // 0x1* debugging commands
  'CMD_BEEP': {
    address:  0x10,
    rxBytes:  0,
    txBytes:  1,
    },
  'CMD_BEEP_LONG': {
    address:  0x11,
    rxBytes:  0,
    txBytes:  1,
    },
  'CMD_BEEP_BYTE': {
    address:  0x12,
    rxBytes:  0,
    txBytes:  1,
    },
  'CMD_LED_TOG': {
    address:  0x15,
    rxBytes:  1,
    txBytes:  0,
    },
  'CMD_LED_SET': {
    address:  0x16,
    rxBytes:  0,
    txBytes:  1,
    },
  // 0x3* temperature sensor commands
  'CMD_GET_TOBJ1': {
    address:  0x30,
    rxBytes:  2+2+6,
    txBytes:  0,
    },
  'CMD_GET_TOBJ2': {
    address:  0x31,
    rxBytes:  2+2+6,
    txBytes:  0,
    },
  'CMD_GET_TAMB': {
    address:  0x32,
    rxBytes:  2+6,
    txBytes:  0,
    },
  // 0x4* timer commands
  'CMD_SET_TIME': {
    address:  0x40,
    rxBytes:  0,
    txBytes:  4,
    },
  'CMD_GET_TIME': {
    address:  0x41,
    rxBytes:  4+2,
    txBytes:  0,
    },
  // 0x6* servo commands
  'CMD_SET_PAN': {
    address:  0x60,
    rxBytes:  0,
    txBytes:  2,
    },
  'CMD_SET_TILT': {
    address:  0x61,
    rxBytes:  0,
    txBytes:  2,
    },
  // 0x7* laser activities
  'CMD_LSR_TOG': {
    address:  0x70,
    rxBytes:  1,
    txBytes:  0,
    },
  'CMD_LSR_SET': {
    address:  0x71,
    rxBytes:  0,
    txBytes:  1,
    },
  // 0x8* delay commands
  'CMD_DELAY_US': {
    address:  0x80,
    rxBytes:  0,
    txBytes:  2,
    },
  'CMD_DELAY_MS': {
    address:  0x81,
    rxBytes:  0,
    txBytes:  2,
    },
  // 0x9 macro commands
  'CMD_GO_FLAG': {
    address:  0x90,
    rxBytes:  0,
    txBytes:  0,
    },
  // 0xE* error identifiers
  
}

var gimbalTiltRng = [0,90]
var gimbalPanRng = [0,180]
var gimbalTilt = 0
var gimbalPan = 0

//CMDS['CMD_SET_PAN'], Math.round( ang/angularResX )*angularResX*2^16 
//CMDS['CMD_SET_TILT'], Math.round( ang/angularResY )*angularResY*2^16 

// define our DOM grid
var graphContainerDiv = document.getElementById( 'graphs' )
var heatmapContainerDiv = document.getElementById( 'heatmaps' )
var terminalContainerDiv = document.getElementById( 'rightSidebarToolbox1' )
var controlContainerDiv = document.getElementById( 'rightSidebarToolbox2' )
var otherContainerDiv = document.getElementById( 'rightSidebarToolbox3' )

// initalize everything
initBase()

var terminal = new Log( terminalContainerDiv )
terminal.terminal( onEnter=sendHandler, cmdHash=CMDS )
var hid = new Hid( receiveHandler )
hid.connect()

// initialize any objects we want at the start ..

// .. graphs
var graphs = []
var newGraph = ( function( varargin ) {
  graphs.push( new Graph( graphContainerDiv, varargin ) )
  return graphs[graphs.length-1] 
} )
var graphTObj1 = newGraph()
var graphTObj2 = newGraph()
var graphTObj1Long = newGraph( ( { 'xRng': [-30*1000,5*1000] } ) )
var graphTAmb = newGraph()

// .. heatmaps
var heatmaps = []
var newHeatmap = ( function( varargin ) {
  heatmaps.push( new Heatmap( heatmapContainerDiv, varargin ) )
  return heatmaps[heatmaps.length-1] 
} )
var heatmapTObj1 = newHeatmap()

// setup callback for directing gimbal based on interaction with 
// heatmap(s)
Heatmap.MOUSE_OVER_CB = function( data ) {
  
  // compute pan and tilt values to send to device
  gimbalTilt = ( gimbalTiltRng[1] - gimbalTiltRng[0] ) * ( data.loc[0] / (heatmaps[0].dim[0]-1) ) + gimbalTiltRng[0]
  if ( data.loc[0] % 2 )
    gimbalPan = ( gimbalPanRng[1] - gimbalPanRng[0] ) * ( (data.loc[1]) / (heatmaps[0].dim[1]-0.5) ) + gimbalPanRng[0]
  else
    gimbalPan = ( gimbalPanRng[1] - gimbalPanRng[0] ) * ( (data.loc[1]+0.5) / (heatmaps[0].dim[1]-0.5) ) + gimbalPanRng[0]
  var gimbalTiltBytes = gimbalTilt / 360 * (Math.pow(2,16)-1)
  var gimbalPanBytes = gimbalPan / 360 * (Math.pow(2,16)-1)
  
  //console.log( 'Setting gimbal pan to ' + (gimbalPan) + ' degrees.' )
  //console.log( 'Setting gimbal tilt to ' + (gimbalTilt) + ' degrees.' )
  
  // send command packet to device to turn gimbal to 
  sendHandler( [
    CMDS['CMD_SET_TILT'].address,
    gimbalTiltBytes>>8,
    gimbalTiltBytes>>0,
    CMDS['CMD_SET_PAN'].address,
    gimbalPanBytes>>8,
    gimbalPanBytes>>0,
  ] )
  
  return
}


// add heatmap object to DOM
//var heatmapObjTOBJ1 = createHeatmap( 'heatmapTOBJ1Div', 48, 32 )

// link go button to DOM
//graphContainerDiv.heatmap.on( 'click', function click(e) {
//  start()
//} )

// try to connect to HID device (this need for case of it already
// being plugged in
//hid.connect()

hideCurtain()

//go()

//var rand=10
//window.setInterval( function() {
//  graphs.forEach( function( graph ) {
//    graph.addPoint( 20+rand*Math.random() )
//  } )
  //graphTObj1.addPoint( data[data.length-1] )
  //graphObjTOBJ2.addPoint( data[data.length-1] )
  //graphObjTOBJ3.addPoint(-1] )
  //addHeatmapHex( heatmapObjTOBJ1, data[data.length-1] )
//}, 50 )

var timeTH
function timeT() {
  timeTH=window.setInterval( function() { sendHandler( [
  CMDS['CMD_GET_TOBJ1'].address,
  CMDS['CMD_GET_TOBJ1'].address,
  CMDS['CMD_GET_TOBJ1'].address,
  CMDS['CMD_GET_TOBJ1'].address,
  CMDS['CMD_GET_TOBJ1'].address,
  CMDS['CMD_GET_TOBJ1'].address,
  CMDS['CMD_GET_TOBJ1'].address,
  CMDS['CMD_GET_TOBJ1'].address,
  ] ) }, 10 )
  window.setTimeout( function() {
    graphTObj1.tickTock()
    window.clearInterval(timeTH)
  }, 110 )
  return
}

var goFlag = false
// define command packet to send to device
var goCmdPacket = [
  CMDS['CMD_GET_TOBJ1'].address,
  //CMDS['CMD_GET_TOBJ2'].address,
  //CMDS['CMD_GET_TAMB'].address,
  CMDS['CMD_GO_FLAG'].address,
]
function go() {
  
  // enable flag to tell receive handler to recall same calling
  // of command packet once we receive data from previous packet
  goFlag = true
  
  // have graphs updated nicely and scroll appropriately
  startTickTock()
  
  // send first command packet to device, once the device sends a
  // response for this packet, the same command packet will be sent
  // again (assuming flag is still set )
  sendHandler( goCmdPacket )
  
  return
}
//go()

function stop() {
  
  // first things first, turn off the flag for recursive
  // sending of command packet
  goFlag = false
  
  // stop graphs from updating nicely and scrolling
  stopTickTock()
  
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
  dataArr.forEach( function( val, idx ) { bytes[idx] = val } )
  
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
  
      case CMDS['CMD_GET_TOBJ1'].address:
        
        // extract data bytes from packet
        var dataBytes = getDataBytes( 'CMD_GET_TOBJ1' )
        
        // build up 16-bit register contents
        var tempReg = bytesToUnsignedInt( dataBytes.splice(0,2) )
        
        // convert register to degrees C
        var temp = tempReg/50 - 273.15
        
        // get time information
        var unixTimestamp = bytesToUnsignedLong( dataBytes.slice(4,8) )
        var ms = bytesToUnsignedInt( dataBytes.slice(8,10) )
        
        // handle whether we think on board time information is good
        if ( hid.onBoardClocking )
          var timeWithMs = unixTimestamp + (ms/1000)
        else
          var timeWithMs = Date.now()// + (ms/1000)
        
        // add point to current graph object
        graphTObj1.addPoint( temp )
        graphTObj1Long.addPoint( temp )
        
        // add to heatmap
        if ( gimbalTilt == 0 )
          locTilt = 0
        else
          locTilt = Math.round( (heatmaps[0].dim[0]-1) * ( gimbalTilt - gimbalTiltRng[0] ) / ( gimbalTiltRng[1] - gimbalTiltRng[0] ) )
        if ( gimbalPan == 0 ) {
          locPan = 0
        } else {
          if ( locTilt % 2 )
            locPan = Math.round( (heatmaps[0].dim[1]-0.5) * ( gimbalPan - gimbalPanRng[0] ) / ( gimbalPanRng[1] - gimbalPanRng[0] ) )
          else
            locPan = Math.round( (heatmaps[0].dim[1]-0.5) * ( gimbalPan - gimbalPanRng[0] ) / ( gimbalPanRng[1] - gimbalPanRng[0] ) - 0.5 )
        }
        heatmapTObj1.colorize( [locTilt,locPan], temp )
        
        break
          
      case CMDS['CMD_GET_TOBJ2'].address:
        
        // build up 16-bit register contents
        var reg = (dataByteOne<<8)+dataByteTwo
        
        // convert register to degrees C
        var temp = reg/50 - 273.15
        
        // add point to current graph object
        graphTObj2.addPoint( temp )
        
        break
        
      case CMDS['CMD_GET_TAMB'].address:
        
        // build up 16-bit register contents
        var reg = (dataByteOne<<8)+dataByteTwo
        
        // convert register to degrees C
        var temp = reg/50 - 273.15
        
        // add point to current graph object
        graphTAmb.addPoint( temp )
        
        break
      
      case CMDS['CMD_GET_TIME'].address:
        
        // extract data bytes from packet
        var dataBytes = getDataBytes( 'CMD_GET_TIME' )
        
        // convert data to time information
        var unixTimestamp = bytesToUnsignedLong( dataBytes.slice(0,4) )
        var ms = bytesToUnsignedInt( dataBytes.slice(4,6) )
        console.log( unixTimestamp + '.' + ms )
        
        break
        
      case CMDS['CMD_SET_TIME'].address:
        
        // no data here, but set flag to let app know that
        // all clocking is now being handled on board (PIC-side)
        // this currently includes but is not limited to expectations
        // that timestamps received from temperature object calls are
        // accurate
        var onBoardClocking = true
        
        break
        
      case CMDS['CMD_LED_TOG'].address:
        
        var dataBytes = getDataBytes( 'CMD_LED_TOG' )
        
        break
      
      case CMDS['CMD_GO_FLAG'].address:
        
        // if it looks like the program wants us to (flag set),
        // re-run macro command packet
        if ( goFlag )
          sendHandler( goCmdPacket )
        
        break
        
      case CMDS['CMD_LSR_TOG'].address:
        
        // extract data bytes from packet
        var dataBytes = getDataBytes( 'CMD_LSR_TOG' )
        
        // haven't decided if we want to do anything with this yet...
        
        break
      
      case CMDS['CMD_LED_TOG'].address:
        
        // extract data bytes from packet
        var dataBytes = getDataBytes( 'CMD_LED_TOG' )
        
        // haven't decided if we want to do anything with this yet...
        
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
  return ( (bytes[0]<<8) + 
           (bytes[1]<<0) )
}
function bytesToUnsignedLong( bytes ) {
  return ( (bytes[0]<<24) + 
           (bytes[1]<<16) + 
           (bytes[2]<<8) + 
           (bytes[3]<<0) )
}
