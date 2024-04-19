require("dotenv").config();
import express, { Express, Request, Response } from "express";
import messages from "./src/constants/messages";
import response from "./src/utils/response";
import cors from "cors";
import logger from "./src/config/logger";
import path from "path";

import adminRoute from "./src/routes/admin";
import registrationRoute from "./src/routes/registration";
import studentRoute from "./src/routes/student";
import subjectRoute from "./src/routes/subject";
import classRoute from "./src/routes/class";
import lessonRoute from "./src/routes/lesson";
import assessmentRoute from "./src/routes/assessment";
import Authorization from "./src/middleware/authorization";
import authentication from "./src/middleware/authentication";
import checkAdmin from "./src/middleware/admin";

const app: Express = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: (origin: any, callback: any) => {
    // Check if the origin matches any of the patterns
    if (
      !origin ||
      allowedOriginPatterns.some((pattern) => pattern.test(origin))
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

//middlewares
const allowedOriginPatterns = [
  /http:\/\/localhost:3000$/,
  /http:\/\/localhost:5173$/,
  /^https:\/\/school-website-rouge-two\.vercel\.app/,
];
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use("/api/v1/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req: Request, res: Response) => {
  return response(res, 200, messages.welcomeMessage);
});

app.use("/api/v1/registration", registrationRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/student", studentRoute);
app.use("/api/v1/subject", subjectRoute);
app.use("/api/v1/class", classRoute);
app.use("/api/v1/lesson", lessonRoute);
app.use("/api/v1/assessment", assessmentRoute);

app.use((req: Request, res: Response) => {
  response(res, 404, messages.invalidRoute);
});

app.listen(PORT, () => {
  logger.info({
    message: `...app listening on port http://localhost:${PORT}`,
  });
  console.log(`Server running on port http://localhost:${PORT}`);
});
