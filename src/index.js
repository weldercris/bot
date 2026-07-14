const express = require("express");
const { port } = require("./config");
const jiraRoutes = require("./routes/jira");

const app = express();

app.use(express.json({ limit: "1mb" }));

// Health check (monitores de uptime / Render).
app.get("/", (_req, res) => res.json({ status: "ok" }));

app.use(jiraRoutes);

const server = app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}`);
});

// Encerramento gracioso (Render/containers enviam SIGTERM ao reiniciar).
for (const sinal of ["SIGTERM", "SIGINT"]) {
    process.on(sinal, () => {
        console.log(`${sinal} recebido, encerrando...`);
        server.close(() => process.exit(0));
    });
}
