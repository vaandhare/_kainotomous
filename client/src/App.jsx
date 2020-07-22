import React, { Fragment } from "react";
import "./styles/App.scss";
import Dashboard from './components/pages/Dashboard'
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Auth from './components/auth/Auth';
import Login from "./components/auth/login";
import Register from "./components/auth/register";


class App extends React.Component {
  
  render() {
    return (
      <Router>
        <Fragment>
          <Switch>
            <Route exact={true} path="/" component={Dashboard}></Route>
            <Route exact={true} path="/auth" component={Auth}></Route>

          </Switch>
        </Fragment>
      </Router>
    );
  }
}


export default App;
