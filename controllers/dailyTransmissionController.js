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
