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
var application = "";
var document = "";
var link = "https://ipfs.infura.io/ipfs/";

class DGCA extends Component {
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
      app: "",
      doc: "",
    };
    this.get_Airports = this.get_Airports.bind(this);
    this.get_timestamp = this.get_timestamp.bind(this);
    this.issueApplication = this.issueApplication.bind(this);
    this.toggle = this.toggle.bind(this);
    this.displayModal = this.displayModal.bind(this);
    this.get_approved_count = this.get_approved_count.bind(this);
  }

  async get_Airports() {
    const response = await axios.get(`http://localhost:5000/api/airports/`);
    this.setState({ airports: response.data });
    // console.log(this.state.currentUser)
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

  toggle() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  }

  displayModal = async (appId, airportCode) => {
    console.log(appId, airportCode);
    // var application='';
    // var document='';
    this.props.apps.map((app, key) => {
      if (app.appId == appId) {
        application = app;
        console.log(application);
        document = this.props.docs[key];
        console.log(document);
        // this.setState({app:application});
        // this.setState({doc:document})
      }
    });
    //
    this.toggle();
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

  async issueApplication(event) {
    event.preventDefault();
    // const appId = event.target.id
    const appId = application.appId;
    const airportCode = application.airportCode;
    const timestamp = this.get_timestamp();
    console.log(appId, timestamp);
    console.log("Airport Code", airportCode);
    this.props.issueApp(appId, timestamp);
    console.log("You have issued app!!");
    const response = await axios.put(
      `http://localhost:5000/api/status/${airportCode}`,
      {
        airport_code: airportCode,
        appId: appId,
        status: "issued",
      }
    );
  }

  render() {
    return (
      <Fragment>
        <br />
        <div className="container">
          <div className="row">
            <div className="col-8">
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
                {/* <h1>Hello</h1> */}
                {this.props.apps.map((app, key) => {
                  let doc = this.props.docs[key];
                  let airport = this.state.airports;
                  if (app.state === "created") {
                    return (
                      <Fragment>
                        <br></br>
                        <div className="row">
                          <div className="col-12">
                            <div
                              className="card"
                              style={{ padding: "18px" }}
                              id={app.appId}
                              onClick={(event) =>
                                this.displayModal(app.appId, app.airportCode)
                              }
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
                                    {app.airportCode}
                                  </td>
                                  <td
                                    className="h6"
                                    style={{
                                      fontWeight: "bold",
                                      textAlign: "center",
                                    }}
                                  >
                                    {airport.airport_name}
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
            <div className="col-4 text-black">
              <Modal isOpen={this.state.modal} toggle={this.toggle}>
                <ModalHeader toggle={this.toggle}>
                  Licensing Application Details
                </ModalHeader>

                <ModalBody>
                  <form onSubmit={this.issueApplication}>
                    <ListGroup>
                      <ListGroupItem>
                        Airport Code : {application.airportCode}
                      </ListGroupItem>
                      <ListGroupItem>
                        <a href={link.concat(document.aerodromeManual)}>
                          {" "}
                          Aerodrome Manual
                        </a>
                      </ListGroupItem>
                      <ListGroupItem>
                        <a href={link.concat(document.licensingFee)}>
                          {" "}
                          Licensing Fee
                        </a>
                      </ListGroupItem>
                      <ListGroupItem>
                        <a href={link.concat(document.CARcompliance)}>
                          {" "}
                          CAR Compliance
                        </a>
                      </ListGroupItem>
                      <ListGroupItem>
                        <a href={link.concat(document.exceptionsDoc)}>
                          {" "}
                          Exceptions Document
                        </a>
                      </ListGroupItem>
                    </ListGroup>
                    <Button
                      type="submit"
                      color="primary"
                      className="btn btn-outline-light btn-block"
                    >
                      Issue Application
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

export default DGCA;
