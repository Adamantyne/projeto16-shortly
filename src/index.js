import express, {json} from "express";
import cors from "cors";
import dotenv from "dotenv";

import routes from "./routes/routes.js";
import chalk from "chalk";

const app = express();
app.use(cors());
app.use(json());

dotenv.config();

app.use(routes);


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(chalk.blue(`Server is running on port ${port}.`));
});