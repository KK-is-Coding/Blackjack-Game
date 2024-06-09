import mongoose from "mongoose";
import { Card } from "./cardModel.js";
import { Player } from "./playerModel.js";

const gameSchema = new mongoose.Schema({
    deck: [Card.schema],
    player: Player.schema,
    dealer: Player.schema,
    winner: String, // New field to store the winner
});

export const Game = mongoose.model('Game', gameSchema);