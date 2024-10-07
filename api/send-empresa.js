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
        tipoSocio,
        nombres,
        apellidos,
        cedulaIdentidad,
        telefono,
        email,
        direccionResidencia,
        municipio,
        provincia,
        razonSocial,
        rnc,
        registroMercantil,
        actividadEconomica,
        direccionEmpresa,
        telefonoEmpresa,
        emailEmpresa,
      } = fields;

      // Extraer la ruta del archivo (foto de la cédula)
      const fotoCedula = files.fotoCedula ? files.fotoCedula.filepath : null;

      // Crear el contenido del correo en HTML
      const htmlContent = `
        <p><strong>Tipo de Socio:</strong> ${tipoSocio || ""}</p>
        <p><strong>Nombre:</strong> ${nombres || ""} ${apellidos || ""}</p>
        <p><strong>Cédula de Identidad:</strong> ${cedulaIdentidad || ""}</p>
        <p><strong>Teléfono:</strong> ${telefono || ""}</p>
        <p><strong>Email:</strong> ${email || ""}</p>
        <p><strong>Dirección de Residencia:</strong> ${
          direccionResidencia || ""
        }, ${municipio || ""}, ${provincia || ""}</p>
        <p><strong>Razón Social:</strong> ${razonSocial || ""}</p>
        <p><strong>RNC:</strong> ${rnc || ""}</p>
        <p><strong>Registro Mercantil:</strong> ${registroMercantil || ""}</p>
        <p><strong>Actividad Económica:</strong> ${actividadEconomica || ""}</p>
        <p><strong>Dirección de la Empresa:</strong> ${
          direccionEmpresa || ""
        }</p>
        <p><strong>Teléfono de la Empresa:</strong> ${telefonoEmpresa || ""}</p>
        <p><strong>Email de la Empresa:</strong> ${emailEmpresa || ""}</p>
        ${
          fotoCedula
            ? `<p><strong>Foto de la cédula:</strong></p><img src="${fotoCedula}" alt="Foto de la cédula" />`
            : ""
        }
      `;

      try {
        // Envío del correo utilizando Resend
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: "onboarding@resend.dev",
          subject: `Nuevo registro de empresa: ${razonSocial || "Empresa"}`,
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
