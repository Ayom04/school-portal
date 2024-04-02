import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { hashPassword, comparePassword, generateOtp } from "../utils/helper";
import response from "../utils/response";
const models = require("../models");
import messages from "../constants/messages";

const changePassword = async (req: Request, res: Response) => {};
const login = async (req: Request, res: Response) => {};
const createStudent = async (req: Request, res: Response) => {};
const updateStudent = async (req: Request, res: Response) => {};
const deleteStudent = async (req: Request, res: Response) => {};
const getStudent = async (req: Request, res: Response) => {};
const getStudents = async (req: Request, res: Response) => {};
const createTeaacher = async (req: Request, res: Response) => {};
const updateTeacher = async (req: Request, res: Response) => {};
const deleteTeacher = async (req: Request, res: Response) => {};
const getTeacher = async (req: Request, res: Response) => {};
const getTeachers = async (req: Request, res: Response) => {};
const createSubject = async (req: Request, res: Response) => {};
const updateSubject = async (req: Request, res: Response) => {};
const deleteSubject = async (req: Request, res: Response) => {};
const getSubject = async (req: Request, res: Response) => {};
const getSubjects = async (req: Request, res: Response) => {};
const getStudentSubjects = async (req: Request, res: Response) => {};
const getTeacherSubjects = async (req: Request, res: Response) => {};
const getTermCourses = async (req: Request, res: Response) => {};

export {
  changePassword,
  login,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudent,
  getStudents,
  createTeaacher,
  updateTeacher,
  deleteTeacher,
  getTeacher,
  getTeachers,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubject,
  getSubjects,
  getStudentSubjects,
  getTeacherSubjects,
  getTermCourses,
};
