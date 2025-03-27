// =======================
// Función para Sugerir Comandos
// =======================
const sugerirHandler = async (m, { conn, text, usedPrefix }) => {
  if (!text) {
    return conn.reply(m.chat, `❗️ Por favor, ingrese su sugerencia en el siguiente formato:\n\ncomando | descripción\n\nEjemplo:\n!saludo | Envía un mensaje de bienvenida al usuario.`, m)
  }
  let parts = text.split("|").map(p => p.trim())
  if (parts.length < 2) {
    return conn.reply(m.chat, `❗️ Formato incorrecto. Usa:\ncomando | descripción`, m)
  }
  let [nuevoComando, descripcion] = parts
  if (nuevoComando.length < 3) return conn.reply(m.chat, `❗️ El nombre del comando es muy corto.`, m)
  if (descripcion.length < 10) return conn.reply(m.chat, `❗️ La descripción debe tener al menos 10 caracteres.`, m)
  if (descripcion.length > 1000) return conn.reply(m.chat, `❗️ La descripción debe tener máximo 1000 caracteres.`, m)

  let teks = `*✳️ S U G E R E N C I A   D E   C O M A N D O S ✳️*\n\n📌 Comando propuesto:\n• ${nuevoComando}\n\n📋 Descripción:\n• ${descripcion}\n\n👤 Usuario:\n• ${m.pushName || 'Anónimo'}\n• Número: wa.me/${m.sender.split`@`[0]}\n\n_Para aprobar o rechazar la sugerencia, el staff debe responder a este mensaje con .aceptar o .noaceptar seguido de una razón (opcional)._`

  // Envía la sugerencia tanto al creador como al grupo de staff.
  await conn.reply('50488198573@s.whatsapp.net', teks, m, { mentions: conn.parseMention(teks) })
  await conn.reply('120363416199047560@g.us', teks, m, { mentions: conn.parseMention(teks) })

  conn.reply(m.chat, `✅ Tu sugerencia se ha enviado al staff. Recibirás una notificación cuando se revise.`, m)
}
sugerirHandler.help = ['sugerir']
sugerirHandler.tags = ['info']
sugerirHandler.command = ['sugerir', 'suggest']


// =======================
// Función para Aceptar la Sugerencia
// =======================
const aceptarHandler = async (m, { conn, text, usedPrefix, command }) => {
  // Verifica que se esté usando en el grupo del staff y que el usuario tenga permisos
  if (!m.isGroup) return m.reply(`Este comando solo se puede usar en el grupo del staff.`)
  if (!global.staffs || !global.staffs.includes(m.sender)) return m.reply(`❌ No tienes permisos para usar este comando.`)

  if (!m.quoted) return m.reply(`❗️ Responde al mensaje de sugerencia para aprobarlo.`)
  let razon = text.trim() || 'Sin razón especificada.'

  // Se asume que en la sugerencia se incluyó la línea "Número: wa.me/XXXXXXXXXXX"
  let regex = /wa\.me\/(\d+)/i
  let match = m.quoted.text.match(regex)
  if (!match) {
    return m.reply(`❗️ No se pudo extraer el número del usuario de la sugerencia.`)
  }
  let userId = match[1] + "@s.whatsapp.net"

  // Notifica al usuario que su sugerencia fue aceptada
  await conn.reply(userId, `✅ *¡Tu sugerencia fue ACEPTADA!*\n\n_El staff ha revisado tu propuesta y la ha aprobado._\nRazón: ${razon}`, m)
  m.reply(`✅ Sugerencia aceptada y notificada al usuario.`)
}
aceptarHandler.help = ['aceptar']
aceptarHandler.tags = ['staff']
aceptarHandler.command = ['aceptar']


// =======================
// Función para Rechazar la Sugerencia
// =======================
const noAceptarHandler = async (m, { conn, text, usedPrefix, command }) => {
  // Verifica que se esté usando en el grupo del staff y que el usuario tenga permisos
  if (!m.isGroup) return m.reply(`Este comando solo se puede usar en el grupo del staff.`)
  if (!global.staffs || !global.staffs.includes(m.sender)) return m.reply(`❌ No tienes permisos para usar este comando.`)

  if (!m.quoted) return m.reply(`❗️ Responde al mensaje de sugerencia para rechazarlo.`)
  let razon = text.trim() || 'Sin razón especificada.'

  let regex = /wa\.me\/(\d+)/i
  let match = m.quoted.text.match(regex)
  if (!match) {
    return m.reply(`❗️ No se pudo extraer el número del usuario de la sugerencia.`)
  }
  let userId = match[1] + "@s.whatsapp.net"

  // Notifica al usuario que su sugerencia fue rechazada
  await conn.reply(userId, `❌ *Tu sugerencia fue RECHAZADA*\n\n_El staff ha revisado tu propuesta y decidió no implementarla._\nRazón: ${razon}`, m)
  m.reply(`❌ Sugerencia rechazada y notificada al usuario.`)
}
noAceptarHandler.help = ['noaceptar']
noAceptarHandler.tags = ['staff']
noAceptarHandler.command = ['noaceptar']


// =======================
// Función Principal para Dirigir los Comandos
// =======================
const handler = async (m, { conn, text, usedPrefix, command }) => {
  switch (command) {
    case 'sugerir':
    case 'suggest':
      await sugerirHandler(m, { conn, text, usedPrefix })
      break
    case 'aceptar':
      await aceptarHandler(m, { conn, text, usedPrefix, command })
      break
    case 'noaceptar':
      await noAceptarHandler(m, { conn, text, usedPrefix, command })
      break
    default:
      m.reply(`Comando no reconocido.`)
  }
}

// Asigna propiedades comunes al handler principal
handler.help = [...sugerirHandler.help, ...aceptarHandler.help, ...noAceptarHandler.help]
handler.tags = ['sugerencias', 'staff']

// Exporta la función principal para que el bot la registre y gestione según el comando invocado
export default handler;