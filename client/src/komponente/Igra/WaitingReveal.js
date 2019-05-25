import React from 'react'

class WaitingReveal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      web3: props.core.web3,
      contract: props.core.contract,
      account: props.core.account,
      timeLeft: 9999,
      updateView: props.updateView,
      funkcijaZmagaj: props.gumbVzemiNagrado
    }

  }

  componentDidMount = async () => {

    let endBlock =  await this.state.contract.methods.getMyTimeLimit().call({from: this.state.account});

    // One mined block takes approx. 15 seconds --> calculate approx time left in minutes
    let timeLeft = (endBlock * 15) / 60;

    this.setState(
      {
        timeLeft: timeLeft
      }
    )

  };

  buttonStyle(timeLeft)
  {
    if (timeLeft <= 0)
    {
      return "btn btn-primary razmik-gumbi";
    }
    else {
      return "btn btn-primary razmik-gumbi disabled";
    }
  }

  isDisabled(timeLeft)
  {
    if (timeLeft <= 0)
    {
      return "";
    }
    else {
      return "disabled";
    }
  }

  takeReward = async () =>
  {
    await this.state.contract.methods.vzemiNagrado().send({ from: this.state.account });

    await this.updateView();
  }

  render() {
    return(
      <div className="container" >
        <div className="row">
          <div className="col-md-12 text-left">
            <center>
              <h3>Waiting for the other player to reveal their value.</h3>
              <h5>Time left: {this.state.timeLeft} minutes</h5>

              <button type="submit" className={this.buttonStyle(this.state.timeLeft)} disabled={this.isDisabled(this.state.timeLeft)} onClick={this.state.takeReward}>Take reward</button>
            </center>
          </div>
        </div>
      </div>
  );
  }
}

export default WaitingReveal;
