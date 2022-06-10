import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

import db from "../db.js";

export async function signUp(req, res) {
  const { name, email, password } = req.body;
  try {
    const sault = 10;
    const cryptPassword = bcrypt.hashSync(password, sault);
    await db.query(
      'INSERT INTO users (name,email,password) VALUES ($1,$2,$3);', 
      [name,email,cryptPassword]
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.status(500).send("error signUp");
  }
}

export async function signIn(req, res) {
  const user = res.locals.user;
  const { email } = user;
  try {
    const token = uuid();
    await sessionControl(email);
    await db.query(
      'INSERT INTO sessions(email,token) VALUES ($1,$2);', [email,token]
    );
    res.status(200).send(token);
  } catch (error) {
    console.log(error);
    return res.status(500).send("error signIn");
  }
}



async function sessionControl(email) {
  try {
    const {rows:lastSession} = await db.query(
      'SELECT * FROM sessions WHERE email = $1 ORDER BY id DESC LIMIT 1;',[email]
    );
    if(lastSession[0]){
      await db.query(
        'UPDATE sessions SET "expiredDate" = NOW() WHERE id=$1;', 
        [lastSession[0].id]
      );
    }
  } catch (error) {
    return console.log(`error sessionControl ${error}`);
  }
}