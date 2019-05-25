import React from 'react'
import { NavLink } from 'react-router-dom';

const Home = () => (

  <main role="main">

    <div className="jumbotron">
      <div className="container">
        <h1 className="display-5">Welcome to Online casino <b>Prism</b></h1>
        <p>Powered by Ethereum.</p>
        <NavLink className="btn btn-primary btn-lg" to="/game">Play</NavLink>
      </div>
    </div>

    <div className="container">
      <div className="row">
        <div className="col-md-4 tekst-levo">
          <h2>Pros</h2>
          <hr/>
          <p>Powered by Ethereum.</p>
          <p>Fully transparent, provably fair and unstoppable online casino.</p>
          <br/>
          <p><a className="btn btn-secondary" href="https://ethereum.org/" role="button">More &raquo;</a></p>
        </div>
        <div className="col-md-4 tekst-levo">
          <h2>How does it work?</h2>
          <hr/>
          <p>Source of randomness is completely left out to the players.</p>
          <h4>Game</h4>
          <p>Game consists of two players. Each player first pays the entry fee and provides a digital signature of any value, that he reveals in the later stage.</p>
          <p>Winner is generated based on both provided values.</p>
          <NavLink className="btn btn-secondary" to="/help">More &raquo;</NavLink>
        </div>
        <div className="col-md-4 tekst-levo">
          <h2>Query</h2>
          <hr/>
          <p>Every game is written to the Ethereum blockchain.</p>
          <p>Player can query data about any game.</p>
          <br/>
          <NavLink className="btn btn-secondary" to="/help">More &raquo;</NavLink>
        </div>
      </div>

    </div>

  </main>

);

export default Home;
