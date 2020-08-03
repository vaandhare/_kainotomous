import React, { Fragment } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Auth from './components/auth/Auth';
import Dashboard from './components/pages/Dashboard';
import Usernotapproved from "./components/redirect/Usernotapproved";
import UserAdmin from './components/pages/UserAdmin'
import AerodromeLicenseCertificate from './components/pages/AerodromeLicenseCertificate'
import Project from './components/pages/Project'

import "./styles/App.scss";

// import MetamaskError from "./components/redirect/MetamaskError";


class App extends React.Component {
  
  render() {
    return (
      <Router>
        <Fragment>
          <Switch>
            <Route exact={true} path="/" component={Dashboard}></Route>
            <Route exact={true} path="/auth" component={Auth}></Route>
            <Route exact={true} path="/notapproved" component={Usernotapproved}></Route>
            <Route exact={true} path="/useradmin" component={UserAdmin}></Route>
            <Route exact={true} path="/certificate" component={AerodromeLicenseCertificate}></Route>
            <Route exact={true} path="/project" component={Project}></Route>
            {/* <Route exact={true} path="/metamasklogin" component={MetamaskError}></Route> */}

            
          </Switch>
        </Fragment>
      </Router>
    );
  }
}


export default App;
