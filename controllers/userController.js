const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { FIREBASE_STORAGE } = require('../firebase');

const prisma = new PrismaClient();

exports.createUser = async (req, res) => {
  try {
    const { email, password, uid } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).send('Un utilisateur avec cette adresse e-mail existe déjà.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        uid,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).send('Utilisateur non trouvé.');
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { prenom, nom, role, profilePicture, filename } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return res.status(404).send('Utilisateur non trouvé.');
    }

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        prenom,
        nom,
        role,
      },
    });

    let updatedProfilePictureUrl = user.profilePicture;
    if (profilePicture) {
      await prisma.user.update({
        where: { id },
        data: { profilePicture: profilePicture },
      });
    }

    res.json({ message: 'Mise à jour réussie', updatedUser, profilePictureUrl: updatedProfilePictureUrl });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
