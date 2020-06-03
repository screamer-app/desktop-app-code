import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import jwtDecode from "jwt-decode";
// Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";
// Components
import Navbar from "./components/layout/Navbar";
import themeObject from "./util/theme";
import AuthRoute from "./util/AuthRoute";
// Pages
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";
import user from "./pages/user";

import axios from "axios";
import firebase from "firebase";
require('@firebase/firestore');
require('@firebase/functions');
const theme = createMuiTheme(themeObject);

axios.defaults.baseURL = "https://screamer-app.firebaseio.com";

const Config = {
  apiKey: "AIzaSyBrJbhxONYQDprXw-kqmzHUEWl83e89Ky0",
  authDomain: "screamer-app.firebaseapp.com",
  databaseURL: "https://screamer-app.firebaseio.com",
  projectId: "screamer-app",
  storageBucket: "screamer-app.appspot.com",
  messagingSenderId: "215139518869",
  appId: "1:215139518869:web:f0ca47413af624c26e0e9c",
  measurementId: "G-LP0HYFSR1Y",
};

firebase.initializeApp(Config);
export const db = firebase.firestore();
export const functions = firebase.functions();
const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location.href = "/login";
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common["Authorization"] = token;
    store.dispatch(getUserData());
  }
}

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <Navbar />
            <div className="container">
              <Switch>
                <Route exact path="/" component={home} />
                <AuthRoute exact path="/login" component={login} />
                <AuthRoute exact path="/signup" component={signup} />
                <Route exact path="/users/:handle" component={user} />
                <Route
                  exact
                  path="/users/:handle/scream/:screamId"
                  component={user}
                />
              </Switch>
            </div>
          </Router>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
