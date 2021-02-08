import {
  RouteComponentProps,
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

// Components
import Home from 'src/components/Home';
import Landing from 'src/components/Landing';
import Login from 'src/components/auth/Login';
import Signup from 'src/components/auth/Signup';
import ResetPasswordRequest from 'src/components/auth/ResetPasswordRequest';
import ResetPasswordConfirm from 'src/components/auth/ResetPasswordConfirm';
import Loading from 'src/components/common/Loading';
import {useAuth} from 'src/components/auth/AuthProvider';

function App() {
  const auth = useAuth();

  if (auth.loading) {
    return <Loading />;
  }

  if (!auth.isAuthenticated) {
    return (
      <Router>
        <Switch>
          <Route path={'/'} exact={true} component={Landing} />

          <Route path={'/login'} component={Login} />
          <Route path={'/signup'} component={Signup} />

          <Route
            path={'/reset-password/:token'}
            component={ResetPasswordConfirm}
          />
          <Route path={'/reset-password'} component={ResetPasswordRequest} />

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
        <Route path={'/'} component={Home} />
        <Route
          path={'/reset-password/:token'}
          component={ResetPasswordConfirm}
        />
        <Route path={'/reset-password'} component={ResetPasswordRequest} />

        <Route path="*" render={() => <Redirect to={'/'} />} />
      </Switch>
    </Router>
  );
}

export default App;
