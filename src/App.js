import React, { Component } from "react";

import Deck from "react-poker";
import "./styles.css";
const range = (start, count) =>
  Array.apply(0, Array(count)).map((element, index) => {
    return index + start;
  });
function shuffle(array) {
  const copy = [];
  let n = array.length;
  let i;

  // While there remain elements to shuffle…
  while (n) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * array.length);

    // If not already shuffled, move it to the new array.
    if (i in array) {
      copy.push(array[i]);
      delete array[i];
      n--;
    }
  }

  return copy;
}

const suits = ["d", "c", "h", "s"];
const ranks = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K"
];

const getDeck = () =>
  shuffle(
    ranks
      .map(r => suits.map(s => r + s))
      .reduce((prev, curr) => prev.concat(curr))
  );

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { board: [], playerBoard: [], playerBoardextension: [], deck: getDeck(), numberOfPlayers: props.numberOfPlayers };
    this.handleChange = this.handleChange.bind(this);
    this.progressDeal = this.progressDeal.bind(this);
  }
  handleChange(event) { 
    const target = event.target;
    const value = target.name === 'numberOfPlayers' ? parseInt(target.value): target.value;
    const name = target.name;
    this.setState({[name]: value });
   }

  newRound() {
    const { deck, board, playerBoard, playerBoardextension, numberOfPlayers} = this.state;
    const newDeck = getDeck();
    this.setState(Object.assign({}, { board: [], playerBoard: [], playerBoardextension:[], deck: newDeck, numberOfPlayers: numberOfPlayers }));
  }

  dealFlop() {
    const { deck, board, playerBoard, playerBoardextension } = this.state;
    const flop = range(0, 3).map(e => deck.pop());

    this.setState(Object.assign({}, { board: flop, deck }));
  }

  dealPlayer(numberOfPlayers) {
    const { deck, playerBoard, playerBoardextension, board} = this.state;
    const hand = range(0, numberOfPlayers).map(e => deck.pop());
    const handextension = range(0, numberOfPlayers).map(e => deck.pop());
    this.setState(Object.assign({}, { playerBoard: hand, playerBoardextension: handextension, deck , board}));
  }

  dealCard() {
    const { deck, board, playerBoard, playerBoardextension } = this.state;
    const card = deck.pop();

    this.setState(Object.assign({}, { deck, board: board.concat(card) }));
  }

  progressDeal() {
    const { deck, board, playerBoard, playerBoardextension, numberOfPlayers} = this.state;

    if (playerBoard.length === 0) {
      this.dealPlayer(numberOfPlayers);
      return;
    }

    if (board.length === 0) {
      this.dealFlop();
      return;
    }

    if (board.length === 5) {
      this.newRound();
    } else {
      this.dealCard();
    }
  }

  render() {
    const { board , playerBoard, playerBoardextension} = this.state;

    return (
      <div style={{ left: "10vw", top: "10vh", position: "absolute" }}>
        <button
          style={{ padding: "1.5em", margin: "2em" }}
          onClick={this.progressDeal}
        >
          Deal
        </button>
        <input name="numberOfPlayers" type="number" min={1} max={8} onChange={this.handleChange} value={this.state.numberOfPlayers} />
        <Deck board={playerBoard} boardXoffset={175} boardYoffset={0} size={100} />
        <Deck board={playerBoardextension} boardXoffset={175} boardYoffset={20} size={100} />
        <Deck board={board} boardXoffset={375} boardYoffset={200} size={150} />
      </div>
    );
  }
}

export default App;