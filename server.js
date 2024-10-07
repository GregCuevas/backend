import express from "express";
import sendIndividualHandler from "./api/send-individual.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Ruta para manejar el envío del formulario
app.post("/api/send-individual", sendIndividualHandler);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
