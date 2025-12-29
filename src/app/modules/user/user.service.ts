import dbConfig from "../../config/db.config";
import { prisma } from "../../config/prisma";
import { IUser } from "./user.interface";
import bcrypt from "bcryptjs";
const createUser = async (userData: IUser) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });

  if (isUserExist) {
    throw new Error("User already exists");
  }
  console.log("DEBUG password:", userData.passwordHash);
  console.log("DEBUG salt:", dbConfig.bcryptJs_salt);

  const hashedPassword = await bcrypt.hash(
    userData.passwordHash,
    Number(dbConfig.bcryptJs_salt)
  );

  const newUser = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      passwordHash: hashedPassword,
      phone: userData.phone,
      role: userData.role,
      isVerified: userData.isVerified ?? false,
      isActive: userData.isActive ?? true,
    },
  });

  return newUser;
};

const getUserById = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      addresses: true,
      reviews: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    include: {
      addresses: true,
      reviews: true,
    },
  });
  return users;
};

export const UserService = {
  createUser,
  getUserById,
  getAllUsers,
};
