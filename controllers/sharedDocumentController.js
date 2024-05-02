const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createSharedDocument = async (req, res) => {
  const { title, content, userId, childId } = req.body;

  try {
    const sharedDocument = await prisma.sharedDocument.create({
      data: {
        title,
        content,
        userId,
        childId,
      },
    });

    res.status(201).json(sharedDocument);
  } catch (error) {
    console.error('Erreur lors de la création du document partagé:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};


exports.getAllSharedDocuments = async (req, res) => {
  const userId = req.query.userId;

  try {
    const documents = await prisma.sharedDocument.findMany({
      where: {
        OR: [
          { userId: userId },
          { child: { users: { some: { userId: userId } } } }
        ]
      },
      include: {
        user: true,
        child: true
      }
    });
    res.json(documents);
  } catch (error) {
    console.error('Erreur lors de la récupération des documents partagés:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.deleteDocument = async (req, res) => {
  const { id } = req.params;

  try {
    const document = await prisma.sharedDocument.delete({
      where: { id: id },
    });

    res.status(200).json(document);
  } catch (error) {
    console.error('Erreur lors de la suppression d\'un document:', error);
    res.status(500).json({ error: "Erreur lors de la suppression d'un document" });
  }
}
