import React, { Fragment } from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Auth from './components/auth/Auth';
import Dashboard from './components/pages/Dashboard';
import Usernotapproved from './components/redirect/Usernotapproved';
import AerodromeLicenseCertificate from './components/pages/AerodromeLicenseCertificate';
import './styles/App.scss';
// import MetamaskError from "./components/redirect/MetamaskError";

class App extends React.Component {
	render() {
		return (
			<Router>
				<Fragment>
					<Switch>
						<Route exact={true} path="/" component={Dashboard} />
						<Route exact={true} path="/auth" component={Auth} />
						<Route exact={true} path="/notapproved" component={Usernotapproved} />
						<Route exact={true} path="/aerodromeLicense" component={AerodromeLicenseCertificate} />
						{/* <Route exact={true} path="/ad" component={AD}></Route> */}
						{/* <Route exact={true} path="/metamasklogin" component={MetamaskError}></Route> */}
					</Switch>
				</Fragment>
			</Router>
		);
	}
}

export default App;
