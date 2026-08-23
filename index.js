let parentCard=document.querySelector('.parent-cards')
function createCard(product){
   let card=document.createElement('div')
    card.classList.add('card')
    let infoForCard=document.createElement('div')
    infoForCard.classList.add('info-for-card')
    let buttonsCard=document.createElement('div')
    buttonsCard.classList.add('buttons-card')

    let img=document.createElement('img')
    let h2=document.createElement('div')
    h2.classList.add('card-title')
    let rate=document.createElement('p')
    let price=document.createElement('p')

    let detailsBtn=document.createElement('div')
    detailsBtn.classList.add('details-btn')
    let addBasket=document.createElement('div')
    addBasket.classList.add('add-basket-btn')

    detailsBtn.textContent='👁'
    addBasket.textContent='Add to basket'

    img.setAttribute('src',`${product.image}`)
    if(product.title.length>60){
      h2.textContent=`${product.title.slice(0,60)}...`
    }else{
       h2.textContent=`${product.title}`
    }
    rate.innerHTML=`<span style="color:yellow">★</span> ${product.rating.rate}`
    price.textContent=`$${product.price.toFixed(2)}`

    buttonsCard.append(addBasket,detailsBtn)
    infoForCard.append(h2,rate,price)
    card.append(img,infoForCard,buttonsCard)
    parentCard.append(card)
}
fetch('https://fakestoreapi.com/products')
.then(res=>{
  if(!res.ok){
   throw new Error('Error')
  }
  return res.json()
})
.then(products=>{
  products.forEach(product => {
   createCard(product)
  });

})
.catch(err=>{
 console.log(err)
})
