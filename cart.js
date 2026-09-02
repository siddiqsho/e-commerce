const cartItems = new Map()

let isCartOpen = false

const STORAGE_KEY = 'cart'

function saveToStorage() {
    const arr = Array.from(cartItems.values()).map(entry => ({
        product: entry.product,
        quantity: entry.quantity
    }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
}

function loadFromStorage() {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return

    try {
        const arr = JSON.parse(raw)
        arr.forEach(item => {
            cartItems.set(item.product.id, {
                product: item.product,
                quantity: item.quantity,
                syncCard: null
            })
        })
    } catch (err) {
        console.log('Не удалось прочитать корзину из localStorage', err)
    }
}

function getTotalCount() {
    let total = 0
    cartItems.forEach(item => total += item.quantity)
    return total
}

function getTotalPrice() {
    let total = 0
    cartItems.forEach(item => total += item.product.price * item.quantity)
    return total
}

function formatPrice(value) {
    return `₽${Math.round(value).toLocaleString('ru-RU')}`
}

function updateBadge() {
    const badge = document.querySelector('#cart-badge')
    if (!badge) return

    const total = getTotalCount()

    if (total > 0) {
        badge.textContent = total
        badge.style.display = 'flex'
    } else {
        badge.style.display = 'none'
    }
}

export function setQuantity(product, qty, syncCard) {
    if (qty > 0) {
        cartItems.set(product.id, { product, quantity: qty, syncCard })
    } else {
        cartItems.delete(product.id)
    }
    saveToStorage()
    updateBadge()

    if (isCartOpen) {
        renderCartList()
    }
}

export function getQuantity(productId) {
    const entry = cartItems.get(productId)
    return entry ? entry.quantity : 0
}
export function initCard(product, syncCard) {
    const entry = cartItems.get(product.id)
    if (entry) {
        entry.syncCard = syncCard
        return entry.quantity
    }
    return 0
}

function changeQuantity(productId, delta) {
    const entry = cartItems.get(productId)
    if (!entry) return

    const newQty = entry.quantity + delta

    if (newQty <= 0) {
        cartItems.delete(productId)
        if (entry.syncCard) entry.syncCard(0)
    } else {
        entry.quantity = newQty
        if (entry.syncCard) entry.syncCard(newQty)
    }

    saveToStorage()
    updateBadge()
    renderCartList()
}

function removeItem(productId) {
    const entry = cartItems.get(productId)
    if (entry && entry.syncCard) entry.syncCard(0)
    cartItems.delete(productId)
    saveToStorage()
    updateBadge()
    renderCartList()
}

function buildCartItemRow(entry) {
    const row = document.createElement('div')
    row.classList.add('cart-item')

    const img = document.createElement('img')
    img.classList.add('cart-item-img')
    img.src = entry.product.image

    const info = document.createElement('div')
    info.classList.add('cart-item-info')

    const title = document.createElement('p')
    title.classList.add('cart-item-title')
    title.textContent = entry.product.title.length > 50
        ? `${entry.product.title.slice(0, 50)}...`
        : entry.product.title

    const price = document.createElement('p')
    price.classList.add('cart-item-price')
    price.textContent = formatPrice(entry.product.price * entry.quantity)

    info.append(title, price)

    const controls = document.createElement('div')
    controls.classList.add('cart-item-controls')

    const minusBtn = document.createElement('button')
    minusBtn.classList.add('counter-btn')
    minusBtn.textContent = '-'
    minusBtn.addEventListener('click', () => changeQuantity(entry.product.id, -1))

    const qtySpan = document.createElement('span')
    qtySpan.classList.add('counter-count')
    qtySpan.textContent = entry.quantity

    const plusBtn = document.createElement('button')
    plusBtn.classList.add('counter-btn')
    plusBtn.textContent = '+'
    plusBtn.addEventListener('click', () => changeQuantity(entry.product.id, 1))

    controls.append(minusBtn, qtySpan, plusBtn)

    const removeBtn = document.createElement('span')
    removeBtn.classList.add('cart-item-remove')
    removeBtn.textContent = '×'
    removeBtn.addEventListener('click', () => removeItem(entry.product.id))

    row.append(img, info, controls, removeBtn)
    return row
}

function renderCartList() {
    const list = document.querySelector('#cart-list')
    const footer = document.querySelector('#cart-footer')
    if (!list || !footer) return

    list.innerHTML = ''

    if (cartItems.size === 0) {
        list.innerHTML = '<p class="cart-empty">Корзина пуста</p>'
        footer.style.display = 'none'
        return
    }

    cartItems.forEach(entry => {
        list.appendChild(buildCartItemRow(entry))
    })

    footer.style.display = 'flex'
    const totalEl = document.querySelector('#cart-total')
    if (totalEl) totalEl.textContent = formatPrice(getTotalPrice())
}

function closeCart() {
    const overlay = document.querySelector('.cart-overlay')
    if (overlay) overlay.remove()
    document.body.classList.remove('modal-open')
    document.removeEventListener('keydown', onKeyDown)
    isCartOpen = false
}

function onKeyDown(e) {
    if (e.key === 'Escape') closeCart()
}

function openCart() {
    if (isCartOpen) return
    isCartOpen = true

    const overlay = document.createElement('div')
    overlay.classList.add('cart-overlay')

    const cartModal = document.createElement('div')
    cartModal.classList.add('cart-modal')

    const header = document.createElement('div')
    header.classList.add('cart-modal-header')

    const heading = document.createElement('h2')
    heading.textContent = 'Корзина'

    const closeBtn = document.createElement('span')
    closeBtn.classList.add('modal-close')
    closeBtn.textContent = '×'
    closeBtn.addEventListener('click', closeCart)

    header.append(heading, closeBtn)

    const list = document.createElement('div')
    list.classList.add('cart-list')
    list.id = 'cart-list'

    const footer = document.createElement('div')
    footer.classList.add('cart-footer')
    footer.id = 'cart-footer'

    const totalLabel = document.createElement('span')
    totalLabel.textContent = 'Итого:'

    const totalValue = document.createElement('span')
    totalValue.id = 'cart-total'
    totalValue.classList.add('cart-total-value')

    footer.append(totalLabel, totalValue)

    cartModal.append(header, list, footer)
    overlay.append(cartModal)
    document.body.append(overlay)
    document.body.classList.add('modal-open')

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeCart()
    })
    document.addEventListener('keydown', onKeyDown)

    renderCartList()
}

loadFromStorage()
updateBadge()

document.addEventListener('DOMContentLoaded', () => {
    updateBadge()
    const wrapper = document.querySelector('.cart-icon-wrapper')
    if (wrapper) {
        wrapper.addEventListener('click', openCart)
    }
})