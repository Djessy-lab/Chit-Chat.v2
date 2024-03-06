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

app.get('/api/child', async (req, res) => {
  try {
    const data = await prisma.child.findMany();
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/child/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const child = await prisma.child.findUnique({
      where: { id: parseInt(id) },
    });

    if (!child) {
      return res.status(404).json({ error: 'Enfant non trouvé.' });
    }

    res.json(child);
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de l\'enfant:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/user/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/add-post', async (req, res) => {
  try {
    const { content, childId, image, userId } = req.body;

    const existingChild = await prisma.child.findUnique({
      where: { id: childId },
    });

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingChild || !existingUser) {
      return res.status(400).json({ error: 'L\'enfant ou l\'utilisateur spécifié n\'existe pas.' });
    }

    const newPost = await prisma.post.create({
      data: {
        content,
        image,
        user: { connect: { id: userId } },
        child: { connect: { id: childId } },
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du post:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.put('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { content },
    });

    res.json(updatedPost);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du post:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existingPost = await prisma.post.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingPost) {
      return res.status(404).json({ error: 'Post non trouvé.' });
    }

    await prisma.post.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Post supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du post:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
