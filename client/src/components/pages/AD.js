import { Layout } from "antd";
import axios from "axios";
import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Label,
  Row,
} from "reactstrap";
import Web3 from "web3";
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: process.env.PORT || "5001",
  protocol: "https",
});
var link = "https://ipfs.infura.io/ipfs/";
var count = 0;

const { Header, Content, Footer, Sider } = Layout;

class AD extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.fetchUserData();
    await this.fetchStatus();
    await this.get_Airport();
  }
  async loadWeb3() {
    if (window.ethereum) {
      // console.log('here')
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    localStorage.setItem("currentAccount", account);
    this.setState({ account: accounts[0] });
  }

  async fetchUserData() {
    console.log("Address", this.props.account);
    const response = await axios.get(
      `http://localhost:5000/api/Users/${this.props.account}`
    );
    this.setState({ currentUser: response.data });
  }

  async fetchStatus() {
    console.log("Already Fetched", this.state.currentUser);
    const res = await axios.get(
      `http://localhost:5000/api/status/${this.state.currentUser.airportCode}`
    );
    let status = res.data[0];
    if (status == undefined) {
      console.log("Undefined");
      this.setState({ isAppExist: false });
    } else {
      this.setState({ isAppExist: true });
      console.log("Apps", this.props.apps);
      console.log("Status", status);
      this.setState({ appID: status.appId });
      this.setState({ state: status.status });
    }
    //
  }

  async get_Airport(airportCode) {
    const res = await axios.get(
      `http://localhost:5000/api/airports/${this.state.currentUser.airportCode}`
    );
    this.setState({ airport: res.data[0] });
  }

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      airports: [],
      airportCode: "",
      userAppId: "",
      approved_count: 0,
      pending_count: 0,
      buffer: "",
      isAppExist: false,
    };

    this.get_timestamp = this.get_timestamp.bind(this);
    this.captureFile = this.captureFile.bind(this);
    this.submitFile = this.submitFile.bind(this);
    // this.buildAirportSelect = this.buildAirportSelect.bind(this);
    // this.showAirports = this.showAirports.bind(this);

    this.submitToBlockchain = this.submitToBlockchain.bind(this);
  }
  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

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
        console.log(filehash);
      } else if (count === 2) {
        this.setState({ doc2: filehash });
        console.log(filehash);
      } else if (count === 3) {
        this.setState({ doc3: filehash });
        console.log(filehash);
      } else if (count === 4) {
        this.setState({ doc4: filehash });
        console.log(filehash);
      }
      if (error) {
        console.log(error);
        return;
      }
    });
  };

  async submitToBlockchain(event) {
    event.preventDefault();
    const airportCode = this.state.currentUser.airportCode;
    const timestamp = this.get_timestamp();
    const applength = this.props.apps.length;
    const doc1 = this.state.doc1;
    const doc2 = this.state.doc2;
    const doc3 = this.state.doc3;
    const doc4 = this.state.doc4;
    console.log(airportCode, timestamp, doc1, doc2, doc3, doc4);

    this.props.createApp(airportCode, doc1, doc2, doc3, doc4, timestamp);
    let status = {
      airport_code: airportCode,
      appId: applength,
      status: "created",
      feedback: "",
    };
    console.log(status);
    // // Save the status on the mongodb
    const response = await axios.post(
      `http://localhost:5000/api/status/`,
      status
    );
  }

  // get_Application(){
  //     let application;
  //     await this.fetchStatus();
  //     let status = this.state.currStatus;
  //     return this.state.apps.maps((app)=>{
  //         if(app.appId == this.status.appId){
  //             application = app
  //         }
  //     })
  //     return application;
  // }

  render() {
    return (
      <div>
        {!this.state.isAppExist ? (
          <Col md={12}>
            <Card style={{ padding: "20px" }}>
              <form onSubmit={this.submitToBlockchain}>
                <Label
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    color: "gray",
                  }}
                >
                  <h3>Submit New License Application</h3>
                </Label>
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
                            <label
                              className="custom-file-label"
                              id="uploadLabel1"
                            />
                          </div>
                          <Button
                            type="button"
                            color="primary"
                            style={{ width: "100%", marginTop: "10px" }}
                            className="btn"
                            name="doc1Submit"
                            onClick={this.submitFile}
                          >
                            {" "}
                            Upload{" "}
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
                            <label
                              className="custom-file-label"
                              id="uploadLabel1"
                            />
                          </div>
                          <Button
                            style={{ width: "100%", marginTop: "10px" }}
                            type="button"
                            color="primary"
                            className="btn"
                            name="doc1Submit"
                            onClick={this.submitFile}
                          >
                            {" "}
                            Upload{" "}
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
                            <label
                              className="custom-file-label"
                              id="uploadLabel3"
                            />
                          </div>
                          <Button
                            type="button"
                            color="primary"
                            style={{ width: "100%", marginTop: "10px" }}
                            className="btn"
                            name="doc3Submit"
                            onClick={this.submitFile}
                          >
                            {" "}
                            Upload{" "}
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
                            <label
                              className="custom-file-label"
                              id="uploadLabel4"
                            />
                          </div>
                          <Button
                            style={{ width: "100%", marginTop: "10px" }}
                            type="button"
                            color="primary"
                            className="btn"
                            name="doc4Submit"
                            onClick={this.submitFile}
                          >
                            {" "}
                            Upload{" "}
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
        ) : (
          <div>
            {this.props.apps.map((app, key) => {
             let doc = this.props.docs[key];
              let application;
              console.log("Key", key, "- APP ID:", this.state.appID);
            //   let index = key+1;
              if (key == (this.state.appID-1)) {
                
                console.log(doc);
                console.log("Key", key, "- APP ID:", this.state.appID);
                application = app;
                console.log(app)
                const { airport, status, currentUser, state } = this.state;
                return (
                  <div class="card container m-2 p-3" key={key}>
                    <div class="row">
                      <div class="col-9">
                        <h1 style={{ color: "grey" }}>License Application</h1>
                        <h4
                          className="h6"
                          style={{ color: "grey", marginTop: "5%" }}
                        >
                          Airport Name:{airport.airport_name}
                        </h4>
                        <h4 className="h6" style={{ color: "grey" }}>
                          Airport Code:{airport.airport_code}
                        </h4>
                        <br />
                        <h4
                          className="h6"
                          style={{ fontWeight: "bold", color: "grey" }}
                        >
                          Uploaded Documents
                        </h4>
                      </div>
                      <div class="col-3">
                        <span
                          class="badge badge-secondary"
                          style={{
                            marginTop: "10%",
                            padding: "20px",
                            paddingRight: "1.2rem",
                            marginRight: "10%",
                            fontSize: "1rem",
                          }}
                        >
                          {state}
                        </span>
                        <br />
                        <br />
                        <h4 className="h5" style={{ color: "grey" }}>
                          Uploaded By
                        </h4>
                        <h5 className="h6" style={{ color: "grey" }}>
                          {currentUser.fullname}
                        </h5>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="card" style={{ padding: "15px" }}>
                          <div className="row">
                            <div className="col-6">Aerodrome Manual</div>
                            {/* <div className="col-6">
                              <a
                                href={link.concat(doc.aerodromeManual)}
                                className="btn btn-secondary text-center"
                                target="_blank"
                              >
                                View Document
                              </a>
                            </div> */}
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="card" style={{ padding: "15px" }}>
                          <div className="row">
                            <div className="col-6">Licensing Fee</div>
                            {/* <div className="col-6">
                              <a
                                href={link.concat(doc.licensingFee)}
                                className="btn btn-secondary text-center"
                                target="_blank"
                              >
                                View Document
                              </a>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-6">
                        <div className="card" style={{ padding: "15px" }}>
                          <div className="row">
                            <div className="col-6">CAR Compliance</div>
                            {/* <div className="col-6">
                              <a
                                href={link.concat(doc.CARcompliance)}
                                className="btn btn-secondary text-center"
                                target="_blank"
                              >
                                View Document
                              </a>
                            </div> */}
                          </div>
                        </div>
                        </div>
                        <div className="col-6">
                          <div className="card" style={{ padding: "15px" }}>
                            <div className="row">
                              <div className="col-6">Exceptions Document</div>
                              {/* <div className="col-6">
                                <a
                                  href={link.concat(doc.exceptionsDoc)}
                                  className="btn btn-secondary text-center"
                                  target="_blank"
                                >
                                  View Document
                                </a>
                              </div> */}
                              
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  
                );
              }
            })}
          </div>
        )}
      </div>
    );
  }
}

export default AD;
