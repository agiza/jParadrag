(function( $ ) {
  $.fn.jParadrag = function(o) {
    var opts = $.extend( {
		width 			: 600,
		height			: 400,
		startingZIndex 	: 1,
		startPosition 	: null,
		factor 			: 2,
		onDrag 			: function(){  },
		onDragStop 		: function(){  },
		onLoad			: function(){  }
    }, o);
	
	// returns the x of the middle image
	function _middle_x(left_x, width){
		if(left_x > -width){
			return left_x - width;
		} else if(left_x < -(2*width)){
			return left_x + width;
		}
		return left_x;
	}
	
	return this.each(function(){
		var $self         = $(this),
			self          = this,
			li_count      = $('li', this).length,
			img_count     = $(this).find('img').length,
			images_loaded = 0;
			
		var methods = {
			drag : function(ev, ui){
				var left_x = typeof ev === 'object' ? ui.position.left : ev;
				methods.move_layers(left_x);
			},
			move_to : function(left_x){
				$('li:last', $self).css({ left : left_x });
				methods.drag(left_x);
			},
			stop_drag : function(ev, ui){
				$('li', $self).each(function(i){
					$(this).css('left', _middle_x(parseInt($(this).css('left')), $(this).data('jParadrag.width')));
				});
			},
			move_layers : function(front_x){
				$('li', $self).each(function(i){
					if(i == li_count - 1) return;
					
					var last_spot = $(this).data('jParadrag.last_spot'),
					 	f = (1+i) * opts.factor, 
						my_left;
						
					if(last_spot){
						var diff = parseInt(last_spot) - _middle_x(front_x, $(this).data('jParadrag.width'));
						var sign = diff > 0 ? '-=' : '+=';
						if(Math.abs(diff) < opts.width)
							$(this).css({ left : sign + parseInt(Math.abs(diff) / f) + 'px' });
						
					} else {
						$(this).css({ left : _middle_x(front_x / f, $(this).data('jParadrag.width')) });
					}
					$(this).data('jParadrag.last_spot', _middle_x(front_x, $(this).data('jParadrag.width')));
					
				})
			}
		}
		
		function init(){
			$self.css({
				position : 'relative',
				display  : 'block',
				width    : opts.width,
				height   : opts.height,
				overflow : 'hidden',
				'list-style' : 'none'
			});
			$('li', self)
				.css({
					position : 'absolute',
					top: 0,
					left: 0
				})
				.each(function(i){
					var my_img = $('img', this),
						img_width = $(this).data('jParadrag.width');
					
					$(this).css({
						'z-index': opts.startingZIndex + i,
						'width' : img_width * 3
					});
					
					$(this)
						.append(my_img.clone())
						.prepend(my_img.clone())
						.find('img')
							.css({
								display : 'block',
								float : 'left'
							});

					// the front li
					if(i == li_count - 1){
						$(this)
							.draggable({
								axis : 'x',
								drag : function(ev, ui){ 
									if(!$self.data('jParadrag.draggin')){
										$self.data('jParadrag.draggin', true);
										opts.onDrag();
									} 
									methods.drag(ev, ui);
								},
								stop : function(ev, ui){
									if($self.data('jParadrag.draggin')){
										$self.data('jParadrag.draggin', false);
										opts.onDragStop();
									} 
									
									methods.stop_drag(ev, ui);
								}
							});
							
						var	starting_position = opts.startPosition ? -(opts.startPosition + img_width) : -(img_width * 1.5);
						methods.move_to(starting_position);
					} 
				});
				opts.onLoad();
		}
		
		
		$self.find('img').each(function(){
			var i    = new Image();
			i.src    = $(this).attr('src');
			var me   = $(this);
			i.onload = function(){
				me.closest('li').data('jParadrag.width', me.width());
				images_loaded++;
				if(images_loaded == img_count) init();
			}
		})
			
		
	});

  };
})( jQuery );
