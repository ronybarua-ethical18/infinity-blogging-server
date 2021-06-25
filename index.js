const express =require('express')
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require('body-parser')
const cors = require('cors')

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

  app.post('/addBlogs', (req, res) =>{
      const blogData = req.body
      blogsCollection.insertOne(blogData)
      .then(result => {
          console.log(result)
          res.send(result.insertedCount > 0)
        })
  })

  app.get('/blogs', (req, res) =>{
    blogsCollection.find({})
    .toArray((error, documents) =>{
      res.send(documents)
    })
  })
  console.log('database connected successfully');
});

app.get('/', (req, res) =>{
    res.send('Hello Infinity!')
})
app.listen(port)