import {
  AppstoreOutlined,
  DeleteOutlined,
  EditOutlined,
  FolderOpenOutlined,
  InboxOutlined,
  LogoutOutlined,
  PlusOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Drawer,
  Form,
  Input,
  Layout,
  Menu,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Upload,
  Skeleton,
  Descriptions
} from "antd";
import axios from "axios";
import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
// import { Card } from "reactstrap";
const { Meta } = Card;
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
let fileList = [];
class Project extends Component {
  async componentWillMount() {
    await this.loadCurrentUser();
    await this.loadAllADUsers();
    await this.loadAllProjects();
  }

  async loadAllADUsers() {
    let res = await axios.get("http://localhost:5000/api/Users/");

    let response = res.data;
    let users = [];
    response.map((user) => {
      if (user.role == "AD") {
        users.push(user);
      }
    });

    this.setState({ users: users });
  }

  async loadAllProjects() {
    let res = await axios.get("http://localhost:5000/api/projects");
    let projects = res.data;
    this.setState({ projects });
    this.setState({ loading: false });
    console.log("Projects",this.state.projects)
  }

  async loadCurrentUser() {
    let currentUser = localStorage.getItem("currentAccount");
    let res = await axios.get(`http://localhost:5000/api/Users/${currentUser}`);
    this.setState({ currentUser: res.data });
  }

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      currentUser: "",
      visible: "",
      users: [],
      editmode: false,
      pname: "",
      pdesc: "",
      author: "",
      files: "",
      projects: [],
      loading: true,
      editmode:false
    };
    this.buildshowProject = this.buildshowProject.bind(this)
    this.confirm = this.confirm.bind(this);
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

  async deleteUser(record) {
    let res = await axios.delete(
      `http://localhost:5000/api/projects/${record._id}`
    );
    this.loadAllProjects();
  }

  async confirm(record) {
    await this.deleteUser(record);
    message.success("User is Deleted Successfully");
  }
  
  buildshowProject(){
    var arr = [];
    this.state.projects.map((project,key)=>{
      arr.push(
        <Row gutter={16}>
        <Card
              style={{marginTop: 16 }}
              actions={[                    
              <DeleteOutlined key="delete" onClick={(e)=>{console.log(project)}}/>,
              <EditOutlined key="edit" onClick={(e)=>{console.log(project)}}/>,
              ]}
            >
            <Skeleton loading={this.state.loading} avatar active>
            <Descriptions title={project.pname} 
            layout="horizontal"
            bordered
            >                    
              <Descriptions.Item label="Project Description" span={3}>{project.pdesc}</Descriptions.Item>
              <Descriptions.Item label="Author" span={3}>{project.author}</Descriptions.Item>
              <Descriptions.Item label="Airport Code"span={1}>
                {project.airportCode}
              </Descriptions.Item>
              <Descriptions.Item label="Airport Name" span={2}>Name of the Airport</Descriptions.Item>
                
              <Descriptions.Item label="Attachments" span={3}>
                {project.attachment}
              </Descriptions.Item>                   
            </Descriptions>
          </Skeleton>
        </Card>
        </Row>
      )
    })
    return arr;
  }
  captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    console.log("console.log", file);
    const reader = new window.FileReader(); // converts the file to a buffer
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) }, () => {
        console.log(this.state.buffer);
      });
    };
  };

  findAirportCode = (address) => {
    let airportcode = "";
    this.state.users.map((user) => {
      if (user.address == address) {
        airportcode = user.airportCode;
      }
    });
    return airportcode;
  };

  handleSubmit = async () => {
    const { pname, pdesc, author } = this.state;
    let airportCode = this.findAirportCode(author);
    let files = [];
    let size = fileList.length;

    fileList.map(async (file, key) => {
      const originfile = file.originFileObj;
      const reader = new window.FileReader(); // converts the file to a buffer
      reader.readAsArrayBuffer(originfile);
      reader.onloadend = async () => {
        let buffer = Buffer(reader.result);
        // Send to Ipfs
        await ipfs.add(buffer, async (error, result) => {
          console.log("Ipfs result", result);
          let filehash = result[0].hash;
          files.push({ filename: file.name, fileaddr: filehash });
          if (key == size - 1) {
            console.log(key, size);
            console.log(files);
            // Upload Here
            let res = await axios
              .post("http://localhost:5000/api/projects", {
                pname: pname,
                pdesc: pdesc,
                author: author,
                airport_code: airportCode,
                attachment: files,
              })
              .then((res) => console.log(res));
          }
        });
      };
    });

    // reload project
    await this.loadAllProjects();
  };

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
    console.log("Value", value);
    this.setState({ pdesc: value });
  };

  render() {
    const columns = [
      {
        title: "Project Name",
        dataIndex: "pname",
        key: "pnam",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.pname.length - b.pname.length,
        sortDirections: ['descend', 'ascend']
      },
      {
        title: "Description",
        dataIndex: "pdesc",
        key: "pdesc",
        sorter: (a, b) => a.pdesc.length - b.pdesc.length,
        sortDirections: ['descend', 'ascend']
      },
      {
        title: "Author",
        dataIndex: "author",
        key: "author",
      },
      {
        title: "Airport Code",
        dataIndex: "airport_code",
        key: "airport_code",
        sorter: (a, b) => a.airport_code.length - b.airport_code.length,
        sortDirections: ['descend', 'ascend']
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

    const data = [];
    this.state.projects.map((user, key) => {
      user.key = key;
      data.push(user);
    });

    const props = {
      name: "file",
      multiple: true,
      action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
      onChange(info) {
        const { status } = info.file;
        if (status !== "uploading") {
          console.log(info.file, info.fileList);
        }
        if (status === "done") {
          fileList = info.fileList;
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === "removed") {
          fileList = info.fileList;
        } else if (status === "error") {
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

                  <Table columns={columns} dataSource={data} />
                  
                  <Drawer
                    title={
                      this.state.editmode
                        ? "Edit Project Details"
                        : "Add New Project"
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
                            <p className="ant-upload-text">
                              Click or drag file to this area to upload
                            </p>
                            <p className="ant-upload-hint">
                              Support for a single or bulk upload. Strictly
                              prohibit from uploading company data or other band
                              files
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
