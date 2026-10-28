const express = require("express");
const cors = require("cors")
const executarSQL = require("./services");
const app = express();

app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
    res.send("ola mundo");
});

//rota de login
app.post("/login", async (req, res) => {
    try {
        const { email, senha } = req.body
        const emailExist = await executarSQL(`SELECT * FROM usuarios WHERE email='${email}'`);

        if (emailExist.rowCount == 0) {
            res.json({
                tipo: "warning",
                mensagem: "email ou senha incorretos"
            });
            return
        }

        if (emailExist.rows[0].senha != senha) {
            res.json({
                tipo: "warning",
                mensagem: "email ou senha incorretos",
                teste: "teste"
            });
            return
        }

        delete emailExist.rows[0].senha

        res.json({
            tipo: "success",
            mensagem: "login realizado com sucesso",
            usuario: emailExist.rows[0]
        })

    } catch (error) {
        res.json({
            mensagem: error.mensagem
        })
    }

});

//rota para buscar um usuario
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
//rota para criar uma tarefa
app.get("/tarefas/:id", async (req, res) => {
    const {id} = req.params
    try {
        const linhas = await executarSQL(`SELECT * FROM tarefas WHERE usuario_id = ${id};`);
        res.json(linhas.rows);
    } catch (error) {
        res.json({
            mensagem: error.message
        })
    }
});


//rota para criar um usuario
app.post("/usuarios", async (req, res) => {
    try {
        const { nome, email, senha } = req.body
        const emailExist = await executarSQL(`SELECT * FROM usuarios WHERE email='${email}'`);

        if (emailExist.rowCount > 0) {
            req.json({
                tipo: "warning",
                mensagem: "email ja cadastrado"
            });
            return
        }

        const query = await executarSQL(`INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *;`, [nome, email, senha]);

        if (query.rowCount > 0) {
            res.json({
                tipo: "success",
                mensagem: "registro criado com sucesso"
            })
        } else {
            res.json({
                tipo: "warning",
                mensagem: "falha ao criar registro"
            })
        }

        res.json(query.rows);
    } catch (error) {
        res.json({
            mensagem: error.message
        })
    }
});
//rota para criar uma tarefa
app.post("/tarefas", async (req, res) => {
    try {
        const { titulo, descricao, usuario_id } = req.body
        const tituloExist = await executarSQL(`SELECT * FROM tarefas WHERE titulo='${titulo}'`);

        if (tituloExist.rowCount > 0) {
            req.json({
                tipo: "warning",
                mensagem: "ja existe uma tarefa com esse titulo"
            });
            return
        }

        const query = await executarSQL(`INSERT INTO tarefas (titulo, descricao, usuario_id) VALUES ($1, $2, $3) RETURNING *;`, [titulo, descricao, usuario_id]);

        if (query.rowCount > 0) {
            res.json({
                tipo: "success",
                mensagem: "registro criado com sucesso"
            })
        } else {
            res.json({
                tipo: "warning",
                mensagem: "falha ao criar registro"
            })
        }

        res.json(query.rows);
    } catch (error) {
        res.json({
            mensagem: error.message
        })
    }
});


//rota para editar um usuario
app.put("/usuarios/:id", async (req, res) => {

    try {
        const { nome, email, senha } = req.body
        const { id } = req.params

        const query = await executarSQL(`UPDATE usuarios SET nome=$1, email=$2, senha=$3 WHERE id=${id} RETURNING *;`, [nome, email, senha]);

        if (query.rowCount > 0) {
            res.json({
                tipo: "success",
                mensagem: "registro atualizado com sucesso"
            })
        } else {
            res.json({
                tipo: "warning",
                mensagem: "falha ao atualizado registro"
            })
        }

        res.json(query.rows);
    } catch (error) {
        res.json({
            mensagem: error.message
        })
    }
});
//rota para editar uma tarefa
app.put("/tarefas/:id", async (req, res) => {

    try {
        const { titulo, descricao, usuario_id } = req.body
        const { id } = req.params

        const query = await executarSQL(`UPDATE tarefas SET titulo=$1, descricao=$2, usuario_id=$3 WHERE id=${id} RETURNING *;`, [titulo, descricao, usuario_id]);

        if (query.rowCount > 0) {
            res.json({
                tipo: "success",
                mensagem: "registro atualizado com sucesso"
            })
        } else {
            res.json({
                tipo: "warning",
                mensagem: "falha ao atualizado registro"
            })
        }

        res.json(query.rows);
    } catch (error) {
        res.json({
            mensagem: error.message
        })
    }
});


//rota para deletar um usuario
app.delete("/usuarios/:id", async (req, res) => {
    try {
        const { id } = req.params

        const query = await executarSQL(`DELETE FROM usuarios WHERE id=${id} RETURNING *;`);

        if (query.rowCount > 0) {
            res.json({
                tipo: "success",
                mensagem: "registro deletado com sucesso"
            })
        } else {
            res.json({
                tipo: "warning",
                mensagem: "Registro nao encontrado"
            })
        }

        res.json(query.rows);
    } catch (error) {
        res.json({
            mensagem: error.message
        })
    }
});
//rota para deletar uma tarefa
app.delete("/tarefas/:id", async (req, res) => {
    try {
        const { id } = req.params

        const query = await executarSQL(`DELETE FROM tarefas WHERE id=${id} RETURNING *;`);

        if (query.rowCount > 0) {
            res.json({
                tipo: "success",
                mensagem: "registro deletado com sucesso"
            })
        } else {
            res.json({
                tipo: "warning",
                mensagem: "Registro nao encontrado"
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
    res.status(404).json({
        tipo: "warning",
        mensagem: "error 404: Rota nao encontrada"
    })
});

app.listen(3000, () => {
    console.log("servidor on: http://localhost:3000");
});