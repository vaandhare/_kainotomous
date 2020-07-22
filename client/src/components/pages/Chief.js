import React, { Component } from 'react';
import Identicon from 'identicon.js';
import '../../styles/Chief.css'


const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })
var warning = "The article file has been modified"

class Chief extends Component {
  addRow(id) {
    var arrHead = new Array();
    arrHead = ['ID', 'Title', 'Content','FileUploaded', 'Author Address'];
    var traceTable = document.getElementById('tracingTable');
    var rowCnt = traceTable.rows.length;  
    var tr = traceTable.insertRow(rowCnt);  
    var _id = id;
    var post = this.props.posts[_id];
  
    for (var c = 0; c <arrHead.length; c++) {
        var td = document.createElement('td'); 
                 // TABLE DEFINITION.
        td = tr.insertCell(c);
        
  
        if (c === 0) {           // FIRST COLUMN.
          td.innerHTML = post.id; 
        }
        else if(c === 1) {
          td.innerHTML = post.articleName;
        }
        else if(c === 2){
          td.innerHTML = post.content;
    
        }
        else if(c === 3){  
          var link = "";
              link = "https://ipfs.infura.io/ipfs/";
              link = link.concat(post.filehash);
              td.innerHTML=  '<a  classNameName="btn btn-link" href="'+link+'">File Link</a>';
        }
        else {
          td.innerHTML = post.author;
        
        }
    }
  
  }

  displayTable(id) {
    var x = document.getElementById("myDIV");
    x.style.display = "table";
    var _id = id - 1;
    console.log(_id);
    var post = this.props.posts[_id];
    console.log(post);
    var prev = post.prevId;
    console.log(prev);

    while (post.id !== post.prevId) {
      this.addRow(_id);
      _id = post.prevId - 1;
      post = this.props.posts[_id];
    }
    this.addRow(_id);
  }

  warning(id) {
    id = id - 1
    console.log(id)
    console.log(this.props.posts[id])
    var post = this.props.posts[id]
    if (post.id !== post.prevId) {
      return (
        <li classNameName="list-group-item-warning">
          The article file has been modified.
        </li>

      )
    }

  }

  approval(id) {
    id = id - 1
    console.log(id)
    console.log(this.props.posts[id])
    var post = this.props.posts[id]
    if (post.approvalStatus.toString() === "true") {
      return (
        <li key={id} classNameName="list-group-item-success">
          <small classNameName="float-right mt-1 ">
            Approved: {post.approvalStatus.toString()}
          </small>
        </li>
      )
    }
    else {
      return (
        <li key={id} classNameName=" list-group-item-danger">
          <small classNameName="float-right mt-1">
            Approved: {post.approvalStatus.toString()}
          </small>
        </li>
      )
    }

  }

  render() {
    var currentId = 0;
    return (
      <div classNameName="container-fluid">
  
      <div classNameName="row">
        <main
          role="main"
          classNameName="col-lg-12 ml-auto mr-auto"

        >
          <br/>
              {this.props.posts.map((post, key) => {
                  var link = "";
                  link = "https://ipfs.infura.io/ipfs/"
                  link = link.concat(post.filehash)

                  return (
                    <div className="card text-white bg-dark mb-3 col-lg-12 ml-auto mr-auto" key={key} id="cardDIV" style={{ maxWidth: '700px' }}>
                      <div className="card-header ml-auto mr-auto">Documents {key}</div>
                      <div className="card-body text-white ">
                        <form onSubmit={(event) => {
                          event.preventDefault()
                        }}>

                          <img
                            classNameName='mr-2'
                            width='30'
                            height='30'
                            alt="Identicon"
                            src={`data:image/png;base64,${new Identicon(post.author, 30).toString()}`}
                          />
                          <small classNameName="text-white">{post.author}</small>
                          <button
                              type="button"
                              classNameName="btn btn-dark btn-outline-light float-right"

                              name={post.id}
                              onClick={(event) => {
                                currentId = event.target.name
                                this.displayTable(currentId)
                              }
                              }
                            >
                              Previous Versions
                          </button>
                          <ul id="postList" classNameName="list-group list-group-flush">
                            {this.warning(key + 1)}
                      
                            <li classNameName="list-group-item text-white">
                              <input
                                id="articleName"
                                type="text"
                                ref={(input) => { this.articleName = input }}
                                value={this.props.value}
                                defaultValue={post.articleName}
                                classNameName="form-control text-white"
                                required />
                            </li>
                            <li classNameName="list-group-item text-wwhite" >
                              <input
                                id="postContent"
                                type="text"
                                ref={(input) => { this.postContent = input }}
                                defaultValue={post.content}
                                classNameName="form-control text-white"
                                required />
                            </li>
                            </ul>

                              <a classNameName="btn btn-dark btn-outline-light btn-block" href={link} role="button">File</a>
                          <br/>
                            {this.approval(key + 1)}
                            <br/>
                              <button
                                type="button"
                                classNameName="btn btn-danger btn-outline-light float-left "
                                name={post.id}
                                onClick={(event) => {
                                  console.log("Checking approval status")
                                  console.log(post.approvalStatus.toString())
                                  if (post.approvalStatus.toString() === "false") {
                                    console.log("Disapproving the post")
                                    window.alert(" Post has been disapproved!")

                                  }
                                  else {
                                    console.log("Post is already rejected!")
                                    window.alert(" Post has already been rejected !")
                                  }

                                }}
                              >
                                Disapprove
</button>



                              <button
                                type="button"
                                classNameName="btn btn-success btn-outline-light float-right"
                                name={post.id}
                                onClick={(event) => {
                                  console.log("Checking approval status")
                                  if (post.approvalStatus.toString() === "false") {
                                    console.log("Approving the post")
                                    this.props.approvePost(event.target.name) 
                                  }
                                  else {
                                    console.log("Post is already approved!")
                                    window.alert(" Post has already been approved!")
                                  }

                                }}
                              >
                                Approve
</button>





                        </form>
                        </div>
                        </div>
          );
                    
        })}
                    <div classNameName="container-fluid mt-5 text-white" border="1 px white solid" id="myDIV">

                      <div classNameName="card text-white bg-dark text-center ml-auto mr-auto">
                        <div classNameName="card-header" >
                          PREVIOUS VERSIONS
    </div>
                        <table classNameName="table table-hover table-striped text-white" id="tracingTable" border="1 px white solid">
                          <thead>
                            <tr classNameName="text-white">
                              <th >ID</th>
                              <th>Title</th>
                              <th >Description</th>
                              <th>File </th>
                              <th >Author Address</th>
                            </tr>
                          </thead>
                          <tbody classNameName="text-white">
                          </tbody>
                        </table>
                      </div>
                    </div>

        </main>
          </div >
          </div>
      
      
    );
  }
}

export default Chief;