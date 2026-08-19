let parentCarts=document.querySelector('.parent-cards')

fetch('https://fakestoreapi.com/products')
.then(res=>{
  if(!res.ok){
    throw new Error('Error')
  }
  return res.json()
})
.then(products=>{
    products.forEach(product=> {
      let card =document.createElement('div')
      let cardInfo=document.createElement('div')
      let cardButtons=document.createElement('div')

      card.classList.add('card')
      cardInfo.classList.add('card-info')
      cardButtons.classList.add('card-buttons')


      let img=document.createElement('img')
      let title=document.createElement('h2')
      let category=document.createElement('span')
      let price=document.createElement('p')

      let view=document.createElement('button')
      view.classList.add('view')
      let add=document.createElement('button')
      add.classList.add('add')

      view.textContent='View details'
      add.textContent='Add to Cart'

      img.setAttribute('src',`${product.image}`)
      title.textContent=`${product.title}`
      category.textContent=`${product.category}`
      price.textContent=`$${product.price}`

      cardButtons.append(view,add)
      cardInfo.append(title,category,price,cardButtons)

      card.append(img,cardInfo)
      
    parentCarts.append(card)
  
    }); 
    })
.catch(err=>{
    console.log('Error'+err)
})

