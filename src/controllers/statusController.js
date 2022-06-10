import db from "../db.js";

export async function getUserStatus(req, res) {
    const { id } = req.params;
    try {
        const userStatus = await getUserData(id);
        console.log(userStatus);
        if (!userStatus) return res.sendStatus(404);
        res.status(200).send(userStatus);
    } catch (error) {
        console.log(error);
        return res.status(500).send("error get user status");
    }
}

export async function getRanking(req, res) {
    const { id } = req.params;
    try {
        const ranking = await getRankingData();
        res.status(200).send(ranking);
    } catch (error) {
        console.log(error);
        return res.status(500).send("error get user status");
    }
}

async function getUserData(id) {
    try {
        const { rows: userData } = await db.query(
            `SELECT users.id,users.name,
            SUM(urls."visitCount") as "visitCount"
            FROM users
            LEFT JOIN urls ON urls."userEmail" = users.email
            WHERE users.id=$1
            GROUP BY users.id`, [id]
        );
        if (userData.length === 0) {
            return;
        }
        const { rows: urls } = await db.query(
            `
            SELECT urls.id,urls."shortUrl",urls.url,urls."visitCount" 
            FROM urls
            JOIN users ON urls."userEmail" = users.email
            WHERE users.id=$1
            `, [id]
        );
        return { ...userData[0], shortenedUrls: urls }
    } catch (error) {
        console.log(`error getUserStatus ${error}`);
    }
}
async function getRankingData() {
    try {
        const { rows: ranking } = await db.query(
            `
            SELECT users.id,users.name,
            COUNT(urls.id) as "linksCount", 
            COALESCE(SUM(urls."visitCount"),0) as "visitCount"
            FROM users
            LEFT JOIN urls ON urls."userEmail" = users.email
            GROUP BY users.id
            ORDER BY "visitCount" DESC
            `
        );
        return ranking;
    } catch (error) {
        console.log(`error getRankingData ${error}`);
    }
}