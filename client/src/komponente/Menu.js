import React from 'react'
import { NavLink } from 'react-router-dom';

class Menu extends React.Component {


  constructor(props) {
    super(props);

    // Next we establish our state
    this.state = {
      gumbIgraj: props.gumbIgraj,
      gumbPoizvedbe: props.gumbPoizvedbe,
      gumbPomoc: props.gumbPomoc,
    }
  }

  componentDidMount = async () => {

  };

  render() {
    return(
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark" id="mainNav">
        <div className="container">
          <NavLink className="navbar-brand js-scroll-trigger" to="/">Home</NavLink>
          <div className="navbar-toggleable-xl">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <NavLink className="nav-link js-scroll-trigger clickable active" to="/game">Game</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link js-scroll-trigger clickable active" to="/query">Query</NavLink>
              </li>
              <li className="nav-item selected">
                <NavLink className="nav-link js-scroll-trigger clickable active" to="/help">Help</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
  );
  }
}


export default Menu;
