import React, { Component } from 'react';
import '../../styles/Deputy.css'
import axios from "axios";
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })
var statement = "Upload Your File"
var count = 0

class MoCA extends Component {
  
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

    this.get_Airports = this.get_Airports.bind(this)
    this.get_timestamp = this.get_timestamp.bind(this)
    this.captureFile  = this.captureFile.bind(this)
    this.submitFile  = this.submitFile.bind(this)
    this.buildAirportSelect = this.buildAirportSelect.bind(this)
    this.submitToBlockchain = this.submitToBlockchain.bind(this)
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
    const applength = this.props.apps.length;
    
    const doc1 = this.state.doc1
    const doc2 = this.state.doc2
    const doc3 = this.state.doc3
    const doc4 = this.state.doc4
    console.log(airportCode,timestamp,doc1,doc2,doc3,doc4)

    this.props.createApp(airportCode,doc1,doc2,doc3,doc4,timestamp)

    // Save the status on the mongodb
    const response = await axios.post(`http://localhost:5000/api/status/`,{
      IATA_code:airportCode,
      appId:applength,
      status:'created'
    })
  }

  render() {
    return (
      <div className="container-fluid">
        <br/>
        <div className="card text-white bg-dark mb-3 col-lg-12 ml-auto mr-auto" style={{maxWidth: '700px'}}>
  <div className="card-header ml-auto mr-auto">Upload the Document Here</div>
  <div className="card-body text-white ">
  <form onSubmit={this.submitToBlockchain}>
              <div className="form-group mr-sm-2 bg-transparent text-white" id="bg">
              <ul className="list-group list-group-flush text-white">  
                <li className="list-group-item text-white">
                  {/* <input
                    id="airportCode"
                    type="text"
                    ref={(input) => { this.airportCode = input }}
                    className="form-control"
                    placeholder="Enter the Airport Code"
                    required /> */}
                    <select value={this.state.role} onChange={(e)=>{this.setState({airportCode:e.target.value})}} className="form-control" defaultValue="">
                      <option value="" disabled>Select the Airport</option>
                      { this.buildAirportSelect()}

                    </select>
                    </li>

                    <br/>

                    <li className="list-group-item text-white">
                  <div className="custom-file">
                    <input
                    id="doc1"
                      type="file"
                      className="custom-file-input bg-dark"
                      onChange={this.captureFile}
                    />
                    <label className="custom-file-label bg-dark text-white" id="uploadLabel1">
                      {statement}
                      </label>
                  </div>
                  <button
                                type="button"
                                className="btn btn-danger btn-outline-light float-right"
                                name="doc1Submit"
                                onClick={this.submitFile}
                              >
                                Upload
                  </button>

                  </li>
                  
                  <br/>

                  <li className="list-group-item text-white">
                  <div className="custom-file">
                    <input
                    id="doc2"
                      type="file"
                      className="custom-file-input bg-dark"
                      onChange={this.captureFile}
                    />
                    <label className="custom-file-label bg-dark text-white" id="uploadLabel2">
                      {statement}
                      </label>
                  </div>
                  <button
                                type="button"
                                className="btn btn-danger btn-outline-light float-right"
                                name="doc1Submit"
                                onClick={this.submitFile}
                              >
                                Upload
                  </button>
                  </li>
                  <br/>

                  <li className="list-group-item text-white">
                  <div className="custom-file">
                    <input
                    id="doc3"
                      type="file"
                      className="custom-file-input bg-dark"
                      onChange={this.captureFile}
                    />
                    <label className="custom-file-label bg-dark text-white" id="uploadLabel3">
                      {statement}
                      </label>
                  </div>
                  <button
                                type="button"
                                className="btn btn-danger btn-outline-light float-right"
                                name="doc1Submit"
                                onClick={this.submitFile}
                              >
                                Upload
                  </button>
                  </li>
                  <br/>

                  <li className="list-group-item text-white">
                  <div className="custom-file">
                    <input
                    id="doc4"
                      type="file"
                      className="custom-file-input bg-dark"
                      onChange={this.captureFile}
                    />
                    <label className="custom-file-label bg-dark text-white" id="uploadLabel4">
                      {statement}
                      </label>
                  </div>
                  <button
                                type="button"
                                className="btn btn-danger btn-outline-light float-right"
                                name="doc1Submit"
                                onClick={this.submitFile}
                              >
                                Upload
</button>

                  </li>
                  <br/>
                  <li className="list-group-item text-white">
                  <input
                    id="details"
                    type="text"
                    className="form-control"
                    placeholder="Details for the application"
                    required />
                    </li>
                   <br/>
                  </ul>
                </div>
                <button type="submit" className="btn btn-dark btn-outline-light btn-block">Upload</button>
              </form>
  
  </div>
{/*Displaying the list of the applications  */}
</div>
        <br />
        <div className="row">
          <main
            role="main"
            className="col-lg-12 ml-auto mr-auto"

          >
            {this.props.apps.map((app, key) => {
              
              let doc = this.props.docs[key];
              
              return (
                <div className="card mb-3 col-lg-12 ml-auto mr-auto" key={key} id="" style={{ maxWidth: '700px' }}>
                  <div className="card-header ml-auto mr-auto">Licensing Application {key}</div>
                  <div className="card-body ">
                    <form >
                      Author:
                      <small className="text-white">{app.author}</small>

                      <ul id="" className="list-group">
                       
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
                        
                        </ul>
                         
                    </form>
                  </div>
                </div>

              );
            })}
          </main>
        </div >
      </div>
  );
 }
}


export default MoCA;