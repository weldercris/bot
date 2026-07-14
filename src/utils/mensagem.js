const { emojiDoStatus } = require("../config/status");

// Escapa os caracteres que o parse_mode HTML do Telegram interpreta,
// para que summary/responsável com "<", ">" ou "&" não quebrem a mensagem.
function escapeHtml(texto) {
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// Monta a mensagem (HTML) do Telegram a partir do payload da Automation do Jira.
// A hierarquia vem do negrito, não de rótulos, para uma leitura mais limpa:
//   {emoji} {origem → destino}   (negrito)
//
//   {KEY} — {summary}            (KEY em negrito)
//   👤 {responsável}             (se houver)
//
//   🔗 Abrir no Jira            (se houver url)
function montarMensagem({ issue, transition, url }) {
    const emoji = emojiDoStatus(transition.to);

    // Cabeçalho: "origem → destino" quando temos o "from"; só o destino quando
    // o gatilho do Jira não informa a origem.
    const titulo = transition.from
        ? `${escapeHtml(transition.from)} → ${escapeHtml(transition.to)}`
        : escapeHtml(transition.to);

    const linhas = [
        `${emoji} <b>${titulo}</b>`,
        "",
        `<b>${escapeHtml(issue.key)}</b> — ${escapeHtml(issue.summary)}`
    ];

    if (issue.assignee) {
        linhas.push(`👤 ${escapeHtml(issue.assignee)}`);
    }

    if (url) {
        linhas.push("", `🔗 <a href="${escapeHtml(url)}">Abrir no Jira</a>`);
    }

    return linhas.join("\n");
}

module.exports = { montarMensagem };
