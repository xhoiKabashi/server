import { Schema, model } from "mongoose";
import { UserDocument } from "../types/user.interface";
import validator from "validator";
import bcryptjs from "bcryptjs";

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail],
    },
    username: { type: String, required: true },
    password: { type: String, required: true, select: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next;
  }
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
  } catch (error) {
    return next(error as Error);
  }
});

userSchema.methods.validatePassword = function (password: string) {
  return bcryptjs.compare(password, this.password);
};

export const User = model<UserDocument>("User", userSchema);
