import { Router } from "express";

import { authenticate } from "../middlewares/authMeddleware.js";
import {
    getUserStatus,getRanking
} from "../controllers/statusController.js";

const statusRouter = Router();

statusRouter.get("/users/:id",authenticate,getUserStatus);
statusRouter.get("/ranking",getRanking);

export default statusRouter;