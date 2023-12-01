const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// User middleware
app.use(cors())
app.use(express.json())


// Connect Mongodb
// foodRest
// samiyDLN4a3YBvGS

const uri = "mongodb+srv://foodRest:samiyDLN4a3YBvGS@cluster0.okgnpfm.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const foodCollection = client.db("foodRestaurant").collection("foods");

        // ------------- Get the "foodCollection" data with this code below ------------

        app.get('/foods', async (req, res) => {
            const cursor = foodCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // ----------- Get "Only one data" from foods -------------

        app.get('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodCollection.findOne(query);
            res.send(result)
        })

        // ----------- PurchasingCollection part ---------------

        const purchasingCollection = client.db("foodRestaurant").collection("purchasing");

        // ------------ Purchasing -----------

        app.post('/purchasing', async (req, res) => {
            const purchasing = req.body;
            console.log(purchasing);
            const result = await purchasingCollection.insertOne(purchasing)
            res.send(result)
        })

        // ----------- Make the purchase api ------------

        app.get('/purchasing', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await purchasingCollection.find(query).toArray()
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})