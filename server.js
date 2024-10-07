import express from "express";
import cors from "cors";
import sendIndividualHandler from "./api/send-individual.js";
import sendEmpresaHandler from "./api/send-empresa.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar CORS para permitir solicitudes desde cualquier origen
app.use(
  cors({
    origin: "https://www.coopebred.com", // Reemplaza con tu dominio permitido
    methods: "POST",
    allowedHeaders: "Content-Type",
  })
);

// Ruta para manejar el envío del formulario
app.post("/api/send-individual", sendIndividualHandler);
app.post("/api/send-empresa", sendEmpresaHandler);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
