// Base de datos simulada de productos
const products = [
    { id: 1, name: "Galaxy Alpha X", price: 699, description: "Pantalla AMOLED 6.5\", 128GB, Cámara de 64MP", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=500&q=80" },
    { id: 2, name: "iPhone Pro Max 14", price: 999, description: "Chip A16 Bionic, 256GB, Batería de larga duración", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80" },
    { id: 3, name: "Xiaomi Note Pro", price: 399, description: "Carga rápida 120W, 8GB RAM, 128GB", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=500&q=80" },
    { id: 4, name: "Motorola Edge 40", price: 499, description: "Diseño ultra delgado, Pantalla curva de 144Hz", image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=500&q=80" }
];

let cart = [];

// Cargar productos en el DOM
function renderProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${product.price}</div>
                <button class="buy-btn" onclick="addToCart(${product.id})">Añadir al Carrito</button>
            </div>
        `;
        productList.appendChild(card);
    });
}

// Agregar producto al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCartUI();
    alert(`¡${product.name} agregado al carrito!`);
}

// Actualizar interfaz del carrito
function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    
    const cartItemsList = document.getElementById('cartItems');
    cartItemsList.innerHTML = '';
    
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        const li = document.createElement('li');
        li.innerHTML = `${item.name} - $${item.price} <button onclick="removeFromCart(${index})" style="background:red; color:white; border:none; padding:2px 5px; cursor:pointer;">X</button>`;
        cartItemsList.appendChild(li);
    });

    document.getElementById('cartTotal').innerText = total;
}

// Remover un ítem del carrito
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// Mostrar / Ocultar el modal del carrito
function toggleCart() {
    const modal = document.getElementById('cartModal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

// Simular proceso de compra
function checkout() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }
    alert("¡Compra realizada con éxito! Gracias por elegir TecnoCell.");
    cart = [];
    updateCartUI();
    toggleCart();
}

// Inicializar la aplicación al cargar la página
window.onload = renderProducts;