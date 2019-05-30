// function addToCart(product) {
//     if (localStorage && localStorage.getItem('cart')) {
//         var cart = JSON.parse(localStorage.getItem('cart'));
//         // console.log($.inArray(product, cart.products));
//         if($.inArray(product, cart.products) == -1) {
//             cart.products.push(product);
//             localStorage.setItem('cart', JSON.stringify(cart));
//         }
//     }else{
//         var cart = {};
//         cart.products = [];
//         cart.products.push(product);
//         localStorage.setItem('cart', JSON.stringify(cart));
//     }
// }
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
	var close_lb = document.querySelector('.js_lightBox.active .close_lb');

	close_lb.addEventListener("click", function () {


		lb_back.classList.remove('active');
		lb_back.style.display = 'none';

		lb_active.classList.remove('active');
		lb_active.style.display = 'none';
	})
	// $('.js_lightBox').each(function(index, el) {
	//  var self = $(this);
	//  var data = self.attr('data-lb');
	//  $('.lb_backdrop').addClass('active').show();
	//  $('.js_lightBox[data-lb='+obj+']').addClass('active').show();
	// });
}
//Favorite Section
function addToFavoriteKey(){
	var idGen = new Generator();
	 if (localStorage.getItem('dmFavoriteKey') == '' || localStorage.getItem('dmFavoriteKey') == null ) {
		localStorage.setItem('dmFavoriteKey', idGen.getId());
	 }
}

function Generator() {};
Generator.prototype.rand =  Math.floor(Math.random() * 26) + Date.now();
Generator.prototype.getId = function() {
	return this.rand++;};

// ADD TO FAVORITES
$('a.addtofavorite').on('click', function(e) {
	addToFavoriteKey();
	var favoriteKey = localStorage.getItem('dmFavoriteKey');
	var product = $(this).attr('data-prdid');
	var destination = $(this).attr('data-dest');
	$.ajax({
		url: main_url_js+'/wp-admin/admin-ajax.php',
		type: 'POST',
		data: {productId: product,favoriteKey:favoriteKey,action:'addtofavorite'},
	})
	.done(function(data) {
			// console.log(data.addedpostId);
		if(data.status == 'success'){
			if(destination =='detailpage'){
				$('p.prod_add_to_fav_btn').html('<span style="color: #000;">Has been added to your favorites.</span>');
				$('.product_img .fav_sample_pop').show();
				$('.product_img .fav_sample_msg').text('Has been added to your favorites.');
			}else{
				$('a[data-prdid='+data.addedpostId+']').remove();
				$('<span style="color: #000;">Has been added to your favorites.</span>').insertAfter( '.prdtitle[data-post='+data.addedpostId+']' );
			}
		}else{

		}
		// console.log("success");
	})
	.fail(function() {
		// console.log("error");
	});
});

//Save favorite and Sample Key Key in session
jQuery(document).ready(function($) {
	var favoriteKey = localStorage.getItem('dmFavoriteKey');
	$.ajax({
		url: main_url_js+'/wp-admin/admin-ajax.php',
		type: 'POST',
		data: {favoriteKey:favoriteKey,action:'getFavoriteKey'},
	})
	.done(function() {
		console.log("success");
	})
	.fail(function() {
		// console.log("error");
	});

	//For Sapme Key
	var sampleKeySave = localStorage.getItem('dmSampleKey');
	$.ajax({
		url: main_url_js+'/wp-admin/admin-ajax.php',
		type: 'POST',
		data: {sampleKeySave:sampleKeySave,action:'getSampleKey'},
	})
	.done(function() {
		// console.log("success");
	})
	.fail(function() {
		// console.log("error");
	});
});

//Remove from Favorites List
$('.rmfromFav').click( function(){
	if (confirm('Are you sure to Remove From Favorites?')) {
		removeFromFav(this);
	}else{
		$(this).prop("checked", false);
	}
});

function removeFromFav(obj) {
  var rmFavpostid = $(obj).attr('data-rmpost-id');
  var favoriteKey = localStorage.getItem('dmFavoriteKey');
  $.ajax({
	  url: main_url_js+'/wp-admin/admin-ajax.php',
	  type: 'POST',
	  data: {rmFavpostid:rmFavpostid, rmFavoriteKey:favoriteKey, action:'removeFromFav'},
  })
  .done(function(data) {
	// console.log(data);
	if(data.status=='success'){
		$('li[data-favprdId='+data.removedPost+']').fadeOut();
		if(data.favoritePostCount == 0){
			$('ul.favorite_list').html('<li><div class="fav_prod_dtl"><h3>No Favorites Products Found.</h3></div></li>');
		}
	}
	  // console.log("success");
  })
  .fail(function() {
	  // console.log("error");
  });
}

//Send Favorite List Email
jQuery("#sendFavoriteEmail").validate({
	rules: {
	  emailFavList: {
		 required: true,
		 email: true,
	  }
	},
	// Specify validation error messages
	messages: {
	  emailFavList: {
		required: "Email can’t be blank.",
		email: "Your email address must be in the format of name@domain.com",
	  }
	},
	submitHandler: function(form) {
		$('.favErrorMsg').text('');
		var favoriteKey = localStorage.getItem('dmFavoriteKey');
		var data = $(form).serializeArray();
		data.push({name: 'favoriteKey', value:favoriteKey});
		$.ajax({
			url: main_url_js+'/wp-admin/admin-ajax.php',
			type: 'POST',
			data: data,
		})
		.done(function(data) {
			if(data.status == 'success'){
				var title = 'favorites';
				var icon = 'like';
				var text = data.message;
				lb_open(title,icon,text);
				$('#sendFavoriteEmail').trigger("reset");
			}else{
				$('.favErrorMsg').text(data.message);
			}
			// console.log("success");
		})
		.fail(function() {
			 $('.favErrorMsg').text('Something went wrong, Please try after some time!');
			// console.log("error");
		});
	}
  });

//For Sample Key
function addToSampleKey(){
	var idGen = new Generator();
	 if (localStorage.getItem('dmSampleKey') == '' || localStorage.getItem('dmSampleKey') == null ) {
		localStorage.setItem('dmSampleKey', idGen.getId());
	 }
}

// ADD TO Sample
$('.add_to_sample_btn a.addtosample').on('click', function(e) {
	addToSampleKey();
	var SampleKey = localStorage.getItem('dmSampleKey');
	var sampleProduct = $(this).attr('dataProductId');
	$.ajax({
		url: main_url_js+'/wp-admin/admin-ajax.php',
		type: 'POST',
		data: {sampleProductId: sampleProduct,SampleKey:SampleKey,action:'addToSample'},
	})
	.done(function(data) {
		if(data.status == 'success'){
			$('div.add_to_sample_btn a').remove();
			$('div.add_to_sample_btn').html('<p><span style="color: #000;">Has been added to your samples.</span></p>');
			$('.product_specs .fav_sample_pop').show();
			$('.product_specs .fav_sample_msg').text('Has been added to your samples.');
		}else{

		}
		// console.log("success");
	})
	.fail(function() {
		// console.log("error");
	});
});

//Remove from Samples List
$('.rmsamplesprod').click( function(){
	if (confirm('Are you sure to Remove From Samples?')) {
		removeFromSample(this);
	}else{
		$(this).prop("checked", false);
	}
});

function removeFromSample(obj) {
  var rmSamplePostId = $(obj).attr('data-rm-sampleprodId');
  var sampleKey = localStorage.getItem('dmSampleKey');
  $.ajax({
	  url: main_url_js+'/wp-admin/admin-ajax.php',
	  type: 'POST',
	  data: {rmSampleKey:sampleKey, rmSamplePostId:rmSamplePostId, action:'removeFromSample'},
  })
  .done(function(data) {
	// console.log(data);
	if(data.status=='success'){
		$('li[data-sapleprodId='+data.removedPost+']').fadeOut();
		if(data.samplePostCount == 0){
			$('ul.sample_list').html('<li><div class="req_prod_list_dtl"><h3>No Samples Products Found.</h3></div></li>');
		}
	}
	  // console.log("success");
  })
  .fail(function() {
	  // console.log("error");
  });
}

//Send Sample List Email
jQuery("#sendSamplesEmail").validate({
	rules: {
	  firstName: {
			required: true,
	   },
	   lastName: {
			required: true,
	   },
	   address1: {
		   required: true,
	   },
	   state: {
		   required: true,
	   },
	   zipcode: {
		   required: true,
	   },
	   emailSapmle: {
		   required: true,
		   email: true,
	   }
	},
	// Specify validation error messages
	messages: {
		firstName: {
			required: "First Name can’t be blank.",
		},
		lastName: {
			required: "Last Name can’t be blank.",
		},
		address1: {
			required: "Address can’t be blank.",
		},
		state: {
			required: "State can’t be blank.",
		},
		zipcode: {
			required: "Zip Code can’t be blank.",
		},
		emailSapmle: {
			required: "Email can’t be blank.",
			email: "Your email address must be in the format of name@domain.com",
		}
	},
	submitHandler: function(form) {
		var samplesKey = localStorage.getItem('dmSampleKey');
		var data = $(form).serializeArray();
		data.push({name: 'samplesKey', value:samplesKey});
		$.ajax({
			url: main_url_js+'/wp-admin/admin-ajax.php',
			type: 'POST',
			data: data,
		})
		.done(function(data) {
			if(data.status == 'success'){
				var title = 'samples';
				var icon = 'files';
				var text = data.message;
				lb_open(title,icon,text);
				$('#sendSamplesEmail').trigger("reset");
			}else{
				$('.sampleErrorMsg').text(data.message);
			}
			// console.log("success");
		})
		.fail(function() {
			 $('.sampleErrorMsg').text('Something went wrong, Please try after some time!');
			// console.log("error");
		});

	}
  });


  window.fbAsyncInit = function() {
  FB.init({
	//appId            : '2040558702856357',
	appId            : '291983461686837',
	autoLogAppEvents : true,
	xfbml            : true,
	version          : 'v2.10'
  });
  FB.AppEvents.logPageView();
  };


  (function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
$('a.fbshare').click(function(event) {
	var FBimg = jQuery(this).attr('FBshareImage');
	var FBLink = jQuery(this).attr('FBshareLink');
	var FBTitle = jQuery(this).attr('FBshareTitle');
	// console.log(FBimg);
	// console.log(FBLink);
	// console.log(FBTitle);

  FB.ui({
	method: 'share_open_graph',
	action_type: 'og.shares',
	action_properties: JSON.stringify({
	  object: {
		'og:url': FBLink,
		'og:title': 'Blue Martini Lounge Fort Lauderdale - '+FBTitle,
		'og:description': 'Experience upscale night life at Blue Martini, the premier happy hour bars with live music. We offer a VIP lounge and tapas menu at Fort Lauderdale',
		'og:image': FBimg
	  }
	})
  },
  function (response) {
  // Action after response
  });
});



// ****************************************************************************
// *                               Event scripts                              *
// ****************************************************************************
$('.event_item').each(function(index, el) {
	var self = $(this);
	var js_switch = self.find('.js_switch');
	var input = self.find('.js_switch .switch-input');
	js_switch.click(function(event) {
		if (input.prop('checked') == true) {
			$('.lb_backdrop').addClass('active').show();
			self.find('.rsvp_form_lb').addClass('active').show();
			self.find('.rsvp_form_lb .close_lb').click(function(event) {
				$('.lb_backdrop').removeClass('active').hide();
				self.find('.rsvp_form_lb').removeClass('active').hide();
				input.prop('checked', false);
			});
		}
	});
	// if (js_switch.length == 1) {
	// }
});


$(document).on('mouseup touchend', function(e) {
	var container = $('.fav_sample_pop');
	if (!container.is(e.target) && container.has(e.target).length === 0) {
		container.hide();
	}
});
