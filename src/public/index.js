console.log("Archivo del Frontend")
const conexionSocket = io()

conexionSocket.on("connect", () => {
    console.log("Conectado al servidor, id", conexionSocket.id)
    conexionSocket.emit("mensajeDesdeCliente", "Hola servidor, te saluda el cliente")
})

const updateProductList = (products) => {
    const productContainer = document.querySelector('.product-grid');
    if (!productContainer) return; 
    //Mapear en el HTML la tarjeta
    const productHTML = products.map(p => `
        <div class="product-card">
            <h3>${p.title}</h3>
            <p class="description">${p.description}</p>
            <div class="details">
                <span class="price">$${p.price}</span>
                <span class="stock">Stock: ${p.stock}</span>
            </div>
            <small>ID: ${p.id}</small>
        </div>
    `).join('');

    productContainer.innerHTML = productHTML || "<p>No hay productos disponibles.</p>";
};

// Escuchar el evento 'productsUpdate' del servidor
socket.on("productsUpdate", (products) => {
    console.log("¡Lista de productos actualizada en tiempo real!");
    updateProductList(products);
});