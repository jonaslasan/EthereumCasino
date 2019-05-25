import React from 'react'

class End extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      account: props.core.account,
      contract: props.core.contract,
      updateView: props.updateView,
      message: "Loading...",
      buttonText: "",
      buttonStyle: "btn btn-default disabled"
    }
  }

  componentDidMount = async () =>
  {
    let winnerAddress = await this.state.contract.methods.getMyWinner().call({from: this.state.account});

    let message = "Loading...";
    let buttonText = "";
    let buttonStyle = "btn btn-default disabled";

    // Winner address == my address
    if (winnerAddress === this.state.account)
    {
      message = "You won! 😄💰";
      buttonText = "Collect your reward";
      buttonStyle = 'btn btn-success';
    }
    else {
      message = "You lost. 😔";
      buttonText = "End game";
      buttonStyle = 'btn btn-danger';
    }

    this.setState(
      {
        message: message,
        buttonText: buttonText,
        buttonStyle: buttonStyle
      }
    );
  }

  end = async () =>
  {
    await this.state.contract.methods.LeaveTheGame().send({ from: this.state.account });

    await this.state.updateView();
  }

  render() {

    return(
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <center>
              <div className="form-group">
                <h4>{this.state.message}</h4>
              </div>
              <button type="submit" className={this.state.buttonStyle} onClick={this.end}>{this.state.buttonText}</button>
            </center>
          </div>
        </div>
      </div>
    );

  }
}

export default End;
