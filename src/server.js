const express = require('express')
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");


const app = express();
const prisma = new PrismaClient();


app.use(cors({
    origin: ['https://seu-frontend.vercel.app', 'http://localhost:3000']
}));
app.use(express.json());

// Criar uma tarefa
app.post("/tasks", async (req, res) => {
    const { title, description, dateTime } = req.body;
    const task = await prisma.task.create({ data: { title, description, dateTime: dateTime ? new Date(dateTime) : null, } });
    res.json(task);
});

// Buscar todas as tarefas
app.get("/tasks", async (req, res) => {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
});

// Atualizar uma tarefa
app.put("/tasks/:id", async (req, res) => {
    const { id } = req.params;  // Pega o ID da URL
    const { title, description, status, dateTime } = req.body;  // Pega os dados do corpo da requisição

    if (!id) {
        return res.status(400).json("Id é obrigatório");
    }

    const taskAlreadyExists = await prisma.task.findUnique({
        where: { id: Number(id) },  // Convertendo id para número
    });

    if (!taskAlreadyExists) {
        return res.status(404).json("Task não existe");
    }

    try {
        const updatedTask = await prisma.task.update({
            where: { id: Number(id) },  // Convertendo id para número
            data: { title, description, status, dateTime: dateTime ? new Date(dateTime) : null, },
        });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar a tarefa." });
    }
});


app.patch("/tasks/:id/complete", async (req, res) => {
    const { id } = req.params;

    try {
        const task = await prisma.task.update({
            where: { id: Number(id) },
            data: { status: "Concluída" }, // Certifique-se de que "status" existe no schema
        });

        res.json(task);
    } catch (error) {
        console.error("Erro ao marcar como concluída:", error);
        res.status(500).json({ error: "Erro ao atualizar status da tarefa." });
    }
});

// Alternar o status da tarefa entre "Pendente" e "Concluída"
app.patch("/tasks/:id/toggle-status", async (req, res) => {
    const { id } = req.params;

    try {
        const task = await prisma.task.findUnique({ where: { id: Number(id) } });

        if (!task) {
            return res.status(404).json({ error: "Tarefa não encontrada." });
        }

        const newStatus = task.status === "Concluída" ? "Pendente" : "Concluída";

        const updatedTask = await prisma.task.update({
            where: { id: Number(id) },
            data: { status: newStatus },
        });

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: "Erro ao alterar o status da tarefa." });
    }
});




// Deletar uma tarefa
app.delete("/tasks/:id", async (req, res) => {
    const { id } = req.params;

    const intId = parseInt(id)

    if (!intId) {
        return res.status(400).json("Id é Obrigatório");
    }

    const tasksAlreadyExist = await prisma.task.findUnique({ where: { id: intId } });

    if (!tasksAlreadyExist) {
        return res.status(404).json("tarefa não existe");
    }

    await prisma.task.delete({ where: { id: intId } });
    res.json({ message: "Tarefa deletada" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
