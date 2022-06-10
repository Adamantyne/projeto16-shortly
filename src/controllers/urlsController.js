import db from "../db.js";
import { nanoid } from "nanoid";

export async function postShorten(req,res){
    const {email,url} = res.locals.sessionData;
    const shortUrl = nanoid(8);
    try {
        await db.query(
            `INSERT INTO urls("userEmail","shortUrl",url) VALUES ($1,$2,$3)`,[email,shortUrl,url]
        );
        return res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.status(500).send("error post shorten");
    }
}
export async function getShorten(req,res){
    const {id}=req.params;
    try {
        const { rows:shorten }=await db.query(
            `SELECT id,"shortUrl",url FROM urls WHERE id=$1`,[id]
        );
        if(shorten.length===0){
            return res.sendStatus(404);
        }
        return res.status(200).send(shorten[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).send("error get shorten");
    }
}
export async function deleteShorten(req,res){
    const {id}=req.params;
    try {
        await db.query(
            `DELETE FROM urls WHERE id=$1`,[id]
        );
        return res.sendStatus(204);
    } catch (error) {
        console.log(error);
        return res.status(500).send("error delete shorten");
    }
}
export async function openShorten(req,res){
    const {shortUrl} = req.params;
    try {
        const { rows:link }=await db.query(
            `SELECT url,"visitCount" FROM urls WHERE "shortUrl"=$1`,[shortUrl]
        );
        if(link.length===0){
            return res.sendStatus(404);
        }
        await db.query(
             `UPDATE urls SET "visitCount"=$2 WHERE "shortUrl"=$1`,[shortUrl,link[0].visitCount+1]
        );
        res.redirect(`${link[0].url}`);
    } catch (error) {
        console.log(error);
        return res.status(500).send("error open shorten");
    }
}
