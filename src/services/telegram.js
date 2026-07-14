const axios = require("axios");
const { telegramToken, chatId, messageThreadId } = require("../config");

// Instância reutilizável. Timeout generoso porque o envio roda em background
// (o Jira já recebeu 200), então uma rede de saída lenta não prejudica ninguém.
const client = axios.create({
    baseURL: `https://api.telegram.org/bot${telegramToken}`,
    timeout: 20000
});

// Envia a mensagem, repetindo em falhas de rede/timeout.
// Erros de resposta da API (4xx, ex.: "chat not found") NÃO são repetidos,
// pois retry não resolve — são relançados na hora.
async function enviarMensagem(texto, tentativas = 3) {
    // parse_mode HTML habilita negrito/link na mensagem (ver utils/mensagem.js);
    // disable_web_page_preview evita o card gigante de preview do link do Jira.
    const payload = {
        chat_id: chatId,
        text: texto,
        parse_mode: "HTML",
        disable_web_page_preview: true
    };
    // Em grupos com Tópicos ativados, message_thread_id direciona a mensagem
    // para um tópico específico. Sem ele, cai no tópico "General".
    if (messageThreadId) {
        payload.message_thread_id = Number(messageThreadId);
    }

    for (let i = 1; i <= tentativas; i++) {
        try {
            await client.post("/sendMessage", payload);
            return;
        } catch (err) {
            if (err.response || i === tentativas) {
                throw err;
            }
            console.warn(`Telegram tentativa ${i} falhou (${err.message}); repetindo...`);
            await new Promise((resolve) => setTimeout(resolve, 1000 * i));
        }
    }
}

module.exports = { enviarMensagem };
