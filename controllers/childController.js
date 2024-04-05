const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getChildren = async (req, res) => {
  try {
    const children = await prisma.child.findMany({
      include: {
        users: true,
      },
    });
    res.json(children.map(child => ({
      ...child,
      users: child.users.map(user => ({ uid: user.uid, prenom: user.prenom, nom: user.nom, email: user.email, role: user.role }))
    })));
  } catch (error) {
    console.error('Erreur lors de la récupération des enfants:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getChild = async (req, res) => {
  try {
    const { id } = req.params;
    const child = await prisma.child.findUnique({
      where: { id },
      include: {
        users: true,
      },
    });

    if (!child) {
      return res.status(404).json({ error: 'Enfant non trouvé.' });
    }

    const result = {
      ...child,
      users: child.users.map(user => ({ uid: user.uid, prenom: user.prenom, nom: user.nom, email: user.email, role: user.role }))
    };

    res.json(result);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'enfant:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};


exports.createChild = async (req, res) => {
  // Logique pour créer un enfant
};

exports.updateChild = async (req, res) => {
  // Logique pour mettre à jour un enfant
};

exports.deleteChild = async (req, res) => {
  // Logique pour supprimer un enfant
};
