import express, { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

export const deposit = async (req: express.Request, res: express.Response) => {
  try {
    const { clerkId, email, name } = req.body;

    if (!email || !clerkId) {
      return res.status(400).send("All credentials are required");
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: clerkId,
      },
    });

    if (!user) {
    

    // Hash the password
    const hashedPassword = await bcrypt.hash(email, 10);

    await prisma.user.create({
      data: {
        clerkId: clerkId,
        email: email,
        name: name || email,
        password: hashedPassword, // use the hashed password
      },
    });

    return res.status(200).send("User created successfully");}
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
};

const userRoute = Router();
userRoute.post("/user", deposit); // corrected route name
export default userRoute;
