pragma solidity >=0.4.16 <0.7.0;
//pragma experimental ABIEncoderV2;

contract SocialNetwork {
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
        string state;
        string timestamp;
        address payable author;
    }

    event AppCreated(
        uint appId,
        string airportCode,
        uint id,
        string state,
        string timestamp,
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
        string state,
        string timestamp,
        address payable author
    );

event AppAssigned(
        uint appId,
        string airportCode,
        uint id,
        string state,
        string timestamp,
        address payable author
    );
    
 event AppApproved(
    uint appId,
    string airportCode,
    uint id,
    string state,
    string timestamp,
    address payable author
);

 event AppRejected(
    uint appId,
    string airportCode,
    uint id,
    string state,
    string timestamp,
    address payable author
);

 event AppGranted(
    uint appId,
    string airportCode,
    uint id,
    string state,
    string timestamp,
    address payable author
);

 event AppRenewed(
    uint appId,
    string airportCode,
    uint id,
    string state,
    string timestamp,
    address payable author
);
    // Constructor function
    constructor () public {
        name = "Airport Database";
    }

    function compareStrings (string memory a, string memory b) public pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );

       }

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
    apps[appCount] = Application(appCount,airportCode,docCount,"created",timestamp,msg.sender);
    // Trigger event
    emit AppCreated(appCount,airportCode,docCount,"created",timestamp,msg.sender);
}

 function issueApp(uint _id, string memory timestamp) public {
    //Require valid ID
    require(_id > 0 && _id <= appCount);
    //fetch the application and document 
    Application memory app = apps[_id];
    Document memory doc = docs[app.id];
        // If the state of the application is created only then the further state change will taake place
        // if(compareStrings(app.state,"created")){
            //Change the state of the application
             app.state="issued";
            //Update the application
             apps[_id] = app;
            //Trigger event
             emit AppIssued(app.appId,app.airportCode,doc.id,"issued",timestamp,msg.sender);
        // }
}


function assignApp(uint _id, string memory timestamp) public {
   //Require valid ID
    require(_id > 0 && _id <= appCount);
    //fetch the application and document 
    Application memory app = apps[_id];
    Document memory doc = docs[app.id];
        // If the state of the application is issued only then the further state change will take place
       // if(compareStrings(app.state,"issued")){
            //Change the state of the application
             app.state="assigned";
            //Update the application
             apps[_id] = app;
            //Trigger event
             emit AppAssigned(app.appId,app.airportCode,doc.id,"assigned",timestamp,msg.sender);
       // }
}

function approveApp(uint _id, string memory timestamp) public {
   //Require valid ID
    require(_id > 0 && _id <= appCount);
    //fetch the application and document 
    Application memory app = apps[_id];
    Document memory doc = docs[app.id];
        // If the state of the application is assigned only then the further state change will take place
        //if(compareStrings(app.state,"assigned")){
            //Change the state of the application
             app.state="approved";
            //Update the application
             apps[_id] = app;
            //Trigger event
             emit AppApproved(app.appId,app.airportCode,doc.id,"approved",timestamp,msg.sender);
       // }
}

function rejectApp(uint _id, string memory timestamp) public {
   //Require valid ID
    require(_id > 0 && _id <= appCount);
    //fetch the application and document 
    Application memory app = apps[_id];
    Document memory doc = docs[app.id];
        // If the state of the application is assigned only then the further state change will take place
        //if(compareStrings(app.state,"assigned")){
            //Change the state of the application
             app.state="rejected";
            //Update the application
             apps[_id] = app;
            //Trigger event
             emit AppRejected(app.appId,app.airportCode,doc.id,"rejected",timestamp,msg.sender);
       // }
}

function renewApp(uint _id, string memory timestamp) public {
   //Require valid ID
    require(_id > 0 && _id <= appCount);
    //fetch the application and document 
    Application memory app = apps[_id];
    Document memory doc = docs[app.id];
        // validation of state is not used here because this function is used twice. 
            //Change the state of the application
             app.state="renewed";
            //Update the application
             apps[_id] = app;
            //Trigger event
             emit AppRenewed(app.appId,app.airportCode,doc.id,"renewed",timestamp,msg.sender);
        }

function grantApp(uint _id, string memory timestamp) public {
    //Require valid ID
    require(_id > 0 && _id <= appCount);
    //fetch the application and document 
    Application memory app = apps[_id];
    Document memory doc = docs[app.id];
        // If the state of the application is assigned only then the further state change will take place
       // if(compareStrings(app.state,"approved")){
            //Change the state of the application
             app.state="granted";
            //Update the application
             apps[_id] = app;
            //Trigger event
             emit AppGranted(app.appId,app.airportCode,doc.id,"granted",timestamp,msg.sender);
        //}
}



}
