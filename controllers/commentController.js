const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const commentController = {
  addComment: async (req, res) => {
    const { postId } = req.params;
    const { userId, content } = req.body;

    try {
      const comment = await prisma.comment.create({
        data: {
          content,
          post: { connect: { id: postId } },
          user: { connect: { uid: userId } },
        },
      });

      res.status(201).json(comment);
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'un commentaire:', error);
      res.status(500).json({ error: "Erreur lors de l'ajout d'un commentaire" });
    }
  },

  getComments: async (req, res) => {
    const { postId } = req.params;

    try {
      const comments = await prisma.comment.findMany({
        where: { postId },
        include: { user: true },
      });

      res.status(200).json(comments);
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
      res.status(500).json({ error: "Erreur lors de la récupération des commentaires" });
    }
  },

  deleteComment: async (req, res) => {
    const { commentId } = req.params;

    try {
      const comment = await prisma.comment.delete({
        where: { id: commentId },
      });

      res.status(200).json(comment);
    } catch (error) {
      console.error('Erreur lors de la suppression d\'un commentaire:', error);
      res.status(500).json({ error: "Erreur lors de la suppression d'un commentaire" });
    }
  },
};

module.exports = commentController;
