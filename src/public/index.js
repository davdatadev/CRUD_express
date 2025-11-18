console.log("Archivo del Frontend")
const conexionSocket = io()

conexionSocket.on("mensajeDesdeServidor", (data) => {
    console.log("Mensaje recibido del servidor:", data)
})