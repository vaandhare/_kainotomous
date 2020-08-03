import {
  AppstoreOutlined,
  DeleteOutlined,
  EditOutlined,
  FolderOpenOutlined,
  LogoutOutlined,
  PlusOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Drawer,
  Form,
  Input,
  Layout,
  Menu,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Popconfirm,
  message,
} from "antd";
import axios from "axios";
import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Card } from "reactstrap";
const { Header, Content, Footer, Sider } = Layout;

const { Option } = Select;

class UserAdmin extends Component {
  async componentWillMount() {
    await this.loadCurrentUser();
    await this.loadAllUsers();
    await this.get_Airports();
  }
  async loadAllUsers() {
    let res = await axios.get("http://localhost:5000/api/Users");
    console.log("All User:", res.data);
    let users = res.data;
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
      users: [],

      fullname: "",
      email: "",
      address: "",
      role: "",
      airportCode: "",
      isapproved: "",
      userId: "",
      visible: "",
      airports: [],
      editmode: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.cleanInputs = this.cleanInputs.bind(this);
    this.fillDrawer = this.fillDrawer.bind(this);
    this.cancel = this.cancel.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  buildAirportSelect() {
    var arr = [];
    this.state.airports.map((airport, key) => {
      if (airport.operatorAddr == "") {
        arr.push(
          <Option value={airport.airport_code} key={key}>
            {airport.airport_name}
          </Option>
        );
      }
    });
    return arr;
  }

  async get_Airports() {
    const response = await axios.get(`http://localhost:5000/api/airports/`);
    this.setState({ airports: response.data });
    // console.log(this.state.currentUser)
  }

  fillDrawer(record) {
    this.setState({
      userId: record._id,
      fullname: record.fullname,
      email: record.email,
      address: record.address,
      role: record.role,
      airportCode: record.airportCode,
      isapproved: record.isapproved,
    });
    console.log("Record", this.state.userId);
  }

  async deleteUser(record) {
    let res = await axios.delete(
      `http://localhost:5000/api/Users/${record._id}`
    );
    this.loadAllUsers();
  }

  async confirm(record) {
    await this.deleteUser(record);
    message.success("User is Deleted Successfully");
  }

  cancel(e) {
    console.log(e);
    message.error("User is Not Deleted");
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { fullname, email, address, role, airportCode, userId } = this.state;
    // Check if it edit or post
    if (this.state.editmode === true) {
      // Put the User

      const response = await axios.put(
        `http://localhost:5000/api/Users/${userId}`,
        {
          fullname: fullname,
          email: email,
          address: address,
          role: role,
          airportCode: airportCode,
        }
      );
      message.success("User Updated Successfully");
    } else {
      // post the user
     

      const response = await axios.post(
        "http://localhost:5000/api/Users/register",
        {
          fullname: fullname,
          email: email,
          address: address,
          role: role,
          airportCode: airportCode,
        }
      );
      message.success("User Added Successfully");
    }

    if (airportCode !== "") {
      const airresponse = await axios.get(
        `http://localhost:5000/api/airports/${airportCode}`
      );
      const airport = airresponse.data[0];
      console.log(airport);
      const putres = await axios.put(
        `http://localhost:5000/api/airports/${airport._id}`,
        {
          airport_code: airport.airport_code,
          airport_name: airport.airport_name,
          city_name: airport.city_name,
          lat: airport.lat,
          long: airport.long,
          operatorAddr: address,
          status: airport.status,
        }
      );
    }
    this.onClose();
    this.loadAllUsers();
    // console.log(response.data);
    this.cleanInputs();
  }

  cleanInputs() {
    this.setState({
      userId: "",
      fullname: "",
      email: "",
      address: "",
      role: "",
      airportCode: "",
      isapproved: "",
    });
  }

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

  onCollapse = (collapsed) => {
    console.log("collaspse");
    this.cleanInputs();
    this.setState({ collapsed });
  };

  render() {
    const columns = [
      {
        title: "Full Name",
        dataIndex: "fullname",
        key: "fullname",
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Role",
        dataIndex: "role",
        key: "role",
      },

      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <Space size="middle">
            <EditOutlined
              onClick={(e) => {
                e.preventDefault();
                this.setState({ editmode: true });
                this.fillDrawer(record);
                this.showDrawer();
              }}
            />
            <Popconfirm
              title="Are you sure delete this task?"
              onConfirm={() => this.confirm(record)}
              onCancel={this.cancel}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined />
            </Popconfirm>
          </Space>
        ),
      },
    ];

    //   const data = [...this.state.users  ];
    const data = [];
    this.state.users.map((user, key) => {
      user.key = key;
      data.push(user);
    });

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
                <Link to="/useradmin">
                  <UserSwitchOutlined />
                  <span>Manage Users</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="4">
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
                <h2
                  style={{
                    textAlign: "left",
                    margin: "10px",
                    fontWeight: "800",
                  }}
                >
                  Manage Users
                </h2>
                <Card style={{ margin: "10px", padding: "10px" }}>
                  <Button
                    type="primary"
                    onClick={(e) => {
                      this.cleanInputs();
                      this.setState({ editmode: false });
                      this.showDrawer();
                    }}
                    style={{ margin: "10px" }}
                  >
                    <PlusOutlined />
                    Add user
                  </Button>
                  <Table columns={columns} dataSource={data} />
                  <Drawer
                    title={
                      this.state.editmode ? "Edit User Details" : "Add New User"
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
                          {this.state.editmode ? "Edit User" : "Add User"}
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
                              message: "Please enter user name",
                            },
                          ]}
                          style={{ width: "100%" }}
                        >
                          <Input
                            placeholder="Please enter user name"
                            defaultValue={this.state.fullname}
                            onChange={(e) => {
                              this.setState({ fullname: e.target.value });
                            }}
                          />
                        </Form.Item>
                      </Row>
                      <Row gutter={16}>
                        <Form.Item
                          name="email"
                          label="Email"
                          rules={[
                            {
                              required: true,
                              message: "Please enter user email",
                            },
                          ]}
                          style={{ width: "100%" }}
                        >
                          <Input
                            placeholder="Please enter user email"
                            defaultValue={this.state.email}
                            onChange={(e) => {
                              this.setState({
                                email: e.target.value,
                              });
                            }}
                          />
                        </Form.Item>
                      </Row>
                      <Row gutter={16}>
                        <Form.Item
                          name="address"
                          label="Address"
                          rules={[
                            {
                              required: true,
                              message: "Please enter user Address",
                            },
                          ]}
                          style={{ width: "100%" }}
                        >
                          <Input
                            placeholder="Please Enter Blockchain Address"
                            defaultValue={this.state.address}
                            onChange={(e) => {
                              this.setState({
                                address: e.target.value,
                              });
                            }}
                          />
                        </Form.Item>
                      </Row>
                      <Row gutter={16}>
                        <Form.Item
                          name="designation"
                          label="Designation"
                          rules={[
                            {
                              required: true,
                              message: "Please choose the designation",
                            },
                          ]}
                          style={{ width: "100%" }}
                        >
                          <Select
                            placeholder="Please choose the type"
                            defaultValue={this.state.role}
                            onChange={(e) => {
                              console.log(e);
                              this.setState({ role: e });
                            }}
                          >
                            <Option value="" disabled>
                              Select Role
                            </Option>
                            <Option value="DGCA">
                              Director General of Civil Aviation
                            </Option>
                            <Option value="DoAS">
                              Director of Aerodrome Standards
                            </Option>
                            <Option value="AI">Aerodrome Inspector</Option>
                            <Option value="CHQ(ED)">ED (Licensing)</Option>
                            <Option value="AD">Aerodrome Director</Option>
                          </Select>
                        </Form.Item>
                      </Row>
                      {this.state.role == "AD" ? (
                        <Row gutter={16}>
                          <Form.Item
                            name="aerodrome"
                            label="Aerodrome"
                            rules={[
                              {
                                required: true,
                                message: "Please choose user Aerodrome",
                              },
                            ]}
                            style={{ width: "100%" }}
                          >
                            <Select
                              placeholder="Please choose user Aerodrome"
                              defaultValue={this.state.airportCode}
                              onChange={(e) => {
                                this.setState({ airportCode: e });
                              }}
                            >
                              <Option value="" disabled>
                                Select the Airport
                              </Option>
                              {this.buildAirportSelect()}
                            </Select>
                          </Form.Item>
                        </Row>
                      ) : (
                        ""
                      )}
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
export default UserAdmin;
