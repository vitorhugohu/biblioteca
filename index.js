import express from "express";
import pool from "./db.js";

const app = express();
const port = process.env.PORT_APPLICATION;
app.use(express.json()); // avisando que vou usar JSON para o express

app.get("/teste-banco", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT NOW()");
    res.json({
      mensagem: "Conectado com o PS",
      horario_banco: resultado.rows[0].now,
    });
  } catch (erro) {
    console.error("Erro ao conectar no PS:", erro);
    res.status(500).json({ erro: "Falha ao conectar com o PS" });
  }
});

app.get("/", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT * FROM livros");
    res.status(200).json(resultado.rows);
  } catch (erro) {
    console.error("Erro: ", erro);
    res.status(500).json({ erro: "Ocorreu algum erro!" });
  }
});

app.post("/", async (req, res) => {
  try {
    let { nome, autor } = req.body;
    const resultado = await pool.query(
      "INSERT INTO livros (nome, autor) VALUES ($1, $2)",
      [nome, autor],
    );
    res.status(201).send();
  } catch (erro) {
    console.error("Erro: ", erro);
    res.status(500).json({ erro: "Algo deu errado!" });
  }
});

app.patch("/:id", async (req, res) => {
  try {
    let id = Number(req.params.id);
    let { nome, autor } = req.body;
    const resultado = await pool.query(
      "UPDATE livros SET nome = $1, autor = $2 WHERE id = $3",
      [nome, autor, id],
    );
    res.status(200).send();
  } catch (erro) {
    console.error("Erro: ", erro);
    res.status(500).json({ erro: "Ocorreu algum erro!" });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    let id = Number(req.params.id);
    const resultado = await pool.query("DELETE FROM livros WHERE id = $1", [
      id,
    ]);
    return res.status(200).json({
      messagem: "Livro deletado com sucesso!",
    });
  } catch (erro) {
    console.error("Erro: ", erro);
    res.send(500).json({ erro: "Ocorreu algum erro!" });
  }
});

app.listen(port, () => {
  console.log(`Rodando na porta ${port}!`);
});
