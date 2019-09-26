import React from 'react';
import axios from "axios";
import { Button, Image } from 'react-bootstrap';
import { Random } from 'react-animated-text';
import Rules from './components/Rules';

class CrapJack extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deckID: '',
            isGameStarted: false,
            revealCards: false,
            dealersCard: [],
            playersCard: [],
            dealerScore: 0,
            playerScore: 0,
            result: '',
            toggleRules: false,
            playerWinningStreak : 0
        };
    }

    componentDidMount() {
        axios
        .get("https://deckofcardsapi.com/api/deck/new/shuffle/")
        .then(response => {
            this.setState({ 
                deckID: response.data.deck_id
            });
        })
        .catch(err => {
            console.log("oh no!!", err);
        });
    }

    startGame = async () => {
        if (this.state.isGameStarted) {
            await axios.get("https://deckofcardsapi.com/api/deck/" + this.state.deckID + "/shuffle/");
            this.setState({
                revealCards: false,
                result: ''
            });
        }

        axios
        .get("https://deckofcardsapi.com/api/deck/" + this.state.deckID + "/draw/?count=6")
        .then(response => {
            console.log(response.data.remaining);
            this.setState({ 
                deckID: response.data.deck_id,
                dealersCard : response.data.cards.slice(0, 3),
                playersCard : response.data.cards.slice(3),
                isGameStarted : true
            });
        })
        .catch(err => {
            console.log("oh no!!", err);
        });
    }

    revealCardsAndWinner = () => {
        let dealerTotalScore = 0;
        let playerTotalScore = 0;
        const {dealersCard, playersCard, dealerScore, playerScore, playerWinningStreak} = this.state;

        for (let i = 0; i < dealersCard.length; i++) {
            dealerTotalScore += this.getScore(dealersCard[i].value);
        }

        for (let i = 0; i < playersCard.length; i++) {
            playerTotalScore += this.getScore(playersCard[i].value);
        }

        if (dealerTotalScore <= 21 && (dealerTotalScore > playerTotalScore || playerTotalScore > 21)) {
            this.setState({ 
                dealerScore: dealerScore + 1,
                result: 'Dealer Won',
                playerWinningStreak: 0
            });
        } else if (playerTotalScore <= 21 && (playerTotalScore > dealerTotalScore || dealerTotalScore > 21)) {
            this.setState({
                playerScore: playerScore + 1,
                result: 'You Won!!',
                playerWinningStreak: playerWinningStreak + 1
            });
        } else if (playerTotalScore > 21 && dealerTotalScore > 21){
            this.setState({ 
                result: 'Both Hands Busted',
                playerWinningStreak: 0
            });
        } else {
            this.setState({ result: 'It is a TIE' });
        }
        this.setState({
            revealCards: true
        });
    }

    getScore(value) {
        switch (value) {
            case 'ACE':
            case 'KING':
            case 'QUEEN':
            case 'JACK':
                return 10;
            default:
                return parseInt(value);
        }
    }

    render() {
        const {isGameStarted, toggleRules, dealerScore, revealCards, dealersCard, result, playersCard, playerScore, playerWinningStreak} = this.state;
        return (
            <div>
                <h1 id='game-title'> Crap Jack </h1>
                <Button id='start-button' type='button' disabled={isGameStarted} onClick={this.startGame}> Start A Game </Button>
                <div className='rules' onClick={() => this.setState({ toggleRules: !toggleRules })}> View Rules </div>
                {
                    toggleRules && <Rules />
                }

                <div className='playing-table'>
                    {
                        isGameStarted && <h2>Dealer's Cards! Games Won: {dealerScore}</h2>
                    }
                    <p>
                        {
                            revealCards ?
                            dealersCard && (
                                dealersCard.map((card, i) => {
                                    return <Image className='dealer-card drawn-cards' key={i} alt={card.code} src={card.image} />
                                })
                            ) :
                            dealersCard && (
                                dealersCard.map((card, i) => {
                                    return <Image className='dealer-card drawn-cards' key={i} alt={card.code} src='https://upload.wikimedia.org/wikipedia/commons/5/54/Card_back_06.svg' />
                                })
                            )
                        }
                    </p>
                    {
                        isGameStarted && <h2><Random text={result} /></h2>
                    }
                    {
                        isGameStarted ? 
                            revealCards ? 
                            <Button className='deal-button deal-reveal' type='button' onClick={this.startGame} variant="warning"> Deal Another Hand </Button> :
                            <Button className='reveal-button deal-reveal' type='button' onClick={this.revealCardsAndWinner} variant="danger"> Reveal! </Button> :
                        ''
                    }
                    <p>
                        {
                            playersCard && (
                                playersCard.map((card, i) => {
                                    return <Image className='player-card drawn-cards' key={i} alt={card.code} src={card.image} />
                                })
                            )
                        }
                    </p>
                    {
                        isGameStarted && 
                        <React.Fragment>
                            <h2>Your Cards! Games Won: {playerScore}</h2>
                            <h2>Winning Streak: {playerWinningStreak}</h2>
                        </React.Fragment>
                    }
                </div>
            </div>
        );
    }
}

export default CrapJack;
