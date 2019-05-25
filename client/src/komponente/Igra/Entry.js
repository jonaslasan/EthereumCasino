import React from 'react'

class Entry extends React.Component {

  constructor(props) {
    super(props);

    let core = props.core;

    // Next we establish our state
    this.state = {
      web3: core.web3,
      account: core.account,
      contract: core.contract,
      myValue: "",
      updateView: props.updateView
    }

    this.randomValue = this.randomValue.bind(this);
  }

  componentDidMount = async () => {
    this.randomValue();

    let web3 = this.state.web3;
    let account = this.state.account;
    let contract = this.state.contract;

    let price = web3.utils.fromWei(await contract.methods.getEntranceFee().call({from: account}));
    let fee = web3.utils.fromWei(await contract.methods.getCasinoFee().call({from:  account}));
    let reward = (price * 2) - fee;

    this.setState(
      {
          price: price,
          reward: reward
      }
    );
  };

  randomValue() {
    let length = 32;
    var possibleChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (var i = 0; i < length; i++)
      result += possibleChar.charAt(Math.floor(Math.random() * possibleChar.length));

      this.setState({myValue: result});
  }

  valueChanged(value){
    this.setState({
         myValue: value
    });
  }

  joinTheGame = async () =>
  {
    let account = this.state.account;
    let web3 = this.state.web3;
    let myValue = this.state.myValue;

    // SHA3 hash
    const entryHash = web3.utils.sha3(myValue);

    const digitalSig = await web3.eth.personal.sign(entryHash, account);

    await this.state.contract.methods.EnterTheGame(digitalSig).send({ from: account, value:50000000000000000 });

    let deterministicId = 'niz_' + account ;
    localStorage.setItem(deterministicId, myValue);

    this.state.updateView();
  }

  render() {
    return(
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <div className="tekst-levo">

                <h5>Entry fee: {this.state.price} ETH</h5>
                <h5>Reward: {this.state.reward} ETH</h5>

                <hr />
                <p>Provide a random value that will be digitaly signed with your private key.</p>
                <p><b>Save your value</b> (remember it or write it down), you will need it later.</p>
                <hr />
                <h4>Your value:</h4>
              </div>
            </div>
            <div className="input-group">
               <input className="form-control" id="stevilo"  value={this.state.myValue} onChange={e => this.valueChanged(e.target.value)}/>
               <span className="input-group-btn">
                    <button type="submit" className="btn btn-info razmik-gumbi" onClick={this.randomValue}>Generate</button>
               </span>
            </div>

            <br/>
            <button type="submit" className="btn btn-primary razmik-gumbi" onClick={this.joinTheGame}>Join</button>

          </div>
        </div>
      </div>
  );
  }
}


export default Entry;
