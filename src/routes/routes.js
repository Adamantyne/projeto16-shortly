import {Router} from "express";

import authRouter from "./authRouter.js";
import urlsRouter from "./urlsRouter.js";
import statusRouter from "./statusRouter.js";

const routes = Router();

routes.use(authRouter);
routes.use(urlsRouter);
routes.use(statusRouter);

export default routes;