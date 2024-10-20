


//import { MongoClient } from 'mongodb';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const connectionStr = process.env.atlasURI;


const client = new MongoClient(connectionStr);

let conn;

try {
    conn = await client.connect();
    console.log("Connected to the database");
} catch (err) {
    console.log(err);
}

let db = conn.db("sample_training");


export default db;