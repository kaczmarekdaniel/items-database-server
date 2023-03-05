import { comparePasswords, createJWT } from "../modules/auth";
import prisma from "../../db";
import { hashPassword } from "../modules/auth";
import { nextTick } from "process";

export const createNewUser = async (req, res) => {
  const hash = await hashPassword(req.body.password);

  const user = await prisma.user.create({
    data: {
      username: req.body.username,
      password: hash,
      name: req.body.username,
      surname: req.body.surname,
      profilePic: req.body.profilePic,
      requests: {},
      items: {},
    },
  });

  const token = createJWT(user);
  res.json({ token });
};

export const signin = async (req, res, next) => {
  console.log(req.body);
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.username,
      },
    });

    const isValid = await comparePasswords(req.body.password, user.password);

    if (!isValid) {
      res.status(401);
      res.json({ message: "wrong password" });
      return;
    }

    console.log(user);

    const token = createJWT(user);
    return res
      .cookie("logged_in", true, {
        httpOnly: false,
        expires: new Date(Date.now() + 600000),
      })
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 600000),
        secure: false,
      })
      .status(200)
      .json({ username: user.username });
  } catch (e) {
    next(e);
  }
};
