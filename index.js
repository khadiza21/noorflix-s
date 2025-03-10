require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());



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
    const usersCollection = client.db("nooflixData").collection("users");
    const favoriteMoviesCollection = client
        .db("nooflixData")
        .collection("favorites");

    app.get("/", (req, res) => {
        res.send("Noorflix API is running...");
    });

    //   movies route

    // get
    app.get("/movies", async (req, res) => {
        try {
            const movies = await moviesCollection.find().sort({ rating: -1 }).toArray();
            res.json(movies);
        } catch (error) {
            res.status(500).json({ message: "Error fetching movies", error });
        }
    });
    // get
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

    //   post
    app.post("/movies", async (req, res) => {
        try {
            const movie = req.body;
            const result = await moviesCollection.insertOne(movie);
            res.send(result);
        } catch (error) {
            res
                .status(500)
                .json({ message: "Internal Server Error", error: error.message });
        }
    });

    // update
    app.put("/movies/:id", async (req, res) => {
        const { id } = req.params;
        const updatedMovie = req.body;
        try {
            const result = await moviesCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedMovie }
            );
            if (result.modifiedCount === 0) {
                return res
                    .status(404)
                    .json({ message: "No changes made or movie not found" });
            }
            res.json({ message: "Movie updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error updating movie", error });
        }
    });

    // delete
    app.delete("/movies/:id", async (req, res) => {
        const id = req.params.id;
        const result = await moviesCollection.deleteOne({ _id: new ObjectId(id) });
        result.deletedCount > 0
            ? res.json({ message: "Movie deleted successfully." })
            : res.status(404).json({ error: "Movie not found." });
    });

    // users

    // get
    app.get("/users", async (req, res) => {
        try {
            const users = await usersCollection.find().toArray();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: "Error fetching users", error });
        }
    });

    //   post
    app.post("/users", async (req, res) => {
        try {
            const newUser = req.body;
            console.log(newUser);
            const result = await usersCollection.insertOne(newUser);
            res.send(result);
        } catch (error) {
            res
                .status(500)
                .json({ message: "Internal Server Error", error: error.message });
        }
    });

    //   favorites
    // get
    app.get("/favorites/:email", async (req, res) => {
        const email = req.params.email;
        const favorites = await favoriteMoviesCollection
            .find({ userEmail: email })
            .toArray();
        res.json(favorites);
    });
    // post
    app.post("/favorites", async (req, res) => {
        const {
            userEmail,
            movieId,
            movieTitle,
            moviePoster,
            genre,
            duration,
            releaseYear,
            rating,
        } = req.body;
        if (!userEmail || !movieId || !movieTitle || !moviePoster) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        const exists = await favoriteMoviesCollection.findOne({
            userEmail,
            movieId,
        });
        if (exists) {
            return res.status(400).json({ error: "Movie already in favorites." });
        }

        const movieData = {
            userEmail,
            movieId,
            movieTitle,
            moviePoster,
            genre,
            duration,
            releaseYear,
            rating,
        };

        const result = await favoriteMoviesCollection.insertOne(movieData);
        res.status(201).json(result);
    });
    // delete
    app.delete("/favorites/:id", async (req, res) => {
        const id = req.params.id;
        const result = await favoriteMoviesCollection.deleteOne({
            _id: new ObjectId(id),
        });

        result.deletedCount > 0
            ? res.json({ message: "Movie removed from favorites." })
            : res.status(404).json({ error: "Movie not found in favorites." });
    });

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });

    try {
        //  await client.connect();
    } finally {
    }
}
run().catch(console.dir);
