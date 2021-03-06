jParadrag
=========

A jQuery Pluggin that creates a Draggable Parallax Panorama.  

By default it will endlessly loop, i.e. the user can drag the foreground image to the left and right forever.  However, you can turn this feature off and contain the foreground image within the viewing window. 

# Usage
## HTML
You can have as many layers as you like. The last one will be the one that they drag. Every image except the most background image needs to have transparency.

	<ul id="jParadrag">
		<li><img src="http://background-image.jpg" /></li>
		<li><img src="http://front-draggable-image.png" /></li>
	</ul>
## JS
You need jQuery and jQueryUI Draggable

	<script type="text/javascript" src="js/jquery.min.js"></script>
	<script type="text/javascript" src="js/jquery-ui.min.js"></script>
	<script type="text/javascript" src="js/jparalax-drag.js" ></script>

Initialize

	<script type='text/javascript' charset='utf-8'>
		$(document).ready(function() {
			$('#jParadrag').jParadrag({
				width 			: 600, 	// the width of your panorama window *All your images must be >= this width*
				height			: 400, 	// the height of your panorama window
				startingZIndex 	: 1,	
				loop			: true, // endlessly loop
				momentum		: {		// mimic iOS scrolling momentum - set to false to disable
					avg 	  : 3,		// how many drag points to average to determine velocity
					friction  : 0.4		// pixels/millisecond
				},
				startPosition 	: null, // by default the panorama will start in the center of the front image, otherwise use pixels from the left
				factor 			: 2,	// the parallax factor, each layer back will move at half the speed of the one in front
				onDrag 			: function(){  }, // called when the drag starts
				onDragStop 		: function(){  }, // called when the drag stops
				onLoad			: function(){  }  // called when the panorama is all set up
			});
		});
	</script>
	
### Notes
* If you want it to work on touchscreens, [this library](https://github.com/furf/jquery-ui-touch-punch) will work.
* Since these transparent panoramic images can get pretty large,
jParadrag will create a placeholder div that is the same size as the viewing window with the id "\_jparadrag\_placeholder" 
and then fade in the panaorama when all the images have been loaded.
You can style this div with a spinner image if you like, *see example*
* TODO: momentum scrolling is only compatible with looping right now