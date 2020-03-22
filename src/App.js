import React, { Component } from 'react';
import './css/App.css';
import {
  BrowserRouter as Router,
  Link,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import * as routes from './constants/routes';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import { firebase, auth } from './firebase';

const UnauthenticatedHomeContent = () => {
  return (
    <React.Fragment>
      <p>
        Welcome, please <Link to={routes.SIGN_IN_PATH}>sign in</Link>
      </p>
      <p>
        If you don't already have an account,{' '}
        <Link to={routes.SIGN_UP_PATH}>sign up</Link>
      </p>
    </React.Fragment>
  );
};

const AuthenticatedHomeContent = ({ authUser }) => {
  return (
    <p>
      Welcome back, {authUser.email}!
    </p>
  );
};

class Home extends React.Component {
  render() {
    return (
      <AuthContext.Consumer>
        {({ authUser }) =>
          <div>
            <h1>Home</h1>
            {!authUser && <UnauthenticatedHomeContent />}
            {authUser && <AuthenticatedHomeContent authUser={authUser} />}
          </div>}
      </AuthContext.Consumer>
    );
  }
}

class SignOut extends React.Component {
  signOut = e => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    return auth
      .doSignOut()
      .then(response => {
        console.log('successfully signed out', response);
      })
      .catch(err => {
        console.log('failed to sign out', err);
      });
  };

  componentDidMount() {
    this.signOut();
  }

  render() {
    return <Redirect to={routes.HOME_PATH} />;
  }
}

const AuthenticatedNavigation = () => {
  return (
    <React.Fragment>
      <li>
        <Link to={routes.SIGN_OUT_PATH}>Sign Out</Link>
      </li>
    </React.Fragment>
  );
};

const UnauthenticatedNavigation = () => {
  return (
    <React.Fragment>
      <li>
        <Link to={routes.SIGN_UP_PATH}>Sign Up</Link>
      </li>
      <li>
        <Link to={routes.SIGN_IN_PATH}>Sign In</Link>
      </li>
    </React.Fragment>
  );
};

const Navigation = () => {
  return (
    <AuthContext.Consumer>
      {({ authUser }) =>
        <nav>
          <ul>
            <li>
              <Link to={routes.HOME_PATH}>Home</Link>
            </li>
            {authUser && <AuthenticatedNavigation />}
            {!authUser && <UnauthenticatedNavigation />}
          </ul>
        </nav>}
    </AuthContext.Consumer>
  );
};

const AuthContext = React.createContext({ authUser: null });

class AuthProvider extends React.Component {
  state = {
    authUser: null,
  };

  componentDidMount() {
    firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState(() => ({ authUser }))
        : this.setState(() => ({ authUser: null }));
    });
  }

  render() {
    return (
      <AuthContext.Provider value={{ authUser: this.state.authUser }}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

class App extends Component {
  render() {
    return (
      <AuthProvider>
        <Router>
          <div className="App">
            <header className="App-header">
              <h1>Screamer-app</h1>
            </header>
            <Navigation />
            <div class="page">
            <Switch>
              <Route exact path={routes.HOME_PATH} component={Home} />
              <Route exact path={routes.SIGN_UP_PATH} component={SignUp} />
              <Route exact path={routes.SIGN_IN_PATH} component={SignIn} />
              <Route exact path={routes.SIGN_OUT_PATH} component={SignOut} />
            </Switch>
            </div>
          </div>
        </Router>
      </AuthProvider>
    );
  }
}

export default App;
