import { NextFunction, Request, Response } from "express-serve-static-core";
import { Error } from "mongoose";
import { User } from "../models/user";
import { UserDocument } from "../types/user.interface";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const normalizeUser = (user: UserDocument) => {
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

  return {
    email: user.email,
    username: user.username,
    id: user.id,
    token: token,
  };
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newUser = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });
    const savedUser = await newUser.save();
    res.send(normalizeUser(savedUser));
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ error: messages });
    }
    return next(error);
  }
};
