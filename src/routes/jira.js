const { Router } = require("express");
const { webhookSecret } = require("../config");
const { montarMensagem } = require("../utils/mensagem");
const { enviarMensagem } = require("../services/telegram");

const router = Router();

router.post("/jira", async (req, res) => {
    // Segurança opcional: se JIRA_WEBHOOK_SECRET estiver definido, o Jira
    // precisa enviar o mesmo valor no header "x-webhook-secret" (ou ?secret=).
    if (webhookSecret) {
        const enviado = req.get("x-webhook-secret") || req.query.secret;
        if (enviado !== webhookSecret) {
            return res.sendStatus(401);
        }
    }

    try {
        const { issue, transition, url } = req.body || {};

        // Payload incompleto: reconhece (200) e ignora, para o Jira não reenviar.
        if (!issue?.key || !transition?.to) {
            console.warn("Payload sem issue.key/transition.to:", JSON.stringify(req.body));
            return res.sendStatus(200);
        }

        console.log(`Transição recebida: ${issue.key} "${transition.from}" → "${transition.to}"`);

        const mensagem = montarMensagem({ issue, transition, url });

        // Responde ao Jira imediatamente. Uma falha no Telegram é logada, mas
        // NÃO vira 500 — um 500 faria o Jira reenviar o webhook e duplicar a
        // notificação assim que o Telegram voltasse.
        res.sendStatus(200);

        if (!mensagem) {
            console.log(`Sem notificação para "${transition.from}" → "${transition.to}" (transição fora do mapa).`);
            return;
        }

        try {
            await enviarMensagem(mensagem);
            console.log(`Mensagem enviada ao Telegram para ${issue.key}.`);
        } catch (err) {
            // err.response.data traz o erro da API do Telegram (ex.: chat not found).
            console.error("Falha ao enviar ao Telegram:", err.response?.data || err.message);
        }
    } catch (e) {
        console.error("Erro ao processar webhook do Jira:", e);
        if (!res.headersSent) {
            res.sendStatus(500);
        }
    }
});

module.exports = router;
