import { verify, sign } from "jsonwebtoken";
import { prisma } from "@kahoot-clone/database";
import { User } from "@prisma/client";
import { genSalt, hash, compare } from "bcrypt";

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await compare(password, hashedPassword);
}

export const createUser = async ({ email, username, password }: {
  email: string,
  username: string,
  password: string
}): Promise<User> => {
  const salt = await genSalt();
  const hashedPassword = await hash(password, salt);
  return prisma.user.create({
    data: {
      email,
      username,
      hashedPassword
    }
  })
}

export const createToken = (id: string): string => {
  return sign({ id }, process.env["JWT_SECRET"]);
}

export const getToken = (token: string): Record<string, unknown> => {
  if (!token) {
    throw "Missing token";
  }
  let decodedToken = null;
  verify(token, process.env["JWT_SECRET"], (err, decoded) => {
    if (err) {
      throw err;
    }
    decodedToken = decoded;
  });

  return decodedToken; // unreachable
}

export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    const { id } = getToken(token);
    const users = await prisma.user.findMany({
      where: {
        id: {
          equals: id as string
        }
      }
    });
    if (users.length == 0) {
      return false;
    }
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
