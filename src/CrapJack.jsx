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
            toggleRules: false
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

        for (let i = 0; i < this.state.dealersCard.length; i++) {
            dealerTotalScore += this.getScore(this.state.dealersCard[i].value);
        }

        for (let i = 0; i < this.state.playersCard.length; i++) {
            playerTotalScore += this.getScore(this.state.playersCard[i].value);
        }

        if (dealerTotalScore <= 21 && (dealerTotalScore > playerTotalScore || playerTotalScore > 21)) {
            this.setState({ 
                dealerScore: this.state.dealerScore + 1,
                result: 'Dealer Won'
            });
        } else if (playerTotalScore <= 21 && (playerTotalScore > dealerTotalScore || dealerTotalScore > 21)) {
            this.setState({
                playerScore: this.state.playerScore + 1,
                result: 'You Won!!'
            });
        } else if (playerTotalScore > 21 && dealerTotalScore > 21){
            this.setState({ result: 'Both Hands Busted' });
        } else {
            this.setState({ result: 'It is a TIE' });
        }
        this.setState({revealCards: true});
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
        return (
            <div>
                <h1 id='game-title'> Crap Jack </h1>
                <Button id='start-button' type='button' disabled={this.state.isGameStarted} onClick={this.startGame}> Start A Game </Button>
                <div className='rules' onClick={() => this.setState({ toggleRules: !this.state.toggleRules })}> View Rules </div>
                {
                    this.state.toggleRules && <Rules />
                }

                <div className='playing-table'>
                    {
                        this.state.isGameStarted && <h2>Dealer's Cards! Games Won: {this.state.dealerScore}</h2>
                    }
                    <p>
                        {
                            this.state.revealCards ?
                            this.state.dealersCard && (
                                this.state.dealersCard.map((card, i) => {
                                    return <Image className='dealer-card drawn-cards' key={i} alt={card.code} src={card.image} />
                                })
                            ) :
                            this.state.dealersCard && (
                                this.state.dealersCard.map((card, i) => {
                                    return <Image className='dealer-card drawn-cards' key={i} alt={card.code} src='https://upload.wikimedia.org/wikipedia/commons/5/54/Card_back_06.svg' />
                                })
                            )
                        }
                    </p>
                    {
                        this.state.isGameStarted && <h2><Random text={this.state.result} /></h2>
                    }
                    {
                        this.state.isGameStarted ? 
                            this.state.revealCards ? 
                            <Button className='deal-button deal-reveal' type='button' onClick={this.startGame} variant="warning"> Deal Another Hand </Button> :
                            <Button className='reveal-button deal-reveal' type='button' onClick={this.revealCardsAndWinner} variant="danger"> Reveal! </Button> :
                        ''
                    }
                    <p>
                        {
                            this.state.playersCard && (
                                this.state.playersCard.map((card, i) => {
                                    return <Image className='player-card drawn-cards' key={i} alt={card.code} src={card.image} />
                                })
                            )
                        }
                    </p>
                    {
                        this.state.isGameStarted && <h2>Your Cards! Games Won: {this.state.playerScore}</h2>
                    }
                </div>
            </div>
        );
    }
}

export default CrapJack;
