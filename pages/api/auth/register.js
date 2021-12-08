import bcrypt from "bcrypt";

import dbConnect from "./../../../lib/dbConnect";
import User from "../../../models/User";

export default async function handler(req, res) {
  const { method } = req;

  const db = await dbConnect();
  if (db) {
    console.log("Connected to MongoDb");
  }

  switch (method) {
    case "POST":
      try {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
          res.status(400).json({
            sucess: false,
            message: `User ${req.body.username} already exists`,
          });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = User({
          username: req.body.username,
          password: hashedPassword,
        });

        const createdUser = await newUser.save();
        const { createdAt, updatedAt, password, ...info } = createdUser._doc;

        res.status(201).json({ success: true, user: info });
      } catch (error) {
        res.status(400).json({ sucess: false, error });
      }
    default:
      res.status(400).json({ success: false, message: "Invalid request" });
  }
}
