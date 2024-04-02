import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { hashPassword, comparePassword, generateOtp } from "../utils/helper";
import response from "../utils/response";
const models = require("../models");
import messages from "../constants/messages";

const changePassword = async (req: Request, res: Response) => {};
const login = async (req: Request, res: Response) => {};
const getProfile = async (req: Request, res: Response) => {};
const getSubjects = async (req: Request, res: Response) => {};

export = {
  login,
  changePassword,
  getProfile,
  getSubjects,
};
