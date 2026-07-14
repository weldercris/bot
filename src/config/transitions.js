// Mapa de transições de status -> notificação.
// Chave: "De|Para". Para adicionar uma nova notificação, basta incluir uma linha.
//   - emoji:  ícone que abre a mensagem
//   - rodape: função que recebe { from, to } e devolve a última linha antes do link
const TRANSICOES = {
    "Fazendo|Testes": {
        emoji: "🧪",
        rodape: ({ from, to }) => `➡️ ${from} → ${to}`
    },
    "Testes|Pronto para Deploy": {
        emoji: "📦",
        rodape: ({ from, to }) => `➡️ ${from} → ${to}`
    },
    "Pronto para Deploy|Publicado": {
        emoji: "🚀",
        rodape: () => "🎉 Publicado!"
    },
    "Pendente deploy|Concluído": {
        emoji: "✅",
        rodape: () => "🎉 Concluído!"
    }
};

// Usada quando a transição não está mapeada acima. Como o filtro de QUAL
// transição dispara já é feito na Automation do Jira, por padrão notificamos
// qualquer transição recebida — em vez de descartar em silêncio.
const DEFAULT = {
    emoji: "🔔",
    rodape: ({ from, to }) => `➡️ ${from} → ${to}`
};

module.exports = { TRANSICOES, DEFAULT };
