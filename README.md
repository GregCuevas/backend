# Backend - Sistema de Formularios de Afiliación

## 📋 Descripción

Este backend está diseñado para manejar formularios de afiliación para **Cooperativa Bred** (coopebred.com). El sistema procesa dos tipos de formularios:

1. **Formulario Individual**: Para afiliación de personas individuales
2. **Formulario Empresa**: Para afiliación de empresas/organizaciones

Ambos formularios capturan información personal/empresarial y envían los datos por correo electrónico usando el servicio **Resend**.

## 🚀 Características

- **API REST** con Express.js
- **Envío de correos** automático con Resend
- **Subida de archivos** (fotos de cédula) con Multer
- **CORS configurado** para dominio específico
- **Variables de entorno** para configuración segura

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Resend** - Servicio de envío de correos
- **Multer** - Middleware para manejo de archivos
- **CORS** - Middleware para Cross-Origin Resource Sharing
- **dotenv** - Gestión de variables de entorno

## 📦 Instalación

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm o yarn
- Cuenta en [Resend](https://resend.com) para API key

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear un archivo `.env` en la raíz del proyecto:
   ```env
   PORT=3000
   RESEND_API_KEY=tu_api_key_de_resend
   ```

4. **Iniciar el servidor**
   ```bash
   npm start
   ```

   El servidor estará disponible en `http://localhost:3000`

## 🔧 Configuración

### Variables de Entorno

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `PORT` | Puerto del servidor (default: 3000) | No |
| `RESEND_API_KEY` | API key de Resend para envío de correos | Sí |

### CORS

El servidor está configurado para aceptar solicitudes solo desde `https://www.coopebred.com`. Si necesitas cambiar el dominio permitido, modifica la configuración en `server.js`:

```javascript
app.use(
  cors({
    origin: "https://www.coopebred.com", // Cambiar por tu dominio
    methods: "POST",
    allowedHeaders: "Content-Type",
  })
);
```

## 📡 API Endpoints

### 1. Formulario Individual
**POST** `/api/send-individual`

Procesa formularios de afiliación para personas individuales.

**Campos del formulario:**
- `nombres` (string) - Nombres del solicitante
- `apellidos` (string) - Apellidos del solicitante
- `cedula` (string) - Número de cédula
- `telefono` (string) - Número de teléfono
- `email` (string) - Correo electrónico
- `direccion1` (string) - Dirección de residencia
- `ciudad` (string) - Ciudad
- `estado` (string) - Estado/Provincia
- `pais` (string) - País
- `afiliacion` (string) - Tipo de afiliación
- `comoSupiste` (string) - Cómo se enteró de la cooperativa
- `cedulaFoto` (file) - Foto de la cédula (opcional)

**Respuesta de éxito:**
```json
{
  "message": "Correo enviado exitosamente"
}
```

### 2. Formulario Empresa
**POST** `/api/send-empresa`

Procesa formularios de afiliación para empresas.

**Campos del formulario:**
- `tipoSocio` (string) - Tipo de socio
- `nombres` (string) - Nombres del gerente
- `apellidos` (string) - Apellidos del gerente
- `cedulaIdentidad` (string) - Cédula del gerente
- `telefono` (string) - Teléfono del gerente
- `email` (string) - Email del gerente
- `direccionResidencia` (string) - Dirección de residencia
- `provincia` (string) - Provincia
- `municipio` (string) - Municipio
- `razonSocial` (string) - Razón social de la empresa
- `rnc` (string) - RNC de la empresa
- `registroMercantil` (string) - Registro mercantil
- `actividadEconomica` (string) - Actividad económica
- `direccionEmpresa` (string) - Dirección de la empresa
- `telefonoEmpresa` (string) - Teléfono de la empresa
- `emailEmpresa` (string) - Email de la empresa
- `fotoCedula` (file) - Foto de la cédula (opcional)

**Respuesta de éxito:**
```json
{
  "message": "Correo enviado exitosamente"
}
```

## 📧 Configuración de Correos

### Resend Setup

1. Crear cuenta en [Resend](https://resend.com)
2. Obtener API key desde el dashboard
3. Configurar dominio verificado (opcional pero recomendado)

### Destinatarios de Correos

Actualmente los correos se envían a `onboarding@resend.dev`. Para cambiar los destinatarios, modifica los archivos:
- `api/send-individual.js` (línea 47)
- `api/send-empresa.js` (línea 67)

```javascript
await resend.emails.send({
  from: "tu-dominio@resend.dev",
  to: "destinatario@ejemplo.com", // Cambiar aquí
  subject: "Asunto del correo",
  html: htmlContent,
});
```

## 🚨 Manejo de Errores

### Errores Comunes

1. **Error 500 - Subida de archivo**
   - Verificar que el archivo no exceda el límite
   - Verificar formato de imagen válido

2. **Error 500 - Envío de correo**
   - Verificar API key de Resend
   - Verificar conexión a internet
   - Verificar configuración de dominio en Resend

3. **Error 405 - Método no permitido**
   - Solo se aceptan solicitudes POST

## 🔒 Seguridad

- **CORS configurado** para dominio específico
- **Variables de entorno** para datos sensibles
- **Validación de archivos** con Multer
- **Límites de tamaño** para archivos subidos

## 📁 Estructura del Proyecto

```
backend/
├── api/
│   ├── send-individual.js    # Handler para formulario individual
│   └── send-empresa.js       # Handler para formulario empresa
├── server.js                 # Servidor principal
├── package.json              # Dependencias y scripts
├── .env                      # Variables de entorno (crear)
└── README.md                 # Este archivo
```

## 🧪 Testing

Para probar los endpoints, puedes usar herramientas como:
- **Postman**
- **cURL**
- **Thunder Client** (VS Code extension)

### Ejemplo con cURL

```bash
# Formulario Individual
curl -X POST http://localhost:3000/api/send-individual \
  -F "nombres=Juan" \
  -F "apellidos=Pérez" \
  -F "cedula=123456789" \
  -F "telefono=8091234567" \
  -F "email=juan@ejemplo.com"

# Formulario Empresa
curl -X POST http://localhost:3000/api/send-empresa \
  -F "razonSocial=Mi Empresa SRL" \
  -F "rnc=123456789" \
  -F "nombres=María" \
  -F "apellidos=González"
```

## 🚀 Despliegue

### Opciones de Despliegue

1. **Vercel** - Recomendado para proyectos Node.js
2. **Railway** - Fácil despliegue con variables de entorno
3. **Heroku** - Plataforma establecida
4. **DigitalOcean** - VPS personalizado

### Variables de Entorno en Producción

Asegúrate de configurar las variables de entorno en tu plataforma de despliegue:
- `RESEND_API_KEY`
- `PORT` (opcional, la plataforma suele asignarlo automáticamente)

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto:
- Revisar la documentación de [Resend](https://resend.com/docs)
- Consultar la documentación de [Express.js](https://expressjs.com/)
- Abrir un issue en el repositorio

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `package.json` para más detalles.

---

**Desarrollado para Cooperativa Bred** 🏦 