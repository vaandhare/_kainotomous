import React, { Component } from 'react';
import '../../styles/Deputy.css'

// const ipfsClient = require('ipfs-http-client')
// const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

class AI extends Component {

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

    approveApplication = (event) =>{
        event.preventDefault()
        const appId = event.target.id
        const timestamp = this.get_timestamp()
        console.log(appId, timestamp)
        this.props.approveApp(appId, timestamp)
        console.log("You have approved app!!")
    }

    rejectApplication = (event) =>{
        event.preventDefault()
        const appId = event.target.id
        const timestamp = this.get_timestamp()
        console.log(appId, timestamp)
        this.props.rejectApp(appId, timestamp)
        console.log("You have rejected app!!")
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
                                                    <input
                                                        id="airportCode"
                                                        className="title "
                                                        type="text"
                                                        ref={(input) => { this.airportCode = input }}
                                                        value={this.props.value}
                                                        defaultValue={app.airportCode}
                                                        required />

                                                </li>
                                                <li className="list-group-item " >
                                                    <input
                                                        id="state"
                                                        type="text"
                                                        className="content"
                                                        ref={(input) => { this.state = input }}
                                                        defaultValue={app.state}
                                                        required />

                                                </li>
                                                <li className="list-group-item-success">
                                                <button
                                                    id={app.appId}
                                                    type="button"
                                                    className="btn btn-secondary btn-outline-light float-right"
                                                    name="approve"
                                                    onClick = {this.rejectApplication}
                                                >
                                                    Reject Application
                                                </button>
                                                <button
                                                    id={app.appId}
                                                    type="button"
                                                    className="btn btn-success btn-outline-light float-right"
                                                    name="approve"
                                                    onClick = {this.approveApplication}
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