const SocialNetwork = artifacts.require('./SocialNetwork.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('SocialNetwork', ([deployer, deputy,chief,chairman]) => {
  let socialNetwork
  
  before(async () => {
    socialNetwork = await SocialNetwork.deployed()
  })
   describe('deployment', async () => {
    it('deploys successfully', async () => {
     // socialNetwork = await SocialNetwork.deployed() 
      const address = await socialNetwork.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async() =>{
      const name = await socialNetwork.name()
      assert.equal(name, 'Airport Database')
    })
  })

  describe('posts', async() => {
    let result, postCount

    before(async () => {
      result = await socialNetwork.createPost('Test Article','This is my first post','abc123',{ from: deputy })
      postCount = await socialNetwork.postCount()
    })

    

    it('creates posts', async()=> {
    
     //Success
     assert.equal(postCount, 1)
     const event = result.logs[0].args
     assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
     assert.equal(event.articleName, 'Test Article', 'Article name is correct' )
     assert.equal(event.content, 'This is my first post', 'content is correct')
     assert.equal(event.approvalStatus, false, 'approvalStatus is correct')
     assert.equal(event.prevId, '1', 'The previous post id is correct')
     assert.equal(event.filehash, 'abc123', 'The filehash is correct')
     //Failure

     await socialNetwork.createPost('','','','', {from: deputy}).should.be.rejected;
    })

    it('lists posts', async()=> {
        const post = await socialNetwork.posts(postCount)
        assert.equal(post.id.toNumber(), postCount.toNumber(), 'id is correct')
        assert.equal(post.articleName, 'Test Article', 'Article name is correct' )
     assert.equal(post.content, 'This is my first post', 'content is correct')
     assert.equal(post.approvalStatus, false, 'approvalStatus is correct')
     assert.equal(post.author, deputy, 'author is correct')
     assert.equal(post.filehash, 'abc123', 'The fielhash is correct')
    })

     it('allows users to approve posts', async()=> {
       const post = await socialNetwork.posts(postCount)

      let oldApprovalStatus
      oldApprovalStatus = post.approvalStatus;

      result = await socialNetwork.approvePost(postCount,{ from: chief})

      //Success
     const event = result.logs[0].args
     assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
     assert.equal(event.articleName, 'Test Article', 'Article name is correct' )
     assert.equal(event.content, 'This is my first post', 'content is correct')
     assert.equal(event.approvalStatus, true, 'approvalStatus is correct')
     assert.equal(event.author, deputy, 'author is correct')
     assert.equal(event.filehash, 'abc123', 'The fielhash is correct')

     //Check if the author received funds or not 
     let newApprovalStatus
     newApprovalStatus = post.approvalStatus

    let expectedApprovalStatus
    expectedApprovalStatus = post.approvalStatus

    assert.equal(expectedApprovalStatus,newApprovalStatus)
    
    })

it('modified posts', async()=> {
  //fetch the current post 
  const post = await socialNetwork.posts(postCount)
  // fetch the current post id and previous id
  let _id, oldprevId
  _id = post.id
  oldprevId = post.prevId
  //define new content
  const title = "modified article"
  const content = "modified content"
  const filehash = "abc123456"
  // modifying the post 
  result = await socialNetwork.modifyPost(_id,title,content,filehash,{from: deputy})
  postCount = await socialNetwork.postCount()
  //Success
  assert.equal(postCount,2)
  const event = result.logs[0].args
  assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
  assert.equal(event.articleName, 'modified article', 'Article name is correct' )
  assert.equal(event.content, 'modified content', 'content is correct')
  assert.equal(event.approvalStatus, false, 'approvalStatus is correct')
  assert.equal(event.prevId, '1', 'The previous post id is correct')
  assert.equal(event.filehash, 'abc123456', 'The fielhash is correct')

  //Failure
  
  await socialNetwork.modifyPost('','','', {from: deputy}).should.be.rejected;
 })

 it('retrieves the fileHash', async () => {
  const post = await socialNetwork.posts(postCount)
  let filehash = post.filehash
  const result = await socialNetwork.getHash(postCount)
  assert.equal(result, filehash,'get hash function works properly ')
  
})

})


})



