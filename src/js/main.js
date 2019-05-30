/**
 *	This is the main JS file.
 *
 *	this file will require everything your app needs to run
 *	using require. eg require('./script/this-script');
 *
 */

// Example: npm install jquery
// Import libraries
// var $ = require("jquery");
// import $ from 'jquery';
// window.jQuery = $;
// window.$ = $;
// import TweenMax from "gsap";
// import 'slick-carousel';
// import "overlayscrollbars";
// import "mailgo";
require("./vendors/mailgo.min.js");
require("./vendors/slick.js");
require("./vendors/jquery.validate.min.js");
require("./vendors/additional-methods.min.js");

// Import custom modules
// import Utils from'./modules/util.js';
import App from'./modules/app.js';
import Carousel from './modules/carousel.js';
// import Lightbox from './modules/lightbox.js';
var accordion = require("./modules/accordion.js");
var form = require("./modules/forms.js");
// var util = require("./modules/util.js");

var app = new App();
var carousel = new Carousel();
// var lightbox = new Lightbox();
// document.addEventListener("DOMContentLoaded", function() {
// 	OverlayScrollbars(document.querySelectorAll('body'), { });
// });
$(document).ready(function($) {
	if ($('.insta_sec')[0]) {
		var name = "decorativematerials",
		items;
		$.get("https://images"+~~(Math.random()*33)+"-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=https://www.instagram.com/" + name + "/", function(html) {
			if (html) {
				var regex = /_sharedData = ({.*);<\/script>/m,
					json = JSON.parse(regex.exec(html)[1]),
					edges = json.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges;
					$.each(edges, function(n, edge) {
						var node = edge.node;
						$('.insta_sec .instaFeed').append(
							$('<a/>', {
								href: 'https://instagr.am/p/'+node.shortcode,
								target: '_blank'
							}).css({
								backgroundImage: 'url(' + node.thumbnail_src + ')'
							}));
						if (n == 7) {
							return false;
						}
					});
			}
		});
	}
	if ($('.custo_file')[0]) {
		var custoFile = Array.prototype.slice.call(document.querySelectorAll(".custo_file"), 0);
		// console.log(Array.prototype.slice.call(document.querySelectorAll(".custo_file"), 0));
		custoFile.forEach(function(element) {
			var fileInput = element.querySelector( ".input_file" );
			var button = element.querySelector( ".input_file_trigger" );
			var the_return = element.querySelector("strong");

			button.addEventListener( "keydown", function( event ) {
				if ( event.keyCode == 13 || event.keyCode == 32 ) {
					fileInput.focus();
				}
			});
			button.addEventListener( "click", function( event ) {
				fileInput.focus();
				return false;
			});
			fileInput.addEventListener( "change", function( event ) {
				the_return.innerHTML = this.value;
			});
		});
	}
	if ($('.team_members_list')[0]) {
		$('.team_members_list li').each(function(index, el) {
			var self = $(this);
			var ev = self.find('.team_basics');
			var pop = self.find('.team_info');
			ev.click(function(event) {
				$('.lb_backdrop').addClass('active').show();
				pop.addClass('active').show();
				/* Act on the event */
			});
		});
		$('.team_info .close_lb').click(function(event) {
			$('.lb_backdrop').removeClass('active').hide();
			$(this).parent().removeClass('active').hide();
		});
	}
});
$(window).bind('load', function(event) {
	if ($('#mailgo')[0]) {
		$('.mailgo-open').attr('target', '_blank');
	}
	$('.mega_menu').each(function(index, el) {
		var self = $(this);
		self.mouseover(function(event) {
			var item = $(this).find(' > .sub_menu > li').length;
			console.log(item);
			self.find(' > .sub_menu').addClass('active').slick({
				dots: false,
				arrows: true,
				autoplay: false,
				infinite: false,
				speed: 500,
				slidesToShow: item,
				slidesToScroll: 1,
				responsive: [
				{
					breakpoint: 1200,
					settings: {
						slidesToShow: item-2,
					}
				},
				{
					breakpoint: 1024,
					settings: {
						slidesToShow: item-2,
						slidesToScroll: 2
					}
				},
				{
					breakpoint: 480,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1
					}
				}
				]
			});
		});
		self.mouseleave(function(event) {
			self.find(' > .sub_menu').removeClass('active');
		});
	});
	$('.search_form').click(function(event) {
		// $(this).toggleClass('active');
		if (!$(this).hasClass('active')) {
			$(this).addClass('active');
			$('.main_nav').addClass('form_active');
		}
	});
	$(document).on('mouseup touchend', function(e) {
		if ($('.search_form').hasClass('active')) {
			var form = $('.search_form');
			if (!form.is(e.target) && form.has(e.target).length === 0) {
				form.removeClass('active');
				$('.main_nav').removeClass('form_active');
			}
		}
	})
});


import {
  watchViewport,
  unwatchViewport,
  getViewportState
} from './vendors/tornis.min.js';

// define a watched function, to be run on each update
let maxScroll = 0;
const updateValues = ({ size, scroll, mouse, orientation }) => {
	if (size.changed) {
		// console.log(`${size.x}, ${size.y}`);
		console.log($('.home_sec_06 .wrap').width());

	}
	if (scroll.changed) {
		// console.log(scroll.bottom);
		// console.log(`${scroll.left}, ${scroll.top}`);
		// console.log(`${scroll.velocity.x}, ${scroll.velocity.y}`);

		let scrollOffset = Math.round((scroll.bottom / (size.docY)) * 100);
		if (scrollOffset > maxScroll) {
			maxScroll = scrollOffset > 100 ? 100 : scrollOffset;
			// console.log(`${maxScroll}%`);
		}

		if (maxScroll >= 95) {
			// console.log('Thanks for reading!');
		}
	}

	if (mouse.changed) {
		// console.log(mouse.x, mouse.y);
	}
};

// bind the watch function
// By default this will run the function as it is added to the watch list
watchViewport(updateValues);

// // to bind the watch function without calling it
// watchViewport(updateValues, false);

// // when you want to stop updating
// unwatchViewport(updateValues);

// // to get a snapshot of the current viewport state
// const state = getViewportState();