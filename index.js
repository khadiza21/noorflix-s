// password: 
// username: bibikhadiza474
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

require("dotenv").config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://bibikhadiza474:naDAbPgOI646s1BU@noorflix.vy5ee.mongodb.net/?retryWrites=true&w=majority&appName=noorflix";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {

    const studentCollection = client
    .db("nooflixData")
    .collection("movies");


  try {
  
    await client.connect();

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    await client.close();
  }
}
run().catch(console.dir);
