const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@noorflix.vy5ee.mongodb.net/?retryWrites=true&w=majority&appName=noorflix`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    const moviesCollection = client.db("nooflixData").collection("movies");

    app.get("/", (req, res) => {
        res.send("Noorflix API is running...");
    });

    app.get("/movies", async (req, res) => {
        try {
            const movies = await moviesCollection.find().toArray();
            res.json(movies);
        } catch (error) {
            res.status(500).json({ message: "Error fetching movies", error });
        }
    });

    app.get("/movies/:id", async (req, res) => {
        const id = req.params.id;
        try {
            const movie = await moviesCollection.findOne({ _id: new ObjectId(id) });

            if (!movie) {
                return res.status(404).json({ message: "Movie not found" });
            }

            res.json(movie);
        } catch (error) {
            res.status(500).json({ message: "Error fetching movie", error });
        }
    });

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });

    try {
        await client.connect();
        // await client.db("admin").command({ ping: 1 });
        // console.log(
        //   "Pinged your deployment. You successfully connected to MongoDB!"
        // );
    } finally {
        //await client.close();
    }
}
run().catch(console.dir);
