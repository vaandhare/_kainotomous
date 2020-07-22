pragma solidity >=0.4.16 <0.7.0;
//pragma experimental ABIEncoderV2;

contract SocialNetwork {
    // State variable
    string public name;
    uint public postCount = 0;

    mapping(uint => Post) public posts;

    struct Post {
        uint id;
        string articleName;
        string content;
        bool approvalStatus;
        uint prevId;
        string filehash;
        address payable author;
    }

    event PostCreated(
        uint id,
        string articleName,
        string content,
        bool approvalStatus,
        uint prevId,
        string filehash,
        address payable author
    );

    event PostModified(
        uint id,
        string articleName,
        string content,
        bool approvalStatus,
        uint prevId,
        string filehash,
        address payable author
    );

   event PostTipped(
    uint id,
    string articleName,
    string content,
    bool approvalStatus,
    uint prevId,
    string filehash,
    address payable author
);

 event PostApproved(
    uint id,
    string articleName,
    string content,
    bool approvalStatus,
    uint prevId,
    string filehash,
    address payable author
);

    // Constructor function
    constructor () public {
        name = "Airport Database";
    }

   function createPost(string memory _articleName, string memory _content, string memory filehash) public {
    // Require valid content
    require(bytes(_content).length > 0);
    require(bytes(_articleName).length > 0);
    // Increment the post count
    postCount ++;
    // Create the post
    posts[postCount] = Post(postCount,_articleName, _content, false,postCount,filehash,msg.sender);
    // Trigger event
    emit PostCreated(postCount, _articleName, _content,false, postCount,filehash, msg.sender);
}

function getHash(uint _id) public view returns (string memory){
  require(_id > 0 && _id <= postCount);
    // Fetch the post
    Post memory _post = posts[_id];
    // Fetch the author
   return _post.filehash;
}

 function modifyPost(uint _id, string memory _articleName, string memory _content, string memory filehash) public {
    //Require valid ID
    require(_id > 0 && _id <= postCount);
    // Require valid content
    require(bytes(_content).length > 0);
    require(bytes(_articleName).length > 0);
    // Increment the post count
   // Post memory _post = posts[_id];
   
    postCount ++;

    // Create the post
    posts[postCount] = Post(postCount,_articleName, _content,false, _id,filehash, msg.sender);
    // Trigger event
    emit PostModified(postCount, _articleName, _content,false, _id,filehash,msg.sender);
}

    function approvePost(uint _id) public payable {
        // Make sure the id is Valid
        require(_id > 0 && _id <= postCount, "Post does not exist yet");
        // Fetch the post
        Post memory _post = posts[_id];
        // Increment the tip Amount
        _post.approvalStatus = true;
        // Update the post
        posts[_id] = _post;
        // Trigger an event
        emit PostApproved(
            postCount,
            _post.articleName,
            _post.content,
            _post.approvalStatus,
            _post.prevId,
            _post.filehash,
            _post.author
        );
    }
}