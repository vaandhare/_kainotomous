import React, { Component } from 'react';
import '../../styles/Deputy.css'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })
var statement = "Upload Your File"
var count = 0

class MoCA extends Component {
  
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
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }
  
  submitFile = (event) => {
    event.preventDefault();
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


  render() {
    return (
      <div className="container-fluid">
        <br/>
        <div className="card text-white bg-dark mb-3 col-lg-12 ml-auto mr-auto" style={{maxWidth: '700px'}}>
  <div className="card-header ml-auto mr-auto">Upload the Document Here</div>
  <div className="card-body text-white ">
  <form onSubmit={this.submitToBlockchain= (event) => {
    event.preventDefault();
    const airportCode = this.airportCode.value
    const timestamp = this.get_timestamp()
    const doc1 = this.state.doc1
    const doc2 = this.state.doc2
    const doc3 = this.state.doc3
    const doc4 = this.state.doc4
    console.log(airportCode,timestamp,doc1,doc2,doc3,doc4)
    this.props.createApp(airportCode,doc1,doc2,doc3,doc4,timestamp)
  
  }}>
              <div className="form-group mr-sm-2 bg-transparent text-white" id="bg">
              <ul className="list-group list-group-flush text-white">  
                <li className="list-group-item text-white">
                  <input
                    id="airportCode"
                    type="text"
                    ref={(input) => { this.airportCode = input }}
                    className="form-control"
                    placeholder="Enter the Airport Code"
                    required />
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
              return (
                <div className="card bg-dark mb-3 col-lg-12 ml-auto mr-auto" key={key} id="cardDIV" style={{ maxWidth: '700px' }}>
                  <div className="card-header ml-auto mr-auto">Licensing Application {key}</div>
                  <div className="card-body ">
                    <form >
                      Author:
                      <small className="text-white">{app.author}</small>

                      <ul id="postList" className="list-group list-group-flush">
                       
                        <li className="list-group-item">
                          <input
                            id="airportCode"
                            className="title "
                            type="text"
                            ref={(input) => { this.airportCode = input }}
                            value={this.props.value}
                            defaultValue={app.airportCode}
                            required />

                        </li>
                        {/* {this.props.docs.map((doc, id) => {
                          if (app.id === doc.id ){
                            return(
                       <div>
                         <ul>
                        <li className="list-group-item ">
                          <input
                            id="doc1"
                            className="title"
                            type="text"
                            ref={(input) => { this.doc1 = input }}
                            value={this.props.value}
                            defaultValue={doc.aerodromeManual}
                            required />

                        </li>

                        <li className="list-group-item ">
                          <input
                            id="doc2"
                            className="title "
                            type="text"
                            ref={(input) => { this.doc2 = input }}
                            value={this.props.value}
                            defaultValue={doc.licensingFee}
                            required />

                        </li>
                        <li className="list-group-item">
                          <input
                            id="doc3"
                            className="title "
                            type="text"
                            ref={(input) => { this.doc3 = input }}
                            value={this.props.value}
                            defaultValue={doc.CARcompliance}
                            required />

                        </li>
                        <li className="list-group-item ">
                          <input
                            id="doc4"
                            className="custom-file-input bg-dark"
                            type=""
                            ref={(input) => { this.doc4 = input }}
                            value={this.props.value}
                            defaultValue={doc.extensionDocs}
                            required />

                        </li>
                        </ul>
                        </div>
                            )
                          }
                        })
                      } */}
                        <li className="list-group-item " >
                          <input
                            id="state"
                            type="text"
                            className="content"
                            ref={(input) => { this.state = input }}
                            defaultValue={app.state}
                            required />

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