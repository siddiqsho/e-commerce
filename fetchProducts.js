import { createCard } from "./createCard.js"

const DOM = {
    parentCard: document.querySelector('.parent-cards'),
    categorySelector: document.querySelector('#category'),
    priceSelector: document.querySelector('#price')
}

let state = {
    products: [],
    categories: []
}

const STORAGE_KEY = 'products';

function saveFiltersToStorage() {
    const filters = {
        category: DOM.categorySelector.value,
        price: DOM.priceSelector.value
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
}

function getFiltersFromStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
}

function renderProducts(products) {
    DOM.parentCard.innerHTML = '';

    if(!products || products.length === 0 ) {
        DOM.parentCard.innerHTML = '<p>No products found</p>';
        return;
    }

    const fragment = document.createDocumentFragment();

    products.forEach(product => {
        const card = createCard(product);
        fragment.appendChild(card);
    });

    DOM.parentCard.appendChild(fragment);  
}

function updateCategories(categories){
    DOM.categorySelector.innerHTML='';
    const allOptions = document.createElement('option')
    allOptions.value = '';
    allOptions.textContent = `All Categories`

    DOM.categorySelector.appendChild(allOptions);

    categories.forEach(category => {
        let option = document.createElement('option');

        option.value = category;
        option.textContent = category;

        DOM.categorySelector.appendChild(option);
    })
}

function filterByCategory(products, category) {
    if(!category) {
        return products;
    }
    return products.filter(product => product.category === category);
}

function sortByPrice(products, order) {
    const sortedProduct = [...products];

    if(order === 'min') {
        sortedProduct.sort((a, b) => a.price-b.price);
    }else if(order === 'max'){
        sortedProduct.sort((a, b)=> b.price-a.price);
    }
    return sortedProduct;
}

function applyFilters(products) {
    const currentCategory = DOM.categorySelector.value;
    const currentPrice = DOM.priceSelector.value;

    const filtered = filterByCategory(products, currentCategory);
    const sorted = sortByPrice(filtered, currentPrice);

    renderProducts(sorted);
}

function setupEventListeners(products) {
    DOM.categorySelector.addEventListener('change', () => {
        applyFilters(products);
        saveFiltersToStorage();
    });

    DOM.priceSelector.addEventListener('change', () => {
        applyFilters(products);
        saveFiltersToStorage();
    });
}

function extractCategories(products) {
    const categories = new Set();

    products.forEach(product=> categories.add(product.category))

    return Array.from(categories)
}

export function fetchProducts() {
    fetch('https://fakestoreapi.com/products')
    .then(res=>{
        if(!res.ok) {
            throw new Error('Error')
        }
        return res.json()
    })
    .then(
        products => {
            state.products = products;
            state.categories = extractCategories(products);

            updateCategories(state.categories);
            setupEventListeners(products);

            const savedFilters = getFiltersFromStorage();

            if (savedFilters) {
                DOM.categorySelector.value = savedFilters.category;
                DOM.priceSelector.value = savedFilters.price;
            }

            applyFilters(products);
        }
    )
    .catch(err=> {
        console.log(err);
    })
}