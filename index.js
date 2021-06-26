const express = require('express')
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require('body-parser')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
const app = express()
app.use(bodyParser.json())
app.use(cors())
require('dotenv').config()

const port = process.env.PORT || 8000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tao3z.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const blogsCollection = client.db("blogsdb").collection("blogs");

  app.post('/addBlogs', (req, res) => {
    const blogData = req.body
    blogsCollection.insertOne(blogData)
      .then(result => {
        console.log(result)
        res.send(result.insertedCount > 0)
      })
  })
  //get a single item by id
  app.get('/blog/:id', (req, res) => {
    blogsCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((error, documents) => {
        res.send(documents[0]);
      })
  })

  app.get('/blogs', (req, res) => {
    blogsCollection.find({})
      .toArray((error, documents) => {
        res.send(documents)
      })
  })

  app.delete('/deleteBlog/:id', (req, res) => {
    console.log(req.params.id)
    blogsCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        console.log(result)
        res.send(result.deletedCount > 0);

      })
  })

  console.log('database connected successfully');
});

app.get('/', (req, res) => {
  res.send('Hello Infinity!')
})
app.listen(port)