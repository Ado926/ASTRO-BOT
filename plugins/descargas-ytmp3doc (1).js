import fetch from "node-fetch";

// Función para manejar reintentos de solicitudes const fetchWithRetries = async (url, maxRetries = 2) => { for (let attempt = 0; attempt <= maxRetries; attempt++) { try { const response = await fetch(url); const data = await response.json(); if (data?.status === 200 && data?.result?.download?.url) return data.result; } catch (error) { console.error(Error en el intento ${attempt + 1}:, error.message); } } throw new Error("No se pudo obtener una respuesta válida después de varios intentos."); };

// Reconstruir URL desde base64 const reconstructUrl = () => { const parts = ["aHR0cHM6Ly9hcGkudnJlZGVuLndlYi5pZC9hcGkveXRtcDM="]; return Buffer.from(parts.join(""), "base64").toString("utf-8"); };

// Handler principal let handler = async (m, { conn, text, usedPrefix }) => { if (!text || !/^https?://(www.)?(youtube.com/watch?v=|youtu.be/)/.test(text)) { return conn.sendMessage(m.chat, { text: *Por favor ingresa un enlace válido de YouTube para descargar la música.*\n\n *Ejemplo:* ${usedPrefix}ytmp3doc https://www.youtube.com/watch?v=dQw4w9WgXcQ, }); }

const key = await conn.sendMessage(m.chat, { text: ⌘─≪ *🚅 ASTRO-BOT 🚅* ≫─⌘\n\n🔎 *Procesando, un momento...*, });

try { const apiUrl = ${reconstructUrl()}?url=${encodeURIComponent(text)}; const result = await fetchWithRetries(apiUrl); if (!result) throw new Error("No se pudo obtener la información del video.");

const { metadata, download } = result;
if (!metadata || !download?.url) throw new Error("Error en la estructura de la respuesta de la API.");

const { title, duration, views, author, url: videoUrl } = metadata;
const downloadUrl = download.url;

const description = `⌘ 💙 ASTRO 💙 ⌘\n\n🎵 *Título:* ${title}\n⏳ *Duración:* ${duration.timestamp || "Desconocida"}\n👁️ *Vistas:* ${views?.toLocaleString() || "Desconocidas"}\n⭐ *Autor:* ${author?.name || "Desconocido"}\n🔗 *Enlace del video:* ${videoUrl}\n\n📶 *Tu archivo está siendo enviado, espera un momento...*`;

await conn.sendMessage(m.chat, { text: description, edit: key });
await conn.sendMessage(
  m.chat,
  {
    document: { url: downloadUrl },
    mimetype: "audio/mpeg",
    fileName: `${title}.mp3`,
    caption: `🎶 *Aquí tienes tu pedido ✔️*`,
  },
  { quoted: m }
);

} catch (error) { console.error("Error al procesar la solicitud:", error); await conn.sendMessage(m.chat, { text: ❌ *Ocurrió un error al intentar procesar tu solicitud:* ${error.message || "Error desconocido"}, edit: key, }); } };

handler.help = ['ytmp3doc >Link<']; handler.tags = ['downloader']; handler.command = ['ytmp3doc'];

export default handler;

