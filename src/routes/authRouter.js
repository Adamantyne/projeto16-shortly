import {Router} from "express";

import {
    singUpVallidation,signInVallidation
} from "../middlewares/authMeddleware.js";
import { signUp, signIn } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/signup",singUpVallidation, signUp);
authRouter.post("/signin",signInVallidation, signIn);

export default authRouter;