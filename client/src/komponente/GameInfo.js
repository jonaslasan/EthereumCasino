import React from 'react'

class GameInfo extends React.Component {

  constructor(props) {
    super(props);

    // Next we establish our state
    this.state = {
      web3: props.core.web3,
      contract: props.core.contract,
      gameId: props.gameId,
      account: props.core.account,
      addresses: null,
      signatures: null,
      hashes: null,
      xor: null,
      decimal: null,
      winnerId: null,
      isFinished: false,
      gameState: ''
    }

  }

  componentWillReceiveProps(newProps) {
    if (newProps.gameId == this.state.gameId)
      return;

    this.setState(
      {
        addresses: null
      }
    );

    this.fetchGameData(newProps.gameId);
  }

  componentDidMount = async () => {
    this.fetchGameData(this.state.gameId);
  };

  fetchGameData = async (gameId) =>
  {
    let web3 = this.state.web3;
    let contract = this.state.contract;

    if (gameId === null)
    {
      gameId = await contract.methods.getMyGameId().call({ from: this.state.account });
    }

    let firstAddress = await contract.methods.getPlayerAddress(gameId, 0).call();
    let secondAddress = await contract.methods.getPlayerAddress(gameId, 1).call();

    let addresses = [firstAddress, secondAddress];

    let firstSignature = await contract.methods.getDigitalSignature(gameId, 0).call();
    let secondSignature = await contract.methods.getDigitalSignature(gameId, 1).call();

    // Display 0x00.. instead of blank
    if (firstSignature == null)
    {
      firstSignature = "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
    }
    if (secondSignature == null)
    {
      secondSignature = "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
    }

    let signatures = [firstSignature, secondSignature];


    const firstHash = await contract.methods.getHash(gameId, 0).call();
    const secondHash = await contract.methods.getHash(gameId, 1).call();

    let hashes = [firstHash, secondHash]

    const gameState = await contract.methods.getMyGameState().call();

    const isOver = gameState == 3;

    let xor = null;
    let decimal = null;
    let winnerIndex = null;

    if (isOver)
    {
      // Izračunamo xor hashov, stevilcno vrednost in id zmagovalca
      xor = await contract.methods.getXor(gameId).call();
      decimal = await contract.methods.getDecimalValue(gameId).call();
      winnerIndex = await contract.methods.getWinnerIndex(gameId).call();
    }

    this.setState({addresses: addresses,
                   signatures: signatures,
                   hashes: hashes,
                   isOver: isOver,
                   xor: xor,
                   decimal: decimal,
                   winnerIndex: winnerIndex,
                   gameId: gameId
                 });
  }

  RenderGameResult ()
  {
    if (!this.state.isOver)
      return;

    return(
      <div className="row">
        <div className="col-md-12 text-left">
          <div className="card">
            <h5 className="card-header">Outcome:</h5>
              <div className="card-body">
              <h5 className="card-title">XOR function of both hashes:</h5>
              <p className="card-title">{this.state.xor}</p>
              <hr />
              <h5 className="card-text">Decimal value:</h5>
              <p className="card-text">{this.state.decimal}</p>
              <hr />
              <h5 className="card-text">Winner ID:</h5>
              <p className="card-text">{this.state.winnerIndex}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  RenderGameData ()
  {
    let indexes = [0, 1];

    return indexes.map(index =>
    (
      <div key={index}>
        <div className="row">
          <div className="col-md-12 text-left">
            <div className="card">
              <h5 className="card-header">Player {index + 1}</h5>
              <div className="card-body">
                <h5 className="card-title">Address: {this.state.addresses[index]}</h5>
                <hr />
                <h5 className="card-text">ID: {index}</h5>
                <hr />
                <h5 className="card-text">Signature:</h5>
                <p className="card-text">{this.state.signatures[index]}</p>
                <hr />
                <h5 className="card-text">Hash:</h5>
                <p className="card-text">{this.state.hashes[index]}</p>
              </div>
            </div>
          </div>
        </div>
        <br />
      </div>
    ));
  }

  render() {
    if (this.state.addresses === null)
    {
      return (
        <div className="container text-left" >
          <center>
            <h3>Fetching data</h3>
            <br />
          </center>
        </div>
      );
    }

    return(
      <div className="container text-left" >
      <hr />
        <h2>Game ID: {this.state.gameId}</h2>

        {this.RenderGameResult()}
        <br />
        {this.RenderGameData()}

      </div>
  );
  }
}


export default GameInfo;
