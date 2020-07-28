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
        uint previousStateId;
        address payable author;
    }

    event AppCreated(
        uint appId,
        string airportCode,
        uint id,
        string state,
        string timestamp,
        uint previousStateId,
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
