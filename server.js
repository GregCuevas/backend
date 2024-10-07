const express = require("express");
const sendIndividualHandler = require("./api/send-individual").default; // Cargar el handler
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000; // Usar el puerto proporcionado por Railway

// Ruta para manejar el envío del formulario
app.post("/api/send-individual", sendIndividualHandler);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
