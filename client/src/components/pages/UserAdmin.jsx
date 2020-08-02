import {
    AppstoreOutlined,
    FolderOpenOutlined,
    LogoutOutlined,
    UserSwitchOutlined
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import axios from 'axios';
import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;


class UserAdmin extends Component{
    async componentWillMount(){
        await this.loadCurrentUser();
        await this.loadAllUsers();
    }
    async loadAllUsers(){
        let res = await axios.get('http://localhost:5000/api/Users');
        console.log("All User:",res.data);
    }
    async loadCurrentUser(){
        let currentUser = localStorage.getItem('currentAccount');
        let res = await axios.get(`http://localhost:5000/api/Users/${currentUser}`);
        this.setState({currentUser:res.data})
        console.log("Current User",this.state.currentUser)
    }
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            currentUser:''
        }

    }
    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({ collapsed });
      };


    render(){

        return (
            <Fragment>
                <Layout style={{ minHeight: "100vh" }}>
            <Sider
              collapsible
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse}
            >
              <div className="logo" />
              <Menu theme="dark" defaultSelectedKeys={["4"]} mode="inline">
                <Menu.Item key="1">
                  <AppstoreOutlined />
                  <span>
                        
                      {this.state.currentUser.fullname}<br></br>
                      {this.state.currentUser.role})
                    </span>
                </Menu.Item>
                  <Menu.Item key="2">
                  <Link to="/">
                    <FolderOpenOutlined />
                    <span>Dashboard</span>
                  </Link>
                  </Menu.Item>

                  
                
                <Menu.Item key="3">
                  <Link to="/">
                    <FolderOpenOutlined />
                    <span>Projects</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="4">
                  <Link to="/useradmin">
                    <UserSwitchOutlined />
                    <span>Manage Users</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="5">
                  <Link to="/auth">
                    <LogoutOutlined />
                    <span>Logout</span>
                  </Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout>
              <Header style={{ background: "#000" }}>
                <h1>Manage User</h1>
              </Header>
              <Content style={{ margin: "0 16px" }}>
                <h1>Current UserName: {this.state.currentUser.fullname}</h1>
                
              </Content>
            </Layout>
          </Layout>
            </Fragment>
        )
    }
}
export default UserAdmin;