const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("../frontend"));

//SCRIPTS:
const loginScript = require("./scripts/login")
const odsScript = require("./scripts/ods") 
const registerScript = require("./scripts/register")



//POSTS:
app.post("/login", loginScript)
app.post("/ods", odsScript.response)
app.post("/sugestions", odsScript.sugest)
app.post("/register", registerScript)

app.get("/", (req, res) => {
    res.send("Servidor iniciado!");
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
});