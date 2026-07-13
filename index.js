require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

const TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

async function enviarMensagem(texto) {
    await axios.post(
        `https://api.telegram.org/bot${TOKEN}/sendMessage`,
        {
            chat_id: CHAT_ID,
            text: texto
        }
    );
}

app.post("/jira", async (req, res) => {

    try {

        const issue = req.body.issue;

        const changelog = req.body.changelog;

        if (!changelog) {
            return res.sendStatus(200);
        }

        const status = changelog.items.find(
            x => x.field === "status"
        );

        if (!status) {
            return res.sendStatus(200);
        }

        const from = status.fromString;
        const to = status.toString;

        const key = issue.key;
        const summary = issue.fields.summary;

        let mensagem = null;

        if (from === "Fazendo" && to === "Testes") {

            mensagem =
`🧪 ${key}

${summary}

➡️ Fazendo → Testes`;

        }

        if (from === "Testes" && to === "Pronto para Deploy") {

            mensagem =
`📦 ${key}

${summary}

➡️ Testes → Pronto para Deploy`;

        }

        if (from === "Pronto para Deploy" && to === "Publicado") {

            mensagem =
`🚀 ${key}

${summary}

Publicado com sucesso 🎉`;

        }

        if (mensagem) {
            await enviarMensagem(mensagem);
        }

        res.sendStatus(200);

    } catch (e) {

        console.error(e);

        res.sendStatus(500);

    }

});

app.listen(process.env.PORT, () => {
    console.log("Servidor iniciado");
});