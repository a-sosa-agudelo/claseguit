/* Edita esta lista para cambiar el catálogo de la tienda. */
const productos = [
    { id: 1, nombre: 'Lápiz labial Cherry', categoria: 'Labios', precio: 18.90, icono: '💄', color: '#ffc2d9' },
    { id: 2, nombre: 'Paleta Sunset', categoria: 'Ojos', precio: 29.90, icono: '🎨', color: '#ffd85a' },
    { id: 3, nombre: 'Rubor Dream Blush', categoria: 'Rostro', precio: 22.50, icono: '🌸', color: '#e3c9ff' },
    { id: 4, nombre: 'Gloss Crystal Shine', categoria: 'Labios', precio: 15.90, icono: '✨', color: '#a8eee3' },
    { id: 5, nombre: 'Máscara Volume Pop', categoria: 'Ojos', precio: 19.50, icono: '👁️', color: '#d8c8ff' },
    { id: 6, nombre: 'Iluminador Golden Hour', categoria: 'Rostro', precio: 24.90, icono: '🌟', color: '#ffe7a1' }
];

const carrito = [];
let categoriaActual = 'Todos';
const formatoPrecio = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

const productGrid = document.querySelector('#productGrid');
const filters = document.querySelector('#filters');
const searchInput = document.querySelector('#searchInput');
const cartPanel = document.querySelector('#cartPanel');
const overlay = document.querySelector('#overlay');
const cartItems = document.querySelector('#cartItems');
const cartCount = document.querySelector('#cartCount');
const cartTotal = document.querySelector('#cartTotal');

function crearFiltros() {
    const categorias = ['Todos', ...new Set(productos.map((producto) => producto.categoria))];
    filters.innerHTML = categorias.map((categoria) => `
        <button class="filter-button ${categoria === categoriaActual ? 'active' : ''}" type="button" data-category="${categoria}">
            ${categoria}
        </button>
    `).join('');

    filters.querySelectorAll('[data-category]').forEach((boton) => {
        boton.addEventListener('click', () => {
            categoriaActual = boton.dataset.category;
            crearFiltros();
            mostrarProductos();
        });
    });
}

function mostrarProductos() {
    const busqueda = searchInput.value.toLowerCase().trim();
    const resultados = productos.filter((producto) => {
        const coincideCategoria = categoriaActual === 'Todos' || producto.categoria === categoriaActual;
        const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda);
        return coincideCategoria && coincideBusqueda;
    });

    productGrid.innerHTML = resultados.length
        ? resultados.map((producto) => `
            <article class="product-card">
                <div class="product-image" style="--card-color: ${producto.color}" aria-hidden="true">${producto.icono}</div>
                <div class="product-info">
                    <p class="product-category">${producto.categoria}</p>
                    <h3 class="product-name">${producto.nombre}</h3>
                    <div class="product-bottom">
                        <span class="product-price">${formatoPrecio.format(producto.precio)}</span>
                        <button class="add-button" type="button" data-product-id="${producto.id}">Añadir</button>
                    </div>
                </div>
            </article>
        `).join('')
        : '<p>No encontramos productos con esa búsqueda.</p>';

    productGrid.querySelectorAll('[data-product-id]').forEach((boton) => {
        boton.addEventListener('click', () => añadirAlCarrito(Number(boton.dataset.productId)));
    });
}

function añadirAlCarrito(id) {
    const producto = productos.find((item) => item.id === id);
    if (producto) carrito.push(producto);
    actualizarCarrito();
}

function quitarDelCarrito(indice) {
    carrito.splice(indice, 1);
    actualizarCarrito();
}

function actualizarCarrito() {
    cartCount.textContent = carrito.length;
    const total = carrito.reduce((suma, producto) => suma + producto.precio, 0);
    cartTotal.textContent = formatoPrecio.format(total);
    cartItems.innerHTML = carrito.length
        ? carrito.map((producto, indice) => `
            <div class="cart-item">
                <div><strong>${producto.nombre}</strong><br><small>${formatoPrecio.format(producto.precio)}</small></div>
                <button class="remove-item" type="button" data-remove-index="${indice}">Quitar</button>
            </div>
        `).join('')
        : '<p class="empty-cart">Todavía no has añadido productos.</p>';

    cartItems.querySelectorAll('[data-remove-index]').forEach((boton) => {
        boton.addEventListener('click', () => quitarDelCarrito(Number(boton.dataset.removeIndex)));
    });
}

function cambiarCarrito(abrir) {
    cartPanel.classList.toggle('open', abrir);
    overlay.classList.toggle('visible', abrir);
    cartPanel.setAttribute('aria-hidden', String(!abrir));
}

document.querySelector('#cartButton').addEventListener('click', () => cambiarCarrito(true));
document.querySelector('#closeCart').addEventListener('click', () => cambiarCarrito(false));
overlay.addEventListener('click', () => cambiarCarrito(false));
searchInput.addEventListener('input', mostrarProductos);
document.querySelector('#checkoutButton').addEventListener('click', () => {
    if (!carrito.length) {
        alert('Añade un producto antes de finalizar la compra.');
        return;
    }
    alert('Demo: aquí puedes conectar tu pasarela de pago.');
});

crearFiltros();
mostrarProductos();
actualizarCarrito();
