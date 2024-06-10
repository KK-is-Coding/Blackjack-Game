import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const Game = () => {
	const [gameState, setGameState] = useState(null);
	const [winnerMessage, setWinnerMessage] = useState('');
	const [gameEnded, setGameEnded] = useState(false);

	useEffect(() => {
		const storedGameState = localStorage.getItem('gameState');
		if (storedGameState) {
			setGameState(JSON.parse(storedGameState));
		} else {
			setGameState({
				player: {
					hand: [{ rank: '_', suit: '_' }],
					score: '_'
				},
				dealer: {
					hand: [{ rank: '_', suit: '_' }],
					score: '_'
				}
			});
		}
	}, []);

	const handleHit = () => {
		if (gameEnded) {
			setWinnerMessage('Please! start a new game first');
			return;
		}
		axios.post('http://127.0.0.1:5000/api/game/hit', { gameId: gameState._id })
			.then(response => {
				setGameState(response.data);
				localStorage.setItem('gameState', JSON.stringify(response.data));
				checkWinner(response.data.winner);
			})
			.catch(error => console.error('Error hitting:', error));
	};

	const handleStand = () => {
		if (gameEnded) {
			setWinnerMessage('Please! start a new game first');
			return;
		}
		axios.post('http://127.0.0.1:5000/api/game/stand', { gameId: gameState._id })
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
		try {
			localStorage.removeItem('gameState'); // Clear game state from local storage
		} catch (error) {
			console.error('Error clearing game state from local storage:', error);
		}
		axios.post('http://127.0.0.1:5000/api/game/start')
			.then(response => {
				setGameState(response.data);
				localStorage.setItem('gameState', JSON.stringify(response.data));
			})
			.catch(error => console.error('Error starting a new game:', error));
	};

	const checkWinner = (winner) => {
		setWinnerMessage(`Winner: ${winner}`);
		setGameEnded(true);
	};

	return (
		<div className="kl">
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
						<button onClick={handleHit}>Hit</button>
						<button onClick={handleStand}>Stand</button>
						<button onClick={startNewGame}>Start New Game</button>
					</div>
				</>
			) : (
				<p>Loading...</p>
			)}
		</div>

	);
};

export default Game;