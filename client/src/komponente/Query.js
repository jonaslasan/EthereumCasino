import React from 'react'
import GameInfo from './GameInfo'
import getCore from "../Web3Manager";

class Poizvedba extends React.Component {

  constructor(props) {
    super(props);

    // Next we establish our state
    this.state = {
      core: null,
      gameIdField: 1,
      gameId: 1,
      kljucPosodobitve: 0,
      steviloIger: 1
    }

    this.executeQuery = this.executeQuery.bind(this);
    this.RenderGameInfo = this.RenderGameInfo.bind(this);
  }

  componentDidMount = async () => {

    let core = await getCore();

    let numberOfGames = await core.contract.methods.getGameCount().call();

    this.setState(
      {
        core: core,
        numberOfGames: numberOfGames,
      }
    );
  };

  valueChanged(value)
  {
    if (value < 0)
      value = 0;

    this.setState({gameIdField: value});
  }

  executeQuery()
  {
    this.setState({gameId: this.state.gameIdField});
  }

  RenderGameInfo()
  {
    if (this.state.core === null)
      return null;

    return <GameInfo core={this.state.core} gameId={this.state.gameId} />
  }

  render() {
    return(
      <div className="container text-left" >
        <div className="row">
          <div className="col-md-12 text-left">
          <div className="card">
            <div className="card-header">
              <h3>Query game data</h3>
            </div>
            <br />
            <h4 className="razmik-gumbi">Number of games: {this.state.numberOfGames}</h4>
            <h5 className="razmik-gumbi">Valid IDs <b>1</b> - <b>{this.state.steviloIger}</b></h5>
            <hr />
            <h4 className="razmik-gumbi">Game ID:</h4>
            <div className="input-group">
               <input className="form-control razmik-gumbi" type="number" id="stevilo"  value={this.state.gameIdField} onChange={e => this.valueChanged(e.target.value)}/>
               <span className="input-group-btn">
                    <button type="submit" className="btn btn-success razmik-gumbi" onClick={this.executeQuery}>Query</button>
               </span>
            </div>
            <br />
            <this.RenderGameInfo />

          </div>
        </div>
      </div>
    </div>
  );
  }
}


export default Poizvedba;
