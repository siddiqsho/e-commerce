import { createCard } from "./createCard.js"
const parentCard = document.querySelector('.parent-cards')
fetch('https://fakestoreapi.com/products')
    .then(res => {
        if (!res.ok) {
            throw new Error('Error')
        }
        return res.json()
    })
    .then(products => {
        products.forEach(product => {
            const card = createCard(product)
            parentCard.append(card)
        })
    })
    .catch(err => {
        console.log(err)
    })