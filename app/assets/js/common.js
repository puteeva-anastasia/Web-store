$(function () {

	let checkoutCard1 = document.querySelector('#checkout-card-1'),
		checkoutCross1 = document.querySelector('#checkout-cross-1'),
		checkoutCard2 = document.querySelector('#checkout-card-2'),
		checkoutCross2 = document.querySelector('#checkout-cross-2'),
		checkoutButtonClear = document.querySelector('#checkout-button-clear');

	$(".js-range-slider").ionRangeSlider({
		type: "double",
		min: 0,
		max: 2840,
		from: 0,
		to: 2840,
		prefix: "$"
	});

	$('.product-carousel').owlCarousel({
		dots: false,
		loop: true,
		nav: true,
		smartSpeed: 700,
		navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
		responsiveClass: true,
		responsive: {
			0: {
				items: 1
			}
		}
	});

	$('.product-choose-quantity #bt_minus').click(function () {
		let $input = $(this).parent().find('.product-choose-quantity-input');
		let count = parseInt($input.val()) - 1;
		count = count < 1 ? 1 : count;
		$input.val(count);
	});
	$('.product-choose-quantity #bt_plus').click(function () {
		let $input = $(this).parent().find('.product-choose-quantity-input');
		let count = parseInt($input.val()) + 1;
		count = count > parseInt($input.data('max-count')) ? parseInt($input.data('max-count')) : count;
		$input.val(parseInt(count));
	});
	$('.product-choose-quantity-input').bind("change keyup input click", function () {
		if (this.value.match(/[^0-9]/g)) {
			this.value = this.value.replace(/[^0-9]/g, '');
		}
		if (this.value == "") {
			this.value = 1;
		}
		if (this.value > parseInt($(this).data('max-count'))) {
			this.value = parseInt($(this).data('max-count'));
		}
	});

	checkoutCross1.onclick = function () {
		checkoutCard1.style.display = 'none';
	};

	checkoutCross2.onclick = function () {
		checkoutCard2.style.display = 'none';
	};

	checkoutButtonClear.onclick = function () {
		checkoutCard1.style.display = 'none';
		checkoutCard2.style.display = 'none';
	};


});