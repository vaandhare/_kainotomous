import React, { Component, Fragment } from "react";
import "../../styles/Deputy.css";
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
  ModalFooter,
} from "reactstrap";

import axios from "axios";
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: process.env.PORT || "5001",
  protocol: "https",
});
var statement = "Upload Your File";
var count = 0;

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

    this.get_Airport = this.get_Airport.bind(this);

    this.get_timestamp = this.get_timestamp.bind(this);
    this.captureFile = this.captureFile.bind(this);
    this.submitFile = this.submitFile.bind(this);
    this.buildAirportSelect = this.buildAirportSelect.bind(this);
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

    const doc1 = this.state.doc1;
    const doc2 = this.state.doc2;
    const doc3 = this.state.doc3;
    const doc4 = this.state.doc4;
    console.log(airportCode, timestamp, doc1, doc2, doc3, doc4);

    this.props.createApp(airportCode, doc1, doc2, doc3, doc4, timestamp);

    // Save the status on the mongodb
    const response = await axios.post(`http://localhost:5000/api/status/`, {
      IATA_code: airportCode,
      appId: applength,
      status: "created",
    });
  }

  render() {
    const {currentUser} = this.props
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
                      <h2 className="h4">000</h2>
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
                      <h2 className="h4">000</h2>
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

                  return (
                    <Fragment>
                      <br></br>
                      <div className="row">
                        <div className="col-12">
                          <div className="card" style={{ padding: "18px" }}>
                            <table>

                              <tbody>

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
                })}
              </div>
            </div>
            <div className="col-4">
              <br />
              <br />
              <br />
              <div className="card card-body center">
                <h4 className="h5">David Boon</h4>
                <h6 style={{ color: "grey" }}>Chairman</h6>
                <Button
                  color="primary"
                  onClick={this.toggle}
                  style={{ justifyContent: "center" }}
                >
                  <i className="fa fa-cloud-upload"></i>Upload New Document
                </Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                  <ModalHeader toggle={this.toggle}>
                    Upload Document
                  </ModalHeader>
                  <ModalBody>
                    <form onSubmit={this.submitToBlockchain}>
                      <FormGroup>
                        <select
                          value={this.state.role}
                          onChange={(e) => {
                            this.setState({ airportCode: e.target.value });
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
                        <Label>Aerodrome Manual</Label>
                        <Row>
                          <Col md={9}>
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
                              >
                                {statement}
                              </label>
                            </div>
                          </Col>
                          <Col md={3}>
                            <Button
                              type="button"
                              color="primary"
                              className="btn btn-outline-light float-right"
                              name="doc1Submit"
                              onClick={this.submitFile}
                            >
                              {" "}
                          Upload{" "}
                            </Button>
                          </Col>
                        </Row>
                      </FormGroup>

                      <FormGroup>
                        <Label for="doc2">Licensing Fee</Label>
                        <Row>
                          <Col md={9}>
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
                              >
                                {statement}
                              </label>
                            </div>
                          </Col>
                          <Col md={3}>
                            <Button
                              type="button"
                              color="primary"
                              className="btn btn-outline-light float-right"
                              name="doc1Submit"
                              onClick={this.submitFile}
                            >
                              {" "}
                          Upload{" "}
                            </Button>
                          </Col>
                        </Row>
                      </FormGroup>

                      <FormGroup>
                        <Label for="doc3">CAR Compliance Document</Label>
                        <Row>
                          <Col md={9}>
                            <div className="custom-file">
                              <input
                                id="doc3"
                                type="file"
                                className="custom-file-input"
                                onChange={this.captureFile}
                              />
                              <label
                                className="custom-file-label"
                                id="uploadLabel1"
                              >
                                {statement}
                              </label>
                            </div>
                          </Col>
                          <Col md={3}>
                            <Button
                              type="button"
                              color="primary"
                              className="btn btn-outline-light float-right"
                              name="doc1Submit"
                              onClick={this.submitFile}
                            >
                              {" "}
                          Upload{" "}
                            </Button>
                          </Col>
                        </Row>
                      </FormGroup>

                      <FormGroup>
                        <Label for="doc4">Exceptions Doc</Label>
                        <Row>
                          <Col md={9}>
                            <div className="custom-file">
                              <input
                                id="doc4"
                                type="file"
                                className="custom-file-input"
                                onChange={this.captureFile}
                              />
                              <label
                                className="custom-file-label"
                                id="uploadLabel1"
                              >
                                {statement}
                              </label>
                            </div>
                          </Col>
                          <Col md={3}>
                            <Button
                              type="button"
                              color="primary"
                              className="btn btn-outline-light float-right"
                              name="doc1Submit"
                              onClick={this.submitFile}
                            >
                              {" "}
                          Upload{" "}
                            </Button>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup />
                      <Button
                        type="submit"
                        color="primary"
                        className="btn btn-outline-light btn-block"
                      >
                        Upload
                      </Button>
                    </form>
                  </ModalBody>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default MoCA;

