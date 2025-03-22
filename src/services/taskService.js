const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getTasks = async (userId) => {
    return await prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });
};

exports.createTask = async (taskData, userId) => {
    return await prisma.task.create({
        data: {
            ...taskData,
            userId
        }
    });
};

exports.updateTask = async (id, taskData, userId) => {
    const task = await prisma.task.findUnique({ where: { id: Number(id) } });
    if (task.userId !== userId) {
        throw new Error('Não autorizado');
    }

    return await prisma.task.update({
        where: { id: Number(id) },
        data: taskData
    });
};

exports.deleteTask = async (id, userId) => {
    const task = await prisma.task.findUnique({ where: { id: Number(id) } });
    if (task.userId !== userId) {
        throw new Error('Não autorizado');
    }

    return await prisma.task.delete({
        where: { id: Number(id) }
    });
};
