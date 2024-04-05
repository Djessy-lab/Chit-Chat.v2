const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const likeController = {
  // Ajouter un like à un post
  addLike: async (req, res) => {
    const { postId } = req.params;
    const userId = req.body.userId; // L'ID de l'utilisateur doit être sécurisé, idéalement obtenu via l'authentification

    try {
      const like = await prisma.like.create({
        data: {
          post: { connect: { id: postId } },
          user: { connect: { uid: userId } },
        },
      });

      res.status(201).json(like);
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'un like:', error);
      res.status(500).json({ error: "Erreur lors de l'ajout d'un like" });
    }
  },

  // Supprimer un like d'un post
  removeLike: async (req, res) => {
    const { postId } = req.params;
    const userId = req.body.userId; // L'ID de l'utilisateur doit être sécurisé, idéalement obtenu via l'authentification

    try {
      const like = await prisma.like.delete({
        where: {
          userId_postId: { userId, postId },
        },
      });

      res.status(200).json(like);
    } catch (error) {
      console.error('Erreur lors de la suppression d\'un like:', error);
      res.status(500).json({ error: "Erreur lors de la suppression d'un like" });
    }
  },
};

module.exports = likeController;
