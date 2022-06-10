import db from "../db.js";
import { shortenSchema } from "../schemas/urlsSchema.js";

const abortEarly = { abortEarly: false };

export function shortenValidation(req, res, next) {
    const { url } = req.body;
    const validate = shortenSchema.validate({ url }, abortEarly);
    if (validate.error) {
        return res.status(422).send(validate.error.details.map(
            detail => `${detail.message} /`
        ));
    };
    const session = res.locals.session;
    res.locals.sessionData = { ...session, url };
    next();
}

export async function deleteShortenValidation(req,res,next){
    const {id}=req.params;
    const {email} = res.locals.session;
    try {
        const { rows:shorten }= await db.query(
            `SELECT id,"userEmail",url FROM urls WHERE id=$1`,[id]
        );
        if(shorten.length===0){
            return res.sendStatus(404);
        }else if(shorten[0].userEmail!==email){
            return res.sendStatus(401);
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send("error validate delete shorten");
    }
}