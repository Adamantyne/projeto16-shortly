import db from "../db.js";
import { signInSchema, signUpSchema } from "../schemas/authSchema.js";
import bcrypt from "bcrypt";

const abortEarly = { abortEarly: false };

export async function singUpVallidation(req, res, next) {
    const { email, password, confirmPassword } = req.body;
    const validate = signUpSchema.validate(req.body, abortEarly);
    if (validate.error) {
        return res.status(422).send(validate.error.details.map(
            detail => detail.message
        ));
    } else if (password !== confirmPassword) {
        return res.status(409).send("password must be the same");
    }
    try {
        const alreadyExist = await getUser(email);
        if (alreadyExist.length !== 0) {
            return res.status(409).send("email already exist");
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send("error validate signup");
    }
}

export async function signInVallidation(req, res, next) {
    const { email, password } = req.body;
    const validate = signInSchema.validate(req.body, abortEarly);
    if (validate.error) {
        return res.status(422).send(validate.error.details.map(
            detail => `${detail.message} /`
        ));
    };
    try {
        const user = await getUser(email);
        if (!user[0] || !bcrypt.compareSync(password, user[0].password)) {
            return res.status(401).send("incorrect data");
        };
        res.locals.user = user[0];
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).send("error validate signin");
    }
}
async function getUser(email) {
    try {
        const {rows}= await db.query(
            'SELECT * FROM users WHERE email=$1', [email]
        );
        return rows;
    } catch (error) {
        console.log(`error getUser ${error}`);
    }
}

export async function authenticate(req, res,next) {
    const authorization = req.headers.authorization;
    const token = authorization?.replace("Bearer", "").trim();
    try {
        const validToken = await checkToken(token);
        if (!validToken) return res.sendStatus(401);
        res.locals.session = { ...validToken};
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send("error authenticate");
    }
}

async function checkToken(token) {
    try {
        const { rows: validToken } = await db.query(
            `SELECT * FROM sessions WHERE token=$1`, [token]
        );
        if (!token || !validToken[0] || validToken[0]?.expiredDate) {
            return;
        }
        return validToken[0];
    } catch (error) {
        console.log(`error validateToken ${error}`);
    }
}