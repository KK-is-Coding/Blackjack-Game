import express from "express";
import { Game } from "../model/gameModel.js";
import { createDeck } from "../controller/creatDeck.js";
import { calculateScore } from "../controller/calcScore.js";
import { determineWinner } from "../controller/findWinner.js";


const router = express.Router();


router.get('/', async (req, res) => {
    try {
        res.json("Request passed...");
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



// Endpoint to start a new game
router.post('/start', async (req, res) => {
    try {
        const newDeck = createDeck();

        // Shuffle the deck (Fisher-Yates algorithm)
        for (let i = newDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newDeck[i], newDeck[j]] = [newDeck[j],
            newDeck[i]];
        }

        const newGame = new Game({
            deck: newDeck,
            player: {
                name: 'Player', hand: [],
                score: 0
            },
            dealer: {
                name: 'Dealer', hand: [],
                score: 0
            },
        });

        // Deal the initial two cards to the player and the dealer
        newGame.player.hand.push(newGame.deck.pop());
        newGame.dealer.hand.push(newGame.deck.pop());
        newGame.player.hand.push(newGame.deck.pop());
        newGame.dealer.hand.push(newGame.deck.pop());

        // Update scores
        newGame.player.score = calculateScore(
            newGame.player.hand);
        newGame.dealer.score = calculateScore(
            newGame.dealer.hand);

        // Save the new game to the database
        await newGame.save();

        res.status(201).json(newGame);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



// Endpoint to handle player hits
router.post('/hit', async (req, res) => {
    try {
        const gameId = req.body.gameId;

        // Fetch the game from the database
        const game = await Game.findById(gameId);

        // Draw a card from the deck and add it to the player's hand
        const drawnCard = game.deck.pop();
        game.player.hand.push(drawnCard);

        // Update the player's score
        game.player.score = calculateScore(
            game.player.hand);

        // Set the winner field
        game.winner = determineWinner(game.player.score,
            game.dealer.score);

        // Save the updated game to the database
        await game.save();

        res.json({
            ...game.toObject(),
            winner: game.winner
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



router.post('/stand', async (req, res) => {
    try {
        const gameId = req.body.gameId;

        // Fetch the game from the database
        const game = await Game.findById(gameId);

        // Dealer draws cards until their score is 17 or higher
        while (game.dealer.score < 17) {
            const drawnCard = game.deck.pop();
            game.dealer.hand.push(drawnCard);
            game.dealer.score = calculateScore(
                game.dealer.hand);
        }

        // Set the winner field
        game.winner = determineWinner(game.player.score,
            game.dealer.score);

        // Save the updated game to the database
        await game.save();

        res.json({
            ...game.toObject(),
            winner: game.winner
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



// Add a new endpoint to delete all games
router.post('/deleteAllGames', async (req, res) => {
    try {
        await Game.deleteMany({});
        res.status(200).send('All games deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



export default router;