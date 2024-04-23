import bcrypt from "bcrypt";

// created a function for hashing the password
export const hashPassword = (password) => {
  let saltRound = 10;
  const hashedPassword = bcrypt.hashSync(password, saltRound);
  return hashedPassword;
};
