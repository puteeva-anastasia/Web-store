"use strict";

class Basket {
	constructor() {
		//Кнопка "Открытия / Закрытия корзины"
		this.buttonBasketEl = document.querySelector('#buttonBasket');

		//Корзина
		this.inBasketEl = document.querySelector('#inBasket');

		//Кнопки "В корзину"
		this.cardBtnElems = document.querySelectorAll('.featured-items-card-btn');

		//Количество товаров в корзине
		this.basketQuantityEl = document.querySelector('.main-header-basket-quantity');

		//Тело таблицы
		this.tbodyEl = this.inBasketEl.querySelector('tbody');

		//Общая сумма товаров в корзине
		this.totalSummaEl = this.inBasketEl.querySelector('#totalSumma');

		/**
		 * В корзине хранится количество каждого товара
		 * Ключ - это id товара, значение - это количество товаров в корзине, например:
		 {
			 1: 10,
			 3: 2
		 }
		 */
		this.quantityProductsInBasket = {};
	}

	/**
	 * Инициализация обработчиков событий
	 */
	initEventHandlers() {
		/* При клике на кнопку "Открытия / Закрытия корзины", в зависимости от того есть ли у элемента корзины класс close, 
		добавляем или удаляем его */
		this.buttonBasketEl.addEventListener('click', () => this.inBasketEl.classList.toggle('hidden'));

		//Проходим циклом по всем кнопкам "Add to Cart" и отслеживаем, на какую из кнопок был совершен клик
		for (let i = 0; i < this.cardBtnElems.length; i++) {
			this.cardBtnElems[i].addEventListener('click', event => this.addedProductHandler(event));
		}
	}

	/**
	 * Обработчик события клика по кнопке "Add to Cart"
	 * @param {MouseEvent} event 
	 */
	addedProductHandler(event){
		//Находим идентификатор товара, на который нажали
		let productId = event.currentTarget.getAttribute("data-productId");
		this.addProductIntoBasket(productId);
	}

	/**
	 * Этот метод срабатывает, когда добавляют новый товар в корзину
	 * @param {number} productId
	 */
	addProductIntoBasket(productId){
		this.increaseProductsCount();
		this.addProductToObject(productId);
		this.renderProductInBasket(productId);
		this.calculateAndRenderTotalBasketSum();
	}

	/**
	 * Метод увеличивает счетчик количества товаров рядом с иконкой корзины
	 */
	increaseProductsCount(){
		this.basketQuantityEl.textContent++;
	}
	
	/**
	 * Метод добавляет товар в объект quantityProductsInBasket
	 * @param {number} productId 
	 */
	addProductToObject(productId){
		if(!(productId in this.quantityProductsInBasket)){
			this.quantityProductsInBasket[productId] = 1;
		} else{
			this.quantityProductsInBasket[productId]++;
		}
	}

	/**
	 * Метод срабатывает, когда нужно отрисовать товар в корзине
	 * @param {number} productId
	 */
	renderProductInBasket(productId){
		let productExist = document.querySelector(`.product[data-productId = "${productId}"]`);
		if(productExist){
			this.increaseProductCount(productId);
			this.recalculateSumForProduct(productId);
		} else{
			this.renderNewProductInBasket(productId);
		}
	}

	/**
	 * Метод отрисовывает новый товар в корзине
	 * @param {number} productId 
	 */
	renderNewProductInBasket(productId){
		let productRow = `
		<tr class="product" data-productId="${productId}">
			<td>${products[productId].name}</td>
			<td class="productQuantity" data-productId="${productId}"><span>1</span> шт.</td>
			<td>$${products[productId].price.toFixed(2)}</td>
			<td class="productTotal" data-productId="${productId}">$${products[productId].price.toFixed(2)}</td>
		</tr>
		`;

		this.tbodyEl.insertAdjacentHTML('beforeend', productRow);
	}

	/**
	 * Метод увеличивает количество товаров в строке в корзине
	 * @param {number} productId 
	 */
	increaseProductCount(productId){
		this.inBasketEl.querySelector(`.productQuantity[data-productId = "${productId}"] span`).textContent++;
	}

	/**
	 * Метод пересчитывает стоимость товара, умноженное на количество товара в корзине.
	 * @param {number} productId 
	 */
	recalculateSumForProduct(productId){
		let productTotalEl = this.inBasketEl.querySelector(`.productTotal[data-productId = "${productId}"]`);
		let productTotal = this.quantityProductsInBasket[productId] * products[productId].price;
		
		productTotalEl.textContent = `$${productTotal.toFixed(2)}`;
	}

	/**
	 * Метод пересчитывает общую стоимость корзины и выводит это значение на страницу
	 */
	calculateAndRenderTotalBasketSum(){
		let totalBasketSum = 0;

		for (let productId in this.quantityProductsInBasket){
			totalBasketSum += this.quantityProductsInBasket[productId] * products[productId].price;
		}

		this.totalSummaEl.textContent = totalBasketSum.toFixed(2);
	}

}

//Создадим объект класса Basket
const basket = new Basket();
	
//Инициализируем обработчиков событий
basket.initEventHandlers();