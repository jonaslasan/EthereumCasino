import React from 'react';
import End from './Igra/End';
import Entry from './Igra/Entry';
import Loading from './Igra/Loading';
import getCore from "../Web3Manager";
import Reveal from './Igra/Reveal';
import WaitingEntry from './Igra/WaitingEntry';
import WaitingReveal from './Igra/WaitingReveal';
import GameInfo from './GameInfo'

class Game extends React.Component {

  constructor(props) {
    super(props);

    this.gameState = {
      NONE: "none",
      ENTRY: "entry",
      WAITING_FOR_OPPONENT: "waiting_for_opponent",
      REVEAL: "reveal",
      WAITING_FOR_REVEAL: "waiting_for_reveal",
      END: "end"
    };

    // Next we establish our state
    this.state = {
      core: null,
      account: '',
      myGameState: this.gameState.NONE,
    }

    this.RenderState = this.RenderState.bind(this);
    this.RenderGameData = this.RenderGameData.bind(this);
    this.generateTitle = this.generateTitle.bind(this);
  }

  componentDidMount = async () => {
    try {
await this.getRemoteState();
    } catch (e) {
console.log("e " + e);
    } finally {

    }
  };

  getRemoteState = async () =>
  {
    let core = this.state.core;

    if (core === null)
      core = await getCore();
    else if (core.error)
      core = await getCore();
    else
      core.account = (await core.web3.eth.getAccounts())[0];

    let myGameState = null;
    let myGameId = await core.contract.methods.getMyGameId().call({from: core.account});

    if (myGameId == 0)
    {
      myGameState = this.gameState.ENTRY;
    }
    else
    {
      let state = await core.contract.methods.getMyGameState().call({from: core.account});

      if (state == 0)
        myGameState = this.gameState.WAITING_FOR_OPPONENT;
      if (state == 1)
        myGameState = this.gameState.REVEAL;
      if (state == 2)
        myGameState = this.gameState.WAITING_FOR_REVEAL;
      if (state == 3)
        myGameState = this.gameState.END;
    }

    let balance = core.web3.utils.fromWei(await core.web3.eth.getBalance(core.account));

    this.setState({
      core: core,
      account: core.account,
      myGameState: myGameState,
      balance: balance
    });
  }

  RenderState()
  {
    let gameState = this.state.myGameState;
    let core = this.state.core;

    if (this.state.core == null)
      return <Loading />

    if (gameState == this.gameState.ENTRY)
      return <Entry  core={core} updateView={this.getRemoteState}/>

    if (gameState == this.gameState.WAITING_FOR_OPPONENT)
      return <WaitingEntry core={core} updateView={this.getRemoteState} />

    if (gameState == this.gameState.REVEAL)
      return <Reveal core={core} updateView={this.getRemoteState} />

    if (gameState == this.gameState.WAITING_FOR_REVEAL)
      return <WaitingReveal core={core} updateView={this.getRemoteState} />

    if (gameState == this.gameState.END)
      return <End core={core} updateView={this.getRemoteState} />

  }

  generateTitle()
  {
    if (this.state.myGameState == this.gameState.NONE)
      return "Loading";
    if (this.state.myGameState == this.gameState.ENTRY)
      return "Entry phase";
    if (this.state.myGameState == this.gameState.WAITING_FOR_OPPONENT)
      return "Entry phase";
    if (this.state.myGameState == this.gameState.REVEAL)
      return "Reveal phase";
    if (this.state.myGameState == this.gameState.WAITING_FOR_REVEAL)
      return "Reveal phase";
    if (this.state.myGameState == this.gameState.END)
      return "End phase";
  }

  RenderGameData()
  {
    if (this.state.myGameState == this.gameState.NONE ||
        this.state.myGameState == this.gameState.ENTRY)
        return null;

    // Probably bad practice to re-render component using date time as unique value 🤷
    return (<GameInfo core={this.state.core} gameId={null} uniqueKey={new Date().getTime()}  />);
  }

  render() {
    return(
      <div className="container text-left" >
        <div className="row">
          <div className="col-md-12 text-left">
          <div className="card">
            <div className="card-header">
              <h3>{this.generateTitle(this.state)}</h3>
            </div>
            <div className="card-body" id="izborUporabnika">
              <h5 className="card-title">Used account: {this.state.account}</h5>
              <h5 className="card-title">Balance: {this.state.balance} ETH</h5>
              <hr/>
                <this.RenderState />
                <this.RenderGameData />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  }
}

export default Game;
