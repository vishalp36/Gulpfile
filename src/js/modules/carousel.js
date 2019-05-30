class Carousel {

	constructor() {
		this.init();
	}

	init() {
		$( '.fade_slider' ).slick({
			dots: true,
			arrows: false,
			autoplay: true,
			infinite: true,
			speed: 500,
			fade: true,
			cssEase: 'linear'
		});
		// $( '.mega_menu > .sub_menu' ).slick({
		// 	dots: false,
		// 	arrows: true,
		// 	autoplay: false,
		// 	infinite: false,
		// 	speed: 500,
		// 	slidesToShow: 8,
		// 	slidesToScroll: 1,
		// 	responsive: [
		// 	{
		// 		breakpoint: 1200,
		// 		settings: {
		// 			slidesToShow: 6,
		// 		}
		// 	},
		// 	{
		// 		breakpoint: 1024,
		// 		settings: {
		// 			slidesToShow: 6,
		// 			slidesToScroll: 2
		// 		}
		// 	},
		// 	{
		// 		breakpoint: 480,
		// 		settings: {
		// 			slidesToShow: 1,
		// 			slidesToScroll: 1
		// 		}
		// 	}
		// 	]
		// });
		$('.product_opt_slider').slick({
			dots: false,
			infinite: false,
			speed: 300,
			slidesToShow: 4,
			slidesToScroll: 1,
			autoplay: true,
			infinite: true,
			responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
					infinite: true,
					dots: true
				}
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 2,
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
	}
}

export default Carousel;
