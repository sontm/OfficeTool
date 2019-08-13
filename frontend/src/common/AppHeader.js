import React, { Component } from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';
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

    handleMenuClick({ key }) {
      if(key === "logout") {
        this.props.onLogout();
      }
    }

    render() {
        let menuItems;
        if(this.props.currentUser) {
          menuItems = [
            <Menu.Item key="/team">
              <Link to="/team">
              <Icon type="team" className="nav-icon"/>
                <span>Team</span>
              </Link>
            </Menu.Item>,

            <Menu.Item key="/poll/new">
            <Link to="/poll/new">
              <Icon type="bar-chart" className="nav-icon" />
              <span>Poll</span>
            </Link>
            </Menu.Item>,

            <SubMenu key="user"
              title={
                <span style={{paddingLeft: "0px"}}>
                  <Icon type="user" className="nav-icon" />
                 <span>@{this.props.currentUser.username}</span>
                </span>
              }
            >
              <Menu.Item key="profile">
                <Link to={`/users/${this.props.currentUser.username}`}>Profile</Link>
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


export default withRouter(AppHeader);