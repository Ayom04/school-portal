const saltRounds = 10;
import bcrypt from "bcryptjs";
import * as fs from "fs";
let autoIncrement: number;

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

const generateMatricNumber = (): string => {
  let autoIncrement: number;

  try {
    autoIncrement = parseInt(fs.readFileSync("autoIncrement.txt", "utf8"), 10);
  } catch (err) {
    autoIncrement = 1;
  }

  const year: string = new Date().getFullYear().toString().slice(2);
  const paddedNumber: string = autoIncrement.toString().padStart(3, "0");
  const matricNumber: string = `${process.env.SCHOOL_NAME}/${year}/${paddedNumber}`;
  autoIncrement++;
  fs.writeFileSync("autoIncrement.txt", autoIncrement.toString(), "utf8");

  return matricNumber;
};

const generateStaffID = (): string => {
  let autoIncrement;

  try {
    autoIncrement = parseInt(
      fs.readFileSync("staffAutoIncrement.txt", "utf8"),
      10
    );
  } catch (err) {
    autoIncrement = 1;
  }

  const year = new Date().getFullYear().toString().slice(2);
  const paddedNumber = autoIncrement.toString().padStart(3, "0");
  const staffID = `STAFF${year}${paddedNumber}`;
  autoIncrement++;
  fs.writeFileSync("staffAutoIncrement.txt", autoIncrement.toString(), "utf8");

  return staffID;
};

export {
  generateMatricNumber,
  generateStaffID,
  hashPassword,
  comparePassword,
  isEmpty,
  generateOtp,
  generateRandomCharacters,
};
