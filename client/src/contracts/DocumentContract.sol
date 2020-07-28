pragma solidity >=0.4.16 <0.7.0;
//pragma experimental ABIEncoderV2;

contract DocumentContract {
    // State variable
    string public name;
    uint public appCount = 0;
    uint public docCount =0;

    mapping(uint => Application) public apps;
    mapping(uint => Document) public docs;
    
    struct Document {
        uint id;
        uint appId;
        string aerodromeManual;
        string licensingFee;
        string CARcompliance;
        string exceptionsDoc;
    }

    struct Application{
        uint appId;
        string airportCode;
        uint id;
<<<<<<< HEAD:client/src/contracts/SocialNetwork.sol
        string state;
        string timestamp;
        uint previousStateId;
=======
        uint projectId;
        string articleName;
        string content;
        bool approvalStatus;
        string approvedby;
        uint prevId;
        string filehash;
        string timestamp;
>>>>>>> Suhaib:client/src/contracts/DocumentContract.sol
        address payable author;
    }

    event AppCreated(
        uint appId,
        string airportCode,
        uint id,
<<<<<<< HEAD:client/src/contracts/SocialNetwork.sol
        string state,
        string timestamp,
        uint previousStateId,
=======
        uint projectId,
        string articleName,
        string content,
        bool approvalStatus,
        string approvedby,
        uint prevId,
        string filehash,
        string timestamp,
>>>>>>> Suhaib:client/src/contracts/DocumentContract.sol
        address payable author
    );

    event DocCreated(
       uint id,
        uint appId,
        string aerodromeManual,
        string licensingFee,
        string CARcompliance,
        string exceptionsDoc
    );
    
    event DocIdUpdated(
       uint id,
        uint appId,
        string aerodromeManual,
        string licensingFee,
        string CARcompliance,
        string exceptionsDoc
    );

    event AppIssued(
        uint appId,
        string airportCode,
        uint id,
<<<<<<< HEAD:client/src/contracts/SocialNetwork.sol
        string state,
        string timestamp,
        uint previousStateId,
        address payable author
    );

event AppAssigned(
        uint appId,
        string airportCode,
        uint id,
        string state,
        string timestamp,
        uint previousStateId,
        address payable author
    );
    
 event AppApproved(
    uint appId,
    string airportCode,
    uint id,
    string state,
    string timestamp,
    uint previousStateId,
    address payable author
);

 event AppRejected(
    uint appId,
    string airportCode,
    uint id,
    string state,
    string timestamp,
    uint previousStateId,
    address payable author
);

 event AppGranted(
    uint appId,
    string airportCode,
    uint id,
    string state,
    string timestamp,
    uint previousStateId,
=======
        uint projectId,
        string articleName,
        string content,
        bool approvalStatus,
        string approvedby,
        uint prevId,
        string filehash,
        string timestamp,
        address payable author
    );

 event PostApproved(
    uint id,
    uint projectId,
    string articleName,
    string content,
    bool approvalStatus,
    string approvedby,
    uint prevId,
    string filehash,
    string timestamp,
>>>>>>> Suhaib:client/src/contracts/DocumentContract.sol
    address payable author
);

 event AppRenewed(
    uint appId,
    string airportCode,
    uint id,
    string state,
    string timestamp,
    uint previousStateId,
    address payable author
);
    // Constructor function
    constructor () public {
        name = "Airport Database";
    }

<<<<<<< HEAD:client/src/contracts/SocialNetwork.sol
   function createApp(string memory airportCode, string memory doc1, string memory doc2, string memory doc3,string memory doc4, string memory timestamp) 
   public {
    // Compulsory requires an airportcode
    require(bytes(airportCode).length > 0);
    require(bytes(doc1).length>0);
    require(bytes(doc2).length>0);
    require(bytes(doc3).length>0);
    require(bytes(doc4).length>0);
    // Increment the application count
    appCount ++;
    docCount ++;
    //Create the document first
    docs[docCount] = Document(docCount,appCount,doc1,doc2,doc3,doc4);
    emit DocCreated(docCount,appCount,doc1,doc2,doc3,doc4);
    // Create the application
    apps[appCount] = Application(appCount,airportCode,docCount,"created",timestamp,appCount,msg.sender);
    // Trigger event
    emit AppCreated(appCount,airportCode,docCount,"created",timestamp,appCount,msg.sender);
=======
   function createPost(uint projectId, string memory _articleName, string memory _content, string memory filehash, string memory timestamp) public {
    // Require valid content
    require(bytes(_content).length > 0);
    require(bytes(_articleName).length > 0);
    // Increment the post count
    postCount ++;
    // Create the post
    posts[postCount] = Post(postCount,projectId,_articleName, _content, false,"",postCount,filehash,timestamp,msg.sender);
    // Trigger event
    emit PostCreated(postCount,projectId, _articleName, _content,false,"",postCount,filehash, timestamp,msg.sender);
>>>>>>> Suhaib:client/src/contracts/DocumentContract.sol
}




 function issueApp(uint _id, string memory timestamp) public {
    //Require valid ID
    require(_id > 0 && _id <= appCount);
    //fetch the application and document 
    Application memory app = apps[_id];
    Document memory doc = docs[app.id];
    // Increment the application count
    appCount ++;
    docCount ++;
    // Create a new document with the updated project id
    docs[docCount] = Document(docCount,appCount,doc.aerodromeManual,doc.licensingFee,doc.CARcompliance,doc.exceptionsDoc);
    emit DocCreated(docCount,appCount,doc.aerodromeManual,doc.licensingFee,doc.CARcompliance,doc.exceptionsDoc);

    // Create New application with changed state and link it to the prvious application
    apps[appCount] = Application(appCount,app.airportCode,docCount,
    "issued",timestamp,app.appId, msg.sender);
    // Trigger event
    emit AppIssued(appCount,app.airportCode,docCount,
    "issued",timestamp,app.appId, msg.sender);
}

<<<<<<< HEAD:client/src/contracts/SocialNetwork.sol

function assignApp(uint _id, string memory timestamp) public {
   //Require valid ID
    require(_id > 0 && _id <= appCount);
    //fetch the application and document 
    Application memory app = apps[_id];
    Document memory doc = docs[app.id];
    // Increment the application count
    appCount ++;
    docCount ++;
    // Create a new document with the updated project id
    docs[docCount] = Document(docCount,appCount,doc.aerodromeManual,doc.licensingFee,doc.CARcompliance,doc.exceptionsDoc);
    emit DocCreated(docCount,appCount,doc.aerodromeManual,doc.licensingFee,doc.CARcompliance,doc.exceptionsDoc);

    // Create New application with changed state and link it to the prvious application
    apps[appCount] = Application(appCount,app.airportCode,docCount,
    "assigned",timestamp,_id, msg.sender);
    // Trigger event
    emit AppAssigned(appCount,app.airportCode,docCount,
    "assigned",timestamp,_id, msg.sender);
}

function approveApp(uint _id, string memory timestamp) public {
   //Require valid ID
    require(_id > 0 && _id <= appCount);
    //fetch the application and document 
    Application memory app = apps[_id];
    Document memory doc = docs[app.id];
    // Increment the application count
    appCount ++;
    docCount ++;
    // Create a new document with the updated project id
    docs[docCount] = Document(docCount,appCount,doc.aerodromeManual,doc.licensingFee,doc.CARcompliance,doc.exceptionsDoc);
    emit DocCreated(docCount,appCount,doc.aerodromeManual,doc.licensingFee,doc.CARcompliance,doc.exceptionsDoc);

    // Create New application with changed state and link it to the prvious application
    apps[appCount] = Application(appCount,app.airportCode,docCount,
    "approved",timestamp,_id, msg.sender);
    // Trigger event
    emit AppApproved(appCount,app.airportCode,docCount,
    "approved",timestamp,_id, msg.sender);
}

function rejectApp(uint _id, string memory timestamp) public {
    //Require valid ID
    require(_id > 0 && _id <= appCount);
    //fetch the application and document 
    Application memory app = apps[_id];
    Document memory doc = docs[app.id];
    // Increment the application count
    appCount ++;
    docCount ++;
    // Create a new document with the updated project id
    docs[docCount] = Document(docCount,appCount,doc.aerodromeManual,doc.licensingFee,doc.CARcompliance,doc.exceptionsDoc);
    emit DocCreated(docCount,appCount,doc.aerodromeManual,doc.licensingFee,doc.CARcompliance,doc.exceptionsDoc);

    // Create New application with changed state and link it to the prvious application
    apps[appCount] = Application(appCount,app.airportCode,docCount,
    "rejected",timestamp,_id, msg.sender);
    // Trigger event
    emit AppRejected(appCount,app.airportCode,docCount,
    "rejected",timestamp,_id, msg.sender);
}

function renewApp(uint _id, string memory timestamp) public {
    //Require valid ID
    require(_id > 0 && _id <= appCount);
    //fetch the application and document 
    Application memory app = apps[_id];
    Document memory doc = docs[app.id];
    // Increment the application count
    appCount ++;
    docCount ++;
    // Create a new document with the updated project id
    docs[docCount] = Document(docCount,appCount,doc.aerodromeManual,doc.licensingFee,doc.CARcompliance,doc.exceptionsDoc);
    emit DocCreated(docCount,appCount,doc.aerodromeManual,doc.licensingFee,doc.CARcompliance,doc.exceptionsDoc);

    // Create New application with changed state and link it to the prvious application
    apps[appCount] = Application(appCount,app.airportCode,docCount,
    "renewed",timestamp,_id, msg.sender);
    // Trigger event
    emit AppRenewed(appCount,app.airportCode,docCount,
    "renewed",timestamp,_id, msg.sender);
}

function grantApp(uint _id, string memory timestamp) public {
    //Require valid ID
    require(_id > 0 && _id <= appCount);
    //fetch the application and document 
    Application memory app = apps[_id];
    Document memory doc = docs[app.id];
    // Increment the application count
    appCount ++;
    docCount ++;
    // Create a new document with the updated project id
    docs[docCount] = Document(docCount,appCount,doc.aerodromeManual,doc.licensingFee,doc.CARcompliance,doc.exceptionsDoc);
    emit DocCreated(docCount,appCount,doc.aerodromeManual,doc.licensingFee,doc.CARcompliance,doc.exceptionsDoc);

    // Create New application with changed state and link it to the prvious application
    apps[appCount] = Application(appCount,app.airportCode,docCount,
    "granted",timestamp,_id, msg.sender);
    // Trigger event
    emit AppGranted(appCount,app.airportCode,docCount,
    "granted",timestamp,_id, msg.sender);
}



}
=======
 function modifyPost(uint _id, uint projectId, string memory _articleName, string memory _content, string memory filehash, string memory timestamp) public {
    //Require valid ID
    require(_id > 0 && _id <= postCount);
    // Require valid content
    require(bytes(_content).length > 0);
    require(bytes(_articleName).length > 0);
    // Increment the post count
   // Post memory _post = posts[_id];
   
    postCount ++;

    // Create the post
    posts[postCount] = Post(postCount,projectId,_articleName, _content,false,"", _id,filehash,timestamp, msg.sender);
    // Trigger event
    emit PostModified(postCount,projectId, _articleName, _content,false,"",_id,filehash,timestamp,msg.sender);
}

    function approvePost(uint _id, string memory approvedby) public payable {
        // Make sure the id is Valid
        require(_id > 0 && _id <= postCount, "Post does not exist yet");
        // Fetch the post
        Post memory _post = posts[_id];
        // Increment the tip Amount
        _post.approvalStatus = true;
        _post.approvedby = approvedby;
        // Update the post
        posts[_id] = _post;
        // Trigger an event
        emit PostApproved(
            postCount,
            _post.projectId,
            _post.articleName,
            _post.content,
            _post.approvalStatus,
            _post.approvedby,
            _post.prevId,
            _post.filehash,
            _post.timestamp,
            _post.author
        );
    }
}
>>>>>>> Suhaib:client/src/contracts/DocumentContract.sol
