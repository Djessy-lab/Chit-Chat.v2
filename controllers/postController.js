const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        likes: true,
        comments: {
          include: {
            user: true,
          },
        },
        user: true,
      },
    });


    res.status(200).json(posts);
  } catch (error) {
    console.error('Erreur lors de la récupération des posts:', error);
    res.status(500).json({ error: "Erreur lors de la récupération des posts" });
  }
};


exports.getPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        likes: true,
        comments: {
          include: {
            user: true,

          },
        },
        user: true,
      },
    });

    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du post:', error);
    res.status(500).json({ error: "Erreur lors de la récupération du post" });
  }
};


exports.createPost = async (req, res) => {
  try {
    const { content, image, userId, childId } = req.body;
    const post = await prisma.post.create({
      data: {
        content,
        image,
        userId,
        childId,
      },
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Erreur lors de la création du post:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, image } = req.body;

    const post = await prisma.post.update({
      where: { id },
      data: { content, image },
    });

    res.json(post);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du post:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.post.delete({
      where: { id },
    });

    res.json({ message: 'Post supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du post:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
