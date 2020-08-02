import {
    AppstoreOutlined,
    FolderOpenOutlined, InboxOutlined, LogoutOutlined,
    PlusOutlined,
    UserSwitchOutlined
} from "@ant-design/icons";
import {
    Button,
    Drawer,
    Form,
    Input,
    Layout,
    Menu,






    message, Row,
    Select, Upload
} from "antd";
import axios from "axios";
import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Card } from "reactstrap";
const { TextArea } = Input;

const { Dragger } = Upload;

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: process.env.PORT || "5001",
  protocol: "https",
});

const { Header, Content, Footer, Sider } = Layout;

const { Option } = Select;
let fileList = []
class Project extends Component {
  async componentWillMount() {
    await this.loadCurrentUser();
    await this.loadAllADUsers();
  }

  async loadAllADUsers() {
    let res = await axios.get("http://localhost:5000/api/Users/");
    
    let response = res.data;
    let users = [];
    response.map((user)=>{
        if(user.role == "AD"){
            users.push(user)
        }
    })
    console.log("All AD:", users);
    this.setState({ users: users });
  }

  async loadCurrentUser() {
    let currentUser = localStorage.getItem("currentAccount");
    let res = await axios.get(`http://localhost:5000/api/Users/${currentUser}`);
    this.setState({ currentUser: res.data });
    console.log("Current User", this.state.currentUser);
  }

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      currentUser: "",
      visible:"",
      users:[],
      editmode:false,
      pname:"",
      pdesc:"",
      author:"",
      files:""
    };
  }

  buildADSelector() {
    var arr = [];
    this.state.users.map((user, key) => {
      
        arr.push(
          <Option value={user.address} key={key}>
            {user.fullname}
          </Option>
        );
      
    });
    return arr;
  }

  handleSubmit = ()=>{
      console.log("Name:",this.state.pname);
      console.log("Description",this.state.pdesc);
      console.log("Author",this.state.author);
      console.log("Files");
      fileList.map((file,key)=>{
          console.log("File",key,file.name)
      })
  }

  

  onCollapse = (collapsed) => {
    console.log("collaspse");
    this.cleanInputs();
    this.setState({ collapsed });
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onChange = ({ target: { value } }) => {
    this.setState({ value });
  };

  render() {

    const props = {
        name: 'file',
        multiple: true,
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        onChange(info) {

          const { status } = info.file;
          if (status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (status === 'done') {
            fileList = info.fileList
            message.success(`${info.file.name} file uploaded successfully.`);
          }
          else if(status === 'removed'){
            fileList = info.fileList
          } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
      };

    
    return (
      <Fragment>
        <Layout style={{ minHeight: "100vh" }}>
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
          >
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={["3"]} mode="inline">
              <Menu.Item key="1">
                <AppstoreOutlined />
                <span>
                  {this.state.currentUser.fullname}
                  <br></br>
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
                <Link to="/project">
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
            <Content style={{ margin: "0 16px" }}>
              <Fragment>
                <Card style={{ margin: "10px", padding: "10px" }}>
                <Button
                    type="primary"
                    onClick={(e) => {
                    
                      this.showDrawer();
                    }}
                    style={{ margin: "10px" }}
                  >
                    <PlusOutlined />
                    Add New Project
                  </Button>
                  <Drawer
                    title={
                      this.state.editmode ? "Edit Project Details" : "Add New Project"
                    }
                    width={450}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    bodyStyle={{ paddingBottom: 80 }}
                    footer={
                      <div
                        style={{
                          textAlign: "right",
                        }}
                      >
                        <Button
                          onClick={this.onClose}
                          style={{ marginRight: 8 }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={(e) => this.handleSubmit(e)}
                          type="primary"
                        >
                          {this.state.editmode ? "Edit Project" : "Add Project"}
                        </Button>
                      </div>
                    }
                  >
                    <Form layout="vertical" hideRequiredMark>
                      <Row gutter={16}>
                        <Form.Item
                          name="name"
                          label="Name"
                          rules={[
                            {
                              required: true,
                              message: "Please Enter Project Name!!",
                            },
                          ]}
                          style={{ width: "100%" }}
                        >
                          <Input
                            placeholder="Enter Project Name"
                            defaultValue={this.state.prname}
                            onChange={(e) => {
                              this.setState({ pname: e.target.value });
                            }}
                          />
                        </Form.Item>
                      </Row>
                      <Row gutter={16}>
                        <Form.Item
                          name="desc"
                          label="Project Description"
                          rules={[
                            {
                              required: true,
                              message: "Please Enter Project Description!!",
                            },
                          ]}
                          style={{ width: "100%" }}
                        >
                          <TextArea
                            defaultValue={this.state.pdesc}
                            onChange={this.onChange}
                            placeholder="Project Description"
                            autoSize={{ minRows: 3, maxRows: 5 }}
                            />
                        </Form.Item>
                      </Row>
                      
                      
                    <Row gutter={16}>
                        <Form.Item
                        name="address"
                        label="User"
                        rules={[
                            {
                            required: true,
                            message: "Please choose user",
                            },
                        ]}
                        style={{ width: "100%" }}
                        >
                        <Select
                            placeholder="Please choose user"
                            defaultValue={this.state.author}
                            onChange={(e) => {
                            this.setState({ author: e });
                            }}
                        >
                            <Option value="" disabled>
                            Select the Author
                            </Option>
                            {this.buildADSelector()}
                        </Select>
                        </Form.Item>
                    </Row>
                    <Row gutter={16}>
                    <Form.Item
                          name="name"
                          label="Attachments"
                          rules={[
                            {
                              required: true,
                              message: "Please Enter Project Name!!",
                            },
                          ]}
                          style={{ width: "100%" }}
                        >
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                            band files
                            </p>
                        </Dragger>
                    </Form.Item>
                    </Row>
                     
                    </Form>
                  </Drawer>
                </Card>
              </Fragment>
            </Content>
          </Layout>
        </Layout>
      </Fragment>
    );
  }
}

export default Project;
