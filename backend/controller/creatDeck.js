import { Card } from "../model/cardModel.js";


// Helper function to create a new deck
export function createDeck() {
    const suits =
        ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const ranks =
        ['2', '3', '4', '5', '6', '7', '8',
            '9', '10', 'J', 'Q', 'K', 'A'];

    const deck = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            const card = new Card({
                suit: suit,
                rank: rank,
                value: rank ===
                    'A' ? 11 : isNaN(rank) ?
                    10 : parseInt(rank),
            });
            deck.push(card);
        }
    }

    return deck;
}
