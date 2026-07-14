const axios = require("axios");
const { telegramToken, chatId } = require("../config");

// Instância reutilizável com baseURL e timeout: evita travar a request caso
// o Telegram demore a responder.
const client = axios.create({
    baseURL: `https://api.telegram.org/bot${telegramToken}`,
    timeout: 10000
});

async function enviarMensagem(texto) {
    await client.post("/sendMessage", {
        chat_id: chatId,
        text: texto
    });
}

module.exports = { enviarMensagem };
