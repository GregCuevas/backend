import { Resend } from "resend";
import multer from "multer";
import dotenv from "dotenv";

// Cargar las variables de entorno
dotenv.config();

// Configurar multer para manejar la subida de archivos
const storage = multer.memoryStorage(); // Guardar los archivos en memoria para manipularlos como buffers
const upload = multer({ storage }).single("fotoCedula");

// Crear una instancia de Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Handler para manejar el envío del formulario
export default async function handler(req, res) {
  if (req.method === "POST") {
    // Usar multer para manejar la subida de archivos
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: "Error al subir la foto", err });
      }

      const {
        tipoSocio,
        nombres,
        apellidos,
        cedulaIdentidad,
        telefono,
        email,
        direccionResidencia,
        provincia,
        municipio,
        razonSocial,
        rnc,
        registroMercantil,
        actividadEconomica,
        direccionEmpresa,
        telefonoEmpresa,
        emailEmpresa,
      } = req.body;

      // Si hay una foto de cédula, convertirla a base64
      const cedulaFoto = req.file ? req.file.buffer.toString("base64") : null;

      // Construcción del contenido del correo
      const htmlContent = `
        <p><strong>Tipo Socio:</strong> ${tipoSocio || ""}</p>
        <p><strong>Nombre del gerente:</strong> ${nombres || ""} ${
        apellidos || ""
      }</p>
        <p><strong>Cédula:</strong> ${cedulaIdentidad || ""}</p>
        <p><strong>Teléfono:</strong> ${telefono || ""}</p>
        <p><strong>Email:</strong> ${email || ""}</p>
        <p><strong>Dirección Residencia:</strong> ${
          direccionResidencia || ""
        }</p>
        <p><strong>Provincia:</strong> ${provincia || ""}</p>
        <p><strong>Municipio:</strong> ${municipio || ""}</p>
        <p><strong>Razón social:</strong> ${razonSocial || ""}</p>
        <p><strong>RNC:</strong> ${rnc || ""}</p>
        <p><strong>Registro Mercantil:</strong> ${registroMercantil || ""}</p>
        <p><strong>Actividad Económica:</strong> ${actividadEconomica || ""}</p>
        <p><strong>Dirección de la Empresa:</strong> ${
          direccionEmpresa || ""
        }</p>
        <p><strong>Teléfono de la Empresa:</strong> ${telefonoEmpresa || ""}</p>
        <p><strong>Email de la Empresa:</strong> ${emailEmpresa || ""}</p>
        ${
          cedulaFoto
            ? `<p><strong>Foto de la cédula:</strong></p><img src="data:image/jpeg;base64,${cedulaFoto}" alt="Foto de la cédula" />`
            : ""
        }
      `;

      try {
        // Enviar correo usando Resend
        await resend.emails.send({
          from: "onboarding@resend.dev", // Puedes cambiar el remitente
          to: "onboarding@resend.dev", // Cambiar al correo destino real
          subject: `Nuevo mensaje de ${razonSocial || "socio-empresa"}`,
          html: htmlContent,
        });

        // Respuesta de éxito
        return res.status(200).json({ message: "Correo enviado exitosamente" });
      } catch (error) {
        console.error("Error al enviar correo", error);
        return res
          .status(500)
          .json({ message: "Error al enviar el correo", error });
      }
    });
  } else {
    // Si el método no es POST
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: "Método no permitido" });
  }
}
