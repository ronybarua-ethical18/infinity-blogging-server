const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const port = process.env.PORT || 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dupbi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const bookingsCollection = client.db("paintingdb").collection("bookings");

    app.post('/addService', (req, res) => {
        const serviceData = req.body;
        servicesCollection.insertOne(serviceData)
            .then(result => {
                console.log(result);
                res.send(result.insertedCount > 0)

            })
    })

    // read or retrieve data from database 
    app.get('/services', (req, res) => {
        servicesCollection.find({})
            .toArray((error, documents) => {
                res.send(documents);
            })
    })


    //get a single item by id
    app.get('/service/:id', (req, res) => {
        servicesCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((error, documents) => {
                res.send(documents[0]);
            })
    })

    // delete service from database 
    app.delete('/deleteService/:id', (req, res) => {
        console.log(req.params.id)
        servicesCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                console.log(result)
                res.send(result.deletedCount > 0);

            })
    })

    // add admin to database
    app.post('/addAdmin', (req, res) => {
        const admin = req.body;
        adminsCollection.insertOne(admin)
            .then(result => {
                console.log(result);
                res.send(result.insertedCount > 0)

            })
    })

    app.get('/', (req, res) => {
        res.send('Hello Painter!')
    })
    console.log('database connected successfully');
});
app.listen(port)