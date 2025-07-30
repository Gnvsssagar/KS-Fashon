// =================================================================
// DATABASE
// =================================================================
const allProducts = {
    'prod1': { name: 'Elegant Flower Pot', price: 39.99, image: 'img/prod1.jpg', category: 'garden' },
    'prod2': { name: 'Smart LED Lamp', price: 59.00, image: 'img/prod2.jpg', category: 'electronics' },
    'prod3': { name: 'Stylish Wall Clock', price: 29.95, image: 'img/prod3.jpg', category: 'accessories' },
    'prod4': { name: 'Modern Chair', price: 89.00, image: 'img/prod4.jpg', category: 'accessories' },
    'prod5': { name: 'Wireless Earbuds', price: 69.00, image: 'img/prod5.jpg', category: 'electronics' },
    'prod6': { name: 'Bluetooth Speaker', price: 39.99, image: 'img/prod6.jpg', category: 'electronics' },
    'prod7': { name: 'Classic Men\'s Shirt', price: 45.00, image: 'img/men-shirt.jpg', category: 'men' },
    'prod8': { name: 'Stylish Women\'s Dress', price: 75.50, image: 'img/women-dress.jpg', category: 'women' },
    'prod9': { name: 'Kids\' Graphic T-Shirt', price: 19.99, image: 'img/kids-shirt.jpg', category: 'kids' },
    'prod10': { name: 'Men\'s Leather Wallet', price: 35.00, image: 'img/men-wallet.jpg', category: 'men' },
    'prod11': { name: 'Women\'s Handbag', price: 99.00, image: 'img/women-bag.jpg', category: 'women' },
};

// NEW: A list of IDs for the 6 popular products to show on the home page.
const popularProductIds = ['prod8', 'prod7', 'prod5', 'prod2', 'prod11', 'prod10'];

// --- UNIVERSAL HELPER ---
const isSubPage = window.location.pathname.includes('/pages/');

// =================================================================
// INITIALIZATION
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    // ---- PAGE ROUTER ----
    if (path.endsWith('cart.html')) renderCartPage();
    else if (path.endsWith('wishlist.html')) renderWishlistPage();
    else if (path.endsWith('search-results.html')) renderSearchResultsPage();
    else if (path.endsWith('checkout.html')) renderCheckoutPage();
    else if (path.endsWith('categories.html')) renderCategoryPage();
    else if (document.getElementById('product-grid')) renderHomePage();

    // ---- EVENT LISTENERS ----
    setupEventListeners();
    updateFavoriteButtonsUI();
});

function setupEventListeners() {
    document.body.addEventListener('click', (event) => {
        const target = event.target.closest('.add-to-cart-btn, .remove-from-cart-btn, .favorite-btn');
        if (!target) return;
        const productId = target.dataset.productId;
        if (target.matches('.add-to-cart-btn')) addToCart(productId);
        if (target.matches('.remove-from-cart-btn')) removeFromCart(productId);
        if (target.matches('.favorite-btn')) toggleFavorite(productId);
    });

    const navbarSearchForm = document.getElementById('navbarSearchForm');
    const mobileSearchForm = document.getElementById('mobileSearchForm');
    if (navbarSearchForm) navbarSearchForm.addEventListener('submit', handleSearchSubmit);
    if (mobileSearchForm) mobileSearchForm.addEventListener('submit', handleSearchSubmit);
    
    const scrollContainer = document.getElementById('category-carousel-container');
    if (scrollContainer) {
        document.getElementById('scroll-left-btn').addEventListener('click', () => scrollContainer.scrollBy({ left: -300, behavior: 'smooth' }));
        document.getElementById('scroll-right-btn').addEventListener('click', () => scrollContainer.scrollBy({ left: 300, behavior: 'smooth' }));
    }
}

// =================================================================
// PAGE RENDERING FUNCTIONS
// =================================================================

// UPDATED: This function now renders only the 6 popular products.
function renderHomePage() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    // Use the popularProductIds list to get only the popular products
    grid.innerHTML = popularProductIds.map(productId => {
        const product = allProducts[productId];
        // Ensure the product exists before trying to render it
        if (product) {
            return renderProductCard(productId, product);
        }
        return ''; // Return an empty string for invalid IDs
    }).join('');

    updateFavoriteButtonsUI(); // Update wishlist buttons after rendering
}

function renderCategoryPage() {
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get('cat');
    const titleEl = document.getElementById('category-title');
    const gridEl = document.getElementById('category-products-grid');

    if (!categoryId || !titleEl || !gridEl) {
        if(gridEl) gridEl.innerHTML = '<div class="col-12"><div class="alert alert-danger">Category not specified.</div></div>';
        return;
    }

    titleEl.textContent = `Shop ${categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}`;

    // This correctly filters ALL products for the category page
    const filteredProducts = Object.entries(allProducts).filter(([id, product]) => product.category === categoryId);

    if (filteredProducts.length > 0) {
        gridEl.innerHTML = filteredProducts.map(([id, product]) => renderProductCard(id, product)).join('');
    } else {
        gridEl.innerHTML = '<div class="col-12"><div class="alert alert-info">No products found in this category yet.</div></div>';
    }
    updateFavoriteButtonsUI();
}

// --- ALL OTHER FUNCTIONS (UNCHANGED) ---
function handleSearchSubmit(event){event.preventDefault();const inputField=event.target.querySelector('input[type="text"]'),query=inputField.value.trim();if(query){const searchPageUrl=isSubPage?"search-results.html":"pages/search-results.html";window.location.href=`${searchPageUrl}?q=${encodeURIComponent(query)}`}}
function addToCart(productId){let cart=JSON.parse(localStorage.getItem("cart"))||[];const e=cart.findIndex(t=>t.id===productId);e>-1?cart[e].quantity++:cart.push({id:productId,quantity:1}),localStorage.setItem("cart",JSON.stringify(cart)),alert(`"${allProducts[productId].name}" was added to your cart.`)}
function removeFromCart(productId){let cart=JSON.parse(localStorage.getItem("cart"))||[];cart=cart.filter(t=>t.id!==productId),localStorage.setItem("cart",JSON.stringify(cart)),isSubPage&&window.location.pathname.endsWith("cart.html")&&renderCartPage()}
function toggleFavorite(productId){let favorites=JSON.parse(localStorage.getItem("favorites"))||[];const e=favorites.indexOf(productId);e>-1?favorites.splice(e,1):favorites.push(productId),localStorage.setItem("favorites",JSON.stringify(favorites)),updateFavoriteButtonsUI(),isSubPage&&window.location.pathname.endsWith("wishlist.html")&&renderWishlistPage()}
function renderProductCard(productId,product){const favorites=JSON.parse(localStorage.getItem("favorites"))||[],isFavorited=favorites.includes(productId),imagePath=isSubPage?`../${product.image}`:product.image;return`<div class="col-md-4"><div class="card h-100 shadow-sm product-card position-relative"><button class="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle favorite-btn" data-product-id="${productId}" title="Toggle Wishlist"><i class="${isFavorited?"fas favorited":"far"} fa-heart"></i></button><img src="${imagePath}" class="card-img-top" alt="${product.name}"><div class="card-body text-center d-flex flex-column"><h5 class="card-title fw-semibold">${product.name}</h5><p class="text-success fw-bold mt-auto mb-3">$${product.price.toFixed(2)}</p><div class="d-grid gap-2"><a href="${isSubPage?"":"pages/"}product-details.html?id=${productId}" class="btn btn-outline-primary btn-sm">View Details</a><button class="btn btn-primary btn-sm add-to-cart-btn" data-product-id="${productId}">Add to Cart</button></div></div></div></div>`}
function renderWishlistPage(){const container=document.getElementById("wishlist-items-container");if(!container)return;const favorites=JSON.parse(localStorage.getItem("favorites"))||[];favorites.length===0?container.innerHTML='<div class="col-12"><div class="alert alert-info">Your wishlist is empty.</div></div>':container.innerHTML=favorites.map(t=>{const e=allProducts[t];return e?renderProductCard(t,e):""}).join("")}
function renderCartPage(){const container=document.getElementById("cart-items-container");if(!container)return;const cart=JSON.parse(localStorage.getItem("cart"))||[];if(cart.length===0)return container.innerHTML='<div class="alert alert-info">Your cart is empty.</div>',void updatePriceSummary(0,"cart-subtotal","cart-total");let subtotal=0;container.innerHTML=cart.map(t=>{const e=allProducts[t.id];if(!e)return"";const n=e.price*t.quantity;return subtotal+=n,`<div class="card mb-3"><div class="card-body d-flex justify-content-between align-items-center"><div class="d-flex align-items-center"><img src="../${e.image}" width="100" class="rounded me-3" alt="${e.name}"><div><h5 class="mb-0">${e.name}</h5><p class="mb-0 text-muted">Quantity: ${t.quantity}</p></div></div><div class="text-end"><p class="fw-bold mb-0 fs-5">$${n.toFixed(2)}</p><button class="btn btn-sm btn-outline-danger mt-2 remove-from-cart-btn" data-product-id="${t.id}">Remove</button></div></div></div>`}).join(""),updatePriceSummary(subtotal,"cart-subtotal","cart-total")}
function updatePriceSummary(subtotal,subtotalId,totalId){const subtotalEl=document.getElementById(subtotalId),totalEl=document.getElementById(totalId);if(!subtotalEl||!totalEl)return;const shipping=subtotal>0?5:0;subtotalEl.textContent=`$${subtotal.toFixed(2)}`,totalEl.textContent=`$${(subtotal+shipping).toFixed(2)}`}
function updateFavoriteButtonsUI(){const favorites=JSON.parse(localStorage.getItem("favorites"))||[];document.querySelectorAll(".favorite-btn").forEach(t=>{const e=t.querySelector("i");favorites.includes(t.dataset.productId)?(e.classList.add("fas","favorited"),e.classList.remove("far")):(e.classList.add("far"),e.classList.remove("fas","favorited"))})}
function renderSearchResultsPage(){const headerEl=document.getElementById("search-results-header"),container=document.getElementById("search-results-container");if(!headerEl||!container)return;const query=new URLSearchParams(window.location.search).get("q");headerEl.innerHTML=`Results for <span class="text-primary">"${query}"</span>`;const filtered=Object.entries(allProducts).filter(([t,e])=>e.name.toLowerCase().includes(query.toLowerCase()));filtered.length>0?container.innerHTML=filtered.map(([t,e])=>renderProductCard(t,e)).join(""):container.innerHTML='<div class="col-12"><div class="alert alert-warning">No products found matching your search.</div></div>',updateFavoriteButtonsUI()}
function renderCheckoutPage(){const summaryContainer=document.getElementById("checkout-summary-items");if(!summaryContainer)return;const cart=JSON.parse(localStorage.getItem("cart"))||[];if(cart.length===0)return void(window.location.href="cart.html");let subtotal=0;summaryContainer.innerHTML=cart.map(t=>{const e=allProducts[t.id];return subtotal+=e.price*t.quantity,`<li class="list-group-item d-flex justify-content-between lh-sm"><div><h6 class="my-0">${e.name}</h6><small class="text-muted">Quantity: ${t.quantity}</small></div><span class="text-muted">$${(e.price*t.quantity).toFixed(2)}</span></li>`}).join(""),document.getElementById("summary-item-count").textContent=cart.reduce((t,e)=>t+e.quantity,0),updatePriceSummary(subtotal,"summary-subtotal","summary-total");const paymentRadios=document.querySelectorAll('input[name="paymentMethod"]'),creditCardDetails=document.getElementById("credit-card-details");paymentRadios.forEach(t=>{t.addEventListener("change",()=>{creditCardDetails.style.display=t.id==="credit"?"flex":"none"})}),document.getElementById("checkout-form").addEventListener("submit",t=>{t.preventDefault(),alert("Thank you for your order! It has been placed successfully."),localStorage.removeItem("cart"),window.location.href="../index.html"})}
