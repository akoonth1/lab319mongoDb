

import express from 'express';
import  dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { ObjectId } from 'mongodb';
import { MongoClient } from 'mongodb';
import router from  './routes/router.mjs';


const app = express();

dotenv.config();


let PORT = process.env.PORT || 3002;    

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World');
}
);

//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);



// listen to the port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);