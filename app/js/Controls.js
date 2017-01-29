function Controls( parentDiv ) {
  
    // initialize log related components
  this.controls = []
  this.groups = []
  this.controlsByGroup = []
  this.div = null
  
  // creating the DOM elements dynamically allows us to use modules 
  // in a way that allows specific features to be used or not used 
  // nicely
  
  // store the parent container div in case we need to look at it later
  this.parentDiv = parentDiv
  
  // create container to hold log elements
  this.div = document.createElement( 'div' )
  this.div.setAttribute( 'id', Controls.DIV_BASE_ID + '_' + Math.random().toString(36).substr(2,9) )
  this.div.classList.add( 'controlContainer' )
  
  // store reference to object in DOM in case we need to get at it
  this.div.obj = this
  
  // and add it to the DOM
  this.parentDiv.appendChild( this.div )
  
  return
}

Controls.DIV_BASE_ID = 'controls'
Controls.CONTROL_BASE_ID = 'control'
Controls.GROUP_BASE_ID = 'controls'

Controls.prototype.destroy = function() {
  
  // remove div container from DOM
  this.parentDiv.removeChild( this.div )
  
  // this really doesn't do anything (JS is garbage collected) but is
  // nice to look at...?
  delete this
  
  return
}


Controls.prototype.addGroup = function( string='' ) {
  // Add a group to hold controls to the DOM
  
  // only mess with stuff if DOM elements are ready (as they should be)
  if ( !this.div )
    return
  
  // don't allow group name duplicated (it will just confuse everyone/everything
  if ( Object.keys(this.controlsByGroup).includes( string ) ) {
    console.log( 'Group "' + string + ' "already exists, duplicate groups not allowed.' )
    return
  }
  
  // create control DOM element
  var groupDiv = document.createElement( 'div' )
  var uniqueString = Controls.GROUP_BASE_ID + '_' + Math.random().toString(36).substr(2,9)
  groupDiv.setAttribute( 'id', uniqueString )
  groupDiv.classList.add( 'controlGroup' )
  
  // create header DOM element
  var headerDiv = document.createElement( 'div' )
  headerDiv.classList.add( 'header' )
  if ( string == '' )
    string = uniqueString
  headerDiv.innerHTML = string
  
  // add header to top of group DIV
  groupDiv.appendChild( headerDiv )
  
  // keep track of group elements
  this.groups.push( groupDiv )
  this.controlsByGroup[string] = []
  
  // finally add group to control container
  this.div.appendChild( groupDiv )
  
  return
}

Controls.prototype.addControl = function( groupStr='', controlName='', func=null ) {
  // Add a control nicely to the DOM
  
  // only mess with stuff if DOM elements are ready (as they should be)
  if ( !this.div )
    return
  
  // decide if we need to create a new group for this control of if it
  // already exists
  if ( !Object.keys(this.controlsByGroup).includes( groupStr ) )
    this.addGroup( groupStr )
  
  // create control DOM element
  var controlDiv = document.createElement( 'div' )
  var uniqueString = Controls.CONTROL_BASE_ID + '_' + Math.random().toString(36).substr(2,9)
  controlDiv.setAttribute( 'id', uniqueString )
  controlDiv.classList.add( 'controlItem' )
  if ( controlName == '' )
    controlName = uniqueString
  if ( Object.keys(this.controlsByGroup[groupStr]).includes( controlName ) ) {
    console.log( "Control with name '" + controlName + 
    "' already exists in " + groupStr + " group," +
    " giving it the following name: " + uniqueString )
    controlName = uniqueString
  }
  var controlNameDiv = document.createElement( 'span' )
  controlNameDiv.setAttribute( 'id', 'header' )
  controlNameDiv.innerHTML = controlName
  controlDiv.appendChild( controlNameDiv )
  var controlValueDiv = document.createElement( 'span' )
  controlValueDiv.setAttribute( 'id', 'value' )
  controlDiv.appendChild( controlValueDiv )
  
  // set control up so function runs when it is clicked onLine
  if ( func != null )
    controlDiv.addEventListener( 'click', func, false )
  
  // keep track of control elements
  this.controls.push( controlDiv )
  this.controlsByGroup[groupStr][controlName] = controlDiv
  
  // finally add control to group
  for ( var idx=0; idx<this.groups.length; idx++ )
    if ( this.groups[idx].children[0].innerHTML == groupStr ) {
      this.groups[idx].appendChild( controlDiv )
      return
    }
  
  return
}

Controls.prototype.removeControl = function( id ) {
  console.log( 'Function no implemented!' )
}
