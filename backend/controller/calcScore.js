// Helper function to calculate the score of a hand
export function calculateScore(hand) {
    let score = hand.reduce((total, card) =>
        total + card.value, 0);

    // Handle Aces (reduce value from 11 to 1 if necessary)
    hand.filter(card => card.rank === 'A')
        .forEach(_ => {
            if (score > 21) {
                score -= 10;
            }
        });

    return score;
}