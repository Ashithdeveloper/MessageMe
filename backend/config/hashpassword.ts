import bcrypt from "bcryptjs";

export const hashPassword = async (plainPassword: string) => {
  const saltRounds = 10; // You can increase for stronger hashing
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
};

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
