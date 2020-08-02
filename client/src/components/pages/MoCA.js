import axios from "axios";
import React, { Component, Fragment } from "react";
import {
  Button,
  Col,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import "../../styles/Deputy.css";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: process.env.PORT || "5001",
  protocol: "https",
});
var count = 0;
var application = ''
var document = ''
var Airport = ''
var airportData = ''

class MoCA extends Component {
  async componentWillMount() {
    await this.get_Airports();
    await this.get_approved_count();
  }

  buffer = "";

  constructor(props) {
    super(props);
    this.state = {
      airports: [],
      airportCode: "",
      approved_count: 0,
      pending_count: 0,

      buffer: "",
    };

    this.get_Airports = this.get_Airports.bind(this);
    this.get_airportData = this.get_airportData.bind(this);
    this.get_Airport = this.get_Airport.bind(this);
    this.get_timestamp = this.get_timestamp.bind(this);
    this.captureFile = this.captureFile.bind(this);
    this.submitFile = this.submitFile.bind(this);
    this.buildAirportSelect = this.buildAirportSelect.bind(this);
    this.showAirports = this.showAirports.bind(this);

    this.submitToBlockchain = this.submitToBlockchain.bind(this);
    this.toggle = this.toggle.bind(this);

    this.get_approved_count = this.get_approved_count.bind(this)
  }

  async get_Airports() {
    const response = await axios.get(`http://localhost:5000/api/airports/`);
    this.setState({ airports: response.data });
    // console.log(this.state.currentUser)
  }



  async get_Airport(airportCode){
    return await axios.get(`http://localhost:5000/api/airports/${airportCode}`)
  }

  toggle() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  }

  async get_approved_count() {
    var approved_count = 0;
    var pending_count = 0;
    this.props.apps.map((app, key) => {
      if (app.state === "approved" || app.state === "granted") {
        approved_count = approved_count + 1;
      } else {
        pending_count = pending_count + 1;
      }
    });
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
      } else if (count === 2) {
        this.setState({ doc2: filehash });
      } else if (count === 3) {
        this.setState({ doc3: filehash });
      } else if (count === 4) {
        this.setState({ doc4: filehash });
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
        <option value={airport.airport_code} key={key}>
          {airport.airport_name}
        </option>
      );
    });
    return arr;
  }
get_airportData(airportCode){
  this.state.airports.map((airport,key)=>{
    // console.log(airport.airport_name);
    if(airport.airport_code === airportCode){
      airportData = airport;
      
    }
  })
}

displayModal = async (app, airport) => {
  Airport = airport;
  console.log(airport);
  application = app;
  console.log(application);
  this.props.docs.map((doc, key) => {
    if (doc.id === application.id) {
      document = doc;
      console.log(document);
    }
  })
  this.toggle();
}
 

  showAirports() {
    var airportCard = [];

    this.state.airports.map(async (airport, key) => {
      // let state = await this.get_Airport(airport.airport_code)
      // let status = ""
      // if(Array.isArray(state.data) && state.data.length){
      //   console.log('Not Empty',state.data)
      //   status = state.data[0].status;
      // }

      airportCard.push(
        <div className="row" key={key}>
          <div className="col-12">
            <div className="card" style={{ padding: "18px" }}>
              <div className="row">
                <div className="col-3">
                  <p>Airport Code</p>
                </div>
                <div className="col-6">
                  <h6>Airport Name</h6>
                </div>
                <div className="col-3">
                  <h6>Status</h6>
                </div>
              </div>
              <div className="row">
                <div className="col-3">
                  <h6>{airport.airport_code}</h6>
                </div>
                <div className="col-6">
                  <h6>{airport.airport_name}</h6>
                </div>
                <div className="col-3">
                  <span
                    className="badge badge-primary"
                    style={{
                      padding: "8px",
                      fontWeight: "bold",
                      fontSize: "15px",
                    }}
                  >
                    {/* { status === "" ? "Not Licensed": status} */}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
    return airportCard;
  }

  async submitToBlockchain(event) {
    event.preventDefault();
    const airportCode = this.state.airportCode;
    const timestamp = this.get_timestamp();
    const applength = this.props.apps.length;

    const doc1 = this.state.doc1;
    const doc2 = this.state.doc2;
    const doc3 = this.state.doc3;
    const doc4 = this.state.doc4;
    console.log(airportCode, timestamp, doc1, doc2, doc3, doc4);

    this.props.createApp(airportCode, doc1, doc2, doc3, doc4, timestamp);

    // Save the status on the mongodb
    const response = await axios.post(`http://localhost:5000/api/status/`, {
      airport_code: airportCode,
      appId: applength,
      status: "created",
    });
  }

  render() {
    const { currentUser } = this.props;
    return (
      <Fragment>
        <br />
        <div className="container">
          <div className="row">
            <div className="col-6">
              <h2 className="h3" style={{ color: "grey" }}>
                Overview
              </h2>
              <br />
              <div className="row">
                <div className="col-6">
                  <div className="card card-body">
                    <div>
                      <h3 className="h5" style={{ color: "gray" }}>
                        Approved Documents
                      </h3>
                      <h2 className="h4">{this.state.approved_count}</h2>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card card-body">
                    <div>
                      <h3
                        className="h5"
                        style={{
                          color: "gray",
                        }}
                      >
                        Pending Documents
                      </h3>
                      <h2 className="h4">{this.state.pending_count}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div className="card card-body">
                      {this.props.apps.map((app, key) => {
                          
                        this.get_airportData(app.airportCode);
                                        let doc = this.props.docs[key];
                                        return (
                                            <Fragment>
                                                <br></br>
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="card"
                                                            style={{ padding: "18px" }}
                                                            id={app.appId}
                                                            >
                                                            <table>
                                                                <tr>
                                                                    <th
                                                                        className="h6"
                                                                        style={{
                                                                            color: "grey",
                                                                            textAlign: "center",
                                                                        }}
                                                                    >
                                                                        Airport Code
                                </th>
                                                                    <th
                                                                        className="h6"
                                                                        style={{
                                                                            color: "grey",
                                                                            textAlign: "center",
                                                                        }}
                                                                    >
                                                                        Airport Name
                                </th>
                                                                    <th
                                                                        className="h6"
                                                                        style={{
                                                                            color: "grey",
                                                                            textAlign: "center",
                                                                        }}
                                                                    >
                                                                        Status
                                </th>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        className="h6"
                                                                        style={{
                                                                            fontWeight: "bold",
                                                                            textAlign: "center",
                                                                        }}
                                                                    >
                                                                        {airportData.airport_code}
                                                                    </td>
                                                                    <td
                                                                        className="h6"
                                                                        style={{
                                                                            fontWeight: "bold",
                                                                            textAlign: "center",
                                                                        }}
                                                                    >
                                                                        {airportData.airport_name}
                                                                    </td>
                                                                    <td
                                                                        className="h6"
                                                                        style={{
                                                                            fontWeight: "bold",
                                                                            textAlign: "center",
                                                                        }}
                                                                    >
                                                                        <span
                                                                            className="badge badge-primary"
                                                                            style={{
                                                                                padding: "8px",
                                                                                fontWeight: "bold",
                                                                                fontSize: "15px",
                                                                            }}
                                                                        >
                                                                            {app.state}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Fragment>
                                        );
                                })}
                    
              </div>
            </div>
            <div className="col-6">
            
              <br />
              <br/>
              <div className="card card-body center" style={{width:"250px"}}>
                <h4 className="h5">David Boon</h4>
                <h6 style={{ color: "grey" }}>Airport Director</h6>
                <Button
                  color="primary"
                  onClick={this.toggle}
                  style={{ justifyContent: "center" }}
                >
                  <i className="fa fa-cloud-upload"></i>Upload New Document
                </Button>
                </div>
                <br/> 
                
                <div className="card card-body">
                                {this.props.apps.map((app, key) => {
                                    // console.log(app.airportCode)
                                    this.get_airportData(app.airportCode);
                                    let doc = this.props.docs[key];

                                    return (
                                        <Fragment>
                                            <br></br>
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="card"
                                                        style={{ padding: "18px" }}
                                                        id={app.appId}
                                                        onClick={(event) => this.displayModal(app, airportData)}>
                                                        <table>
                                                            <tr>
                                                                <th
                                                                    className="h6"
                                                                    style={{
                                                                        color: "grey",
                                                                        textAlign: "center",
                                                                    }}
                                                                >
                                                                    Airport Code
                                </th>
                                                                <th
                                                                    className="h6"
                                                                    style={{
                                                                        color: "grey",
                                                                        textAlign: "center",
                                                                    }}
                                                                >
                                                                    Airport Name
                                </th>
                                                                <th
                                                                    className="h6"
                                                                    style={{
                                                                        color: "grey",
                                                                        textAlign: "center",
                                                                    }}
                                                                >
                                                                    Status
                                </th>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    className="h6"
                                                                    style={{
                                                                        fontWeight: "bold",
                                                                        textAlign: "center",
                                                                    }}
                                                                >
                                                                    {airportData.airport_code}
                                                                </td>
                                                                <td
                                                                    className="h6"
                                                                    style={{
                                                                        fontWeight: "bold",
                                                                        textAlign: "center",
                                                                    }}
                                                                >
                                                                    {airportData.airport_name}
                                                                </td>
                                                                <td
                                                                    className="h6"
                                                                    style={{
                                                                        fontWeight: "bold",
                                                                        textAlign: "center",
                                                                    }}
                                                                >
                                                                    <span
                                                                        className="badge badge-primary"
                                                                        style={{
                                                                            padding: "8px",
                                                                            fontWeight: "bold",
                                                                            fontSize: "15px",
                                                                        }}
                                                                    >
                                                                        {app.state}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </Fragment>
                                    );
                                })}
                            </div>
                <Modal isOpen={this.state.modal} toggle={this.toggle} size="lg" style={{maxWidth: '800px', width: '80%'}}>
                  <ModalBody>
                  <form onSubmit={this.submitToBlockchain}>
                    <div class="container">
                      <div class="row">
                        <div class="col-9">
                          <h1 style={{ color: "grey" }}>License Application</h1>
                          <h4
                            className="h6"
                            style={{ color: "grey", marginTop: "5%" }}
                          >
                            Please Fill the Required Details
                          </h4>
                          <FormGroup>
                        <select
                          value={this.state.role}
                          onChange={(e) => {
                            this.setState({ airportCode: e.target.value });
                          }}
                          className="form-control"
                          defaultValue=""
                        >
                          <option value="" style={{ color: "grey" }}disabled>
                          Select the Airport
                        </option>

                          {this.buildAirportSelect()}
                        </select>
                      </FormGroup>
                          <br />
                          <h4
                            className="h6"
                            style={{ fontWeight: "bold", color: "grey" }}
                          >
                            Upload Documents
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
                          </span>
                          <br />
                          <br />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <div className="card" style={{ padding: "15px" }}>
                            <div className="row">
                              <div className="col-9">
                                  <FormGroup>
                                  {/* <Label>Aerodrome Manual</Label> */}
                              <input
                                id="doc1"
                                type="file"
                                className="custom-file-input"
                                onChange={this.captureFile}
                              />
                              <label
                                className="custom-file-label"
                                id="uploadLabel1"
                              >Aerodrome Manual</label>
                              </FormGroup>
                              </div>
                              <div className="col-3">
                                <button className="btn btn-secondary text-center" onClick={this.submitFile}>
                                  Select
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>


                        <div className="col-6">
                          <div className="card" style={{ padding: "15px" }}>
                            <div className="row">
                              <div className="col-9">
                              <FormGroup>
                                  {/* <Label>Aerodrome Manual</Label> */}
                              <input
                                id="doc1"
                                type="file"
                                className="custom-file-input"
                                onChange={this.captureFile}
                              />
                              <label
                                className="custom-file-label"
                                id="uploadLabel1"
                              >SMS Manual</label>
                              </FormGroup>
                              </div>
                              <div className="col-3">
                                <button className="btn btn-secondary text-center" onClick={this.submitFile}>
                                  Select
                                </button>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        <div className="col-6">
                          <div className="card" style={{ padding: "15px" }}>
                            <div className="row">
                              <div className="col-9">
                              <FormGroup>
                                  {/* <Label>Aerodrome Manual</Label> */}
               <input
                                id="doc1"
                                type="file"
                                className="custom-file-input"
                                onChange={this.captureFile}
                              />
                              <label
                                className="custom-file-label"
                                id="uploadLabel1"
                              >CAR Compliance Document</label>
                              </FormGroup>
                              </div>
                              <div className="col-3">
                                <button className="btn btn-secondary" onClick={this.submitFile}>
                                  Select
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="card" style={{ padding: "15px" }}>
                            <div className="row">
                              <div className="col-9">
                              <FormGroup>
                                  {/* <Label>Aerodrome Manual</Label> */}

                              <input
                                id="doc1"
                                type="file"
                                className="custom-file-input"
                                onChange={this.captureFile}
                              />
                              <label
                                className="custom-file-label"
                                id="uploadLabel1"
                              >Exceptions Document</label>
                              </FormGroup>
                              </div>
                              <div className="col-3">
                                <button className="btn btn-secondary" onClick={this.submitFile}>
                                  Select
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <br />
                    <Button
                      type="submit"
                      color="primary"
                      className="btn btn-outline-light"
                      style={{ marginLeft: "80%" }}
                    >
                      Submit Application
                    </Button>
                  </form>
                </ModalBody>

                </Modal>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default MoCA;

