import React from 'react'

class WaitingEntry extends React.Component {

  constructor(props) {
    super(props);

    // Next we establish our state
    this.state = {
      funkcijaPreklici: props.gumbPreklici,
      contract: props.core.contract,
      account: props.core.account,
      updateView: props.updateView
    }

  }

  // We can cancel the game if no other player joined yet
  cancelGame = async () =>
  {
    await this.state.contract.methods.AbortGame().send({ from: this.state.account });

    this.state.updateView();
  }

  render() {
    return(
      <div className="container" >
        <div className="row">
          <div className="col-md-12 text-left">

            <center>
            <h3>Waiting for another player</h3>
            <br />
            <h6>You can still cancel the game until no other player has joined. The whole entry fee will be automatically reimbursed to you.</h6>
            <button type="submit" className="btn btn-danger razmik-gumbi" onClick={this.cancelGame}>Cancel</button>
            </center>
          </div>
        </div>
      </div>
  );
  }
}


export default WaitingEntry;
