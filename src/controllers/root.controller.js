export const rootHandler = (req, res) => {
    res.render("home", { 
        titulo: "Home Page",
        bienvenida: "¡Bienvenido a la aplicación groseries-boom!"
    })
}