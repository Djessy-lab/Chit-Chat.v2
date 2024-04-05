const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createDailyTransmission = async (req, res) => {
  const { content, diapers, meals, sleep, userId, childId } = req.body;

  try {
    const newTransmission = await prisma.dailyTransmission.create({
      data: {
        content,
        diapers,
        meals,
        sleep,
        userId,
        childId,
      },
    });

    res.status(201).json(newTransmission);
  } catch (error) {
    console.error('Erreur lors de la création de la transmission quotidienne:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getAllDailyTransmissions = async (req, res) => {
  try {
      const transmissions = await prisma.dailyTransmission.findMany();
      res.json(transmissions);
  } catch (error) {
      console.error('Erreur lors de la récupération des transmissions:', error);
      res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getDailyTransmissionById = async (req, res) => {
  const { id } = req.params;

  try {
      const transmission = await prisma.dailyTransmission.findUnique({
          where: { id },
      });

      if (!transmission) {
          return res.status(404).json({ message: 'Transmission non trouvée.' });
      }

      res.json(transmission);
  } catch (error) {
      console.error('Erreur lors de la récupération de la transmission:', error);
      res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.deleteDailyTransmission = async (req, res) => {
  const { id, userId } = req.params;

  try {
    const transmission = await prisma.dailyTransmission.findUnique({
      where: { id },
    });
    if (!transmission) {
      return res.status(404).json({ message: 'Transmission non trouvée.' });
    }

    if (transmission.userId !== userId) {
      return res.status(403).json({ message: 'Action non autorisée.' });
    }

    await prisma.dailyTransmission.delete({
      where: { id },
    });
    res.status(200).json({ message: 'Transmission supprimée avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la transmission:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
