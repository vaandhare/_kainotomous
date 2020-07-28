pragma solidity >=0.4.16 <0.7.0;
//pragma experimental ABIEncoderV2;

contract DocumentContract {
    // State variable
    string public name;
    uint public postCount = 0;

    mapping(uint => Post) public posts;

    struct Post {
        uint id;
        uint projectId;
        string articleName;
        string content;
        bool approvalStatus;
        string approvedby;
        uint prevId;
        string filehash;
        string timestamp;
        address payable author;
    }

    event PostCreated(
        uint id,
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

    event PostModified(
        uint id,
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
    address payable author
);

    // Constructor function
    constructor () public {
        name = "Airport Database";
    }

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
}

function getHash(uint _id) public view returns (string memory){
  require(_id > 0 && _id <= postCount);
    // Fetch the post
    Post memory _post = posts[_id];
    // Fetch the author
   return _post.filehash;
}

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