import React from 'react';
import {
  RouteComponentProps,
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

// Components
import Home from 'src/components/Home';
import Login from 'src/components/auth/Login';
import Signup from 'src/components/auth/Signup';
import {useAuth} from 'src/components/auth/AuthProvider';

function App() {
  const auth = useAuth();

  if (auth.loading) {
    return null;
  }

  if (!auth.isAuthenticated) {
    return (
      <Router>
        <Switch>
          <Route path={"/login"} component={Login} />
          <Route path={"/signup"} component={Signup} />
          <Route
            path="*"
            render={(props: RouteComponentProps<{}>) => (
              <Redirect to={`/login?redirect=${props.location.pathname}`} />
            )}
          />
        </Switch>
      </Router>
    );
  }

  return (
    <Router>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path="*" render={() => <Redirect to={"/notes"} />} />
      </Switch>
    </Router>
  );
}

export default App;
