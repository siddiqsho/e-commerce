import { createCard } from "./createCard.js"
const parentCard = document.querySelector('.parent-cards')

let selectorCategory = document.querySelector('#category')
let categoryGroup = []

let selectorPrice = document.querySelector('#price')


function showProducts(arrProducts) {
    parentCard.innerHTML = ''
    arrProducts.forEach(product => {
        const card = createCard(product)
        parentCard.append(card)
    })
}

export function fetchProducts() {
    fetch('https://fakestoreapi.com/products')
        .then(res => {
            if (!res.ok) {
                throw new Error('Error')
            }
            return res.json()
        })
        .then(products => {
            products.forEach(product => {

                showProducts(products)

                if (!categoryGroup.includes(product.category)) {
                    categoryGroup.push(product.category)
                }
            })

         //ish ay categoriyahay
            categoryGroup.forEach(group => {
                selectorCategory.innerHTML += `<option value="${group}">${group}</option>`
            })

            selectorCategory.addEventListener('change', evt => {

                let filterGroup = products.filter(product => {
                    return product.category === evt.target.value
                })
                showProducts(filterGroup)
            })
            
            //ish ay senahay
           selectorPrice.addEventListener('change',evt=>{
             if(evt.target.value==='min'){
                parentCard.innerHTML=''
                let sortPrice=products.sort((a,b)=> a.price-b.price)
                showProducts(sortPrice)
             }
             else if(evt.target.value==='max'){
                parentCard.innerHTML=''
                let sortPrice=products.sort((a,b)=>b.price-a.price)
                showProducts(sortPrice)
             }
           })

        })
        .catch(err => {
            console.log(err)
        })
}
