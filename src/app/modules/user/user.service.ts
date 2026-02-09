import { UserRole } from "@prisma/client";
import { deleteImageFromCLoudinary } from "../../config/cloudinary";
import dbConfig from "../../config/db.config";
import { prisma } from "../../config/prisma";
import AppError from "../../errorHelpers/AppError";
import { IUser, IUserUpdate } from "./user.interface";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
const createUser = async (userData: IUser) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });

  if (isUserExist) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(
    userData.passwordHash,
    Number(dbConfig.bcryptJs_salt),
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

const userRoleUpdate = async (userId: string, role: UserRole) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }
  if (user.role !== UserRole.SUPER_ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only Super Admin can change user roles",
    );
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role: role,
    },
  });
  return updatedUser;
};

const updateUser = async (userId: string, updateData: IUserUpdate) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  if (updateData.passwordHash) {
    const hashedPassword = await bcrypt.hash(
      updateData.passwordHash,
      Number(dbConfig.bcryptJs_salt),
    );
    updateData.passwordHash = hashedPassword;
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: updateData,
  });
  if (updateData.profileImage && existingUser.profileImage) {
    try {
      await deleteImageFromCLoudinary(existingUser.profileImage);
    } catch (err) {
      console.error("Failed to delete old image:", err);
    }
  }
  return updatedUser;
};

const deleteUser = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found");
  }
  if (user.profileImage) {
    await deleteImageFromCLoudinary(user.profileImage);
  }
  await prisma.user.delete({ where: { id: userId } });

  return;
};

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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
export const UserService = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  userRoleUpdate,
  getMyProfile,
};
