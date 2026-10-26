const express = require("express");
const app = express();

app.get("/", (req, res) =>{
    res.send("ola mundo");
});

app.get("/usuarios", (req, res) =>{
    res.send(`buscar usuarios`);
});
app.post("/usuarios", (req, res) =>{
    res.send(`criar usuario`);
});
app.put("/usuarios", (req, res) =>{
    res.send(`editar usuarios`);
});
app.delete("/usuarios", (req, res) =>{
    res.send(`deletar usuarios`);
});

// use permite escutar todos os verbos de requisição
app.use((req, res) => {
    res.status(404).send("error 404: Rota nao encontrada")
});

app.listen(3000, ()=> {
    console.log("servidor on: http://localhost:3000");
});