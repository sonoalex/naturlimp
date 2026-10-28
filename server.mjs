import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resend } from 'resend';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, 'dist');
const PORT = parseInt(process.env.PORT || '8080', 10);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

async function handleContact(req, res) {
  try {
    let body = '';
    for await (const chunk of req) {
      body += chunk;
      if (body.length > 1e6) {
        res.writeHead(413, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Payload too large' }));
      }
    }

    const data = JSON.parse(body || '{}');
    const { name, phone, service, zone, message, _gotcha } = data;

    // Honeypot anti-spam: drop silently if bot filled hidden field
    if (_gotcha) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true }));
    }

    if (!name || !phone || !service) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Por favor, rellena todos los campos obligatorios.' }));
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL || 'elbalcodigital@gmail.com';
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'NaturLimp Web <notificaciones@naturlimp.com>';
    const templateId = process.env.RESEND_TEMPLATE_ID || 'd6708ff2-18f6-4d14-a825-640e749cda13';

    const cleanPhoneDigits = String(phone).replace(/\D/g, '');
    const waPhone = cleanPhoneDigits.length === 9 ? `34${cleanPhoneDigits}` : cleanPhoneDigits;
    const waText = encodeURIComponent(
      `Hola ${name}, nos ponemos en contacto de NaturLimp respecto a tu solicitud de presupuesto para ${service}.`
    );
    const waUrl = `https://wa.me/${waPhone}?text=${waText}`;
    const phoneUrl = `tel:${cleanPhoneDigits || phone}`;

    if (!resendApiKey) {
      console.warn('⚠️ RESEND_API_KEY no configurada. Simulación de envío:', { name, phone, service, zone, message });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        success: true,
        mock: true,
        message: 'Solicitud recibida (modo simulación, falta configurar RESEND_API_KEY).'
      }));
    }

    const resend = new Resend(resendApiKey);

    const { data: emailData, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `🟢 Nueva solicitud de presupuesto: ${name} (${service})`,
      template: {
        id: templateId,
        variables: {
          NAME: String(name),
          PHONE: String(phone),
          SERVICE: String(service),
          ZONE: String(zone || 'Tarragona y alrededores'),
          MESSAGE: String(message || 'Sin comentarios adicionales'),
          PHONE_URL: phoneUrl,
          WA_URL: waUrl,
        },
      },
    });

    if (error) {
      console.error('Error enviando con plantilla de Resend:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: error.message || 'Error al enviar el correo.' }));
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true, id: emailData?.id }));
  } catch (err) {
    console.error('Error procesando /api/contact:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Error interno del servidor.' }));
  }
}

function serveStatic(req, res) {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);

  // Handle redirects if any
  const redirects = {
    '/blog': '/',
    '/ofertas': '/servicios/',
    '/declaracion-de-accesibilidad': '/aviso-legal/',
    '/nuestros-servicios-1': '/servicios/',
    '/galeria-de-fotos': '/servicios/',
    '/promociones': '/servicios/',
  };

  const cleanPath = urlPath.replace(/\/$/, '') || '/';
  if (redirects[cleanPath]) {
    res.writeHead(301, { Location: redirects[cleanPath] });
    return res.end();
  }

  let filePath = path.join(DIST_DIR, urlPath);

  // If path is a directory or lacks extension, try index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  } else if (!fs.existsSync(filePath)) {
    if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    }
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const isImmutableAsset = urlPath.startsWith('/_assets/');

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': isImmutableAsset ? 'public, max-age=31536000, immutable' : 'public, max-age=3600',
    });
    return fs.createReadStream(filePath).pipe(res);
  }

  // 404 handler
  const notFoundPath = path.join(DIST_DIR, '404.html');
  if (fs.existsSync(notFoundPath)) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    return fs.createReadStream(notFoundPath).pipe(res);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
}

const server = http.createServer((req, res) => {
  // CORS & Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  if (req.method === 'POST' && req.url === '/api/contact') {
    return handleContact(req, res);
  }

  if (req.method === 'GET' || req.method === 'HEAD') {
    return serveStatic(req, res);
  }

  res.writeHead(405, { 'Content-Type': 'text/plain' });
  res.end('Method Not Allowed');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 NaturLimp server running on http://0.0.0.0:${PORT}`);
});
