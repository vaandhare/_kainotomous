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


const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: process.env.PORT || "5001",
  protocol: "https",
});
var count = 0;
var airportData = '';
var Airport="";
var application="";
var document="";
var link = "https://ipfs.infura.io/ipfs/"

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
      modalIsOpen:false,
      secondModalIsOpen: false,
      buffer: "",
    };

    this.get_Airports = this.get_Airports.bind(this);
    this.get_airportData = this.get_airportData.bind(this);
    this.get_Airport = this.get_Airport.bind(this);
  
    this.captureFile = this.captureFile.bind(this);
    this.submitFile = this.submitFile.bind(this);
    this.buildAirportSelect = this.buildAirportSelect.bind(this);

    this.submitToBlockchain = this.submitToBlockchain.bind(this);
    this.toggle = this.toggle.bind(this);
    this.get_timestamp = this.get_timestamp.bind(this);
    this.get_approved_count = this.get_approved_count.bind(this)
  }

  async get_Airports() {
    const response = await axios.get(`http://localhost:5000/api/airports/`);
    this.setState({ airports: response.data });
    // console.log(this.state.currentUser)
  }



  async get_Airport(airportCode){
    return await axios.get(`http://localhost:5000/api/status/${airportCode}`)
  }

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  openSecondModal = () => {
    this.setState({ secondModalIsOpen: true });
  };

  closeSecondModal = () => {
    this.setState({ secondModalIsOpen: false });
  };

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

  async reviewApplication(event) {
    event.preventDefault();
    const timestamp = this.get_timestamp();
    console.log(timestamp);
    const appId = application.appId;
    const airportCode = application.airportCode;
    console.log(appId, timestamp);
    this.props.reviewApp(appId, timestamp);
    console.log("Application in review!!");
    const response = await axios.put(
      `http://localhost:5000/api/status/${airportCode}`,
      {
        airport_code: airportCode,
        appId: appId,
        status: "reviewed",
      }
    );
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
    console.log(airportCode)
    // console.log(airport.airport_name);
    if(airport.airport_code === airportCode){
      airportData = airport;
      // console.log(airport);
    }
  })
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

  async displayAppDetails(app,airport){
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
    this.setState({ secondModalIsOpen: true });
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
                        if(app.state === "created"){
                        // console.log(app.airportCode)
                        this.get_airportData(app.airportCode);
                                        let doc = this.props.docs[key];
                                        return (
                                            <Fragment>
                                                <br></br>
                                                <div className="row">
                                                    <div className="col-12" onClick={(event)=>this.displayAppDetails(app,airportData)}>
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
                                                                          }
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
                  onClick={this.openModal}
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
                                                        onClick={(event)=>this.displayAppDetails(app,airportData)}>
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
                <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal}
                toggle={this.openModal} size="lg" style={{maxWidth: '800px', width: '80%'}}>
                  <ModalBody>
                  <form >
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
                    <div className="row">
                      <div className="col-6">
                        <Button
                      type="submit"
                      color="primary"
                      className="btn btn-outline-light float-left"
                      style={{ marginRight: "80%" }}
                      onClick={this.closeModal}
                    >
                      Close
                    </Button>
                    </div>
                    <div className="col-6">
                    <Button
                      type="submit"
                      color="primary"
                      className="btn btn-outline-light float-right"
                      style={{ marginLeft: "80%" }}
                      onClick={this.submitToBlockchain}
                    >
                      Submit Application
                    </Button>
                    </div>
                    </div>
                    {/* <button onClick={this.closeModal}>close</button>  */}
                  </form>
                </ModalBody>

                </Modal>

                <Modal isOpen={this.state.secondModalIsOpen}
                onRequestClose={this.closeSecondModal}  
                size="lg" 
                style={{ maxWidth: '800px', width: '80%' }}>
                <ModalBody>
                  <form >
                    <div class="container">
                      <div class="row">
                        <div class="col-9">
                          <h1 style={{ color: "grey" }}>License Application</h1>
                          <h4
                            className="h6"
                            style={{ color: "grey", marginTop: "5%" }}
                          >
                            Airport Name: {Airport.airport_name}
                          </h4>
                          <h4 className="h6" style={{ color: "grey" }}>
                            Airport Code:{Airport.airport_code}
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
                            {application.state}
                          </span>
                          <br />
                          <br />
                          <h4 className="h5" style={{ color: "grey" }}>
                            {application.state} at
                          </h4>
                          <h5 className="h6" style={{ color: "grey" }}>
                            {application.timestamp}
                          </h5>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <div className="card" style={{ padding: "15px" }}>
                            <div className="row">
                              <div className="col-6">Aerodrome Manual</div>
                              <div className="col-6">
                                <a className="btn btn-secondary text-center"
                                  href={link.concat(document.aerodromeManual)}>
                                  View Document
                                  </a>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-6">
                          <div className="card" style={{ padding: "15px" }}>
                            <div className="row">
                              <div className="col-6">SMS Manual</div>
                              <div className="col-6">
                                <a className="btn btn-secondary text-center" href={link.concat(document.licensingFee)}>
                                  View Document
                                </a>
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
                              <div className="col-6">CAR Compliance</div>
                              <div className="col-6">
                                <a className="btn btn-secondary" href={link.concat(document.CARcompliance)}>
                                  View Document
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="card" style={{ padding: "15px" }}>
                            <div className="row">
                              <div className="col-6">Exceptions Document</div>
                              <div className="col-6">
                                <a className="btn btn-secondary" href={link.concat(document.execeptionsDoc)}>
                                  View Document
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      <Button
                      type="submit"
                      color="primary"
                      className="btn btn-outline-light float-right"
                      style={{ marginRight: "80%" }}
                      onClick={this.closeSecondModal}
                    >
                      Close
                    </Button>
                    <Button
                      type="submit"
                      color="primary"
                      className="btn btn-outline-light float-left"
                      style={{ marginLeft: "80%" }}
                      onClick={this.reviewApplication}
                    >
                      Provide Feedback
                    </Button>
                      </div>
                    </div>
                    <br />
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

