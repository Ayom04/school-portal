require("dotenv").config();
import express, { Express, Request, Response } from "express";
import messages from "./src/constants/messages";
import response from "./src/utils/response";
import cors from "cors";
import logger from "./src/config/logger";

import adminRoute from "./src/routes/admin";
import registrationRoute from "./src/routes/registration";
import studentRoute from "./src/routes/student";
import subjectRoute from "./src/routes/subject";
import classRoute from "./src/routes/class";

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  return response(res, 200, messages.welcomeMessage);
});

app.use("/api/v1/registration", registrationRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/student", studentRoute);
app.use("/api/v1/subject", subjectRoute);
app.use("/api/v1/class", classRoute);

app.use((req: Request, res: Response) => {
  response(res, 404, messages.invalidRoute);
});

app.listen(PORT, () => {
  logger.info({
    message: `...app listening on port http://localhost:${PORT}`,
  });
  console.log(`Server running on port http://localhost:${PORT}`);
});
