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
     assert.equal(event.previousStateId, event.appId.toNumber(), 'previous id is correct')
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
     assert.equal(app.previousStateId, app.appId.toNumber(), 'previous Id is correct')
    })

     it('allows users to issue applications', async()=> {
       const app = await socialNetwork.apps(appCount)
      result = await socialNetwork.issueApp(app.appId,'timestamp',{ from: dgca})

      //Success
     const event = result.logs[1].args
     assert.equal(event.appId.toNumber(),2, 'id is correct')
     assert.equal(event.airportCode, '1', 'airport code is correct')
     assert.equal(event.id, '2', 'Doc id is correct' )
     assert.equal(event.state, 'issued', 'state is correct')
     assert.equal(event.timestamp, 'timestamp', 'timestamp is correct')
     assert.equal(event.previousStateId.toNumber(), 1, 'previous id is correct')
    
    })

   it('allows users to approve applications', async()=> {
     appCount++
    const app = await socialNetwork.apps(appCount)

   result = await socialNetwork.approveApp(app.appId,'timestamp',{ from: ai})

   //Success
  const event = result.logs[1].args
  assert.equal(event.appId.toNumber(),3, 'id is correct')
  assert.equal(event.airportCode, '1', 'airport code is correct')
  assert.equal(event.id, '3', 'Doc id is correct' )
  assert.equal(event.state, 'approved', 'state is correct')
  assert.equal(event.timestamp, 'timestamp', 'timestamp is correct')
  assert.equal(event.previousStateId.toNumber(), 2, 'previous id is correct')

 })

 it('allows users to reject applications', async()=> {
   appCount++
  const app = await socialNetwork.apps(appCount)

 result = await socialNetwork.rejectApp(app.appId,'timestamp',{ from: ai})

 //Success
const event = result.logs[1].args
assert.equal(event.appId.toNumber(),4, 'id is correct')
assert.equal(event.airportCode, '1', 'airport code is correct')
assert.equal(event.id, '4', 'Doc id is correct' )
assert.equal(event.state, 'rejected', 'state is correct')
assert.equal(event.timestamp, 'timestamp', 'timestamp is correct')
assert.equal(event.previousStateId.toNumber(), 3, 'previous id is correct')

})

it('allows users to renew applications', async()=> {
  appCount++
  const app = await socialNetwork.apps(appCount)

 result = await socialNetwork.renewApp(app.appId,'timestamp',{ from: moca})

 //Success
const event = result.logs[1].args
assert.equal(event.appId.toNumber(), 5, 'id is correct')
assert.equal(event.airportCode, '1', 'airport code is correct')
assert.equal(event.id, '5', 'Doc id is correct' )
assert.equal(event.state, 'renewed', 'state is correct')
assert.equal(event.timestamp, 'timestamp', 'timestamp is correct')
assert.equal(event.previousStateId.toNumber(), 4, 'previous id is correct')

})

it('allows users to assign applications', async()=> {
  appCount++
  const app = await socialNetwork.apps(appCount)

 result = await socialNetwork.assignApp(app.appId,'timestamp',{ from: doas})

 //Success
const event = result.logs[1].args
assert.equal(event.appId.toNumber(), 6, 'id is correct')
assert.equal(event.airportCode, '1', 'airport code is correct')
assert.equal(event.id, '6', 'Doc id is correct' )
assert.equal(event.state, 'assigned', 'state is correct')
assert.equal(event.timestamp, 'timestamp', 'timestamp is correct')
assert.equal(event.previousStateId.toNumber(), 5, 'previous id is correct')

})

it('allows users to grant license to applications', async()=> {
  appCount++
  const app = await socialNetwork.apps(appCount)

 result = await socialNetwork.grantApp(app.appId,'timestamp',{ from: dgca})

 //Success
const event = result.logs[1].args
assert.equal(event.appId.toNumber(), 7, 'id is correct')
assert.equal(event.airportCode, '1', 'airport code is correct')
assert.equal(event.id, '7', 'Doc id is correct' )
assert.equal(event.state, 'granted', 'state is correct')
assert.equal(event.timestamp, 'timestamp', 'timestamp is correct')
assert.equal(event.previousStateId.toNumber(), 6, 'previous id is correct')

})


})


})
