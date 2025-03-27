let handler = async (m, { conn, isRowner }) => {
    let _muptime;
    let totalreg = Object.keys(global.db.data.users).length;
    let totalchats = Object.keys(global.db.data.chats).length;
    let pp = 'https://qu.ax/LJEVX.jpg'; // Usamos la URL de la imagen aquí

    if (process.send) {
        process.send('uptime');
        _muptime = await new Promise(resolve => {
            process.once('message', resolve);
            setTimeout(resolve, 1000);
        }) * 1000;
    }

    let muptime = clockString(_muptime);
    const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats);
    const groupsIn = chats.filter(([id]) => id.endsWith('@g.us'));
    const used = process.memoryUsage();
    let Astro = `╭─⬣「 *Estado De Bot Astro Bot* 」⬣\n`;
    Astro += `│ 👤 *Creador ∙* Astro Bot\n`;
    Astro += `│ 💎 *Grupos Unidos ∙* ${groupsIn.length}\n`;
    Astro += `│ 💨 *Chats Privados ∙* ${chats.length - groupsIn.length}\n`;
    ASTRO += `│ 🪙 *Total De Chats ∙* ${chats.length}\n`;
    Astro += `│ 💰 *Usuarios Registrados ∙* ${totalreg}\n`;
    Astro += `│ 🪄 *Grupos Registrados ∙* ${totalchats}\n`;
    Astro += `│ 💸 *Actividad ∙* ${muptime}\n`;
    Astro += `╰─⬣`;

    await conn.sendFile(m.chat, pp, 'nino.jpg', Sisked, Astro, null, rcanal);
}

handler.help = ['status'];
handler.tags = ['info'];
handler.command = /^(estado|info|estate|state|stado|stats)$/i;
export default handler;

function clockString(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    console.log({ ms, h, m, s });
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}