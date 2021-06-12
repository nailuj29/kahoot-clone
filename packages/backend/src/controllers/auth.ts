import { createToken, createUser, verifyPassword } from "@kahoot-clone/auth";
import { prisma } from "@kahoot-clone/database";
import { Handler } from "express";

export const authorized_get: Handler = (req, res) => {
  res.send("ok");
}

export const login_post: Handler = async (req, res) => {
  const { email, password } = req.body as { [key: string]: string };
  if (!(email  && password)) {
    res.status(400).json({ status: 400, message: "Email and password are required"});
    return;
  }

  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: email
      }
    }
  });

  if (verifyPassword(password, user.hashedPassword)) {
    res.send({ token: createToken(user.id) });
  } else {
    res.status(401).json({ status: 401, message: "Incorrect username/password combination"});
  }
}

export const signup_post: Handler = async (req, res) => {

  const { email, username, password } = req.body as { [key: string]: string };
  if (!(email && username && password)) {
    res.status(400).json({ status: 400, message: "Email, username, and password are required"});
    return;
  }
  try {
    const user = await createUser({ email, username, password });
    const token = createToken(user.id);
    res.status(201).json({ token });
  } catch (e) {
    const message = e.message as string
    if (message.includes("Unique constraint failed on the fields: (`email`)")) {
      res.status(400).json({ status: 400, message: "Email must be unique"})
    } else if (message.includes("Unique constraint failed on the fields: (`username`)")) {
      res.status(400).json({ status: 400, message: "Username must be unique"})
    }
    res.status(500).json({ status: 500, message: `An error occurred creating this user. This can happen for many reasons. The error was: ${e}`});
    return;
  }
}
