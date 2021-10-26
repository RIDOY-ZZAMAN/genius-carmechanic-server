const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 1000;
app.use(cors());
app.use(express.json());


const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r53mt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        console.log("Connected to Database")
        const database = client.db("carMechanic");
        const serviceCollection = database.collection("services");

        //POST API 
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            console.log("Hit the post api", result);
            res.json(result);
        });

        //GET API 
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);

        })
        //GETTING SPECIFIC ID
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log("Getting Specific service", id);
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service);

        })

        //DELETE OPERATION API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.json(result);

        })




    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send("Hello from server")
});

app.get('/hello', (req, res) => {
    res.send("Hello from server side")
});

app.listen(port, () => {
    console.log("Listening to port", port)
})