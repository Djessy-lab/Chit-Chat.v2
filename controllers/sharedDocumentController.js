const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createSharedDocument = async (req, res) => {
    const { title, content, userId } = req.body;

    try {
        const sharedDocument = await prisma.sharedDocument.create({
            data: {
                title,
                content,
                userId,
            },
        });

        res.status(201).json(sharedDocument);
    } catch (error) {
        console.error('Erreur lors de la création du document partagé:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getAllSharedDocuments = async (req, res) => {
    try {
        const sharedDocuments = await prisma.sharedDocument.findMany();
        res.json(sharedDocuments);
    } catch (error) {
        console.error('Erreur lors de la récupération des documents partagés:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
