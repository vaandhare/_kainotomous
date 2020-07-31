import React, { Component } from 'react';
import '../../styles/Deputy.css'
import axios from 'axios'

// const ipfsClient = require('ipfs-http-client')
// const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

class DoAS extends Component {
    constructor(props){
        super(props)

        this.get_timestamp = this.get_timestamp.bind(this)
        this.get_expirydate = this.get_expirydate.bind(this)
        this.assignApplication = this.assignApplication.bind(this);
        this.grantApplication = this.grantApplication.bind(this);
        this.generateLicenseNumber = this.generateLicenseNumber.bind(this);
    }
    get_expirydate(){
        let d = new Date();
        var y = d.getFullYear();
        var m = d.getMonth();
        var day = d.getDate();
        let date_ob = new Date(y + 1,m,day);
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
    async assignApplication(appId,airportCode){
       
        
        const timestamp = this.get_timestamp()
        console.log(appId, timestamp)
        this.props.assignApp(appId, timestamp)
        console.log("You have issued app!!")
        const response = await axios.put(`http://localhost:5000/api/status/${airportCode}`,{
            IATA_code:airportCode,
            appId:appId,
            status:'assigned'
        })
    }

    generateLicenseNumber(){
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < 10; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    async grantApplication(appId,airportCode){
        
        
        const timestamp = this.get_timestamp()
        console.log(appId, timestamp)
        this.props.grantApp(appId, timestamp)
        console.log("You have granted the license!!")
        const response = await axios.put(`http://localhost:5000/api/status/${airportCode}`,{
            IATA_code:airportCode,
            appId:appId,
            status:'granted'
        })
        let license_no = this.generateLicenseNumber()
        const expirydate = this.get_expirydate() 
        const input = {
            IATA_code:airportCode,
            license_number:license_no,
            from:timestamp,
            to:expirydate
        }
        console.log(input)
        const result = await axios.post(`http://localhost:5000/api/licensetable/`,input)
        
    }

    render() {
        return (
            <div className="container-fluid">
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
                                </div>

                            );
                                    }
                            else if(app.state =="approved"){
                                        return (
                                            <div className="card bg-dark mb-3 col-lg-12 ml-auto mr-auto" key={key} id="cardDIV" style={{ maxWidth: '700px' }}>
                                                <div className="card-header ml-auto mr-auto">Licensing Application To Approve {key}</div>
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
                                                                name="issue"
                                                                onClick = {(event)=>this.grantApplication(event.target.id,app.airportCode)}
                                                            >
                                                                Grant Application
                                                            </button>
                                                            </li>
                                                        </ul>
            
                                                    </form>
                                                </div>
                                            </div>
            
                                        );
                        }
                        })}
                    </main>
                </div >
            </div>
        );
    }
}


export default DoAS;