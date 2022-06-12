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
console.log(uri)



async function run(){
    try{
        await client.connect();
        const projectsCollections = client.db('PortfolioAPI').collection('projects');

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

