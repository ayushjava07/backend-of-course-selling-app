const express = require("express");
const { userModel } = require("../db");
const UserRouter = express.Router();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { z, treeifyError } = require("zod/v4");
const USER_SECRET_key="hadiuhauihuaudahdauju";
UserRouter.post("/signup", async (req, res) => {
  const { username, firstname, lastname, email, password } = req.body;
  const missingfields = [];
  if (!username) missingfields.push("username");
  if (!password) missingfields.push("password");
  if (!firstname) missingfields.push("firstname");
  if (!lastname) missingfields.push("lastname");
  if (!email) missingfields.push("email");
  if (missingfields.length > 0) {
    res.status(400).json({
      meassage: "enter the remaining fields",
      fields: missingfields,
    });
    return;
  }
  const valiDdata = z.object({
    username: z
      .string()
      .min(4, "enter at-least 4 letters ")
      .max(10, "you cannot write username greater then 10 letter")
      .regex(/^[0-9a-z]+$/, "can only contain lower chr and no. are allowed"),
    firstname: z
      .string()
      .min(3)
      .max(20)
      .regex(/^[a-zA-Z\s]+$/),
    lastname: z
      .string()
      .min(3)
      .max(100)
      .regex(/^[a-zA-Z\s]+$/),
    email: z.string().email("enter valid email"),
    password: z
      .string()
      .min(6, "enter 6 letters")
      .regex(/[a-z]/, "must inclde a lower letter")
      .regex(/[A-Z]/, "must inclde a upper letter")
      .regex(/[0-9]/, "must inclde a number")
      .regex(/[^a-z0-9A-Z]/, "must include a special character"),
  });
  const isvalid = valiDdata.safeParse(req.body);
  if (!isvalid.success) {
    const errortree = isvalid.error.format();
    res.status(400).json({
      message: "Validation failed",
      errors: errortree,
    });
    return;
  }
  try {
    const saltround = 10;
    const hashpw = await bcrypt.hash(password, saltround);
    await userModel.create({
      username,
      firstname,
      lastname,
      email,
      password: hashpw,
    });
    return res.json({
      meassage: "signup completed😇",
    });
  } catch (error) {
    return res.json({
      meassage: "error found during signup⚠️",
    });
  }
});
UserRouter.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userModel.findOne({ username });
  if (!user) {
    return res.status(444).json({
      meassage: "user not found",
    });
  }
  const ismatch = await bcrypt.compare(password, user.password);
  if (!ismatch) {
    return res.status(444).json({
      message: "invalid password",
    });
  }
  const token=jwt.sign({userId:user._id},USER_SECRET_key)
  return res.json({
    meassage: "signin endpoint😇",
    token:token
  });
  } catch (error) {
    return res.json({
      meassage:"something went wrong ❌"
    })
  }
});
module.exports = UserRouter;
