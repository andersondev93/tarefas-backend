const express = require('express');
const router = express.Router();
const taskService = require('../services/taskService');
const authMiddleware = require('../middleware/auth');

// Proteger todas as rotas
router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
        const tasks = await taskService.getTasks(req.userId);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const task = await taskService.createTask(req.body, req.userId);
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Atualizar as demais rotas (PUT, DELETE) da mesma forma...

module.exports = router;
