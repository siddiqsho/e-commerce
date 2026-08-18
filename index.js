let parentCarts=document.querySelector('.parent-cards')

fetch('https://fakestoreapi.com/products')
.then(res=>res.json())
.then(json=>{
    json.forEach(product=> {
      let card =document.createElement('div')
      let forCard=document.createElement('div')
      card.classList.add('card')
      forCard.classList.add('for-card')

      let img=document.createElement('img')
      let title=document.createElement('h1')
      let category=document.createElement('span')
      let price=document.createElement('p')

      img.setAttribute('src',`${product.image}`)
      title.textContent=`${product.title}`
      category.textContent=`${product.category}`
      price.textContent=`$${product.price}`

      forCard.append(title,category,price)

      card.append(img,forCard)
      parentCarts.append(card)
    }); 
})
