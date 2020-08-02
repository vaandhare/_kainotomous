import React, { Component, Fragment } from 'react';

import { Layout, Menu, Breadcrumb } from 'antd';
import Icon from '@ant-design/icons';
import {
    AppstoreOutlined,
    UserSwitchOutlined,
    FolderOpenOutlined,
    SearchOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from "axios";
import {
    Row,
    Col,
    Card,
    CardBody,
    Button,
    CardHeader,
    CardFooter,
    CardTitle,
    CardText,
    Form,
    FormGroup,
    Label,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';
import Title from 'antd/lib/skeleton/Title';
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
    host: "ipfs.infura.io",
    port: process.env.PORT || "5001",
    protocol: "https",
});
var statement = "Upload Your File";
var count = 0;
// var airportCode ='';
var userAppId='';

const { Header, Content, Footer, Sider } = Layout;

class AD extends Component {

    async componentWillMount() {
        await this.get_Airports();
        await this.get_approved_count();
    }

    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            airports: [],
            airportCode: "",
            userAppId:"",
            approved_count: 0,
            pending_count: 0,
            buffer: "",
        };
        this.get_Airports = this.get_Airports.bind(this);
        this.get_Airport = this.get_Airport.bind(this);
        this.get_timestamp = this.get_timestamp.bind(this);
        this.captureFile = this.captureFile.bind(this);
        this.submitFile = this.submitFile.bind(this);
        this.buildAirportSelect = this.buildAirportSelect.bind(this);
        // this.showAirports = this.showAirports.bind(this);
        this.get_approved_count = this.get_approved_count.bind(this)
        this.submitToBlockchain = this.submitToBlockchain.bind(this);
    }
    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    async get_Airports() {
        const response = await axios.get(`http://localhost:5000/api/airports/`);
        this.setState({ airports: response.data });
        // console.log(this.state.currentUser)
    }


    async get_Airport(airportCode) {
        return await axios.get(`http://localhost:5000/api/airpots/${airportCode}`)
    }

    async get_approved_count() {
        var approved_count = 0;
        var pending_count = 0;
        this.props.apps.map((app, key) => {
            if (app.state === "approved" || app.state === "granted") {
                approved_count = approved_count + 1;
            }
            else {
                pending_count = pending_count + 1;
            }
        })
        this.setState({ approved_count: approved_count });
        this.setState({ pending_count: pending_count });
    }

    get_timestamp() {
        let date_ob = new Date();
        let year = date_ob.getFullYear();
        // current date
        // adjust 0 before single digit date
        let date = ("0" + date_ob.getDate()).slice(-2);

        // current month
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let hours = date_ob.getHours();
        // current minutes
        let minutes = date_ob.getMinutes();
        // current seconds
        let seconds = date_ob.getSeconds();
        // prints date in YYYY-MM-DD formatc
        const timestamp =
            year +
            "-" +
            month +
            "-" +
            date +
            " " +
            hours +
            ":" +
            minutes +
            ":" +
            seconds;
        return timestamp;
    }

    captureFile = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        const reader = new window.FileReader(); // converts the file to a buffer
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            this.setState({ buffer: Buffer(reader.result) }, () => {
                console.log(this.state.buffer);
            });
        };
    };

    submitFile = (event) => {
        event.preventDefault();
        console.log("buffer", this.state.buffer);
        console.log("File Captured");
        ipfs.add(this.state.buffer, (error, result) => {
            count = count + 1;
            console.log("ipfs");
            console.log("Ipfs result", result);
            var filehash = result[0].hash;
            console.log(filehash);
            if (count === 1) {
                this.setState({ doc1: filehash });
                console.log(filehash)
            } else if (count === 2) {
                this.setState({ doc2: filehash });
                console.log(filehash)
            } else if (count === 3) {
                this.setState({ doc3: filehash });
                console.log(filehash)
            } else if (count === 4) {
                this.setState({ doc4: filehash });
                console.log(filehash)
            }
            if (error) {
                console.log(error);
                return;
            }
        });
    };

    buildAirportSelect() {
        var arr = [];
        this.state.airports.map((airport, key) => {
            arr.push(
                <option value={airport.IATA_code} key={key}>
                    {airport.airport_name}
                </option>
            );
        });
        return arr;
    }

    async submitToBlockchain(event) {
        event.preventDefault();
        const airportCode = this.state.airportCode;
        const timestamp = this.get_timestamp();
        const applength = this.props.apps.length;
        userAppId = applength;
        console.log(userAppId);
        this.setState({userAppId:applength});
        const doc1 = this.state.doc1;
        const doc2 = this.state.doc2;
        const doc3 = this.state.doc3;
        const doc4 = this.state.doc4;
        console.log(airportCode, timestamp, doc1, doc2, doc3, doc4);

        this.props.createApp(airportCode, doc1, doc2, doc3, doc4, timestamp);

        // Save the status on the mongodb
        const response = await axios.post(`http://localhost:5000/api/Akstatus/`, {
            IATA_code: airportCode,
            appId: applength,
            status: "created",
        });
    }

    render() {
        return (
            <div>
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                        <div className="logo" />
                        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                            <Menu.Item key="1">
                                <AppstoreOutlined />
                                <span>Home Page</span>
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
                        <Header style={{ background: '#fff' }}>
                            <span>Welcome, Airport Director </span>
                        </Header>
                        <Content style={{ margin: '0 16px' }}>
                            <Col md={6} style={{ marginTop: '10px', marginLeft: '25%' }}>
                                <Card style={{ padding: '20px' }}>
                                    <form onSubmit={this.submitToBlockchain}>
                                        <Label style={{ display: 'flex', justifyContent: 'center', color: 'gray' }}>
                                            <h3>Submit New License Application</h3>
                                        </Label>
                                        <FormGroup>
                                            <select
                                                value={this.state.role}
                                                onChange={(e) => {
                                                    this.setState({ airportCode: e.target.value });
                                                    // console.log(this.state.airportCode)
                                                }}
                                                className="form-control"
                                                defaultValue=""
                                            >
                                                <option value="" disabled>
                                                    Select the Airport
                                                </option>
                                                {this.buildAirportSelect()}
                                            </select>
        
                                        </FormGroup>
                                        <FormGroup>
                                            <Row>
                                                <Col md={6}>
                                                    <Card>
                                                        <CardHeader>Aerodrome Manual</CardHeader>
                                                        <CardBody>
                                                            <div className="custom-file">
                                                                <input
                                                                    id="doc1"
                                                                    type="file"
                                                                    className="custom-file-input"
                                                                    onChange={this.captureFile}
                                                                />
                                                                <label className="custom-file-label" id="uploadLabel1" />
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                color="primary"
                                                                style={{ width: "100%", marginTop: "10px" }}

                                                                className="btn"
                                                                name="doc1Submit"
                                                                onClick={this.submitFile}
                                                            >
                                                                {' '}
														Upload{' '}
                                                            </Button>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                                <Col md={6}>
                                                    <Card>
                                                        <CardHeader>SMS Manual</CardHeader>
                                                        <CardBody>
                                                            <div className="custom-file">
                                                                <input
                                                                    id="doc2"
                                                                    type="file"
                                                                    className="custom-file-input"
                                                                    onChange={this.captureFile}
                                                                />
                                                                <label className="custom-file-label" id="uploadLabel1" />
                                                            </div>
                                                            <Button
                                                                style={{ width: "100%", marginTop: "10px" }}
                                                                type="button"
                                                                color="primary"
                                                                className="btn"
                                                                name="doc1Submit"
                                                                onClick={this.submitFile}>
                                                                {' '}Upload{' '}
                                                            </Button>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </FormGroup>

                                        <FormGroup>
                                            <Row>
                                                <Col md={6}>
                                                    <Card>
                                                        <CardHeader>CAR Complaince Document</CardHeader>
                                                        <CardBody>
                                                            <div className="custom-file">
                                                                <input
                                                                    id="doc3"
                                                                    type="file"
                                                                    className="custom-file-input"
                                                                    onChange={this.captureFile}
                                                                />
                                                                <label className="custom-file-label" id="uploadLabel3" />
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                color="primary"
                                                                style={{ width: "100%", marginTop: "10px" }}

                                                                className="btn"
                                                                name="doc3Submit"
                                                                onClick={this.submitFile}
                                                            >
                                                                {' '}
														Upload{' '}
                                                            </Button>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                                <Col md={6}>
                                                    <Card>
                                                        <CardHeader>Exeptions Document </CardHeader>
                                                        <CardBody>
                                                            <div className="custom-file">
                                                                <input
                                                                    id="doc4"
                                                                    type="file"
                                                                    className="custom-file-input"
                                                                    onChange={this.captureFile}
                                                                />
                                                                <label className="custom-file-label" id="uploadLabel4" />
                                                            </div>
                                                            <Button
                                                                style={{ width: "100%", marginTop: "10px" }}
                                                                type="button"
                                                                color="primary"
                                                                className="btn"
                                                                name="doc4Submit"
                                                                onClick={this.submitFile}>
                                                                {' '}Upload{' '}
                                                            </Button>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                        <Button
                                            type="submit"
                                            style={{ marginTop: "50px" }}
                                            color="success"
                                            className="btn btn-outline-light btn-block"
                                        >
                                            Submit Application
										</Button>
                                    </form>
                                </Card>
                            </Col>
                        </Content>
                    </Layout>
                </Layout>
                <div>
                    <p>Hello Whatsup</p>
                    {this.props.apps.map((app,key)=>{
                        // let currentUser = this.state.userAppId;
                        let currentUser = userAppId
                        console.log(currentUser)
                        if(app.appId === currentUser){
                            return(
                                <div>
                            <ul>
                                <li>{app.appId}</li>
                                <li>{app.airportCode}</li>
                                <li>{app.state}</li>
                                </ul>
                                </div>
                            );
                        }
                    })}
                    </div>
            </div>
        );
    }
}

export default AD;