import React, { Fragment } from "react";
import "./styles/App.scss";
import Dashboard from './components/pages/Dashboard'
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Auth from './components/auth/Auth';
import AD from './components/pages/AD';
import Usernotapproved from "./components/redirect/Usernotapproved";
import LandingPage from './components/auth/LandingPage'
// import MetamaskError from "./components/redirect/MetamaskError";


class App extends React.Component {
  
  render() {
    return (
      <Router>
        <Fragment>
          <Switch>
            <Route exact={true} path="/" component={Dashboard}></Route>
            <Route exact={true} path="/auth" component={Auth}></Route>
            <Route exact={true} path="/ad" component={AD}></Route>
            <Route exact={true} path="/notapproved" component={Usernotapproved}></Route>
            <Route exact={true} path="/landingPage" component={LandingPage}/>
            {/* <Route exact={true} path="/metamasklogin" component={MetamaskError}></Route> */}

            
          </Switch>
        </Fragment>
      </Router>
    );
  }
}


export default App;
