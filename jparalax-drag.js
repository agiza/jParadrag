/**
 * jParadrag JavaScript Library v0.5
 * http://www.github.com/owise1/jParadrag
 * Copyright 2012, @owise1
 * Licensed under the MIT or GPL Version 2 licenses.
 * Date: Nov 16 2012
 *
 * Copyright (C) 2011 - 2012 by @owise1
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function( $ ) {
  $.fn.jParadrag = function(o) {
    var opts = $.extend( {
		width 			: 600,
		height			: 400,
		startingZIndex 	: 1,
		startPosition 	: null,
		factor 			: 2,
		loop			: true,
		onDrag 			: function(){  },
		onDragStop 		: function(){  },
		onLoad			: function(){  }
    }, o);

	// returns the x of the middle image
	function _middle_x(left_x, width){
		if(!opts.loop) return left_x;

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
				margin   : 0,
				padding  : 0,
				width    : opts.width,
				height   : opts.height,
				overflow : 'hidden',
				'list-style' : 'none'
			}).fadeIn();
			$('#_jparadrag_placeholder').remove();

			$('li', self)
				.css({
					position : 'absolute',
					top: 0,
					left: 0
				})
				.each(function(i){
					var my_img = $('img', this),
						img_width = $(this).data('jParadrag.width'),
						starting_position,
						draggable_opts = {
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
						};

					if(opts.loop){
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
						starting_position = opts.startPosition ? -(opts.startPosition + img_width) : -(img_width * 1.5);

					// not looping
					} else {
						$(this).css({
							'z-index': opts.startingZIndex + i,
							'width' : img_width
						});

						$(this)
							.find('img')
								.css({
									display : 'block',
									float : 'left'
								});
						starting_position = opts.startPosition ? -(opts.startPosition) : -(img_width * 0.5);
						draggable_opts.containment = [-(opts.width-$(this).offset().left),0,0,opts.height];
					}


					// the front li
					if(i == li_count - 1){
						$(this).draggable(draggable_opts);

						methods.move_to(starting_position);
					} 
				});
				opts.onLoad();
		}

		$self.hide().after($("<div id='_jparadrag_placeholder'>").css({ width : opts.width, height :  opts.height }));
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