import { Resend } from "resend";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Configuración de multer para manejar la subida de archivos
const storage = multer.memoryStorage(); // Almacena el archivo en memoria
const upload = multer({ storage }).single("cedulaFoto"); // Solo maneja la subida de un archivo con el campo "cedulaFoto"

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Usar multer para manejar la subida de archivos
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: "Error al subir la foto", err });
      }

      const {
        nombres,
        apellidos,
        cedula,
        telefono,
        email,
        direccion1,
        ciudad,
        estado,
        pais,
        afiliacion,
        comoSupiste,
      } = req.body;

      // Si hay una foto de cédula, convertirla a base64
      const cedulaFoto = req.file ? req.file.buffer.toString("base64") : null;

      // Crear el contenido del correo en HTML
      const htmlContent = `
        <p><strong>Nombre:</strong> ${nombres || ""} ${apellidos || ""}</p>
        <p><strong>Cédula:</strong> ${cedula || ""}</p>
        <p><strong>Teléfono:</strong> ${telefono || ""}</p>
        <p><strong>Email:</strong> ${email || ""}</p>
        <p><strong>Dirección:</strong> ${direccion1 || ""}, ${ciudad || ""}, ${
        estado || ""
      }, ${pais || ""}</p>
        <p><strong>Afiliación:</strong> ${afiliacion || ""}</p>
        <p><strong>¿Cómo supiste?:</strong> ${comoSupiste || ""}</p>
        ${
          cedulaFoto
            ? `<p><strong>Foto de la cédula:</strong></p><img src="data:image/jpeg;base64,${cedulaFoto}" alt="Foto de la cédula" />`
            : ""
        }
      `;

      try {
        // Envío del correo utilizando Resend
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: "onboarding@resend.dev",
          subject: `Nuevo mensaje de ${nombres || "socio-individual"}`,
          html: htmlContent,
        });

        res.status(200).json({ message: "Correo enviado exitosamente" });
      } catch (error) {
        console.error("Error al enviar el correo con Resend", error);
        res.status(500).json({ message: "Error al enviar el correo", error });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
