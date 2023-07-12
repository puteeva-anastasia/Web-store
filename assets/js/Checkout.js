"use strict";

class Checkout {
	constructor() {
		//Находим крестики
		this.cardCrossElems = document.querySelectorAll('.checkout-card-cross');

		//Находим кнопку "Очистить все"
		this.buttonClearEl = document.querySelector('.checkout-button-clear');

		//Находим карточки
		this.cardElems = document.querySelectorAll('.checkout-card');
	}

	/**
	 * Инициализация обработчиков событий
	 */
	initEventHandlers() {
		/* При клике на кнопку "Очистить все", удаляем все карточки товаров */
		this.buttonClearEl.addEventListener('click', () => this.buttonClearClickHandler());

		//Проходим циклом по всем крестикам и отслеживаем, на какой из них был совершен клик
		for (let i = 0; i < this.cardCrossElems.length; i++) {
			this.cardCrossElems[i].addEventListener('click', event => this.crossClickHandler(event));
		}
	}

	/**
	 * Метод, который удаляет все карточки товаров со страницы
	 */
	buttonClearClickHandler() {
		this.cardElems.forEach(function (cardEl) {
			cardEl.style.display = 'none';
		});
	}

	/**
	 * Метод скрывает карточку товара, на крестик который нажали
	 * @param {MouseEvent} event 
	 */
	crossClickHandler(event) {
		event.currentTarget.parentElement.style.display = 'none';
	}
}

//Создадим объект класса Checkout
const checkout = new Checkout();

//Инициализируем обработчики событий
checkout.initEventHandlers();