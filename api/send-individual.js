import { IncomingForm } from "formidable";
import { Resend } from "resend";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Exportar el handler para ser utilizado en `server.js`
export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = new IncomingForm();

    // Procesar el FormData (incluyendo archivos)
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error al procesar el archivo", err);
        return res
          .status(500)
          .json({ message: "Error al procesar el archivo" });
      }

      // Extraer los campos del formulario
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
      } = fields;

      // Extraer la ruta del archivo (foto de la cédula)
      const cedulaFoto = files.cedulaFoto ? files.cedulaFoto.filepath : null;

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
            ? `<p><strong>Foto de la cédula:</strong></p><img src="${cedulaFoto}" alt="Foto de la cédula" />`
            : ""
        }
      `;

      try {
        // Envío del correo utilizando Resend
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "coopebred.com",
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
