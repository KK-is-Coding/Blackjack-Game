import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    suit: String,
    rank: String,
    value: Number,
});


export const Card = mongoose.model('Card', cardSchema);