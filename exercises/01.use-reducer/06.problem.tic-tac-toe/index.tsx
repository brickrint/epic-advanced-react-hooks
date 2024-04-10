import { useEffect, useReducer, useState } from 'react'
import * as ReactDOM from 'react-dom/client'
import {
	calculateNextValue,
	calculateStatus,
	calculateWinner,
	isValidGameState,
	type GameState,
	type Squares,
} from '#shared/tic-tac-toe-utils'

function Board({
	squares,
	onClick,
}: {
	squares: Squares
	onClick: (index: number) => void
}) {
	function renderSquare(i: number) {
		const value = squares[i]
		const label = value ? `square ${i}, ${value}` : `square ${i} empty`

		return (
			<button className="square" onClick={() => onClick(i)} aria-label={label}>
				{squares[i]}
			</button>
		)
	}

	return (
		<div>
			<div className="board-row">
				{renderSquare(0)}
				{renderSquare(1)}
				{renderSquare(2)}
			</div>
			<div className="board-row">
				{renderSquare(3)}
				{renderSquare(4)}
				{renderSquare(5)}
			</div>
			<div className="board-row">
				{renderSquare(6)}
				{renderSquare(7)}
				{renderSquare(8)}
			</div>
		</div>
	)
}

const defaultState: GameState = {
	history: [Array(9).fill(null)],
	currentStep: 0,
}

const localStorageKey = 'tic-tac-toe'

type GameAction = {type: 'SELECT_SQUARE', index: number} | {type: 'RESTART'} | {type: 'SELECT_STEP', step: number}
// 🦺 Create a GameAction type here which supports all three types of state changes
// that can happen for our reducer: SELECT_SQUARE, RESTART, and SELECT_STEP.
function gameStateReducer(state: GameState, action: GameAction): GameState {
	switch (action.type) {
		case 'SELECT_SQUARE': {
			const { currentStep, history } = state
			const currentSquares = history[currentStep]

			const nextValue = calculateNextValue(currentSquares)
			const newHistory = history.slice(0, currentStep + 1)
			const squares = history[currentStep].with(action.index, nextValue)

			return {
				...state,
				history: [...newHistory, squares],
				currentStep: newHistory.length,
			}
		};

		case 'SELECT_STEP': {
			return {
				...state,
				currentStep: action.step
			}
		}

		case 'RESTART': return defaultState

		default: {
			return state
		}
	}
}
// 🐨 Create a gameStateReducer function which accepts the GameState and GameAction
// and handle all three types of state changes.
// 💰 you can borrow lots of the logic from the component below in your implementation

// 🐨 Create a getInitialGameState function here which returns the initial game
// state (move this from the useState callback below)

function App() {
	// 🐨 change this to use useReducer with the gameStateReducer and the getInitialGameState function
	const [state, dispatch] = useReducer(gameStateReducer, defaultState, (initial) => {
		let localStorageValue
		try {
			localStorageValue = JSON.parse(
				window.localStorage.getItem(localStorageKey) ?? 'null',
			)
		} catch {
			// something is wrong in localStorage, so don't use it
		}
		return isValidGameState(localStorageValue)
			? localStorageValue
			: initial
	})

	const currentSquares = state.history[state.currentStep]

	const winner = calculateWinner(currentSquares)
	const nextValue = calculateNextValue(currentSquares)
	const status = calculateStatus(winner, currentSquares, nextValue)

	useEffect(() => {
		window.localStorage.setItem(localStorageKey, JSON.stringify(state))
	}, [state])

	function selectSquare(index: number) {
		// 🐨 move this logic to the reducer
		// then call the dispatch function with the proper type
		if (winner || currentSquares[index]) return

		dispatch({ type: 'SELECT_SQUARE', index})
	}

	function restart() {
		// 🐨 update this to use the dispatch function with the proper type
		dispatch({ type: 'RESTART' })
	}

	const moves = state.history.map((_stepSquares, step) => {
		const desc = step ? `Go to move number ${step}` : 'Go to game start'
		const isCurrentStep = step === state.currentStep
		const label = isCurrentStep ? `${desc} (current)` : desc
		// NOTE: the "step" is actually the "index" which normally you don't want to
		// use as the "key" prop. However, in this case, the index is effectively
		// the "id" of the step in history, so it is correct.
		return (
			<li key={step}>
				<button
					// 🐨 update this to use the dispatch function with the proper type
					onClick={() =>
						dispatch({ type: 'SELECT_STEP', step })
					}
					aria-disabled={isCurrentStep}
					aria-label={label}
					aria-current={isCurrentStep ? 'step' : undefined}
				>
					{desc} {isCurrentStep ? '(current)' : null}
				</button>
			</li>
		)
	})

	return (
		<div className="game">
			<div className="game-board">
				<Board onClick={selectSquare} squares={currentSquares} />
				<button className="restart" onClick={restart}>
					restart
				</button>
			</div>
			<div className="game-info">
				<div aria-live="polite">{status}</div>
				<ol>{moves}</ol>
			</div>
		</div>
	)
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)

/*
eslint
	@typescript-eslint/no-unused-vars: "off",
*/
