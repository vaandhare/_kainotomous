import Web3 from 'web3'
import { Layout } from 'antd';
import axios from "axios";
import {
    Row,
    Col,
    Card,
    CardBody,
    Button,
    CardHeader,
    FormGroup,
    Label,
    CardFooter
} from 'reactstrap';
import React, { Component, Fragment } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import {  Descriptions, Input, Radio, Checkbox } from 'antd';
// import { Input, Radio , Checkbox } from 'antd';
// import { replaceOne } from '../../../../models/User';
var APPID = "";
var AIRPORTCODE="";
var STATUS=""
const { TextArea } = Input;
var link = "https://ipfs.infura.io/ipfs/";
function onChange(checkedValues) {
  console.log('checked = ', checkedValues);
}

const LicenseType = ['Public Use', 'Private Use'];
const boolValues = ['Yes', 'No']

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
    host: "ipfs.infura.io",
    port: process.env.PORT || "5001",
    protocol: "https",
});

var count = 0;
var aero_owner="";
var Airport="";
const { Header, Content, Footer, Sider } = Layout;
var feedback ="";

class AD extends Component {

  state = {
    value: 1,
  };

  ShowForm = e => {
    this.setState({
      showApplication: e.target.showApplication,
    });
  };

  toggleHidden = (prevState) => {
		this.setState({
			showApplication: !prevState.showApplication
		});
  };
  
  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  closeApp = (prevState) => {
		this.setState({
			showApplication: false
		});
  };

  toggleLicense = (prevState) => {
		this.setState({
			showLicense: !prevState.showLicense
		});
	};

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
    // console.log("Address", this.props.account);
    const response = await axios.get(
      `http://localhost:5000/api/Users/${this.props.account}`
    );
    this.setState({ currentUser: response.data });
  }

  async fetchStatus() {
    // console.log("Already Fetched", this.state.currentUser);
    const res = await axios.get(
      `http://localhost:5000/api/status/${this.state.currentUser.airportCode}`
    );
    let status = res.data[0];
    console.log(status);
    if (status == undefined) {
      console.log("Undefined");
      this.setState({ isAppExist: false });
    } else {
      this.setState({ isAppExist: true});
      // console.log("Apps", this.props.apps);
      // console.log("Status", status);
      this.setState({ appID: status.appId });
      this.setState({ state: status.status });
      this.setState({feedback:status.feedback});
      APPID=status.appId;
      AIRPORTCODE=status.feedback;
      STATUS=status.status;
      console.log(APPID,STATUS,AIRPORTCODE);
      feedback = status.feedback;
      console.log(feedback);

    }
    //
  }

  async get_Airport() {
    const res = await axios.get(
      `http://localhost:5000/api/airports/${this.state.currentUser.airportCode}`
    );
    let airport = res.data[0];
    console.log("Airport is fetched",airport);
    // console.log("Airport is fetched",airport);

    this.setState({airport});
    Airport = airport;
  }

  constructor(props) {
    super(props);
    this.state = {
      appId:"",
      state:"",
      isAppExist:false,
      collapsed: false,
      airport:'',
      airportCode: "",
      userAppId: "",
      approved_count: 0,
      pending_count: 0,
      buffer: "",
      fullname:"",
      email:"",
      tel:0,
      nation:"",
      aero_name:"",
      aero_owner:"",
      loc:"",
      details:"",
      isEnclosed:false,
      enclosing_details:"",
      category:"",
      isAllWeather:"",
      weatherDetails:"",
      buffer1:"",
      buffer2:"",
      buffer3:"",
      buffer4:"",
     modalIsOpen:true,
     feedback:"",

    };

    this.get_timestamp = this.get_timestamp.bind(this);
    this.captureFile = this.captureFile.bind(this);
    this.handleSubmit= this.handleSubmit.bind(this);
    this.closeApp = this.closeApp.bind(this);
    this.fetchStatus = this.fetchStatus.bind(this);
    this.fetchUserData = this.fetchUserData.bind(this);
    this.loadBlockchainData = this.loadBlockchainData.bind(this);
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
    const docNumber = event.target.id;
    console.log(docNumber);
    const file = event.target.files[0];
    const reader = new window.FileReader(); // converts the file to a buffer
    reader.readAsArrayBuffer(file);
    if(docNumber === "doc1"){
      reader.onloadend = () => {
        this.setState({ buffer1: Buffer(reader.result) }, () => {
          console.log(this.state.buffer1);
        });
      };
    }
    else if(docNumber ==="doc2"){
      reader.onloadend = () => {
        this.setState({ buffer2: Buffer(reader.result) }, () => {
          console.log(this.state.buffer2);
        });
      };
    }
    else if(docNumber === "doc3"){
      reader.onloadend = () => {
        this.setState({ buffer3: Buffer(reader.result) }, () => {
          console.log(this.state.buffer3);
        });
      };
    }
    else{
      reader.onloadend = () => {
        this.setState({ buffer4: Buffer(reader.result) }, () => {
          console.log(this.state.buffer4);
        });
      };
    }
    
  };

  async handleSubmit(event) {
    event.preventDefault();
    const {fullname,email,tel,nation,aero_name,aero_owner,loc,
        details,isEnclosed,enclosing_details,category,isAllWeather,weatherDetails} = this.state;
        // console.log(fullname,email,tel,nation,aero_name,aero_owner,loc,
        //   details,isEnclosed,enclosing_details,category,isAllWeather,weatherDetails);
        console.log(aero_name);
        console.log(aero_owner);
        const applength = this.props.apps.length;  
        const response = await axios.post("http://localhost:5000/api/appform/", {
        formid:applength,
        appid:applength,
        name: fullname,
        email:email,
        telephone:tel,
        nationality:nation,
        aerodrome_name:aero_name,
        aerodrome_owner:aero_owner,
        is_enclosed:isEnclosed,
        enclosing_details:enclosing_details,
        category:category,
        isAllWeather:isAllWeather,
        weatherDetails:weatherDetails
    }).then((response) =>{
      if (response.data.status === 'success'){
        alert("Message Sent."); 
        this.resetForm()
      }else if(response.data.status === 'fail'){
        alert("Message failed to send.")
      }
    } );
    
    const airresponse = await axios.get(`http://localhost:5000/api/appform/${applength}`)
    const application = airresponse.data[0];
    console.log(application);
    console.log("File Captured");
    const file = await ipfs.add([this.state.buffer1,this.state.buffer2,this.state.buffer3,this.state.buffer4]);
    console.log(file[0].hash);
    console.log(file[1].hash);
    console.log(file[2].hash);
    console.log(file[3].hash);
    const airportCode = Airport.airport_code;
    console.log(airportCode);
    const timestamp = this.get_timestamp();
    console.log(timestamp);
    if(file){
      const doc1 = file[0].hash;
      const doc2 = file[1].hash;
      const doc3 = file[2].hash;
      const doc4 = file[3].hash;
      const timestamp = this.get_timestamp();
      const applength = this.props.apps.length;
      console.log(airportCode, timestamp, doc1, doc2, doc3, doc4);
  
      this.props.createApp(airportCode, doc1, doc2, doc3, doc4, timestamp);
  
      // Save the status on the mongodb
      const response = await axios.post(`http://localhost:5000/api/status/`, {
        airport_code: airportCode,
        appId: applength,
        status: "created",
      });
    }
    else{
      console.log("Error uploading files!");
    }
    this.cleanInputs()
  }

  cleanInputs(){
    this.setState({id:""})
    this.setState({appID:""})
    this.setState({fullname:""})
    this.setState({email:""})
    this.setState({telephone:""})
    this.setState({nationality:""})
    this.setState({aerodrome_name:""})
    this.setState({location:""})
    this.setState({is_enclosed:""})
    this.setState({enclosing_details:""})
    this.setState({category:""})
    this.setState({isAllWeather:""})
    this.setState({weatherDetails:""})
  }

  showStatus = () =>{
    console.log("Showing Status")
    switch(STATUS){
      case '' : return(<Button color="primary">Create New Application</Button>)
                break;
      case 'reviewed': return(<Button color="info">Application Need Improvements</Button>)
                        break;
      case 'issued':return(<Button color="info">Issued to DGCA</Button>)
                    break;
      case 'created': return(<Button color="info">Application Created and Sent to HQ</Button>)
                      break;
      case 'assigned': return(<Button color="info">Assigned to AI</Button>)
                      break;
      case 'approved':return(<Button color="info">Approved By AI</Button>)
                  break;
      case 'granted': return(<div><Button color="success">Granted License</Button>
                       <Button color="success">Download License</Button></div>)
                    break;  
      case 'rejected':return(<Button color="info">Rejected Create Again</Button>)
                    break;        

    }
  }

  render() {
    const {showApplication,showLicense} = this.state;
    
    return (
      <div>
        {showApplication ? (
          <div>
            <Button
					onClick={this.closeApp}
					style={{ marginRight: '85%', marginTop: '10px' }}
				>
					<PlusOutlined />Close
				</Button>
          <Card style={{margin: "10px", padding: "10px"}}>
          <h3 style={{ textAlign: "center", color: "gray", margin: "10px" }}>Application for an Aerodrome Application</h3>
          <Row>
            <Col md={6}>
              <Card style={{margin: "10px", padding: "10px"}}>
                <CardHeader>
                  <h5 style={{ color: "gray", display:"inline"}}>Details of License</h5>
                  <h6 style={{ color: "gray", display:"inline" }}>(As required to be shown on the License)</h6>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={6}>
                      <Input
                        type="text"
                        placeholder="Name of the Applicant"
                        value={this.state.fullname}
                        onChange={(e)=>{this.setState({fullname:e.target.value})}}
                      />
                    </Col>
                    <Col md={6}>
                      <Input
                        type="email"
                        placeholder="Email of the Applicant"
                        value={this.state.email}
                        onChange={(e)=>{this.setState({email:e.target.value})}}
                      />
                    </Col>
                  </Row>
                  <Row style={{marginTop: "20px"}}>
                    <Col md={6}>
                      <Input
                        type="text"
                        placeholder="Telephone"
                        value={this.state.tel}
                        onChange={(e)=>{this.setState({tel:e.target.value})}}
                      />
                    </Col>
                    <Col md={6}>
                      <Input
                        text="email"
                        placeholder="Nationality of the Applicant"
                        value={this.state.nation}
                        onChange={(e)=>{this.setState({nation:e.target.value})}}
                      />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col md={6}>
              <Card style={{margin: "10px", padding: "10px"}}>
                <CardHeader>
                  <h5 style={{color: "gray", display:"inline" }}>Aerodrome Manual</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={6}>
                      <Label>Is the Aerodrome Manual enclosed with this form.</Label>
                    </Col>
                    <Col md={6}>
                      <Radio.Group onChange={(e)=>{this.setState({isEnclosed:e.target.value})}} value={this.state.isEnclosed} 
                      style={{marginLeft: "50px"}}>
                        <Radio value={1}>Yes</Radio>
                        <Radio value={2}>No</Radio>
                      </Radio.Group>                      
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <p>If No please specify when this is likely to be submitted to DGCA</p>
                    </Col>
                    <Col md={6}>
                      <TextArea rows={2} type="text"  value={this.state.enclosing_details}
                        onChange={(e)=>{this.setState({enclosing_details:e.target.value})}}/>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Card style={{margin: "10px", padding: "10px"}}>
                <CardHeader>
                  <h5 style={{ color: "gray", display:"inline"}}>Details of Aerodrome</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={6}>
                      <p>Place name by which the Aerodrome is to be known in all future reference</p>
                    </Col>
                    <Col md={6}>
                      <Input type="text" style={{padding: "5px"}} value={this.state.aero_name}
                        onChange={(e)=>{this.setState({aero_name:e.target.value})}}/>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <p>Name & Address of the Owner of Aerodrome</p>
                    </Col>
                    <Col md={6}>
                      <Input type="text" style={{padding: "5px"}} 
                        onChange={(e)=>{this.setState({aero_owner:e.target.value})}}/>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <p>Situation of the Aerodrome Site with reference to the nearest Airport, Railway Station & Town/Village</p>
                    </Col>
                    <Col md={6}>
                      <TextArea row={4} type="text" style={{padding: "5px"}} 
                        onChange={(e)=>{this.setState({details:e.target.value})}} />
                    </Col>
                  </Row>

                </CardBody>
              </Card>
            </Col>
            <Col md={6}>
              <Card style={{margin: "10px", padding: "10px"}}>
                <CardHeader>
                  <h5 style={{color: "gray", display:"inline" }}>Aerodrome Activities</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={6}>
                      <Label>State category of licence required as defined in Aircraft Rules 1937?</Label>
                    </Col>
                    <Col md={6}>
                         <Checkbox value="Public Use" style={{marginLeft: "50px"}} 
                         onChange={(event)=>{this.setState({category:event.target.value})}}>Public Use</Checkbox>
                         <Checkbox value="Private Use" style={{marginLeft: "50px"}} 
                         onChange={(event)=>{this.setState({category:event.target.value})}}>Private Use</Checkbox>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <p>Is a licence for NIGHT USE/ ALL WEATHER required?</p>
                    </Col>
                    <Col md={6}>
                    <Checkbox value="1" style={{marginLeft: "50px"}} 
                         onChange={(event)=>{this.setState({isAllWeather:event.target.value})}}>Yes</Checkbox>
                         <Checkbox value="0" style={{marginLeft: "50px"}} 
                         onChange={(event)=>{this.setState({category:event.target.value})}}>No</Checkbox>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <p>If the answer of above is YES, Please provide details of proposed lighting along with the lighting plan.</p>
                    </Col>
                    <Col md={6}>
                      <TextArea row={4} type="text" style={{padding: "5px"}} value={this.state.weatherDetails}
                        onChange={(e)=>{this.setState({weatherDetails:e.target.value})}}/>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Col md={12}>
            <Card style={{ padding: "20px" }}>
              <form>
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
                    <Col md={3}>
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
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md={3}>
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
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md={3}>
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
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md={3}>
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
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Button
                    type="submit"
                    style={{ marginTop: "50px" }}
                    color="success"
                    className="btn btn-outline-light btn-block"
                    onClick={this.handleSubmit}
                  >
                    Submit Application
                  </Button>
                </FormGroup>
              </form>
            </Card>
          </Col>
            </Card>
            </div>
        ) : (
          <div>
						<Row style={{ marginTop: '10px' }}>
							<Col md={3} />
							<Col md={6}>
								<Card>
									<Descriptions title="Application Info" style={{ padding: '10px' }} bordered>
        <Descriptions.Item label="Airport Code">{this.state.airport.airport_code}</Descriptions.Item>
										<Descriptions.Item label="Airport Name" span={2}>
											{this.state.airport.airport_name}
										</Descriptions.Item>
										<Descriptions.Item label="Lattitude">{this.state.airport.lat}</Descriptions.Item>
										<Descriptions.Item label="Longitude" span={2}>
											{this.state.airport.long}
										</Descriptions.Item>
										<Descriptions.Item label="Status" span={3}>
                      {
                        this.showStatus()
                      }
											
											
										</Descriptions.Item>
										<Descriptions.Item label="Feedback" span={3}>
											{feedback}
										</Descriptions.Item>
									</Descriptions>
									<div class="col text-center" />
								</Card>
								{showLicense ? (
									<Card style={{ marginTop: '15px' }}>
										<div style={{ textAlign: 'center', padding: '40px' }}>
											<h5 style={{ padding: '10px' }}>
												Congratulations your License is Granted!!
											</h5>
											<Button color="success" style={{ margin: '10px' }}>
												DOWNLOAD LICENSE
											</Button>
										</div>
									</Card>
								) : null}
							</Col>
						</Row>
           {this.props.apps.map((app, key) => {
              let application;
              let doc;
              if(app.appId === APPID ){
                application = app;
                doc = this.props.docs[key];
              
              console.log(application);
              console.log(doc);
								const { airport, status, currentUser, state } = this.state;
								return (
									<div className="card container m-2 p-3" key={key}>
										<div className="row">
											<div className="col-9">
												<h1 style={{ color: 'grey' }}>License Application</h1>
												<h4 className="h6" style={{ color: 'grey', marginTop: '5%' }}>
													Airport Name:{Airport.airport_name}
												</h4>
												<h4 className="h6" style={{ color: 'grey' }}>
													Airport Code:{Airport.airport_code}
												</h4>
												<br />
												<h4 className="h6" style={{ fontWeight: 'bold', color: 'grey' }}>
													Uploaded Documents
												</h4>
											</div>
											<div className="col-3">
												<span
													className="badge badge-secondary"
													style={{
														marginTop: '10%',
														padding: '20px',
														paddingRight: '1.2rem',
														marginRight: '10%',
														fontSize: '1rem'
													}}
												>
													{application.state}
												</span>
												<br />
												<br />
												<h4 className="h5" style={{ color: 'grey' }}>
													Uploaded By
												</h4>
												<h5 className="h6" style={{ color: 'grey' }}>
													{currentUser.fullname}
												</h5>
											</div>
										</div>
										<div className="row">
											<div className="col-6">
												<div className="card" style={{ padding: '15px' }}>
													<div className="row">
														<div className="col-6">Aerodrome Manual</div>
														<div className="col-6">
                              <a
                                href={link.concat(doc.aerodromeManual)}
                                className="btn btn-secondary text-center"
                                target="_blank"
                              >
                                View Document
                              </a>
                            </div> 
													</div>
												</div>
											</div>

											<div className="col-6">
												<div className="card" style={{ padding: '15px' }}>
													<div className="row">
														<div className="col-6">Licensing Fee</div>
														 <div className="col-6">
                              <a
                                href={link.concat(doc.licensingFee)}
                                className="btn btn-secondary text-center"
                                target="_blank"
                              >
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
												<div className="card" style={{ padding: '15px' }}>
													<div className="row">
														<div className="col-6">CAR Compliance</div>
														<div className="col-6">
                              <a
                                href={link.concat(doc.CARcompliance)}
                                className="btn btn-secondary text-center"
                                target="_blank"
                              >
                                View Document
                              </a>
                            </div> 
													</div>
												</div>
											</div>
											<div className="col-6">
												<div className="card" style={{ padding: '15px' }}>
													<div className="row">
														<div className="col-6">Exceptions Document</div>
													 <div className="col-6">
                                <a
                                  href={link.concat(doc.exceptionsDoc)}
                                  className="btn btn-secondary text-center"
                                  target="_blank"
                                >
                                  View Document
                                </a>
                              </div> 
													</div>
												</div>
											</div>
										</div>
									</div>
                  
                );
                          
              }
            })

        }
        
          </div>
        )}
      </div>
    );
  }
}

export default AD;