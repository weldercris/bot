require("dotenv").config();

const config = {
    telegramToken: process.env.TELEGRAM_TOKEN,
    chatId: process.env.CHAT_ID,
    // Opcional: em grupos com Tópicos, envia no tópico indicado. Vazio = General.
    messageThreadId: process.env.MESSAGE_THREAD_ID,
    port: process.env.PORT || 3000,
    // Opcional: se definido, o webhook exige este segredo (veja routes/jira.js).
    webhookSecret: process.env.JIRA_WEBHOOK_SECRET
};

// Valida o obrigatório no boot: melhor falhar aqui do que só descobrir que
// faltou o token quando a primeira issue mudar de status.
if (!config.telegramToken || !config.chatId) {
    console.error(
        "Faltam variáveis de ambiente: TELEGRAM_TOKEN e/ou CHAT_ID. " +
        "Configure o arquivo .env (veja .env.example)."
    );
    process.exit(1);
}

module.exports = config;
