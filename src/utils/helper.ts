const saltRounds = 10;
import bcrypt from "bcryptjs";

const generateOtp = (num: number) => {
  if (num < 2) {
    return Math.floor(1000 + Math.random() * 9000);
  }
  const c = Math.pow(10, num - 1);

  return Math.floor(c + Math.random() * 9 * c);
};

const generateRandomCharacters = (num: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < num; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};

const isEmpty = (val: any) => {
  return val === undefined ||
    val == null ||
    val.length == 0 ||
    Object.keys(val).length === 0
    ? true
    : false;
};
const hashPassword = async (
  password: string
): Promise<{ salt: string; hash: string }> => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        resolve({ salt, hash });
      });
    });
  });
};

const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    let result = bcrypt.compare(password, hashedPassword);
    if (result) {
      resolve(result);
    } else {
      reject(Error);
    }
  });
};

export {
  hashPassword,
  comparePassword,
  isEmpty,
  generateOtp,
  generateRandomCharacters,
};
