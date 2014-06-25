(function($){
	$.fn.easyView = function(option, value){
		var booted = false;
		var selector = this.selector;

		if(typeof option == 'object'){
			/* Default Values */
			var defaults = {
				container: 'body',
				tags: ['h1','h2','h3','h4','h5','h6', 'div', 'p', 'a', 'span', 'strong', 'em', 'ul', 'ol', 'li'],
				step: 10,
				bootstrap: true,
				defaultMarkup: '<a href="#decrease" class="decrease-text">Decrease font size</a><a href="#normal" class="reset-text">Normal font size</a><a href="#increase" class="increase-text">Increase font size</a><a href="#contrast" class="contrast-text">Change contrast</a>',
				increaseSelector: '.increase-text',
				decreaseSelector: '.decrease-text',
				normalSelector: '.reset-text',
				contrastSelector: '.contrast-text'
			};

			/* Merge values */
			var option = $.extend(defaults, option);

			/* Affected tags */
			var affected_tags = new Array();
			$.each(option.tags, function(i, value){
				affected_tags.push(option.container+" "+value);
			});

			affected_tags = affected_tags.join(',');

			/* Text ratio - Percent */
			var current_ratio = 100;
			var normal_contrast = true;

			setCurrentValues();
			putAllTogether();
		} else if(typeof option == 'string' && booted){
			switch(option){
				case 'toRatio':
						doTheFontTrick(value);
					break;
				case 'normal':
						normalText();
					break;
				case 'contrast': 
						changeContrast();
					break;
				default:
						alert("Not a valid option");
					break;
			}
		} else {
			alert("Plugin not initialized");
		}


		/* Store current values (font size, font color, background) */
		function setCurrentValues(){
			$(affected_tags).each(function(){
				var current_tag = $(this);
				var font_size = current_tag.css('font-size');

				if(font_size.indexOf('%') > -1){
					/* Percentage */
					current_tag.data('originalSize', parseInt(font_size.replace('%','')));
					current_tag.data('originalUnit', '%');
				} else {
					/* Other units */
					current_tag.data('originalSize', parseInt(font_size.replace(font_size.substr(-2),'')));
					current_tag.data('originalUnit', font_size.substr(-2));
				}

				current_tag.data('originalBackground', current_tag.css('background-color'));
				current_tag.data('originalColor', current_tag.css('color'));
			});

			$(option.container).data('originalBackground', $(option.container).css('background-color'));
			$(option.container).data('originalColor', $(option.container).css('color'));

			booted = true;
		}

		/* Put all information together */
		function putAllTogether(){
			var font_utility_wrap = $(selector);
			if(font_utility_wrap.html() == ''){
				font_utility_wrap.html(option.defaultMarkup);
			}

			/* Decrease */
			font_utility_wrap.find(option.decreaseSelector).click(function(ev){
				ev.preventDefault();
				decreaseText();
			});

			/* Reset */
			font_utility_wrap.find(option.normalSelector).click(function(ev){
				ev.preventDefault();
				normalText();
			});

			/* Increase */
			font_utility_wrap.find(option.increaseSelector).click(function(ev){
				ev.preventDefault();
				increaseText();
			});

			/* Contrast */
			font_utility_wrap.find(option.contrastSelector).click(function(ev){
				ev.preventDefault();
				changeContrast();
			});
		}

		/* Helper to decrease font-size */
		function decreaseText(){
			if((current_ratio - option.step) > 10){
				current_ratio = current_ratio - option.step;
			}

			doTheFontTrick();
		}

		/* Helper to reset font-size */
		function normalText(){
			current_ratio = 100;
			doTheFontTrick();
		}

		/* Helper to increase font-size */
		function increaseText(){
			current_ratio = current_ratio + option.step;
			doTheFontTrick();
		}

		/* Apply current ratio */
		function doTheFontTrick(ratio){
			if(typeof ratio != 'undefined' && parseInt(ratio) > 10){
				current_ratio = ratio;
			}

			$(affected_tags).each(function(){
				var current_tag = $(this);
				current_tag.css('font-size', (current_tag.data('originalSize')*(current_ratio/100))+current_tag.data('originalUnit'));
			});
		}

		/* Change text contrast */
		function changeContrast(){
			$(affected_tags).each(function(){
				var current_tag = $(this);
				current_tag.css('background-color', (!normal_contrast) ? current_tag.data('originalBackground') : '#000');
				current_tag.css('color', (!normal_contrast) ? current_tag.data('originalColor') : '#fff');
			});

			$(option.container).css('background-color', (!normal_contrast) ? $(option.container).data('originalBackground') : '#000');
			$(option.container).css('color', (!normal_contrast) ? $(option.container).data('originalColor') : '#fff');

			normal_contrast = !normal_contrast;
		}
	}
}(jQuery));