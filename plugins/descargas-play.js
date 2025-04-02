const handler = async (m, { conn, args, command }) => { if (!['ytmp3', 'play'].includes(command)) return; if (args.length < 1) return m.reply(*[ ℹ️ ] Ingresa una URL de un audio de YouTube*);

let url = args[0];

if (!savetube.isUrl(url)) return m.reply("Por favor, ingresa un link válido de YouTube.");

try { await m.react('🎧'); // Emoji de audio

let res = await savetube.download(url);
if (!res.status) {
  await m.react('✖️');
  return m.reply(`*Error:* ${res.error}`);
}

let { title, download, id } = res.result;
let videoInfo = res.result; // Información adicional
let vistas = videoInfo.views || 'Desconocidas';
let timestamp = videoInfo.duration || 'Desconocida';
let ago = videoInfo.published || 'Fecha desconocida';

const infoMessage = `★ 📤 𝑨𝑺𝑻𝑹𝑶-𝑩𝑶𝑻 𝑷𝑳𝑨𝒀 📤 ★\n\n🚀 _Encontré esto:_ 「 ${title} 」\n*📤 Canal:* ${videoInfo.author?.name || 'Desconocido'}\n*✨ Vistas:* ${vistas}\n*⏱ Duración:* ${timestamp}\n*📅 Publicado:* ${ago}\n*🔗 Enlace:* ${url}`;

await m.reply(infoMessage);

await conn.sendMessage(m.chat, {
  audio: { url: download },
  mimetype: 'audio/mpeg',
  fileName: `${title}.mp3`
}, { quoted: m });

await m.react('✅');

} catch (e) { await m.react('✖️'); m.reply(*¡Fallo en la descarga!*); } };

handler.help = ['ytmp3 <url>', 'play <url>']; handler.command = ['ytmp3', 'play']; handler.customPrefix = /p|@|./i; handler.tags = ['dl'];

export default handler;

