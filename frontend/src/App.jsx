import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Confetti from 'react-confetti';
import './index.css';

const Game = () => {
	const initialGameState = {
		player: {
			hand: [{ rank: '_', suit: '_' }],
			score: '_'
		},
		dealer: {
			hand: [{ rank: '_', suit: '_' }],
			score: '_'
		}
	};

	const [gameState, setGameState] = useState(initialGameState);
	const [winnerMessage, setWinnerMessage] = useState('');
	const [gameEnded, setGameEnded] = useState(false);
	const [celebration, setCelebration] = useState(false);


	// Add a function to delete all games
	const deleteAllGames = () => {
		axios.post('http://127.0.0.1:3000/api/game/deleteAllGames')
			.then(response => {
				console.log(response.data);
			})
			.catch(error => console.error('Error deleting all games:', error));
	};

	useEffect(() => {
		deleteAllGames();
		// Clear local storage on page load
		localStorage.removeItem('gameState');
		setGameState(initialGameState);
	}, []);


	const handleHit = () => {
		if (gameEnded || !gameState._id) {
			setWinnerMessage('Please! start a new game first');
			return;
		}
		axios.post('http://127.0.0.1:3000/api/game/hit', { gameId: gameState._id })
			.then(response => {
				setGameState(response.data);
				localStorage.setItem('gameState', JSON.stringify(response.data));
				checkWinner(response.data.winner);
			})
			.catch(error => console.error('Error hitting:', error));
	};


	const handleStand = () => {
		if (gameEnded || !gameState._id) {
			setWinnerMessage('Please! start a new game first');
			return;
		}
		axios.post('http://127.0.0.1:3000/api/game/stand', { gameId: gameState._id })
			.then(response => {
				setGameState(response.data);
				localStorage.setItem('gameState', JSON.stringify(response.data));
				checkWinner(response.data.winner);
			})
			.catch(error => console.error('Error standing:', error));
	};


	const startNewGame = () => {
		setWinnerMessage(''); // Clear the winner message
		setGameEnded(false); // Reset gameEnded state
		setCelebration(false); // Reset celebration state
		deleteAllGames(); // Delete all games

		axios.post('http://127.0.0.1:3000/api/game/start')
			.then(response => {
				setGameState(response.data);
				localStorage.setItem('gameState', JSON.stringify(response.data));
			})
			.catch(error => console.error('Error starting a new game:', error));
	};


	const checkWinner = (winner) => {
		if (winner === 'Player') {
			setCelebration(true);
		}
		setWinnerMessage(`Winner: ${winner}`);
		setGameEnded(true);
	};


	return (
		<div className="kl">
			{celebration && <Confetti />}
			{gameState ? (
				<>
					<h1>Blackjack Game</h1>
					{winnerMessage && <p className="winner-message">
						{winnerMessage} </p>}
					<div className="ma">
						<div className="playerside">
							<h2>Player Hand:</h2>
							<ul>
								{gameState.player.hand.map((card, index) => (
									<li key={index}><b>{card.rank}</b> of <i><b>{card.suit}</b></i></li>
								))}
							</ul>
							<p>Score: <b>{gameState.player.score}</b></p>
						</div>
						<div className="dealerside">
							<h2>Dealer Hand:</h2>
							<ul>
								{gameState.dealer.hand.map((card, index) => (
									//  <li key={index}>{card.rank} of {card.suit}</li>
									<li key={index}><b>{card.rank}</b> of <i><b>{card.suit}</b></i></li>
								))}
							</ul>
							<p>Score: <b>{gameState.dealer.score}</b></p>
						</div>
					</div>
					<div className="buttons">
						<div className="button-bg"><button onClick={handleHit}>Hit</button></div>
						<div className="button-bg"><button onClick={handleStand}>Stand</button></div>
						<div className="button-bg"><button onClick={startNewGame}>Start New Game</button></div>
					</div>
				</>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
};

export default Game;
