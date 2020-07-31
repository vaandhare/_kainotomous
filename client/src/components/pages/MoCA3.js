import React, { Component } from 'react';
import '../../styles/Deputy.css'
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
  Form, FormGroup, Label, Input, 
  Modal, ModalHeader, ModalBody, ModalFooter
 } from 'reactstrap';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })
var statement = "Upload Your File"
var count = 0


class MoCA3 extends Component {
  
  async componentWillMount(){
    await this.get_Airports();
  }

  buffer = '';

  constructor(props) {
    super(props)
    this.state = {
      airports:[],
      airportCode:'',
      buffer:''
    }

    this.toggle = this.toggle.bind(this);
    this.get_Airports = this.get_Airports.bind(this)
    this.get_timestamp = this.get_timestamp.bind(this)
    this.captureFile  = this.captureFile.bind(this)
    this.submitFile  = this.submitFile.bind(this)
    this.buildAirportSelect = this.buildAirportSelect.bind(this)
    this.submitToBlockchain = this.submitToBlockchain.bind(this)
  }

  toggle() {
    this.setState(prevState => ({
        modal: !prevState.modal
    }));
  }

  async get_Airports(){
     
      const response = await axios.get(`http://localhost:5000/api/airports/`)
      this.setState({airports:response.data})
      // console.log(this.state.currentUser)
    
  }

  get_timestamp(){
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
    const timestamp = year + "-" + month + "-" + date+" " + hours + ":" + minutes + ":" + seconds
    return timestamp;
    }

captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0]
    const reader = new window.FileReader() // converts the file to a buffer
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
       
      this.setState({buffer:Buffer(reader.result)},()=>{
        console.log(this.state.buffer)
      })
    }
    
  }
  
  submitFile = (event) => {
    event.preventDefault();
    console.log('buffer', this.state.buffer)
    console.log("File Captured")
    ipfs.add(this.state.buffer, (error, result) => {
      count = count+1
      console.log("ipfs")
      console.log('Ipfs result', result)
      var filehash = result[0].hash
      console.log(filehash)
      if (count === 1){
        this.setState({doc1:filehash})
      }
      else if (count === 2){
        this.setState({doc2:filehash})
      }
      else if (count === 3){
        this.setState({doc3:filehash})
      }
      else if (count === 4){
        this.setState({doc4:filehash})
      }
      if (error) {
        console.log(error)
        return
      }
    })
  }

  

  buildAirportSelect(){
    var arr = [];
    this.state.airports.map((airport,key)=>{
      arr.push(<option value={airport.IATA_code} key={key}>{airport.airport_name}</option>)
    })
    return arr;
  }

  async submitToBlockchain(event){
    event.preventDefault();
    const airportCode = this.state.airportCode;
    const timestamp = this.get_timestamp()
  
    const doc1 = this.state.doc1
    const doc2 = this.state.doc2
    const doc3 = this.state.doc3
    const doc4 = this.state.doc4
    console.log(airportCode,timestamp,doc1,doc2,doc3,doc4)
    this.props.createApp(airportCode,doc1,doc2,doc3,doc4,timestamp)

    // Save the status on the mongodb
    const response = await axios.post(`http://localhost:5000/api/status/`,{
      IATA_code:airportCode,
      status:'created'
    })
  }

  render() {
    return (
            <div>
      <div style={{margin: "10px"}}>
        <Row>
          <Col md={3}>
            <Card>
              <CardBody className="display-flex">
                <div className="m-l">
                  <h3 className="h5" style={{color: "gray"}}>Approved Documents</h3>
                  <h2 className="h4">000</h2>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <CardBody className="display-flex">
              <div className="m-l">
                  <h3 className="h5" style={{color: "gray"}}>Pending Documents</h3>
                  <h2 className="h4">000</h2>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}/>
          <Col>
          <Card>
          <Button color="primary" onClick={this.toggle}><i className="fa fa-cloud-upload"></i>&nbsp;&nbsp;Upload New Document</Button>
              <Modal isOpen={this.state.modal} toggle={this.toggle}>
                <ModalHeader toggle={this.toggle}>Upload Document</ModalHeader>
                  <ModalBody>
                   <form onSubmit={this.submitToBlockchain}>
                     <select value={this.state.role} onChange={(e)=>{this.setState({airportCode:e.target.value})}} className="form-control" defaultValue="">
                      <option value="" disabled>Select the Airport</option>
                      { this.buildAirportSelect()}
                    </select>
                    <FormGroup>
                          <Label>Aerodrome Manual</Label>
                          <div className="custom-file">
                            <input id="doc1" type="file" className="custom-file-input" onChange={this.captureFile} />
                            <label className="custom-file-label bg-dark text-white" id="uploadLabel1">{statement}</label>
                          </div>
                          <Button type="button" className="btn btn-danger btn-outline-light float-right"
                            name="doc1Submit" onClick={this.submitFile}> Upload </Button>
                        </FormGroup>

                        <FormGroup>
                          <Label for="doc2">Licensing Fee</Label>
                          <div className="custom-file">
                          <input id="doc2" type="file" className="custom-file-input bg-dark" onChange={this.captureFile}/>
                          <label className="custom-file-label bg-dark text-white" id="uploadLabel1">{statement}</label>
                          </div>
                          <Button type="button" className="btn btn-danger btn-outline-light float-right"
                              name="doc1Submit" onClick={this.submitFile}> Upload </Button>
                        </FormGroup>

                        <FormGroup>
                          <Label for="doc3">CAR Compliance Document</Label>
                          <div className="custom-file">
                          <input id="doc3" type="file" className="custom-file-input bg-dark" onChange={this.captureFile}/>
                          <label className="custom-file-label bg-dark text-white" id="uploadLabel1">{statement}</label>
                          </div>
                          <Button type="button" className="btn btn-danger btn-outline-light float-right"
                              name="doc1Submit" onClick={this.submitFile}> Upload </Button>
                        </FormGroup>

                        <FormGroup>
                          <Label for="doc4">Exceptions Doc</Label>
                          <div className="custom-file">
                          <input id="doc4" type="file" className="custom-file-input bg-dark" onChange={this.captureFile} />
                          <label className="custom-file-label bg-dark text-white" id="uploadLabel1">{statement}</label>
                          </div>
                          <Button type="button" className="btn btn-danger btn-outline-light float-right"
                            name="doc1Submit" onClick={this.submitFile}> Upload </Button>

                        </FormGroup>
                        <br/>
                        <FormGroup>
                          <Input id="details" type="text" className="form-control" placeholder="Details for the application" required />
                        </FormGroup>

                        <Button type="submit" className="btn btn-dark btn-outline-light btn-block">Upload</Button>
                      </form>
                  </ModalBody>
               </Modal>
            </Card>
          </Col>
        </Row>
      </div>
      <div>
        {this.props.apps.map((app, key) => {   
            let doc = this.props.docs[key];                 
          return (
          <div key={key} id="cardDIV">
            <Row>
              <Col md = {2}/>
              <Col md={4}>
                <Card>
                  <CardHeader>Licensing Application {key}</CardHeader>
                  <CardBody>
                    <CardTitle>Author:
                      <small className="text-black">{app.author}</small>
                    </CardTitle>
                    <Input
                      id=""
                      className="title "
                      type="text"
                      ref={(input) => { this.airportCode = input }}
                      value={this.props.value}
                      defaultValue={app.airportCode}
                      required />
                      <Input
                      id=""
                      className="title "
                      type="text"
                      ref={(input) => { this.aerodromeManual = input }}
                      value={this.props.value}
                      defaultValue={doc.aerodromeManual}
                      required />
                      <Input
                      id=""
                      className="title "
                      type="text"
                      ref={(input) => { this.CARcompliance = input }}
                      value={this.props.value}
                      defaultValue={doc.CARcompliance}
                      required />
                      <Input
                      id=""
                      className="title "
                      type="text"
                      ref={(input) => { this.exceptionsDoc = input }}
                      value={this.props.value}
                      defaultValue={doc.exceptionsDoc}
                      required />
                      <Input
                      id=""
                      className="title "
                      type="text"
                      ref={(input) => { this.state = input }}
                      value={this.props.value}
                      defaultValue={app.state}
                      required />
                    {/* <ul id="" className="list-group">
                       
                        <li className="list-group-item">
                          {app.airportCode}
                          
                        </li>
                      <li className="list-group-item">
                        {doc.aerodromeManual}
                          
                        </li>
                        <li className="list-group-item">
                        {doc.CARcompliance}
                          
                        </li>
                        <li className="list-group-item">
                        {doc.exceptionsDoc}
                          
                        </li>
                        <li className="list-group-item">
                        {doc.licensingFee}
                          
                        </li>
                        <li className="list-group-item">
                          {app.state}
                          
                        </li>
                        </ul> */}
                  </CardBody>
                </Card>
              </Col>
              </Row>
                </div>
              );  
            })}
        </div >
      </div>
    );
  }
  }

  export default MoCA3;