import { createModal } from "./modal.js"
import { setQuantity, initCard } from "./basket.js"

export function createCard(product) {
    const card = document.createElement('div')
    card.classList.add('card')

    const infoForCard = document.createElement('div')
    infoForCard.classList.add('info-for-card')
    const buttonsCard = document.createElement('div')
    buttonsCard.classList.add('buttons-card')

    const img = document.createElement('img')
    img.classList.add('card-img')
    const title = document.createElement('div')
    title.classList.add('card-title')
    const rate = document.createElement('p')
    const price = document.createElement('p')
    price.classList.add('card-price')

    const detailsBtn = document.createElement('div')
    detailsBtn.classList.add('details-btn')
    detailsBtn.textContent = 'Подробнее'

    const addBasketBtn = document.createElement('div')
    addBasketBtn.classList.add('add-basket-btn')
    addBasketBtn.textContent = 'В корзину'

    img.setAttribute('src', `${product.image}`)

    if (product.title.length > 60) {
        title.textContent = `${product.title.slice(0, 60)}...`
    } else {
        title.textContent = `${product.title}`
    }

    rate.innerHTML = `<span style="color:var(--color-star)">★</span> ${product.rating.rate}`
    price.textContent = `₽${Math.round(product.price).toLocaleString('ru-RU')}`

    detailsBtn.addEventListener('click', () => {
        createModal(product)
    })

    let count = 0;

    function updateButtonUI() {
        if (count === 0) {
            addBasketBtn.classList.remove('counter-mode');
            if (!addBasketBtn.classList.contains('add-basket-btn')) {
                addBasketBtn.classList.add('add-basket-btn');
            }
            addBasketBtn.textContent = 'В корзину';
            addBasketBtn.style.display = '';
            addBasketBtn.style.alignItems = '';
            addBasketBtn.style.justifyContent = '';
            addBasketBtn.style.padding = '';
            addBasketBtn.innerHTML = 'В корзину';
        } else {
            addBasketBtn.classList.add('counter-mode');
            addBasketBtn.innerHTML = `
                <button class="counter-btn minus-btn">-</button>
                <span class="counter-count">${count}</span>
                <button class="counter-btn plus-btn">+</button>
            `;
            addBasketBtn.style.display = 'flex';
            addBasketBtn.style.alignItems = 'center';
            addBasketBtn.style.justifyContent = 'space-between';
            addBasketBtn.style.padding = '0 6px';

            const minusBtn = addBasketBtn.querySelector('.minus-btn');
            const plusBtn = addBasketBtn.querySelector('.plus-btn');

            minusBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (count > 0) {
                    count--;
                    renderButtonState();
                }
            });

            plusBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                count++;
                renderButtonState();
            });
        }
    }
    function syncFromCart(newCount) {
        count = newCount
        updateButtonUI()
    }

    function renderButtonState() {
        updateButtonUI()
        setQuantity(product, count, syncFromCart)
    }

    addBasketBtn.addEventListener('click', () => {
        if (count === 0) {
            count = 1;
            renderButtonState();
        }
    });
    count = initCard(product, syncFromCart);
    updateButtonUI();

    buttonsCard.append(detailsBtn, addBasketBtn)
    infoForCard.append(title, rate, price)
    card.append(img, infoForCard, buttonsCard)

    return card
}