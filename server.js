const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/posts', async (req, res) => {
  try {
    const data = await prisma.post.findMany(); 
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
