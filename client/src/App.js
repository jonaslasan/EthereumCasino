import Menu from "./komponente/Menu";
import Game from "./komponente/Game";
import Help from "./komponente/Help";
import React, { Component } from "react";
import NotFound from "./komponente/NotFound";
import Query from "./komponente/Query";
import Home from "./komponente/Home";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import "./App.css";

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <div>
          <Menu />
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/game" component={Game} />
            <Route path="/query" component={Query} />
            <Route path="/help" component={Help} />

            <Route path='*' exact={true} component={NotFound} />

          </Switch>
        </div>
      </BrowserRouter>
    );

  }
}

export default App;
