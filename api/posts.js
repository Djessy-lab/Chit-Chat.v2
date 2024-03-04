import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getPosts() {
  const posts = await prisma.post.findMany();
  return posts;
}
