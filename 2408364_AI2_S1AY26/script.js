/**********************
 * IA#2 JS SECTION
 * Name: Carlos Rodriguez
 * ID #: 2408364
 **********************/

/* --- Product Data --- */
const products = [
    {
        id: 1,
        name: "Soalmost Living Room Rug",
        category: "livingroom",
        price: 9.99,
        image: "../Assets/livingroom.jpg",
        desc: "Washable Area Rug 8x10, Large Soft Rugs for Living Room Vintage Beige Carpet 8x10 Area Rugs for Bedroom Dining Room Non-Slip Stain Resistant Under Table Rug"
    },
    {
        id: 2,
        name: "Ophanie Bedroom Rug",
        category: "bedroom",
        price: 12.50,
        image: "../Assets/bedroom.jpg",
        desc: "Ophanie Area Rugs for Living Room Bedroom, Upgrade Non-Slip Fluffy Soft Grey Shag Carpet, Indoor Floor Gray 4x6 Fuzzy Shaggy Living Room Plush Rug for Kids Home Dorm Decor Aesthetic"
    },
    {
        id: 3,
        name: "OLANLY Bathroom Rug",
        category: "bathroom",
        price: 7.49,
        image: "../Assets/bathroom.jpg",
        desc: "OLANLY Bathroom Rugs 30x20, Extra Soft Absorbent Chenille Bath Rugs, Rubber Backing Quick Dry, Machine Washable Bath Mats for Bathroom Floor, Tub and Shower, Home Decor Accessories, Grey"
    },
    {
        id: 4,
        name: "COSY HOMEER Kitchen Rug",
        category: "kitchen",
        price: 15.00,
        image: "../Assets/kitchen.jpg",
        desc: "COSY HOMEER 48x20 Inch/30X20 Inch Kitchen Rug Mats Made of 100% Polypropylene 2 Pieces Soft Kitchen Mat Specialized in Anti Slippery and Machine Washable (Grey)"
    },
    {
        id: 5,
        name: "GENIMO Outdoor Rug",
        category: "outdoor",
        price: 18.49,
        image: "../Assets/outdoor.jpg",
        desc: "GENIMO Outdoor Rug for Patio Clearance,5'x8' Waterproof Mat,Reversible Plastic Camping Rugs,Rv,Porch,Deck,Camper,Balcony,Backyard,Black & Gray"
    }
    // Add more as needed
];


/* --- DOMContentLoaded: Main Routing Logic --- */
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname.split('/').pop();

    // Home/Product Page
    if (path === '' || path === 'index.html') {
        renderProducts();
        setUpFilters();
    }

    // Cart Page
    if (path === 'cart.html') {
        renderCart();
        document.getElementById('clear-cart').addEventListener('click', clearCart); // Event Listener #1
    }

    // Checkout Page
    if (path === 'checkout.html') {
        renderCheckoutSummary();
        document.getElementById('checkoutForm').addEventListener('submit', handleCheckout); // Event Listener #2
        document.getElementById('cancel-checkout').addEventListener('click', function() {
            window.location.href = "cart.html";
        });
    }

    // Login Page
    if (path === 'login.html') {
        document.getElementById('loginForm').addEventListener('submit', handleLogin); // Event Listener #3
    }

    // Register Page
    if (path === 'register.html') {
        document.getElementById('registerForm').addEventListener('submit', handleRegister); // Event Listener #4
    }
});

/* --- Product List Rendering --- */
function renderProducts() {
    const list = document.getElementById('product-list');
    if (!list) return;
    let displayProducts = products;

    // Initial render
    list.innerHTML = products.map(prod => productCard(prod)).join('');

    // Setup event listeners for Add to Cart
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            addToCart(Number(btn.dataset.id));
        });
    });
}

/* --- Product Card Markup --- */
function productCard(prod) {
    return `
    <div class="product-card">
        <img src="${prod.image}" alt="${prod.name}">
        <h3>${prod.name}</h3>
        <p>${prod.desc}</p>
        <p class="price">$${prod.price.toFixed(2)}</p>
        <button class="add-to-cart" data-id="${prod.id}">Add to Cart</button>
    </div>
    `;
}

/* --- Filter & Search Setup --- */
function setUpFilters() {
    const catSel = document.getElementById('category');
    const search = document.getElementById('search');
    catSel.addEventListener('change', filterProducts); // Event Listener #5
    search.addEventListener('input', filterProducts);  // Event Listener #6
}

/* --- Filtering Logic --- */
function filterProducts() {
    const cat = document.getElementById('category').value;
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const list = document.getElementById('product-list');
    let filtered = products.filter(p =>
        (cat === 'all' || p.category === cat) &&
        (p.name.toLowerCase().includes(searchTerm) || p.desc.toLowerCase().includes(searchTerm))
    );
    list.innerHTML = filtered.map(prod => productCard(prod)).join('');
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            addToCart(Number(btn.dataset.id));
        });
    });
}

/* --- Cart Logic --- */
function addToCart(prodId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let item = cart.find(i => i.id === prodId);
    if (item) {
        item.qty += 1;
    } else {
        let prod = products.find(p => p.id === prodId);
        cart.push({ id: prod.id, name: prod.name, price: prod.price, qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert("Added to cart!");
}

function renderCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const tbody = document.querySelector('#cart-table tbody');
    tbody.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        let row = document.createElement('tr');
        let itemSubtotal = item.price * item.qty;
        subtotal += itemSubtotal;
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <input type="number" min="1" value="${item.qty}" data-id="${item.id}" class="cart-qty">
            </td>
            <td>$${itemSubtotal.toFixed(2)}</td>
            <td><button onclick="removeFromCart(${item.id})">Remove</button></td>
        `;
        tbody.appendChild(row);
    });

    // Event: Quantity change
    document.querySelectorAll('.cart-qty').forEach(input => {
        input.addEventListener('input', function() {
            updateCartQty(Number(input.dataset.id), Number(input.value));
        });
    });

    // Discount: 10% off for subtotal over $50
    let discount = subtotal > 50 ? subtotal * 0.10 : 0;
    let tax = (subtotal - discount) * 0.15;
    let total = subtotal - discount + tax;

    document.getElementById('cart-discount').textContent = `$${discount.toFixed(2)}`;
    document.getElementById('cart-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

function updateCartQty(id, qty) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let item = cart.find(i => i.id === id);
    if (item && qty > 0) {
        item.qty = qty;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(i => i.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function clearCart() {
    localStorage.removeItem('cart');
    renderCart();
}

/* --- Checkout Summary --- */
function renderCheckoutSummary() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const summary = document.getElementById('checkout-summary');
    if (!cart.length) {
        summary.innerHTML = '<p>Your cart is empty.</p>';
        document.getElementById('checkoutForm').style.display = 'none';
        return;
    }
    let subtotal = 0;
    summary.innerHTML = `
        <table>
            <tr><th>Product</th><th>Qty</th><th>Subtotal</th></tr>
            ${cart.map(item => {
                let itemSubtotal = item.price * item.qty;
                subtotal += itemSubtotal;
                return `<tr><td>${item.name}</td><td>${item.qty}</td><td>$${itemSubtotal.toFixed(2)}</td></tr>`;
            }).join('')}
        </table>
    `;
    let discount = subtotal > 50 ? subtotal * 0.10 : 0;
    let tax = (subtotal - discount) * 0.15;
    let total = subtotal - discount + tax;
    summary.innerHTML += `
        <p>Discount: $${discount.toFixed(2)} | Tax: $${tax.toFixed(2)} | <b>Total: $${total.toFixed(2)}</b></p>
    `;
}

/* --- Checkout Form Validation --- */
function handleCheckout(e) {
    e.preventDefault();
    const name = document.getElementById('ship-name').value.trim();
    const address = document.getElementById('ship-address').value.trim();
    const amount = parseFloat(document.getElementById('ship-amount').value);
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    let discount = subtotal > 50 ? subtotal * 0.10 : 0;
    let tax = (subtotal - discount) * 0.15;
    let total = subtotal - discount + tax;

    const errorMsg = document.getElementById('checkout-error');
    if (!name || !address || isNaN(amount)) {
        errorMsg.textContent = "Please fill in all required fields.";
        return;
    }
    if (amount < total) {
        errorMsg.textContent = `Insufficient amount. Total is $${total.toFixed(2)}.`;
        return;
    }
    errorMsg.textContent = "";
    alert("Order confirmed! Thank you for shopping.");
    localStorage.removeItem('cart');
    window.location.href = 'index.html';
}

/* --- Login Logic --- */
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const errorMsg = document.getElementById('login-error');

    // Currently accepting any non-empty credentials
    if (!username || !password) {
        errorMsg.textContent = "Username and password required.";
        return;
    }
    errorMsg.textContent = "";
    alert("Login successful!");
    window.location.href = "index.html";
}

/* --- Register Logic --- */
function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const dob = document.getElementById('reg-dob').value;
    const email = document.getElementById('reg-email').value.trim();
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const errorMsg = document.getElementById('register-error');

    if (!name || !dob || !email || !username || !password) {
        errorMsg.textContent = "All fields are required.";
        return;
    }
    if (!validateEmail(email)) {
        errorMsg.textContent = "Invalid email format.";
        return;
    }
    errorMsg.textContent = "";
    alert("Registration successful!");
    window.location.href = "login.html";
}

function validateEmail(email) {
    // Email format validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}