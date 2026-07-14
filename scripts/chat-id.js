// Utilitário: descobre o chat_id de conversas/grupos onde o bot está.
// Uso: npm run chat-id
// Captura também o evento "my_chat_member" (bot adicionado/removido do grupo),
// que o Telegram envia mesmo com a privacy mode ligada — então basta adicionar
// o bot ao grupo e rodar este script.
require("dotenv").config();
const axios = require("axios");

const TOKEN = process.env.TELEGRAM_TOKEN;

if (!TOKEN) {
    console.error("Faltando TELEGRAM_TOKEN no .env");
    process.exit(1);
}

(async () => {
    const { data } = await axios.get(
        `https://api.telegram.org/bot${TOKEN}/getUpdates`
    );

    if (!data.ok) {
        console.error("Erro na API do Telegram:", data);
        process.exit(1);
    }

    const updates = data.result || [];
    const chats = new Map();

    for (const u of updates) {
        const evento =
            u.message ||
            u.edited_message ||
            u.channel_post ||
            u.my_chat_member;
        const chat = evento?.chat;
        if (chat) {
            chats.set(chat.id, chat);
        }
    }

    if (chats.size === 0) {
        console.log("Nenhum chat encontrado.\n");
        console.log("Faça isto e rode 'npm run chat-id' de novo:");
        console.log("  1. Adicione o bot ao grupo (ou remova e readicione)");
        console.log("  2. Ou envie no grupo uma mensagem mencionando o bot: @seu_bot oi");
        console.log("\nSe continuar vazio: BotFather -> /setprivacy -> Disable,");
        console.log("depois REMOVA e READICIONE o bot ao grupo e tente novamente.");
        return;
    }

    console.log("Chats encontrados:\n");
    for (const chat of chats.values()) {
        const nome =
            chat.title ||
            [chat.first_name, chat.last_name].filter(Boolean).join(" ") ||
            chat.username ||
            "(sem nome)";
        console.log(`  CHAT_ID=${chat.id}   [${chat.type}]  ${nome}`);
    }
    console.log("\nUse o id do grupo (negativo, geralmente -100...) como CHAT_ID.");
})().catch((err) => {
    console.error("Falha ao consultar getUpdates:", err.response?.data || err.message);
    process.exit(1);
});
