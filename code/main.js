import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import './main.css'
class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lastNumber: 0,
            numberOfCards: 0,
            totalBet: 0,
            usedNums: [],
        }
        if (typeof this.state === "undefined") {
            alert("something is undefined");
        }
        if (typeof web3 != 'undefined') {
            console.log("Using web3 detected from external source like Metamask")
            this.web3 = new Web3(web3.currentProvider)
        } else {
            console.log("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
            this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
        }
        const MyContract = web3.eth.contract([
            {
                "constant": true,
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "totalBet",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "players",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "playerInfo",
                "outputs": [
                    {
                        "name": "amountBet",
                        "type": "uint256"
                    },
                    {
                        "name": "numberSelected",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "numberOfCards",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
           
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "player",
                        "type": "address"
                    }
                ],
                "name": "checkPlayerExists",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "lastNumber",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "numberSelected",
                        "type": "uint256"
                    }
                ],
                "name": "bet",
                "outputs": [],
                "payable": true,
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "payable": true,
                "stateMutability": "payable",
                "type": "fallback"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "distributePrizes",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            
            {
                "constant": false,
                "inputs": [],
                "name": "generateNumberWinner",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "kill",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ])
        this.state.ContractInstance = MyContract.at("0x4d78d671d4abbaf092c7b159ea24c2a95b79ae80")
    }
    componentDidMount() {
        this.anotherCard()
        this.newCard()
        this.updateState()
        this.setupListeners()
        setInterval(this.updateState.bind(this), 10e3)
    }

    initAll() {
        if (document.getElementById) {
            //document.getElementById("reload").onclick = this.anotherCard()
            this.newCard()
        }
        else {
            alert("Your browser does not support this script.");
        }
    }

    newCard() {
        for (var i = 0; i < 24; i++) {
            this.setSquare(i)
        }
    }

     setSquare(thisSquare) {
        var currentSquare = "square" + thisSquare;
        var colPlace = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4];
        var colBasis = colPlace[thisSquare] * 15;
        var newNum = colBasis + this.getNewNum() + 1;

        do {
            newNum = colBasis + this.getNewNum() + 1;
        } while (this.state.usedNums[newNum]);

        this.state.usedNums[newNum] = true;
        document.getElementById(currentSquare).innerHTML = newNum;
     }

    getNewNum() {
        return Math.floor(Math.random() * 15);
    }

    anotherCard() {
        for (var i = 1; i < 76; i++) {
            this.state.usedNums[i] = false;
        };

        this.newCard();
        return false;
    }
    updateState() {
       
        this.state.ContractInstance.totalBet((err, result) => {
            if (result != null) {
                this.setState({
                    totalBet: parseFloat(web3.fromWei(result, 'ether'))
                })
            }
        })
        this.state.ContractInstance.numberOfCards((err, result) => {
            if (result != null) {
                this.setState({
                    numberOfCards: parseInt(result)
                })
            }
        })
        
        this.state.ContractInstance.lastNumber((err, result) => {
            if (result != null) {
                this.setState({
                    lastNumber: parseInt(result)
                })
            }
        })
    }

    // Listen for events and executes the voteNumber method
    setupListeners() {
        
    }
    render() {
        return (
            <div className="main-container">
                <h1>Buy as many cards as you want and win huge amounts of Ether</h1>
                <div className="block">
                    <b>Number of cards:</b> &nbsp;
               <span>{this.state.numberOfCards}</span>
                </div>
                <div className="block">
                    <b>Last chosen number:</b> &nbsp;
               <span>{this.state.lastNumber}</span>
                </div>
                <div className="block">
                    <b>Total bet:</b> &nbsp;
               <span>{this.state.totalBet} ether</span>
                </div>

                <hr />
                <h2>Wait for the next number</h2>
                <label>
                    <b>How much cards do you want to buy? <input className="bet-input" ref="ether-bet" type="number" placeholder={this.state.numberOfCards} /></b> ether
               <br />
                </label>
                
                <h1>This is your Bingo Card</h1>
                <table>
                    <tr>
                        <th width="20%">B</th>
                        <th width="20%">I</th>
                        <th width="20%">N</th>
                        <th width="20%">G</th>
                        <th width="20%">O</th>
                    </tr>
                    <tr>
                        <td id="square0">&nbsp;</td>
                        <td id="square1">&nbsp;</td>
                        <td id="square2">&nbsp;</td>
                        <td id="square3">&nbsp;</td>
                        <td id="square4">&nbsp;</td>
                    </tr>
                    <tr>
                        <td id="square5">&nbsp;</td>
                        <td id="square6">&nbsp;</td>
                        <td id="square7">&nbsp;</td>
                        <td id="square8">&nbsp;</td>
                        <td id="square9">&nbsp;</td>
                    </tr>
                    <tr>
                        <td id="square10">&nbsp;</td>
                        <td id="square11">&nbsp;</td>
                        <td id="free">Free</td>
                        <td id="square12">&nbsp;</td>
                        <td id="square13">&nbsp;</td>
                    </tr>
                    <tr>
                        <td id="square14">&nbsp;</td>
                        <td id="square15">&nbsp;</td>
                        <td id="square16">&nbsp;</td>
                        <td id="square17">&nbsp;</td>
                        <td id="square18">&nbsp;</td>
                    </tr>
                    <tr>
                        <td id="square19">&nbsp;</td>
                        <td id="square20">&nbsp;</td>
                        <td id="square21">&nbsp;</td>
                        <td id="square22">&nbsp;</td>
                        <td id="square23">&nbsp;</td>
                    </tr>
                </table>
            </div>
        )
    }
}
ReactDOM.render(
    <App />,
    document.querySelector('#root')
)

