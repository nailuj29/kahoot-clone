import { prisma } from "@kahoot-clone/database";
import { Prisma } from "@prisma/client";
import { Handler } from "express";

export const quizzes_get: Handler = async (req, res) => {
  const { page: pageStr, limit: limitStr } = req.query as { [key: string]: string };
  const page = Number(pageStr) - 1 || 0;
  const limit = Number(limitStr) || 50;
  if (page < 0) {
    res.status(400).json({ status: 400, message: "page must be a positive number greater than 0"});
    return;
  }

  if (limit < 1) {
    res.status(400).json({ status: 400, message: "limit must be a positive number greater than 1"});
    return;
  }
  const quizzes = await prisma.quiz.findMany({
    orderBy: {
      updatedAt: Prisma.SortOrder.desc,
    },
    skip: page * limit,
    take: limit,
  });
  res.json(quizzes);
}
