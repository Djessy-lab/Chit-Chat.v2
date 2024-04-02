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
        const { email } = req.params;
        const { prenom, nom, role, profilePictureData, filename } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).send('Utilisateur non trouvé.');
        }

        const updatedUser = await prisma.user.update({
            where: { email },
            data: {
                prenom,
                nom,
                role,
            },
        });

        // Gestion de la photo de profil
        let updatedProfilePictureUrl = user.profilePicture;
        if (profilePictureData) {
            const storageRef = ref(FIREBASE_STORAGE, `profilePicture/${email}/${filename}`);
            const metadata = { contentType: 'image/jpeg' };
            await uploadBytes(storageRef, profilePictureData, metadata);
            updatedProfilePictureUrl = await getDownloadURL(storageRef);

            await prisma.user.update({
                where: { email },
                data: { profilePicture: updatedProfilePictureUrl },
            });
        }

        res.json({ message: 'Mise à jour réussie', updatedUser, profilePictureUrl: updatedProfilePictureUrl });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
