class Lightbox {

	constructor() {
		this.init();
	}

	init() {
		function lb_open(title,icon,text) {
			var js_lb = document.querySelector('.js_lightBox');
			var lb_title = js_lb.querySelector('.confirm_lb_title span');
			var lb_ico = js_lb.querySelector('.confirm_lb_ico');
			var lb_msg = js_lb.querySelector('.confirm_lb_msg');
			var lb_back = document.querySelector('.lb_backdrop');

			lb_back.classList.add('active');
			lb_back.style.display = 'block';

			js_lb.classList.add('active');
			js_lb.style.display = 'block';

			lb_title.textContent = title;
			lb_ico.removeAttribute = 'class';
			lb_ico.classList.add('confirm_lb_ico', 'icon-'+icon);
			lb_msg.textContent = text;

			var lb_active = document.querySelector('.js_lightBox.active');
			var	close_lb = document.querySelector('.js_lightBox.active .close_lb');

			close_lb.addEventListener("click", function () {


				lb_back.classList.remove('active');
				lb_back.style.display = 'none';

				lb_active.classList.remove('active');
				lb_active.style.display = 'none';
			})
			// $('.js_lightBox').each(function(index, el) {
			// 	var self = $(this);
			// 	var data = self.attr('data-lb');
			// 	$('.lb_backdrop').addClass('active').show();
			// 	$('.js_lightBox[data-lb='+obj+']').addClass('active').show();
			// });
		}
		$('#page').click(function(event) {
			//icon name list
			// ico-like = favorite
			// ico-contact = contact
			// ico-download = download
			// ico-files = common
			// ico-plan = inspiration
			var title = 'favorite';
			var icon = 'like';
			var text = 'Thank you for your interest in this event a confirmation email has been sent to you with the event details. See You Soon! ';
			lb_open(title,icon,text);
			// lb_open('rsvp_thanks');
			// lb_open('newsletter');
			// lb_open('inspiration');
			// lb_open('contact');
			// lb_open('download');
		});
		// function lb_open(obj) {
		// 	var js_lb = Array.prototype.slice.call(document.querySelectorAll('.js_lightBox'), 0);
		// 	var close_lb;
		// 	var lb_back = document.querySelector('.lb_backdrop');

		// 	var lb_load = document.querySelector('.js_lightBox[data-lb='+obj+']');

		// 	lb_back.classList.add('active');
		// 	lb_back.style.display = 'block';

		// 	lb_load.classList.add('active');
		// 	lb_load.style.display = 'block';

		// 	// js_lb.forEach(function(element) {

		// 	// })

		// 	var lb_active = document.querySelector('.js_lightBox.active');
		// 	var	close_lb = document.querySelector('.js_lightBox.active .close_lb');

		// 	close_lb.addEventListener("click", function () {


		// 		lb_back.classList.remove('active');
		// 		lb_back.style.display = 'none';

		// 		lb_active.classList.remove('active');
		// 		lb_active.style.display = 'none';
		// 	})
		// 	// $('.js_lightBox').each(function(index, el) {
		// 	// 	var self = $(this);
		// 	// 	var data = self.attr('data-lb');
		// 	// 	$('.lb_backdrop').addClass('active').show();
		// 	// 	$('.js_lightBox[data-lb='+obj+']').addClass('active').show();
		// 	// });
		// }


		// $('.close_lb').click(function(event) {
		// 	$('.lb_backdrop').removeClass('active').hide();
		// 	$('.js_lightBox.active').removeClass('active').hide();
		// });
	}
}

export default Lightbox;
