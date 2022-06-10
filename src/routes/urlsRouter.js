import { Router } from "express";

import { authenticate } from "../middlewares/authMeddleware.js";
import { 
    shortenValidation,deleteShortenValidation 
} from "../middlewares/urlsMiddleware.js";
import {
    postShorten,getShorten,deleteShorten,openShorten
} from "../controllers/urlsController.js";

const urlsRouter = Router();

urlsRouter.post(
    "/urls/shorten", authenticate, shortenValidation, postShorten
);
urlsRouter.get("/urls/:id", getShorten);
urlsRouter.delete(
    "/urls/:id",authenticate, deleteShortenValidation, deleteShorten
);
urlsRouter.get("/urls/open/:shortUrl", openShorten);

export default urlsRouter;