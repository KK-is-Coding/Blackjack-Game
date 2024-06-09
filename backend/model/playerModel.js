import mongoose from "mongoose";
import { Card } from "./cardModel.js";

const playerSchema = new mongoose.Schema({
    name: String,
    hand: [Card.schema],
    score: Number,
});

export const Player = mongoose.model('Player', playerSchema);