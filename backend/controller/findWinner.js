// Helper function to determine the winner
export function determineWinner(playerScore,
    dealerScore) {
    if (playerScore > 21) {
        return 'Dealer'; // Player busts, dealer wins
    }

    if (dealerScore > 21) {
        return 'Player'; // Dealer busts, player wins
    }

    if (playerScore > dealerScore) {
        return 'Player'; // Player has a higher score
    } else if (playerScore < dealerScore) {
        return 'Dealer'; // Dealer has a higher score
    } else {
        return 'Draw'; // Scores are equal, it's a draw
    }
}



