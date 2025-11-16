# CRUD_express Products & Carts API (Node.js + Express)

Este proyecto implementa una API básica para la gestión de **productos** y **carritos de compra**, desarrollada en **Node.js** con **Express**.  
Utiliza archivos JSON como base de datos local.

---

## Características principales

- CRUD completo para productos (crear, leer, actualizar y eliminar).
- Manejo de carritos con productos asociados.
- IDs autogenerados y únicos para cada registro.
- Estructura modular con clases separadas y constantes centralizadas.
- Persistencia en archivos JSON.

---

## Estructura del proyecto
```
app.js
└── src/
├── class/
│ ├── ProductsManager.js
│ └── CartsManager.js
│
├── db/
│ ├── products.json
│ └── carts.json
│
├── const/
  └── constantes.js
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
