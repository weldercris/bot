// Monta a mensagem do Telegram a partir do payload da Automation do Jira.
// Formato:
//   🔄 Status atualizado
//
//   📌 Tarefa:
//   {summary}
//
//   🆔 ID:
//   {key}
//
//   📍 {from} → {to}
//   (👤 Responsável, se houver)
//
//   🔗 {url}
function montarMensagem({ issue, transition, url }) {
    // Só mostra o bloco do responsável quando o assignee vem preenchido.
    const responsavel = issue.assignee
        ? `\n\n👤 Responsável:\n${issue.assignee}`
        : "";

    // Alguns gatilhos do Jira não trazem o "from" (fica ""); nesse caso
    // mostramos só o status de destino em vez de "  → Destino".
    const transicao = transition.from
        ? `${transition.from} → ${transition.to}`
        : transition.to;

    // Evita imprimir "🔗 undefined" quando o payload não traz a URL.
    const link = url ? `\n\n🔗 ${url}` : "";

    return `🔄 Status atualizado

📌 Tarefa:
${issue.summary}

🆔 ID:
${issue.key}

📍 ${transicao}${responsavel}${link}`;
}

module.exports = { montarMensagem };
