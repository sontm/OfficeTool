import React, { Component } from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';
import { connect } from 'react-redux';
import { actLogout } from '../redux/actions/UserActions';

import './AppHeader.css';
import pollIcon from '../poll.svg';
import { Layout, Menu, Dropdown, Icon } from 'antd';
const Header = Layout.Header;
const Sider = Layout.Sider;
const {SubMenu} = Menu;

class AppHeader extends Component {
    constructor(props) {
        super(props);   
        this.handleMenuClick = this.handleMenuClick.bind(this);   
    }

    handleMenuClick({ item, key }) {
      if(key === "logout") {
        this.props.actLogout(this.props.history);
      }
    }

    render() {
        let menuItems;
        if(this.props.user.currentUser) {
          menuItems = [
            <Menu.Item key="/team">
              <Link to="/team">
              <Icon type="team" className="nav-icon"/>
                <span>Team</span>
              </Link>
            </Menu.Item>,

            <Menu.Item key="/absence">
              <Link to="/absence">
              <Icon type="contacts" className="nav-icon"/>
                <span>Absence</span>
              </Link>
            </Menu.Item>,

            <Menu.Item key="/poll">
            <Link to="/poll">
              <Icon type="bar-chart" className="nav-icon" />
              <span>Poll</span>
            </Link>
            </Menu.Item>,

            <SubMenu key="user"
              title={
                <span style={{paddingLeft: "0px"}}>
                  <Icon type="user" className="nav-icon" />
                 <span>@{this.props.user.currentUser.username}</span>
                </span>
              }
            >
              <Menu.Item key="profile">
                <Link to={`/users/${this.props.user.currentUser.username}`}>Profile</Link>
              </Menu.Item>
              <Menu.Item key="logout">
                Logout
              </Menu.Item>
            </SubMenu>
          ]; 
        } else {
          menuItems = [
            <Menu.Item key="/login">
              <Link to="/login">Login</Link>
            </Menu.Item>,
            <Menu.Item key="/signup">
              <Link to="/signup">Signup</Link>
            </Menu.Item>                  
          ];
        }

        return (
            <Sider theme="light"
              style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
              }}>
            <div>
              <div className="app-title" >
                <Link to="/" style={{paddingLeft: "20px"}}>App</Link>
              </div>
              <Menu theme="light"
                className="app-menu"
                mode="inline"
                inlineCollapsed={true}
                onClick={this.handleMenuClick}
                selectedKeys={[this.props.location.pathname]}
                style={{ lineHeight: '64px' }} >
                  {menuItems}
              </Menu>
            </div>
          </Sider>
        );
    }
}

function ProfileDropdownMenu(props) {
  // return (
    
  // );

  // return (
  //   <Dropdown 
  //     overlay={dropdownMenu} 
  //     trigger={['click']}
  //     getPopupContainer = { () => document.getElementsByClassName('profile-menu')[0]}>
  //     <a className="ant-dropdown-link">
  //        <Icon type="user" className="nav-icon" style={{marginRight: 0}} /> <Icon type="down" />
  //     </a>
  //   </Dropdown>
  // );
}

const mapStateToProps = (state) => ({
  user: state.user
});
const mapActionsToProps = {
  actLogout
};

export default withRouter(connect(
  mapStateToProps,mapActionsToProps
)(AppHeader));