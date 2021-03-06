import axios from "axios";
import React, { Component, Fragment } from "react";
import {

  Button,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
// DGCA is going to issue applications and also grant applications

const ipfsClient = require("ipfs-http-client");


const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: process.env.PORT || "5001",
  protocol: "https",
});
var statement = "Upload Your File";
var count = 0;
var application = ''
var document = ''
var Airport = ''
var airportData = ''
var link = "https://ipfs.infura.io/ipfs/";
var airportData=""
var Airport=""

class DGCA extends Component {
  async componentWillMount() {
    await this.get_Airports();
    await this.get_approved_count();
  }


  buffer = "";

  constructor(props) {
    super(props)
    this.state = {
      airports: [],
      airportCode: "",
      approved_count: 0,
      pending_count: 0,
      buffer: "",
      app: '',
      modalIsOpen:false,
      secondModalIsOpen: false,
      doc: ''
    };
    this.get_Airports = this.get_Airports.bind(this);
    this.get_timestamp = this.get_timestamp.bind(this)
    this.issueApplication = this.issueApplication.bind(this);
    this.toggle = this.toggle.bind(this);
    this.displayModal = this.displayModal.bind(this)
    this.get_airportData = this.get_airportData.bind(this);
    this.get_approved_count = this.get_approved_count.bind(this)

  }

  get_airportData(airportCode) {
    this.state.airports.map((airport, key) => {
      // console.log(airport.airport_name);
      if (airport.airport_code === airportCode) {
        airportData = airport;
        // console.log(airport);
      }
    })

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

  async get_Airports() {
    const response = await axios.get(`http://localhost:5000/api/airports/`);
    this.setState({ airports: response.data });
    this.state.airports.map((airport, key) => {
      // console.log(airport,key);
    })

    // console.log(this.state.currentUser)
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

  toggle() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
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
    this.setState({ modalIsOpen: true });
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
    const timestamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
    return timestamp;
  }

  async issueApplication(event) {
    event.preventDefault();
    // const appId = event.target.id
    const appId = application.appId
    const airportCode = application.airportCode
    const timestamp = this.get_timestamp()
    console.log(appId, timestamp)
    console.log("Airport Code", airportCode)
    this.props.issueApp(appId, timestamp)
    console.log("You have issued app!!")
    const response = await axios.put(`http://localhost:5000/api/status/${airportCode}`, {
      IATA_code: airportCode,
      appId: appId,
      status: 'issued'
    })
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
                  if (app.state === "created") {
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
                              onClick={(event) => this.displayModal(app, airportData)}
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
              <br />
              <br />
              <div className="row">
                <div className="col-12">
                  <div className="card card-body">
                    <div>
                      <h3 className="h5" style={{ color: "gray" }} align="center">
                        {" "}
                            Application Status
                            {" "}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <br />
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
            </div>
            <div className="col-12">
              <Modal isOpen={this.state.modalIsOpen} toggle={this.openModal} onRequestClose={this.closeModal} size="lg" style={{ maxWidth: '800px', width: '80%' }}>
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
                      onClick={this.issueApplication}
                    >
                      Issue Application
                    </Button>
                    </div>
                    </div>
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

export default DGCA;

