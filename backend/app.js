// blackjack-server/app.js
import express from 'express';
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import routes from "./routes/index.js";
import dotenv from "dotenv";


dotenv.config();

const app = express();

// Middlewares for parsing request body
app.use(express.json());


const PORT = process.env.PORT || 3000;
const mongoDB_URL = process.env.mongoDB_URL;


// Middlewares for handling CORS policy
app.use(cors());


// app.use(bodyParser.json());


app.use('/api', routes);


mongoose.connect(mongoDB_URL,
  // {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // }
)
  .then(() => {
    console.log("App is connected to the DataBase...")
    app.listen(PORT, () => {
      console.log(`App is listening to the port: ${PORT}`)
    })
  })
  .catch((error) => {
    console.log(error)
  });