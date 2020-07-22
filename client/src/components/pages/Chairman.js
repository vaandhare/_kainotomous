import React, { Component } from 'react';
import Identicon from 'identicon.js';
import '../../styles/Chairman.css';

class Chairman extends Component {

 
 addRow(id) {
  var arrHead = [];
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
            td.innerHTML=  '<a  className="btn btn-link" href="'+link+'">File Link</a>';
      }
      else {
        td.innerHTML = post.author;
      
      }
  }

}

displayTable(id){
  var x = document.getElementById("myDIV");
  x.style.display = "table";
  var _id = id-1;
  console.log(_id);
  var post = this.props.posts[_id];
  console.log(post);
  var prev = post.prevId;
  console.log(prev);
  
  while(post.id !== post.prevId){
    this.addRow(_id);
    _id=post.prevId-1;
    post = this.props.posts[_id];
  }
  this.addRow(_id);
}



displayGreen(id){
  var post = this.props.posts[id]
  if(post.trueCount >= 2){
    return(
      <li className="list-group-item-success">
        This aticle is termed as "AUTHENTIC"
        </li>
    )
  }
  else if(post.fakeCount >= 2){
    return(
      <li className="list-group-item-danger">
        This aticle is termed as "FAKE" 
        </li>
    )
  }
}



  render() {
    
    return (
      <div className="container-fluid">
      
    <br/>
          <div className="row">
            <div className="col order-1">
            <main
              role="main"
              className="col-lg-12"
              
            >
          
                {this.props.posts.map((post, key) => {
                    var link = "";
            link = "https://ipfs.infura.io/ipfs/"
            link = link.concat(post.filehash)
                

                  return (
                    <div className="card text-white bg-dark mb-3 col-lg-12 " key={key} id="cardDIV" style={{ maxWidth: '700px' }}>
                    <div className="card-header">Document {key}</div>
                    <div className="card-body text-white ">
                        Author :
                        <img
                          className='mr-2 text-white'
                          width='30'
                          height='30'
                          alt ="identicon "
                          src={`data:image/png;base64,${new Identicon(post.author, 30).toString()}`}
                        />
                        
                        <small className="text-white">{post.author}</small>
                        <button
                          type = "button"
                            className=" btn btn-dark btn-outline-light float-right"
                            name={post.id}
                            onClick={(event) => {
                              var currentId=0;
                             currentId = event.target.name
                             this.displayTable(currentId)
                            }
                            }
                          >
                            PREVIOUS VERSIONS
                          </button>
                  
                      <ul id="postList" className="list-group ">
                        {this.displayGreen(key)}
                        <br/>
          
                      <br/>
                        <li className="list-group-item text-white">
                          <p>{post.articleName}</p>
                        </li>
                        <li className="list-group-item text-white">
                          <p>{post.content}</p>
                        </li>
                      
                            <a className="btn btn-dark btn-outline-light btn-block" href={link} role="button">Click here to see the File </a>
                          
                       
                       
                      </ul>
                      <br/>                
                        </div>
                        </div>
                  );
        
                })}
              
              <div className="container-fluid mt-5" id="myDIV"> 

        <div className="card text-white bg-dark">
          <div className="card-header text-white ml-auto mr-auto" >
            PREVIOUS VERSIONS
    </div>
        <table className="table table-hover table-striped text-white" id="tracingTable" border="1 px black solid">
          <thead>
            <tr className="text-white" >
              <th >ID</th>
              <th>Title</th>
              <th >Description</th>
              <th>File Uploaded</th>
              <th >Author Address</th>
            </tr>
          </thead>
          <tbody className="text-white">
          </tbody>
          </table>
          </div>
          </div>
            </main>
            </div>


            <div className="col order-2">
             
              </div>
          </div>
       
      </div>
       
    );
  }

}

export default Chairman;