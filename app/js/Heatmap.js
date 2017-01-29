// variation of Nadieh Bremer's "Self Organizing Map - Heatmap - D3" code
// http://bl.ocks.org/nbremer/6052814

function Heatmap( parentDiv, varargin={} ) {
  // constructor for heatmap class
  
  // set initial range to default values
  this.rng = Heatmap.DEFAULT_RNG
  
  // set initial heatmap dimensions (rows,cols) to default values
  this.dim = Heatmap.DEFAULT_DIM
  
  // set inital colormap to default
  this.colormap = Heatmap.DEFAULT_COLORMAP
  
  // set initial colors for hexagons
  this.colorHexStroke = Heatmap.DEFAULT_COLOR_HEX_STROKE
  this.colorHexFill = Heatmap.DEFAULT_COLOR_HEX_FILL
  
  // override any default values if specified in varargin
  for ( key in varargin ) 
    if ( this.hasOwnProperty( key ) ) 
      this[key] = varargin[key]
  
  // store the parent container div in case we need to look at it later
  this.parentDiv = parentDiv
  
  // initialize local data container
  this.data = []
  
  //setInterval( function() {
    //var v = dataTOBJ1.shift()  // remove the first element of the array
    //graphTOBJ1.append( 
    //dataTOBJ1.push( 13 )  // add a new element to the array (we're just taking the number we just shifted off the front and appending to the end)
    //addPoint( graphObjTOBJ1, 100*Math.random() )
    //updateGraph( graphObjTOBJ1, dataTOBJ1, lineTOBJ1 )
  //}, 100 )
  
  // when object is here, we should actually create a graph too,
  // the rest of this constructor is doing exactly this...
  
  // create graph div
  this.div = document.createElement( 'div' )
  this.div.setAttribute( 'id', Heatmap.DIV_BASE_ID + '_' + Math.random().toString(36).substr(2,9) )
  this.div.classList.add( 'containerItem' )
  this.div.classList.add( 'heatmapItem' )
  
  // store reference to object in DOM in case we need to get at it
  this.div.obj = this
  
  // and add it to the DOM
  this.parentDiv.appendChild( this.div )
  
  // create heatmap svg element
  this.heatmapSvg = d3.select( this.div )
    .append( 'svg' )
  
  // configure heatmap svg with heatmap elements
  this.heatmap = this.heatmapSvg.append( 'g' )
    .attr( 'class', 'hexagons' )
    .attr( 'transform', 'translate(' + Heatmap.MARGINS.left + ',' + Heatmap.MARGINS.top + ')' )
  
   //this.path = this.heatmap.append( 'path' )
   // .attr( 'class', '.hexagon' )
  
  // now render the heatmap (it is important to abstract the rest of
  // the functionality so we can utilize this method on window resize
  // events
  this.render()
  
  // also make sure to resize other heatmaps
  var curHeatmapCnt = this.getHeatmapCnt()
  var indexOfHeatmap = this.getIndexOfHeatmap()
  var parentDivChildren = this._getHeatmapChildren()
  for ( var idx=0; idx<curHeatmapCnt; idx++ )
    if ( idx != (indexOfHeatmap-1) )
      parentDivChildren[idx].obj.render()
  
  // attach render function to window resize events
  this.lisResize = window.addEventListener( 'resize', this.render.bind(this), false )
  
  return
}

// constants relating to underlying magic
Heatmap.DIV_BASE_ID = 'heatmap'
Heatmap.MAX_HEXES = 150000      // i.e. a 500*300 hex grid for ref

// constants to set default values
Heatmap.DEFAULT_RNG = [0, 1]
Heatmap.DEFAULT_DIM = [45, 90]    // rows, columns
Heatmap.DEFAULT_COLOR_HEX_STROKE = 'rgb(255,255,255)'
Heatmap.DEFAULT_COLOR_HEX_FILL = 'rgb(200,200,200)'
Heatmap.DEFAULT_COLORMAP = function( val ) {
  return 'rgb(' + 
    Math.round( (val-this.rng[0]) / (this.rng[1]-this.rng[0]) * 255 ) + 
    ', 0, ' + 
    Math.round( 255 - (val-this.rng[0]) / (this.rng[1]-this.rng[0]) * 255 ) +
    ')'
}

// contants relating to visual appeal
Heatmap.HEATMAPS_PER_ROW = 2
Heatmap.MARGINS = { 
  bottom: 15,
  top: 15,
  left: 15,
  right: 15 
}
Heatmap.TRANSITION_FADE_IN = 10
Heatmap.TRANSITION_FADE_OUT = 500
Heatmap.TRANSITION_COLOR = 100

// create placeholder for extra callback function to be defined from
// outside class
Heatmap.MOUSE_OVER_CB = null

Heatmap.prototype.destroy = function() {
 
  // remove div container from DOM
  this.parentDiv.removeChild( this.div )
  
  // remove render on resize event handler from window
  window.removeEventListener( 'resize', this.lisResizeFunc )
  
  // this really doesn't do anything (JS is garbage collected) but it's
  // nice to look at...?
  delete this
  
  return
}

Heatmap.prototype.render = function() {
  // really, really good function that basically does all initial
  // rendering of the heatmap elements (this is needed initially, 
  // anytime the div is resized, another heatmap is added, etc.)
  
  console.log( 'rendering heatmap @' + this.div.id )
  
  // first make sure our heatmap's svg is the right dimensions
  // to do this we first need information about how many other heatmaps
  // are present
  var curHeatmapCnt = this.getHeatmapCnt()
  var indexOfHeatmap = this.getIndexOfHeatmap()
  var rows = Math.ceil( curHeatmapCnt / Heatmap.HEATMAPS_PER_ROW )
  var heatmapsInLastRow = curHeatmapCnt % Heatmap.HEATMAPS_PER_ROW
  var areWeInLastRow = indexOfHeatmap > ( (rows-1) * Heatmap.HEATMAPS_PER_ROW )
  
  // then, based on flexbox characteristics, we should set the 
  // width/height of the div
  this.height = this.parentDiv.clientHeight / rows
  if ( areWeInLastRow && (heatmapsInLastRow!=0) )
    this.width = this.parentDiv.clientWidth / heatmapsInLastRow
  else
    this.width = this.parentDiv.clientWidth / Heatmap.HEATMAPS_PER_ROW
  this.heatmapSvg
    .attr( 'width', this.width )
    .attr( 'height', this.height )
  console.log( '* ' + this.width + ' * ' + this.height )
  
  // need to resize other heatmaps
  $( this.parentDiv ).trigger( 'resize' )
  
  // now that our heatmap div is added, we need to see how big our
  // heatmap dimensions should actually be
  this.heatmapWidth = this.width - Heatmap.MARGINS.left - Heatmap.MARGINS.right
  this.heatmapHeight = this.height - Heatmap.MARGINS.bottom - Heatmap.MARGINS.top
  console.log( '  width: ' + this.heatmapWidth + 'px' )
  console.log( '  height: ' + this.heatmapHeight + 'px' )
  
  // define radius for hexagons based on width and geometry
  this.hexRadius = d3.min( 
    [ this.heatmapWidth / ( (this.dim[1]+0.5)*Math.sqrt(3) ),
      this.heatmapHeight / ( (this.dim[0]+1/3)*1.5 ) ] )
  console.log(this.hexRadius)
  
  // setup function to create hexagon bins 
  this.hexBin = d3.hexbin().radius( this.hexRadius )
  
  // calculate the center positions of each hexagon
  this.hexCenters = [];
  for ( var idx1 = 0; idx1 < this.dim[0]; idx1++ ) {
    for ( var idx2 = 0; idx2 < this.dim[1]; idx2++ ) {
      if ( idx1 % 2 == 0 ) {
        var x = Math.sqrt(3) * idx2 * this.hexRadius
      } else {
        var x = Math.sqrt(3) * (idx2-0.5) * this.hexRadius
      }
      var y = (3 * idx1) * this.hexRadius / 2
      this.hexCenters.push( [x, y] )
    }
  }
  
  // need to shift transform to offset for new hex radius (also center)
  if ( (this.dim[1]/this.dim[0]) < (this.heatmapWidth/this.heatmapHeight) )
    this.heatmap
      .attr( 'transform', 'translate(' + ( Heatmap.MARGINS.left + 
        ( this.heatmapWidth - (this.hexRadius*(this.dim[1]+0.5)*Math.sqrt(3)) ) / 2 + this.hexRadius ) + 
        ',' + ( Heatmap.MARGINS.top + this.hexRadius ) + ')' )
  else
    this.heatmap
      .attr( 'transform', 'translate(' + ( Heatmap.MARGINS.left + this.hexRadius ) +
        ',' + ( Heatmap.MARGINS.top + this.hexRadius + 
        ( this.heatmapHeight - (this.hexRadius*(this.dim[0]+1/3)*1.5) ) / 2 + this.hexRadius ) + ')' )
  
  // first get rid of everything
  this.heatmap.selectAll( 'path' )
    .data( [] )
    .exit().remove()
    
  // update data with new contents and
  // reflect changes to path
  this.path = this.heatmap.selectAll( 'path' )
    .data( this.hexBin( this.hexCenters ) )
    .enter().append( 'path' )
    .attr( 'd', function (d,i) {
      return "M" + d.x + "," + d.y + this.hexBin.hexagon()
    }.bind(this) )
    .attr( 'stroke', function (d,i) {
      return this.colorHexStroke
    }.bind(this) )
    .attr( 'stroke-width', '1px' )
    .style( 'fill', function (d,i) {
      return this.colorHexFill
    }.bind(this) )
    .on( 'mouseover', function mover(e) {
      if ( Heatmap.MOUSE_OVER_CB && mouseState.clicked )
        Heatmap.MOUSE_OVER_CB( d3.select( this ).data()[0] )
      var el = d3.select( this )
        .transition()
        //.ease( 'linear' )
        //.duration( Heatmap.TRANSITION_FADE_IN )
        .style( 'fill-opacity', 0.3 )
      
      return
    } )
    .on( 'mouseout', function mover(e) {
      var el = d3.select( this )
        .transition()
        .ease( 'linear' )
        .duration( Heatmap.TRANSITION_FADE_OUT )
        .style( 'fill-opacity', 1.0 )
      return
    } )
  
  // give each hexagon SVG element initial data
  // (also consider offset here for offseting of hexagons in grid)
  for ( var row=0; row<this.dim[0]; row++ ) {
    for ( var col=0; col<=this.dim[1]; col++ ) {
      d3.select( this.path[0][row*this.dim[1]+col] ).data( [ {
        'loc': [row,col],
        'val': null,
      } ] )
    }
  }
  
  return
}

Heatmap.prototype._getHeatmapChildren = function() {
  return children = $( this.parentDiv ).children( 'div' )
}

Heatmap.prototype.getIndexOfHeatmap = function( children ) {
  var children = this._getHeatmapChildren()
  for ( var idx=0; idx<children.length; idx++ ) {
     if ( children[idx].id==this.div.id)
      return idx + 1
  }
  return -1
}

Heatmap.prototype.getHeatmapCnt = function() {
  return this._getHeatmapChildren().length
}

Heatmap.prototype.setDim = function( dim ) {

  // don't waste resources in case everything here is already okay
  if ( dim == this.dim )
    return
  
  // make sure this does not put us over the hexagon limit
  if ( (dim[0]*dim[1]) > Heatmap.MAX_HEXES ) {
    console.log( 'Cannot change heatmap dimension, new dimensions over limit resolution of ' + Heatmap.MAX_HEXES )
    return
  }
  
  // everything looks good, go ahead and change them
  this.dim = dim
  
  // and render
  this.render()
  
  return
}

Heatmap.prototype._setRng = function( rng ) {
  
  // don't waste resources if nothing has changed or invalid input
  if ( rng == this.rng )
    return
  
  // update range object property
  this.rng = rng
  
  return
}

Heatmap.prototype.fitRng = function() {
  
  // get data of all hexes
  var data = this.path.data()
  
  // simply set a new range based on a max min values
  this._setRng( [ 
    d3.min( data, function (d) { 
      return d.val
    } ),
    d3.max( data, function (d) { 
      return d.val
    } )
  ] )
  
  // this means we should recolor all the hexes
  this.colorizeAll()
  
  return
}

Heatmap.prototype.colorizeAll = function() {
  
  // retrieve values from all hexes (stored in data)
  var valArr = this.path.data()
  
  for ( var row=0; row<this.dim[0]; row++ )
    for ( var col=0; col<this.dim[1]; col++ )
      this.colorize( [row,col], valArr[(row)*this.dim[1]+(col)].val )
  
  //this.heatmap.transition()
  //  .selectAll( 'path' )
  //  .transition()
  //  .ease( 'linear' )
  //  .duration( Heatmap.TRANSITION_FADE_IN )
  //  .style( 'fill', function (d,i) {
  //    if ( data[i] )
  //      return this.colormap( data[i] )
  //    else
  //      return this.colorHexFill
  //  }.bind(this) )
  
  return
}
Heatmap.prototype.colorize = function( loc, val ) {
  
  // if no good value, don't touch anything
  if ( val == null )
    return
  
  // find hex SVG element we want
  var hex = d3.select( this.path[0][loc[0]*this.dim[1]+loc[1]] )
  
  // colorize individual hexagon tile
  hex
    .transition()
    .ease( 'linear' )
    .duration( Heatmap.TRANSITION_COLOR )
    .style( 'fill', function (d,i) {
      if ( val!=null )
        return this.colormap( val )
      else
        return this.colorHexFill
    }.bind(this) )
  
  // get existing data container attached to hex SVG element
  var data = hex.data()[0]
  
  // add relevant data to data continer
  data.val = val
  
  // finally attach data to element
  hex.data( [data] )
  
  return
}

