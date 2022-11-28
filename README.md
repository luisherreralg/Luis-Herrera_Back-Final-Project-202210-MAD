# Disi Sneakers 👟

## Descripción

Un E-commerce básico donde se puedan comprar zapatillas de diferentes marcas.

## Front

- Home con filtros para marcas (por ejemplo) ¿Barra de búsqueda?
- Cuando haces click en un producto página detalles
- Registro de usuarios
- Cuando está registrado que pueda añadir a su carrito
- Administrador que pueda añadir, borrar y editar productos?

## Back Endpoints

| /sneakers            | /users         | /cart         |
| -------------------- | -------------- | ------------- |
| "/" getAll           | /register post | "/:id" getId  |
| "/" post (admin)     | /login post    | "/" post      |
| "/:id" getId         |                | "/:id" delete |
| "/:id" delete(admin) |                |               |
| "/id"patch (admin)   |                |               |

## Modelo de datos

Link: https://prnt.sc/nNJY1IPpUGt0

| Sneakers    |         |
| ----------- | ------- |
| id          | string  |
| brand       | string  |
| model       | string  |
| size        | Sizes[] |
| price       | number  |
| onSalePrice | number  |
| onSale      | false   |
| stock       | number  |
| gender      | string  |

| Users    |                  |
| -------- | ---------------- |
| id       | string           |
| name     | string           |
| surname  | string           |
| email    | string           |
| password | string           |
| role     | "user" / "admin" |

| Cart       |        |
| ---------- | ------ |
| orderId    | string |
| cartedItem | string |
| size       | string |
| cartedBy   | string |
