const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fjohh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run(){
    try{
        await client.connect();
        const projectsCollections = client.db('PortfolioAPI').collection('projects');
        const resultsCollections = client.db('PortfolioAPI').collection('results');
        const userValuesCollections = client.db('PortfolioAPI').collection('userValues');
        


    app.get('/projects', async(req, res) => {
        const result = await projectsCollections.find().toArray();
        res.send(result);
    })
    app.get('/projects/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await projectsCollections.findOne(query);
        res.send(result);
    })

    ///////////////////
    app.get('/results', async (req, res) => {
        const query = {};
        const limit = Number(req.query.limit);
        const pageNumber = Number(req.query.pageNumber);
        const cursor = resultsCollections.find(query);
        const count = await resultsCollections.estimatedDocumentCount();
        const result = await cursor.skip(limit*pageNumber).limit(limit).toArray();
        res.send({success: true, data: result, count})
    })
    app.get('/results/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await resultsCollections.findOne(query);
        res.send(result);
    })

    //////////////////////
    app.get('/uservalues', async(req, res) =>{
        const result = await userValuesCollections.find().toArray();
        res.send(result);
    })
    app.post('/uservalues', async(req, res) =>{
        const query = req.body;
        const result = await userValuesCollections.insertOne(query);
        res.send(result);
    })

    }
    finally{

    }

}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Server Running')
});

app.listen( port, () => {
    console.log('App is listening with port', port)
})



