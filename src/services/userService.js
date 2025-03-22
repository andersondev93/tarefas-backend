// services/userService.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_aqui';

exports.register = async (email, password) => {
  // Verificar se o usuário já existe
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Usuário já cadastrado com este email');
  }

  // Hash da senha
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Criar usuário
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword
    }
  });

  // Gerar token
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

  return { 
    user: { id: user.id, email: user.email },
    token 
  };
};

exports.login = async (email, password) => {
  // Buscar usuário
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Credenciais inválidas');
  }

  // Verificar senha
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Credenciais inválidas');
  }

  // Gerar token
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

  return { 
    user: { id: user.id, email: user.email },
    token 
  };
};