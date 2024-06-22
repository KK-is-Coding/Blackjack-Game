// blackjack-server/app.js
import express from 'express';
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes/index.js";
import dotenv from "dotenv";


dotenv.config();

const app = express();

// Middlewares for parsing request body
app.use(express.json());


const PORT = process.env.PORT || 3000;
const mongoDB_URL = process.env.mongoDB_URL;
const HOST = process.env.HOST || "http://localhost:5173";


// Middlewares for handling CORS policy
app.use(
  cors({
    origin: HOST,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  })
);


app.get('/', (req, res) => {
  // console.log("request passed...")
  res.json("request passed...")
})



app.use('/api', routes);


mongoose.connect(mongoDB_URL)
  .then(() => {
    console.log("App is connected to the DataBase...")
    app.listen(PORT, () => {
      console.log(`App is listening to the port: ${PORT}`)
    })
  })
  .catch((error) => {
    console.log(error)
  });
