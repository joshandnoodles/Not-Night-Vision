function Log( parentDiv ) {
  
    // initialize log related components
  this.logQueue = []
  this.debugQueue = []
  this.persistentQueue = []
  this.terminalQueue = []
  this.div = null
  
  // creating the DOM elements dynamically allows us to use modules 
  // in a way that allows specific features to be used or not used 
  // nicely
  
  // store the parent container div in case we need to look at it later
  this.parentDiv = parentDiv
  
  // create container to hold log elements
  this.div = document.createElement( 'div' )
  this.div.setAttribute( 'id', Log.DIV_BASE_ID + '_' + Math.random().toString(36).substr(2,9) )
  this.div.classList.add( 'logContainer' )
  
  // store reference to object in DOM in case we need to get at it
  this.div.obj = this
  
  // and add it to the DOM
  this.parentDiv.appendChild( this.div )
  
  return
}

Log.DIV_BASE_ID = 'log'
Log.REMOVE_ELE_DUR = 20000   // ms

Log.prototype.destroy = function() {
  
  // remove div container from DOM
  this.parentDiv.removeChild( this.div )
  
  // this really doesn't do anything (JS is garbage collected) but is
  // nice to look at...?
  delete this
  
  return
}


Log.prototype.debug = function( string ) {
  // log the information prettily if the DOM already has the debug stuff
  // initialized
  
  if ( this.div ) {
    
    // create debug text element
    var debugEle = document.createElement( 'div' )
    debugEle.classList.add( 'logElement' )
    debugEle.innerHTML = string
    
    // add debug element to log container contents
    if ( this.debugQueue.length > 0 &&
         this.logQueue.length > 0 &&
         this.logQueue.indexOf( this.debugQueue[0] ) > -1 &&
         this.debugQueue[0].parentNode != null ) {
      this.div.insertBefore( debugEle, this.debugQueue[0] )
    } else {
      this.div.appendChild( debugEle )
    }
  
    // keep track of debug elements and all logs
    this.debugQueue.unshift( debugEle )
    this.logQueue.unshift( debugEle )
    
    // set action to remove element from debug container
    function removeEleSubFunc() {
      var idx = this.logQueue.indexOf( debugEle )
      this.div.removeChild( debugEle )
      if ( idx > -1 ) this.logQueue.splice( idx, 1 )
    }
    setTimeout( removeEleSubFunc.bind(this), Log.REMOVE_ELE_DUR )
    
  }
  
  // it would be unfair to leave the old console out
  console.log( string )
  //console.log( this.debug.caller.toString() )
  //arguments.callee.caller.toString() // give source
  
  var e = new Error('dummy');
  var stack = e.stack.replace(/^[^\(]+?[\n$]/gm, '')
      .replace(/^\s+at\s+/gm, '')
      .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
      .split('\n');
  //console.log(stack);
  
}

Log.prototype.addPersistent = function( initStr ) {
  
  if ( this.div ) {
    
    // create debug text element
    var persistentEle = document.createElement( 'div' )
    persistentEle.classList.add( 'logElement' )
    persistentEle.innerHTML = initStr
    
    // add debug element to log container contents
    if ( this.logQueue.length > 0 ) {
      this.div.insertBefore( persistentEle, this.persistentQueue[0] )
    } else {
      this.div.appendChild( persistentEle )
    }
    
    // keep track of debug elements and all logs
    this.persistentQueue.unshift( persistentEle )
    this.logQueue.unshift( persistentEle )
    
    return persistentEle 
  } else {
    console.log( 'Persistent Log Error: unable to create persistent log element.' )
    return null
  }
  
}

Log.prototype.addPersistentEditable = function( initStr ) {
  
  // 99% of this is the same as a regular persistent log element
  var id = this.addPersistent( initStr )
  
  // now just make div editable and add class for it editableness
  id.contentEditable = true
  id.classList.add( 'edit' )
  
  return id
}

Log.prototype.removePersistent = function( id ) {
  
  // get indices of element in stored queues
  var idxPersistentQueue = this.persistentQueue.indexOf( id );
  var idxLogQueue = this.logQueue.indexOf( id );
  
  // remove element 
  if ( idxPersistentQueue > -1 ) {
      this.persistentQueue.splice( idxPersistentQueue, 1 )
  } else {
    console.log( 'Log Queue Error: problem finding persistent queue element index.' )
  }
  if ( idxLogQueue > -1 ) {
      this.logQueue.splice( idxLogQueue, 1 )
  } else {
    console.log( 'Log Queue Error: problem finding log queue element index.' )
  }
  
  // remove element from DOM
  this.div.removeChild( id )
  
}

Log.prototype.terminal = function( onEnter=null, cmdHash={} ) {
  
  // store terminal cmd hash table so we can get back at it later
  this.cmdHash = cmdHash
  
  // first give user information about the terminal
  welcomeStr = 'Welcome to the terminal.<br>\
````To begin using, simply type commands you wish to send<br>\
````to over USB seperating each by a space. We can use CMD<br>\
````identifiers to specify commands instead of memorizing<br>\
````their hex values. A list of available CMD identifiers<br>\
````is given below:<br>'
  for ( key in this.cmdHash ) {
    welcomeStr = welcomeStr.concat( 
      '`````````' + key + ' --> ' + this.cmdHash[key] + '<br>' )
  }
  welcomeStr = welcomeStr.concat('\
QED' )
  welcomeStr = welcomeStr.replace( /`/g, '&nbsp;' )
  
  // add it to the terminal
  var id = this.addPersistent( welcomeStr )
  
  // continue with terminal prompting 
  this.prompt( recur=true, onEnter=onEnter )
  
  return
}

Log.prototype.prompt = function( recur=false, onEnter=null, initStr='' ) {  
  // prompt terminal user
  id = this.addPersistentEditable( initStr )
  
  // keep track of all terminal logs independently
  this.terminalQueue.unshift( id )
  
  // zero out up/down arrow selecting count
  upDownArrCnt = 0
  
  // give focus to caret if appropriate
  if ( !id.parentElement.parentElement.classList.contains( 'shrink' ) )
      id.focus()
  
  // attach callback for when user hits enter on their string
  function keystrokeCallback( e ) {
    
    // we only car if the enter key was pressed
    if ( e.which==13 && !id.parentElement.parentElement.classList.contains( 'shrink' ) ) {
      
      // safe-guard b/c the enter key is NASTY
      e.preventDefault()
      
      // stop here if user didn't enter anything yet
      if ( id.innerHTML.length == 0 )
        return false
      
      // remove editable class from div (this way user does not mess
      // with it since it has been enter'ed)
      id.classList.remove( 'edit' )
      
      // and make sure they are not editable
      id.contentEditable = false
      
      // run callback now that information has been enter'ed
      if ( onEnter ) {
        
        // build up CMD array to send to handler
        var dataArr = id.innerHTML.split( ' ' )
        dataArr = dataArr.map( function( obj ) {
          if ( ( this.cmdHash.hasOwnProperty( obj ) ) &&
               ( this.cmdHash[obj].address != undefined ) )
            return this.cmdHash[obj].address
          else
            return parseInt( obj, 16 )
        } )
        onEnter( dataArr )
      }
      
      if ( recur ) {
        // recall function to re-prompt user with new caret
        this.prompt( recur, onEnter, initStr )
      }
    
    } else if ( e.which==38 ) {  // up
      
      // safe-guard b/c the navigation keys are NASTY
      e.preventDefault()
      
      if ( this.terminalQueue.length ) {
        
        // get previous terminal log if available
        if ( this.terminalQueue.length > (upDownArrCnt+1) )
          upDownArrCnt++
        
        // update current terminal log with previous
        if ( upDownArrCnt.length!=1 ) {
          if ( upDownArrCnt==0 )
            this.terminalQueue[0].innerHTML = ''
          this.terminalQueue[0].innerHTML = this.terminalQueue[upDownArrCnt].innerHTML
        }
        
        // also take this time to put the caret at the end of the entry
        if ( this.terminalQueue[0].innerHTML.length ) {
          var domRng = document.createRange()
          var domSel = window.getSelection()
          domRng.setStart( this.terminalQueue[0].childNodes[0], this.terminalQueue[0].innerHTML.length )
          domRng.collapse( true )
          domSel.removeAllRanges()
          domSel.addRange( domRng )
        }
        
      }
      
    } else if ( e.which==40 ) {  // down
      
      // safe-guard b/c the navigation keys are NASTY
      e.preventDefault()
      
      if ( this.terminalQueue.length ) {
        
        // get previous terminal log if available
        if ( upDownArrCnt>0 )
          upDownArrCnt--
        
        // update current terminal log with previous
        if ( upDownArrCnt.length!=1 ) {
          if ( upDownArrCnt==0 )
            this.terminalQueue[0].innerHTML = ''
          this.terminalQueue[0].innerHTML = this.terminalQueue[upDownArrCnt].innerHTML
        }
        
        // also take this time to put the caret at the end of the entry
        if ( this.terminalQueue[0].innerHTML.length ) {
          var domRng = document.createRange()
          var domSel = window.getSelection()
          domRng.setStart( this.terminalQueue[0].childNodes[0], this.terminalQueue[0].innerHTML.length )
          domRng.collapse( true )
          domSel.removeAllRanges()
          domSel.addRange( domRng )
        }
        
      }
    }
    
    return
  }
  $(id).keydown( keystrokeCallback.bind(this) )
  
  return
}
