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
    const { uid } = req.params;

    const user = await prisma.user.findUnique({
      where: { uid },
      include: {
        children: {
          include: {
            id: true,
            name: true,
          },
          include: {
            child: {
              include: {
                users: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).send('Utilisateur non trouvé.');
    }

    const userData = {
      ...user,
      children: user.children.map(({ child }) => ({
        id: child.id, // Incluez l'ID de l'enfant dans les données
        name: child.name,
        birthDate: child.birthDate,
        associatedUsers: child.users.map(({ user }) => ({
          uid: user.uid,
          prenom: user.prenom,
          nom: user.nom,
          email: user.email,
          role: user.role,
        })),
      })),
    };

    res.json(userData);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};



exports.updateUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const { prenom, nom, role, profilePicture } = req.body;

    const user = await prisma.user.findUnique({
      where: { uid },
    });

    if (!user) {
      return res.status(404).send('Utilisateur non trouvé.');
    }

    const updatedUser = await prisma.user.update({
      where: { uid },
      data: {
        prenom,
        nom,
        role,
        profilePicture,
      },
    });

    res.json({ message: 'Mise à jour réussie', updatedUser });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
