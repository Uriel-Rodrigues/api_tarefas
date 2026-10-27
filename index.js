const express = require("express");
const executarSQL = require("./services");
const app = express();

app.use(express.json());

app.get("/", (req, res) =>{
    res.send("ola mundo");
});

app.get("/usuarios", async (req, res) => {
    try {
        const linhas = await executarSQL("SELECT * FROM usuarios;");
        res.json(linhas.rows);
    } catch (error) {
        res.json({
            mensagem: error.message
        })
    }
});

app.post("/usuarios", async (req, res) =>{
    try {
        const {nome, email, senha} = req.body
        const emailExist = await executarSQL(`SELECT * FROM usuarios WHERE email='${email}'`);
        
        if(emailExist.rowCount > 0){
            req.json({
                tipo:"warning",
                mensagem: "emailja cadastrado"
            });
            return
        }

        const query = await executarSQL(`INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *;`,[nome, email, senha]);

        if(query.rowCount > 0) {
            res.json({
                tipo:"success",
                mensagem: "registro criado com sucesso"
            })
        } else{
            res.json({
                tipo:"warning",
                mensagem:"falha ao criar registro"
            })
        }

        res.json(query.rows);
    } catch (error) {
        res.json({
            mensagem: error.message
        })
    }
});


app.put("/usuarios/:id", async (req, res) =>{

    try {
        const {nome, email, senha} = req.body
        const {id} = req.params

        const query = await executarSQL(`UPDATE usuarios SET nome=$1, email=$2, senha=$3 WHERE id=${id} RETURNING *;`,[nome, email, senha]);

            if(query.rowCount > 0) {
                res.json({
                    tipo:"success",
                    mensagem: "registro atualizado com sucesso"
                })
            } else{
                res.json({
                    tipo:"warning",
                    mensagem:"falha ao atualizado registro"
                })
            }

            res.json(query.rows);
    } catch (error) {
        res.json({
            mensagem: error.message
        })
    }
});

app.delete("/usuarios/:id", async (req, res) =>{
    try {
        const {id} = req.params

        const query = await executarSQL(`DELETE FROM usuarios WHERE id=${id} RETURNING *;`);

            if(query.rowCount > 0) {
                res.json({
                    tipo:"success",
                    mensagem: "registro deletado com sucesso"
                })
            } else{
                res.json({
                    tipo:"warning",
                    mensagem:"Registro nao encontrado"
                })
            }

            res.json(query.rows);
    } catch (error) {
        res.json({
            mensagem: error.message
        })
    }
});

// use permite escutar todos os verbos de requisição
app.use((req, res) => {
    res.status(404).send("error 404: Rota nao encontrada")
});

app.listen(3000, ()=> {
    console.log("servidor on: http://localhost:3000");
});