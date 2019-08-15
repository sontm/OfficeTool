import React, { Component } from 'react';
import './App.css';
import {
  Route,
  withRouter,
  Switch
} from 'react-router-dom';

// Redux stuff
import { connect } from 'react-redux';
import { actGetCurrentUser, USER_LOGIN_OK } from '../redux/actions/UserActions';
import store from '../redux/store';
import {useDispatch} from 'react-redux'
import { getCurrentUser } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';

import PollList from '../poll/PollList';
import NewPoll from '../poll/NewPoll';
import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import Profile from '../user/profile/Profile';
import AppHeader from '../common/AppHeader';
import NotFound from '../common/NotFound';
import LoadingIndicator from '../common/LoadingIndicator';
import PrivateRoute from '../common/PrivateRoute';

import TeamPage from '../team/TeamPage';
import AbsencePage from '../absence/AbsencePage'
import PollPage from "../poll/PollPage"

import { Layout, notification, Menu } from 'antd';
const { Content, Header, Sider } = Layout;
const {SubMenu} = Menu;

store.dispatch(actGetCurrentUser());

class App extends Component {
  constructor(props) {
    super(props);

    notification.config({
      placement: 'bottomRight',
      bottom: 20,
      duration: 2,
    });    
  }

  componentDidMount() {
    console.log("****** DID MOUNT APP.js")
  }

  render() {
    if(this.props.user.isLoading) {
      return <LoadingIndicator />
    }
    return (
        <Layout style={{ minHeight: '100vh' }}>
          <AppHeader />
          <Layout>
          <Content className="app-content">
            <div className="container">
              <Switch>      
                <Route exact path="/" 
                  render={(props) => <PollList isAuthenticated={this.props.user.isAuthenticated} 
                      currentUser={this.props.user.currentUser} handleLogout={this.handleLogout} {...props} />}>
                </Route>
                <Route path="/login" 
                  render={(props) => <Login onLogin={this.handleLogin} {...props} />}></Route>
                <Route path="/signup" component={Signup}></Route>
                <Route path="/users/:username" 
                  render={(props) => <Profile isAuthenticated={this.props.user.isAuthenticated} currentUser={this.props.user.currentUser} {...props}  />}>
                </Route>
                <PrivateRoute authenticated={this.props.user.isAuthenticated} path="/poll/new" component={NewPoll} 
                  handleLogout={this.handleLogout} currentUser={this.props.user.currentUser}></PrivateRoute>

                <Route path="/team" 
                  render={(props) => <TeamPage currentUser={this.props.user.currentUser}/>}></Route>
                <Route path="/absence" 
                  render={(props) => <AbsencePage currentUser={this.props.user.currentUser}/>}></Route>
                <Route path="/poll" 
                  render={(props) => <PollPage currentUser={this.props.user.currentUser}/>}></Route>

                <Route component={NotFound}></Route>
              </Switch>
            </div>
          </Content>
          </Layout>
        </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user
});

const mapActionsToProps = {
  actGetCurrentUser
};

export default withRouter(connect(
  mapStateToProps,
  mapActionsToProps
)(App));
