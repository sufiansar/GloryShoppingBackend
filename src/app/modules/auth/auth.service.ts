import { prisma } from "../../config/prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utility/jwt";
import dbConfig from "../../config/db.config";
import { createUserToken } from "../../utility/userToken";

interface LoginPayload {
  email: string;
  password: string;
}
const loginUser = async (payload: LoginPayload) => {
  const userData = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!userData) {
    throw new Error("Email And Password is incorrect");
  }

  if (userData.isActive === false) {
    throw new Error("User account is deactivated");
  }

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData.passwordHash
  );
  if (!isCorrectPassword) {
    throw new Error("Password is incorrect");
  }
  console.log("Access token secret Login:", dbConfig.jwt.accessToken_secret);

  // const accessToken = generateToken(
  //   {
  //     id: userData.id,
  //     email: userData.email,
  //     role: userData.role,
  //   },
  //   dbConfig.jwt.accessToken_secret as string,
  //   dbConfig.jwt.accessToken_expiresIn as string
  // );

  const accessToken = createUserToken(userData).accessToken;
  // const refreshToken = generateToken(
  //   {
  //     id: userData.id,
  //     email: userData.email,
  //     role: userData.role,
  //   },
  //   dbConfig.jwt.refreshToken_secret as string,
  //   dbConfig.jwt.refreshToken_expiresIn as string
  // );

  const refreshToken = createUserToken(userData).refreshToken;
  return { accessToken, refreshToken };
};

export const AuthService = {
  loginUser,
};
