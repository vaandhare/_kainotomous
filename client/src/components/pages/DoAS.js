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
import "../../styles/Deputy.css";

// const ipfsClient = require('ipfs-http-client')
// const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })
var application = "";
var document = "";
var link = "https://ipfs.infura.io/ipfs/";

class DoAS extends Component {
  async componentWillMount() {
    await this.get_Airports();
    await this.get_approved_count();
  }

  constructor(props) {
    super(props);
    this.state = {
      airports: [],
      airportCode: "",
      buffer: "",
      approved_count: 0,
      pending_count: 0,
      buffer: "",
      app: "",
      doc: "",
    };

    this.displayModal = this.displayModal.bind(this);
    this.get_approved_count = this.get_approved_count.bind(this);
    this.toggle = this.toggle.bind(this);
    this.get_timestamp = this.get_timestamp.bind(this);
    this.get_expirydate = this.get_expirydate.bind(this);
    this.assignApplication = this.assignApplication.bind(this);
    this.grantApplication = this.grantApplication.bind(this);
    this.generateLicenseNumber = this.generateLicenseNumber.bind(this);
  }

  toggle() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
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

  displayModal = async (appId, airportCode) => {
    console.log(appId, airportCode);
    //   var application='';
    //   var document='';
    this.props.apps.map((app, key) => {
      if (app.appId == appId) {
        application = app;
        console.log(application);
        document = this.props.docs[key];
        console.log(document);
      }
    });
    //   this.setState({app:application});
    //   this.setState({doc:document})
    this.toggle();
  };

  get_expirydate() {
    let d = new Date();
    var y = d.getFullYear();
    var m = d.getMonth();
    var day = d.getDate();
    let date_ob = new Date(y + 1, m, day);
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
  async assignApplication(event) {
    event.preventDefault();
    const timestamp = this.get_timestamp();
    const appId = application.appId;
    const airportCode = application.airportCode;
    console.log(appId, timestamp);
    this.props.assignApp(appId, timestamp);
    console.log("You have issued app!!");
    const response = await axios.put(
      `http://localhost:5000/api/status/${airportCode}`,
      {
        airport_code: airportCode,
        appId: appId,
        status: "assigned",
      }
    );
  }

  generateLicenseNumber() {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async grantApplication(event) {
    event.preventDefault();
    const timestamp = this.get_timestamp();
    const appId = application.appId;
    const airportCode = application.airportCode;
    console.log(appId, timestamp);
    this.props.grantApp(appId, timestamp);
    console.log("You have granted the license!!");
    const response = await axios.put(
      `http://localhost:5000/api/status/${airportCode}`,
      {
        airport_code: airportCode,
        appId: appId,
        status: "granted",
      }
    );
    let license_no = this.generateLicenseNumber();
    const expirydate = this.get_expirydate();
    const input = {
      airport_code: airportCode,
      license_number: license_no,
      from: timestamp,
      to: expirydate,
    };
    console.log(input);
    const result = await axios.post(
      `http://localhost:5000/api/licensetable/`,
      input
    );
    this.componentWillMount();
  }

  displayButton() {
    if (application.state === "issued") {
      return (
        <Button
          type="submit"
          color="primary"
          className="btn btn-outline-light btn-block"
          onClick={this.assignApplication}
        >
          Assign Application
        </Button>
      );
    } else if (application.state === "approved") {
      return (
        <Button
          type="submit"
          color="primary"
          className="btn btn-outline-light btn-block"
          onClick={this.grantApplication}
        >
          Grant License
        </Button>
      );
    }
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
                {this.props.apps.map((app, key) => {
                  if (app.state === "issued" || app.state === "approved") {
                    let doc = this.props.docs[key];
                    let airport = this.state.airports;

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
                  <form>
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
                    {this.displayButton()}
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
export default DoAS;
{
  /* <div className="container-fluid">
                <br />
                <div className="card text-white bg-dark mb-3 col-lg-12 ml-auto mr-auto" style={{ maxWidth: '700px' }}>
                </div>
                <br />
                <div className="row">
                    <main
                        role="main"
                        className="col-lg-12 ml-auto mr-auto"

                    >
                        {this.props.apps.map((app, key) => {
                        console.log('APP ID', app.appId)
                            if(app.state =="issued"){
                            return (
                                <div className="card bg-dark mb-3 col-lg-12 ml-auto mr-auto" key={key} id="cardDIV" style={{ maxWidth: '700px' }}>
                                    <div className="card-header ml-auto mr-auto">Issued Application {key}</div>
                                    <div className="card-body ">
                                        <form onSubmit={(event) => {
                                            event.preventDefault()
                                        }}>
                                            Author:
                                            <small className="text-white">{app.author}</small>

                                            <ul id="postList" className="list-group list-group-flush">

                                            <li className="list-group-item">
                                                    {app.airportCode}
                                                </li>
                                                <li className="list-group-item">
                                                    {app.state}
                                                </li>
                                                <li className="list-group-item-success">
                                                <button
                                                    id={app.appId}
                                                    type="button"
                                                    className="btn btn-danger btn-outline-light float-right"
                                                    name="assign"
                                                    onClick = {(event) => this.assignApplication(event.target.id,app.airportCode)}
                                                >
                                                    Assigned Application
                                                </button>
                                                </li>
                                            </ul>

                                        </form>
                                    </div>
                                </div> */
}

//                             );
//                                     }
//                             else if(app.state =="approved"){
//                                         return (
//                                             <div className="card bg-dark mb-3 col-lg-12 ml-auto mr-auto" key={key} id="cardDIV" style={{ maxWidth: '700px' }}>
//                                                 <div className="card-header ml-auto mr-auto">Licensing Application To Approve {key}</div>
//                                                 <div className="card-body ">
//                                                     <form onSubmit={(event) => {
//                                                         event.preventDefault()
//                                                     }}>
//                                                         Author:
//                                                         <small className="text-white">{app.author}</small>

//                                                         <ul id="postList" className="list-group list-group-flush">

//                                                         <li className="list-group-item">
//                                                             {app.airportCode}
//                                                         </li>
//                                                         <li className="list-group-item">
//                                                             {app.state}
//                                                         </li>
//                                                             <li className="list-group-item-success">
//                                                             <button
//                                                                 id={app.appId}
//                                                                 type="button"
//                                                                 className="btn btn-danger btn-outline-light float-right"
//                                                                 name="issue"
//                                                                 onClick = {(event)=>this.grantApplication(event.target.id,app.airportCode)}
//                                                             >
//                                                                 Grant Application
//                                                             </button>
//                                                             </li>
//                                                         </ul>

//                                                     </form>
//                                                 </div>
//                                             </div>

//                                         );
//                         }
//                         })}
//                     </main>
//                 </div >
//             </div>
//         );
//     }
// }

// export default DoAS;
