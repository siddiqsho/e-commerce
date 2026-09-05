import { setQuantity, initCard } from "./basket.js"

export function createModal(product) {
    const DOM = {
        overlay: document.createElement('div'),
        modal: document.createElement('div'),
        closeBtn: document.createElement('span'),
        img: document.createElement('img'),
        info: document.createElement('div'),
        category: document.createElement('span'),
        title: document.createElement('h2'),
        rate: document.createElement('p'),
        description: document.createElement('p'),
        price: document.createElement('p'),
        addBasketBtn: document.createElement('div'),
        modalFooter: document.createElement('div')
    }

    let count = 0

    DOM.overlay.classList.add('modal-overlay')
    DOM.modal.classList.add('modal')

    DOM.closeBtn.classList.add('modal-close')
    DOM.closeBtn.textContent = '×'

    DOM.img.classList.add('modal-img')
    DOM.img.src = product.image

    DOM.info.classList.add('modal-info')

    DOM.category.classList.add('modal-category')
    DOM.category.textContent = product.category

    DOM.title.classList.add('modal-title')
    DOM.title.textContent = product.title

    DOM.rate.classList.add('modal-rate')
    DOM.rate.innerHTML = `<span style="color:var(--color-star)">★</span> ${product.rating.rate} <span class="modal-rate-count">(${product.rating.count} отзывов)</span>`

    DOM.description.classList.add('modal-description')
    DOM.description.textContent = product.description

    DOM.price.classList.add('modal-price')
    DOM.price.textContent = `₽${Math.round(product.price).toLocaleString('ru-RU')}`

    DOM.addBasketBtn.classList.add('add-basket-btn', 'modal-basket-btn')
    DOM.addBasketBtn.textContent = 'В корзину'

    DOM.modalFooter.classList.add('modal-footer')
    DOM.modalFooter.append(DOM.price, DOM.addBasketBtn)

    DOM.info.append(DOM.category, DOM.title, DOM.rate, DOM.description, DOM.modalFooter)
    DOM.modal.append(DOM.closeBtn, DOM.img, DOM.info)
    DOM.overlay.append(DOM.modal)
    document.body.append(DOM.overlay)
    document.body.classList.add('modal-open')

    count = initCard(product, syncFromCart)

    renderButtonState()

    DOM.closeBtn.addEventListener('click', closeModal)
    DOM.overlay.addEventListener('click', (e) => {
        if (e.target === DOM.overlay) closeModal()
    })
    document.addEventListener('keydown', onKeyDown)

    DOM.addBasketBtn.addEventListener('click', () => {
        if (count === 0) {
            count = 1
            renderButtonState()
            setQuantity(product, count, syncFromCart) 
        }
    })

    function closeModal() {
        DOM.overlay.remove()
        document.body.classList.remove('modal-open')
        document.removeEventListener('keydown', onKeyDown)
    }

    function onKeyDown(e) {
        if (e.key === 'Escape') closeModal()
    }

    
    function syncFromCart(newCount) {
        if (newCount === count) return
        count = newCount
        renderButtonState()
    }

  
    function renderButtonState() {
        if (count === 0) {
            DOM.addBasketBtn.classList.remove('counter-mode')
            DOM.addBasketBtn.classList.add('add-basket-btn', 'modal-basket-btn')
            DOM.addBasketBtn.style.display = ''
            DOM.addBasketBtn.style.alignItems = ''
            DOM.addBasketBtn.style.justifyContent = ''
            DOM.addBasketBtn.style.padding = ''
            DOM.addBasketBtn.textContent = 'В корзину'
        } else {
            DOM.addBasketBtn.classList.add('counter-mode')
            DOM.addBasketBtn.innerHTML = `
                <button class="counter-btn minus-btn">-</button>
                <span class="counter-count">${count}</span>
                <button class="counter-btn plus-btn">+</button>
            `
            DOM.addBasketBtn.style.display = 'flex'
            DOM.addBasketBtn.style.alignItems = 'center'
            DOM.addBasketBtn.style.justifyContent = 'space-between'
            DOM.addBasketBtn.style.padding = '0 6px'

            const minusBtn = DOM.addBasketBtn.querySelector('.minus-btn')
            const plusBtn = DOM.addBasketBtn.querySelector('.plus-btn')

            minusBtn.addEventListener('click', (e) => {
                e.stopPropagation()
                if (count > 0) {
                    count--
                    renderButtonState()
                    setQuantity(product, count, syncFromCart) 
                }
            })

            plusBtn.addEventListener('click', (e) => {
                e.stopPropagation()
                count++
                renderButtonState()
                setQuantity(product, count, syncFromCart) 
            })
        }
    }
}