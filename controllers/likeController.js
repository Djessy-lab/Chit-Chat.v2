const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const likeController = {
  addLike: async (req, res) => {
    const { postId } = req.params;
    const userId = req.body.userId;

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

  removeLike: async (req, res) => {
    const { postId } = req.params;
    const userId = req.body.userId;

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

  checkLike: async (req, res) => {
    const { postId } = req.params;
    const userId = req.query.userId; 

    try {
      const like = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId: userId,
            postId: postId,
          },
        },
      });

      res.status(200).json({ hasLiked: !!like });
    } catch (error) {
      console.error('Erreur lors de la vérification du like:', error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }

};

module.exports = likeController;
