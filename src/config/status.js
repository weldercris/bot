// Emoji por status de destino da issue. A busca ignora acentos e maiúsculas,
// então "Concluído", "concluido" e "CONCLUÍDO" caem no mesmo item.
// Para mudar/adicionar um emoji, basta editar o mapa abaixo.
const EMOJI_POR_STATUS = {
    "em testes": "🧪",
    "testes": "🧪",
    "pendente staging": "🚧",
    "pronto para deploy": "✅",
    "pendente deploy": "📦",
    "publicado": "🙏🏻",
    "concluido": "🎉"
};

// Usado quando o status não está no mapa acima.
const EMOJI_DEFAULT = "🔔";

function normalizar(texto) {
    return (texto || "")
        .normalize("NFD")                  // separa os acentos das letras
        .replace(/[̀-ͯ]/g, "")   // remove os acentos
        .trim()
        .toLowerCase();
}

function emojiDoStatus(status) {
    return EMOJI_POR_STATUS[normalizar(status)] || EMOJI_DEFAULT;
}

module.exports = { emojiDoStatus };
