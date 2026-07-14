const { emojiDoStatus } = require("../config/status");

// Monta a mensagem do Telegram a partir do payload da Automation do Jira.
// Formato:
//   Item KEY: Summary mudou de status:
//
//   {emoji} {status de destino}
function montarMensagem({ issue, transition }) {
    const status = transition.to;
    const emoji = emojiDoStatus(status);

    return `Item ${issue.key}: ${issue.summary} mudou de status:

${emoji} ${status}`;
}

module.exports = { montarMensagem };
