import React from 'react'

class Reveal extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      account: props.core.account,
      contract: props.core.contract,
      web3: props.core.web3,
      updateView: props.updateView,
      value: "",
      storedValue: "",
    }

    this.getStoredValue = this.getStoredValue.bind(this);
  }

  componentDidMount = async () => {
    this.getStoredValue();
  };

  changeEvent(value){
    this.setState({
         value: value
    });
  }

  getStoredValue = async () =>
  {
    let deterministicId = 'niz_' + this.state.account;
    let storedValue = localStorage.getItem(deterministicId);

    if(storedValue == null)
    {
      storedValue = "";
    }

    this.setState(
      {
        value: storedValue
      }
    );
  }

  reveal = async () =>
  {
    const hash = this.state.web3.utils.sha3(this.state.value);
    await this.state.contract.methods.Reveal(hash).send({ from: this.state.account });

    await this.state.updateView();
  }

  render() {
    return(
      <div className="container">
        <div className="row">
          <div className="col-md-12">
              <h4>Reveal your value:</h4>

            <div className="input-group">
               <input className="form-control" type="tect" id="stevilo" placeholder="Insert your value" value={this.state.value} onChange={e => this.changeEvent(e.target.value)}/>
               <span className="input-group-btn">
                    <button type="submit" className="btn btn-info razmik-gumbi" onClick={this.getStoredValue}>Get stored value</button>
               </span>

            </div>

            <br />
           <button type="submit" className="btn btn-primary" onClick={this.reveal}>Reveal</button>

          </div>
        </div>


      </div>
  );
  }
}


export default Reveal;
