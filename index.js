let parentCarts = document.querySelector('.parent-cards')
let categoriesGroup = document.querySelector('#categories-group')
let categoryList= []

function generateStarsHtml(rating) {
  let html = ''
  const roundedRating = Math.round(rating)

  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      html += '<span class="star filled">★</span>'
    } else {
      html += '<span class="star">★</span>'
    }
  }
  return html
}

function createProductCard(product){
  let card = document.createElement('div')
      let cardInfo = document.createElement('div')
      let cardButtons = document.createElement('div')

      card.classList.add('card')
      cardInfo.classList.add('card-info')
      cardButtons.classList.add('card-buttons')

      let img = document.createElement('img')
      let title = document.createElement('h2')
      let category = document.createElement('span')
      let price = document.createElement('p')


      if (!categoryList.includes(product.category)) {
        categoryList.push(product.category)
      }


      let ratingDiv = document.createElement('div')
      ratingDiv.classList.add('product-rating')

      const starsHtml = generateStarsHtml(product.rating.rate)
      ratingDiv.innerHTML = `
          <div class="stars-container">${starsHtml}</div> 
          <span class="rate-value">${product.rating.rate.toFixed(1)}</span>
          <span class="rate-count">(${product.rating.count})</span>
      `

      let view = document.createElement('button')
      view.classList.add('view')
      let add = document.createElement('button')
      add.classList.add('add')

      view.textContent = 'View details'
      add.textContent = 'Add to Cart'

      img.setAttribute('src', `${product.image}`)

      if (product.title.length > 60) {
        title.textContent = product.title.slice(0, 60) + '...'
      } else {
        title.textContent = product.title
      }

      category.textContent = `${product.category}`
      price.textContent = `$${product.price}`

      cardButtons.append(view, add)
      cardInfo.append(title, category, price, ratingDiv, cardButtons)
      card.append(img, cardInfo)
      parentCarts.append(card)
}

fetch('https://fakestoreapi.com/products')
  .then(res => {
    if (!res.ok) {
      throw new Error('Error')
    }
    return res.json()
  })
  .then(products => {
    products.forEach(product => {
      createProductCard(product)
     
    })
    categoryList.forEach(group => {
      let option = document.createElement('option')
      option.textContent = `${group}`
      categoriesGroup.append(option)
    })

     categoriesGroup.addEventListener('change',evt=>{
        parentCarts.innerHTML=''
        products.forEach(product=>{
      if (categoriesGroup.value === '' || product.category === categoriesGroup.value) {
          createProductCard(product)
        }
        })
      })
  })
  .catch(err => {
    console.log(err.message)
  })
