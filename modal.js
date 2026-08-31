export function createModal(product) {
    const overlay = document.createElement('div')
    overlay.classList.add('modal-overlay')

    const modal = document.createElement('div')
    modal.classList.add('modal')

    const closeBtn = document.createElement('span')
    closeBtn.classList.add('modal-close')
    closeBtn.textContent = '×'

    const img = document.createElement('img')
    img.classList.add('modal-img')
    img.src = product.image

    const info = document.createElement('div')
    info.classList.add('modal-info')

    const category = document.createElement('span')
    category.classList.add('modal-category')
    category.textContent = product.category

    const title = document.createElement('h2')
    title.classList.add('modal-title')
    title.textContent = product.title

    const rate = document.createElement('p')
    rate.classList.add('modal-rate')
    rate.innerHTML = `<span style="color:var(--color-star)">★</span> ${product.rating.rate} <span class="modal-rate-count">(${product.rating.count} отзывов)</span>`

    const description = document.createElement('p')
    description.classList.add('modal-description')
    description.textContent = product.description

    const price = document.createElement('p')
    price.classList.add('modal-price')
    price.textContent = `₽${Math.round(product.price).toLocaleString('ru-RU')}`

    const addBasketBtn = document.createElement('div')
    addBasketBtn.classList.add('add-basket-btn', 'modal-basket-btn')
    addBasketBtn.textContent = 'В корзину'

    info.append(category, title, rate, description, price, addBasketBtn)
    modal.append(closeBtn, img, info)
    overlay.append(modal)
    document.body.append(overlay)
    document.body.classList.add('modal-open')

    function closeModal() {
        overlay.remove()
        document.body.classList.remove('modal-open')
        document.removeEventListener('keydown', onKeyDown)
    }

    function onKeyDown(e) {
        if (e.key === 'Escape') closeModal()
    }

    closeBtn.addEventListener('click', closeModal)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal()
    })
    document.addEventListener('keydown', onKeyDown)
}