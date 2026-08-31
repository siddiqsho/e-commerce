import { createModal } from "./modal.js"

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
    const addBasketBtn = document.createElement('div')
    addBasketBtn.classList.add('add-basket-btn')

    detailsBtn.textContent = 'Детали'
    addBasketBtn.textContent = 'В корзину'

    img.setAttribute('src', `${product.image}`)

    if(product.title.length >60){
         title.textContent=`${product.title.slice(0, 60)}...`
      }
      else{
        title.textContent=`${product.title}`
      }

    rate.innerHTML = `<span style="color:var(--color-star)">★</span> ${product.rating.rate}`
    price.textContent = `₽${Math.round(product.price).toLocaleString('ru-RU')}`

    detailsBtn.addEventListener('click', () => {
        createModal(product)
    })

    buttonsCard.append(detailsBtn, addBasketBtn)
    infoForCard.append(title, rate, price)
    card.append(img, infoForCard, buttonsCard)

    return card
}