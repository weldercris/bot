const { TRANSICOES, DEFAULT } = require("../config/transitions");

// Monta a mensagem do Telegram a partir do payload da Automation do Jira.
// Se a transição não estiver mapeada, usa o layout padrão (DEFAULT).
function montarMensagem({ issue, transition, url }) {
    const config = TRANSICOES[`${transition.from}|${transition.to}`] || DEFAULT;

    return `${config.emoji} ${issue.key}

${issue.summary}

${config.rodape(transition)}

🔗 ${url}`;
}

module.exports = { montarMensagem };
