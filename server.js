const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const { FIREBASE_STORAGE } = require('./firebase');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');


const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fieldSize: 55 * 1024 * 1024 },
});

app.use('/api/update-user/:email', upload.single('profilePicture'), async (req, res, next) => {
  req.body.profilePictureData = req.file?.buffer;
  next();
});

app.put('/api/update-user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { prenom, nom, role, profilePictureData, filename } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        prenom: prenom || existingUser.prenom,
        nom: nom || existingUser.nom,
        role: role || existingUser.role,
      },
    });

    let updatedProfilePictureUrl = existingUser.profilePicture;

    if (profilePictureData) {
      const storageRef = ref(FIREBASE_STORAGE, `profilePicture/${email}/${filename}`);
      const metadata = { contentType: 'image/jpeg' };

      await uploadBytes(storageRef, profilePictureData, metadata);

      updatedProfilePictureUrl = await getDownloadURL(storageRef);


      await prisma.user.update({
        where: { email },
        data: {
          profilePicture: updatedProfilePictureUrl,
        },
      });
    }
    res.json({ message: 'Mise à jour réussie.', profilePictureUrl: updatedProfilePictureUrl });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur avec photo de profil:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});




app.get('/api/get-user/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    res.json({
      prenom: user.prenom,
      nom: user.nom,
      role: user.role,
      profilePicture: user.profilePicture,
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des données du profil:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});





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
      where: { id: id },
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
      where: { id: id },
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
      where: { id: id },
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
      where: { id: id },
    });

    if (!existingPost) {
      return res.status(404).json({ error: 'Post non trouvé.' });
    }

    await prisma.post.delete({
      where: { id: id },
    });

    res.json({ message: 'Post supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du post:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


app.post('/api/create-user', async (req, res) => {
  try {
    const { email, password, uid } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Un utilisateur avec cette adresse e-mail existe déjà.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        id: uid,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
