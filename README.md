# CRUD_express Products & Carts API (Node.js + Express)

Este proyecto implementa una API básica para la gestión de **productos** y **carritos de compra**, desarrollada en **Node.js** con **Express**.  
Utiliza archivos JSON como base de datos local.

---

## Características principales

- CRUD completo para productos (crear, leer, actualizar y eliminar).
- Manejo de carritos con productos asociados.
- IDs autogenerados y únicos para cada registro.
- Estructura modular con clases, rutas, controladores, vistas y constantes centralizadas.
- Persistencia en archivos JSON.
- Implementación de servidor WebSocket con la librería socket.io
- Actulización en tiempo real del listado de productos al agregar eliminar o realizar alguna actualización.

---

## Estructura del proyecto
```

└── src/
    ├── index.js
    ├── class/
    │   ├── ProductsManager.js
    │   └── CartsManager.js
    ├── const/
    │   └── constantes.js
    ├── controllers/
    │   ├── root.controller.js
    │   ├── carts.controller.js
    │   └── products.controller.js
    ├── routes/
    │   ├── root.routes.js
    │   ├── carts.routes.js
    │   └── products.routes.js
    ├── db/
    │   ├── products.json
    │   └── carts.json
    ├── public/
    │   ├── index.css
    │   └── index.js
    └── views/
        ├── layouts/
        │   └── main.handlebars
        ├── partials/
        │   └── header.handlebars
        ├── error.handlebars
        ├── products.handlebars
        └── home.handlebars
```

## Funcionalidades

### Rutas para manejo de productos (`/products`)
- **GET /** : Lista todos los productos.
- **GET /:pid** : Devuelve un producto específico según su ID.
- **POST /** : Agrega un nuevo producto (el `id` se genera automáticamente).
- **PUT /:pid** : Actualiza los campos de un producto (sin modificar su `id`).
- **DELETE /:pid** : Elimina un producto según su ID.

### Rutas para manejo de carritos (`/carts`)
- **POST /** : Agrega un nuevo carrito.
- **GET /:cid** : Devuelve un carrito especifico por su ID.
- **POST /:cid/product/:pid** : Agregar un producto especifico por su ID a un carrito especifico.
