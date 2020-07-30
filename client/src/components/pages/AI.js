import React, { Component } from 'react';
import '../../styles/Deputy.css'
import axios from 'axios'
// const ipfsClient = require('ipfs-http-client')
// const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

class AI extends Component {

    constructor(props){
        super(props)

        this.get_timestamp = this.get_timestamp.bind(this)
        this.approveApplication = this.approveApplication.bind(this);
        this.rejectApplication = this.rejectApplication.bind(this);
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

    approveApplication = async (appId,airportCode) =>{
        
        const timestamp = this.get_timestamp()
        console.log(appId, timestamp)
        this.props.approveApp(appId, timestamp)
        console.log("You have approved app!!")
        const response = await axios.put(`http://localhost:5000/api/status/${airportCode}`,{
            IATA_code:airportCode,
            appId:appId,
            status:'approved'
        })
    }

    rejectApplication = async  (appId,airportCode) =>{
        
        const timestamp = this.get_timestamp()
        console.log(appId, timestamp)
        this.props.rejectApp(appId, timestamp)
        console.log("You have rejected app!!")
        const response = await axios.put(`http://localhost:5000/api/status/${airportCode}`,{
            IATA_code:airportCode,
            appId:appId,
            status:'rejected'
        })
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
                        
                            if(app.state =="assigned"){
                            return (
                                <div className="card bg-dark mb-3 col-lg-12 ml-auto mr-auto" key={key} id="cardDIV" style={{ maxWidth: '700px' }}>
                                    <div className="card-header ml-auto mr-auto">Assigned Application {key}</div>
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
                                                    className="btn btn-secondary btn-outline-light float-right"
                                                    name="approve"
                                                    onClick = {(event) => this.rejectApplication(event.target.id,app.airportCode)}
                                                >
                                                    Reject Application
                                                </button>
                                                <button
                                                    id={app.appId}
                                                    type="button"
                                                    className="btn btn-success btn-outline-light float-right"
                                                    name="approve"
                                                    onClick = {(event) => this.approveApplication(event.target.id,app.airportCode)}
                                                >
                                                    Approve Application
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


export default AI;