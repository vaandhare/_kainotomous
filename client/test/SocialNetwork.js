const { assert } = require('chai')

const SocialNetwork = artifacts.require('./SocialNetwork.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('SocialNetwork', ([moca,dgca,doas,ai]) => {
  let socialNetwork
  
  before(async () => {
    socialNetwork = await SocialNetwork.deployed()
  })
   describe('deployment', async () => {
    it('deploys successfully', async () => {
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

  describe('apps', async() => {
    let result, appCount

    before(async () => {
      result = await socialNetwork.createApp('1','doc1','doc2','doc3','doc4','timestamp',{ from: moca })
      appCount = await socialNetwork.appCount()
    })

    

    it('creates applications', async()=> {
    
     //Success
     assert.equal(appCount, 1)
     const event = result.logs[1].args
     assert.equal(event.appId.toNumber(), appCount.toNumber(), 'id is correct')
     assert.equal(event.airportCode, '1','The airport code is correct')
     assert.equal(event.id, '1', 'Doc id is correct' )
     assert.equal(event.state, 'created', 'The state of the application is created')
     assert.equal(event.timestamp, 'timestamp', 'timestamp is correct')
     //Failure

     await socialNetwork.createApp('','','','', {from: moca}).should.be.rejected;
    })

    it('lists applications', async()=> {
        const app = await socialNetwork.apps(appCount)
        assert.equal(app.appId.toNumber(), appCount.toNumber(), 'id is correct')
        assert.equal(app.airportCode, '1', 'the airport code  is correct')
        assert.equal(app.id, '1', 'Doc id is correct' )
     assert.equal(app.state, 'created', 'application state is correct')
     assert.equal(app.timestamp,'timestamp', 'timestamp is correct')
    })

     it('allows users to issue applications', async()=> {
       const app = await socialNetwork.apps(appCount)
      result = await socialNetwork.issueApp(app.appId,'timestamp',{ from: dgca})

      //Success
     const event = result.logs[0].args
     assert.equal(event.appId.toNumber(),1, 'id is correct')
     assert.equal(event.airportCode, '1', 'airport code is correct')
     assert.equal(event.id, '1', 'Doc id is correct' )
     assert.equal(event.state, 'issued', 'state is correct')
     assert.equal(event.timestamp, 'timestamp', 'timestamp is correct')
    
    })

   it('allows users to approve applications', async()=> {
    const app = await socialNetwork.apps(appCount)

   result = await socialNetwork.approveApp(app.appId,'timestamp',{ from: ai})

   //Success
  const event = result.logs[0].args
  assert.equal(event.appId.toNumber(),1, 'id is correct')
  assert.equal(event.airportCode, '1', 'airport code is correct')
  assert.equal(event.id, '1', 'Doc id is correct' )
  assert.equal(event.state, 'approved', 'state is correct')
  assert.equal(event.timestamp, 'timestamp', 'timestamp is correct')

 })

 it('allows users to reject applications', async()=> {
  const app = await socialNetwork.apps(appCount)

 result = await socialNetwork.rejectApp(app.appId,'timestamp',{ from: ai})

 //Success
const event = result.logs[0].args
assert.equal(event.appId.toNumber(),1, 'id is correct')
assert.equal(event.airportCode, '1', 'airport code is correct')
assert.equal(event.id, '1', 'Doc id is correct' )
assert.equal(event.state, 'rejected', 'state is correct')
assert.equal(event.timestamp, 'timestamp', 'timestamp is correct')

})

it('allows users to review applications', async()=> {
  const app = await socialNetwork.apps(appCount)

 result = await socialNetwork.reviewApp(app.appId,'timestamp',{ from: moca})

 //Success
const event = result.logs[0].args
assert.equal(event.appId.toNumber(), 1, 'id is correct')
assert.equal(event.airportCode, '1', 'airport code is correct')
assert.equal(event.id, '1', 'Doc id is correct' )
assert.equal(event.state, 'reviewed', 'state is correct')
assert.equal(event.timestamp, 'timestamp', 'timestamp is correct')

})

it('allows users to recreate applications', async()=> {
  const app = await socialNetwork.apps(appCount)

 result = await socialNetwork.recreateApp(app.appId,'2','doc1','doc2','doc3','doc4', 'time',{ from: moca})

 //Success
const event = result.logs[0].args
assert.equal(event.appId.toNumber(), 1, 'id is correct')
assert.equal(event.airportCode, '2', 'airport code is correct')
assert.equal(event.id, '1', 'Doc id is correct' )
assert.equal(event.state, 'recreated', 'state is correct')
assert.equal(event.timestamp, 'time', 'timestamp is correct')

})

it('allows users to assign applications', async()=> {
  const app = await socialNetwork.apps(appCount)

 result = await socialNetwork.assignApp(app.appId,'timestamp',{ from: doas})

 //Success
const event = result.logs[0].args
assert.equal(event.appId.toNumber(), 1, 'id is correct')
assert.equal(event.airportCode, '2', 'airport code is correct')
assert.equal(event.id, '1', 'Doc id is correct' )
assert.equal(event.state, 'assigned', 'state is correct')
assert.equal(event.timestamp, 'timestamp', 'timestamp is correct')

})

it('allows users to grant license to applications', async()=> {
  const app = await socialNetwork.apps(appCount)

 result = await socialNetwork.grantApp(app.appId,'timestamp',{ from: dgca})

 //Success
const event = result.logs[0].args
assert.equal(event.appId.toNumber(), 1, 'id is correct')
assert.equal(event.airportCode, '2', 'airport code is correct')
assert.equal(event.id, '1', 'Doc id is correct' )
assert.equal(event.state, 'granted', 'state is correct')
assert.equal(event.timestamp, 'timestamp', 'timestamp is correct')

})


})


})
