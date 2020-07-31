import React, { Component } from 'react';
import '../../styles/Deputy.css'
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
var doc1='',doc2='',doc3='',doc4='',airportCode=0

class MoCA2 extends Component {
  
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
      this.props.setBuffer(Buffer(reader.result))
      console.log(Buffer(reader.result))
      console.log('buffer', this.props.buffer)
    }
  }

  constructor() {
    super();
    this.state = {
      
    }

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
        modal: !prevState.modal
    }));
  }

  submitFile = (event) => {
    event.preventDefault();
    console.log("File Captured")
    ipfs.add(this.props.buffer, (error, result) => {
      count = count+1
      console.log(count)
      console.log("ipfs")
      console.log('Ipfs result', result)
      var filehash = result[0].hash
      console.log(filehash)
      if (count === 1){
        doc1=filehash
        console.log(doc1)
      }
      else if (count === 2){
        doc2=filehash
        console.log(doc2)
      }
      else if (count === 3){
        doc3=filehash
        console.log(doc3)
      }
      else if (count === 4){
        doc4=filehash
        console.log(doc4)
      }
      if (error) {
        console.log(error)
        return
      }
    })
  }

  checkFormFields(){
    if (airportCode === 0){
      window.alert("Please enter the airportCode")
    }
    else if (doc1 == ''){
      window.alert(" Aerodrome Manual not Provided! ")
    }
    else if(doc2 == ''){
      window.alert(" Licensing Fee Receipt is not Provided")
    }
    else if(doc3 == ''){
      window.alert("CAR Compliance manual is not provided")
    }
    else if(doc4 == ''){
      window.alert("Compliance Exception Document is not provided")
    }
    else{
      window.alert("Some unknown error occured, check your internet connection and try again!")
    }
  }

  submitApplication=(event) =>{
    event.preventDefault();
    count = 0;
    const timestamp = this.get_timestamp()
    console.log(airportCode,timestamp,doc1,doc2,doc3,doc4)
    if(doc1!='' && doc2!='' && doc3!='' && doc4!='' && airportCode!=0 ){
    this.props.createApp(airportCode,doc1,doc2,doc3,doc4,timestamp)
    doc1=''
    doc2=''
    doc3=''
    doc4=''
    airportCode=0
    }
    else{
    this.checkFormFields()
    }
  }

  handleChange=(event) => {
    airportCode=event.target.value
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
                      <form onSubmit={this.submitApplication}>
                          <input id="airportCode" type="text" name="airportCode"
                              className="form-control" placeholder="Enter the Airport Code"  value={this.state.airportCode} onChange={this.handleChange} required />

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
                      id="airportCode"
                      className="title "
                      type="text"
                      ref={(input) => { this.airportCode = input }}
                      value={this.props.value}
                      defaultValue={app.airportCode}
                      required />
                    <Input
                      id="state"
                      type="text"
                      className="content"
                      ref={(input) => { this.state = input }}
                      defaultValue={app.state}
                      style={{marginTop: "10px"}} 
                      required />
                    {/* <Button>Go somewhere</Button> */}
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


export default MoCA2;