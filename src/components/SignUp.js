import React from 'react';
import { withRouter } from 'react-router-dom';
import { State } from 'react-powerplug';
import { auth } from '../firebase';
import * as routes from '../constants/routes';

class SignUp extends React.Component {
  handleSubmit = ({ email, password }) => {
    return auth
      .doCreateUserWithEmailAndPassword(email, password)
      .then(response => {
        console.log('Successful Sign Up', response);
        this.props.history.push(routes.HOME_PATH);
      })
      .catch(err => {
        console.log('Failed Sign Up', err);
        throw err;
      });
  };

  render() {
    return (
      <State initial={{ email: '', password: '', error: null }}>
        {({ state, setState }) => {
          const onEmailChange = e => {
            setState({ email: e.target.value });
          };
          const onPasswordChange = e => {
            setState({ password: e.target.value });
          };
          const onSubmit = e => {
            e.preventDefault();
            this.handleSubmit({
              email: state.email,
              password: state.password,
            }).catch(err => {
              setState({ error: err.message });
            });
          };

          return (
            <div>
              <h1>Sign Up</h1>
              <form onSubmit={onSubmit}>
                {state.error &&
                  <p style={{ color: 'red' }}>
                    {state.error}
                  </p>}
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  name="email"
                  value={state.email}
                  onChange={onEmailChange}
                />

                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  value={state.password}
                  onChange={onPasswordChange}
                />

                <button type="submit">Sign Up</button>
              </form>
            </div>
          );
        }}
      </State>
    );
  }
}

export default withRouter(SignUp);
