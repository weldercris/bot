const { TRANSICOES } = require("../config/transitions");

// Monta a mensagem do Telegram a partir do payload da Automation do Jira.
// Retorna null quando a transição não deve gerar notificação.
function montarMensagem({ issue, transition, url }) {
    const config = TRANSICOES[`${transition.from}|${transition.to}`];
    if (!config) {
        return null;
    }

    return `${config.emoji} ${issue.key}

${issue.summary}

${config.rodape(transition)}

🔗 ${url}`;
}

module.exports = { montarMensagem };
