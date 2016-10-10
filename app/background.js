chrome.app.runtime.onLaunched.addListener( function() {
  chrome.app.window.create( 'index.html', {
    'outerBounds': {
      'width': 960, //1150,
      'height': 1080
    }
  } )
} )