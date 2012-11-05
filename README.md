jParadrag
=========

Draggable Parallax Panorama jQuery Pluggin

# Usage
## HTML
You can have as many layers as you like. The last one will be the one that they drag.
	<ul id="jParadrag">
		<li><img src="http://background-image.jpg" /></li>
		<li><img src="http://front-draggable-image.jpg" /></li>
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
				startPosition 	: null, // by default the panorama will start in the middle, otherwise use pixels from the left
				factor 			: 2,	// the parallax factor, each layer back will move at half the speed of the one in front
				onDrag 			: function(){  }, // called when the drag starts
				onDragStop 		: function(){  }, // called when the drag stops
				onLoad			: function(){  }  // called when the panorama is all set up
			});
		});
	</script>