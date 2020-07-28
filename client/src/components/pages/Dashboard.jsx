import React from "react";
import Web3 from 'web3';
import '../../styles/Dashboard.css';
import Navbar from './Navbar'
import SocialNetwork from '../../abis/SocialNetwork.json'
import MoCA from './MoCA'
import DGCA from './DGCA'
import DoAS from './DoAS'
import AI from './AI'
import axios from "axios";

// Get the current account value from Localstorage
let currentAccount = localStorage.getItem('currentAccount');
// let currentChainId = localStorage.getItem('currentChainId');
// Listener to check chainchanged
// window.ethereum.on('chainChanged', handleChainChanged)

// function handleChainChanged (chainId) {

//   if (currentChainId !== chainId) {

//     currentChainId = chainId
//     // Run any other necessary logic...
//     localStorage.setItem('currentChainId',currentChainId);
//     console.log('Chain is Changed to:',currentChainId);
//     window.location.reload(true)
//   }
// }

// On accounts change listner for etheruem
window.ethereum.on('accountsChanged', handleAccountsChanged)

// For now, 'eth_accounts' will continue to always return an array
async function handleAccountsChanged () {
  window.web3 = new Web3(window.ethereum)
  await window.ethereum.enable()
  const accounts = await window.web3.eth.getAccounts()
  const account = accounts[0];
  // const accounts = await web3.eth.getAccounts()
  if (account != currentAccount) {
    currentAccount = account;
    // Run any other necessary logic...
    // Save the current Account to Localstorage
    localStorage.setItem('currentAccount',currentAccount);
    // reload the window because the account is changed
    window.location.reload(true);
  }
}

class Dashboard extends React.Component {
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    await this.fetchUserData();
    this.checkAuth()
  }

  async  loadWeb3() {
    if (window.ethereum) {
      // console.log('here')
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    const account = accounts[0];
    localStorage.setItem('currentAccount',account);
    this.setState({ account: accounts[0] })
    
   // console.log(account)
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = SocialNetwork.networks[networkId]
    if(networkData) {
      const socialNetwork = new web3.eth.Contract(SocialNetwork.abi, networkData.address)
      this.setState({ socialNetwork })
      const appCount = await socialNetwork.methods.appCount().call()
      const docCount = await socialNetwork.methods.docCount().call()
      this.setState({ appCount })
      this.setState({ docCount})
      // Load Posts
      for (var i = 1; i <= appCount; i++) {
        const app = await socialNetwork.methods.apps(i).call()
        this.setState({
          apps: [...this.state.apps, app]
        })
      }
      for (var i = 1; i <= docCount; i++) {
        const doc = await socialNetwork.methods.docs(i).call()
        this.setState({
          docs: [...this.state.docs, doc]
        })
      }
      this.setState({ loading: false})
    } else {
      window.alert('SocialNetwork contract not deployed to detected network.')
    }
  }

  async fetchUserData(){
    const response = await axios.get(`http://localhost:5000/api/Users/${this.state.account}`)
    this.setState({currentUser:response.data})
    // console.log(this.state.currentUser)
  }

  createApp(airportCode, doc1,doc2,doc3,doc4,timestamp) {
    this.setState({ loading: true })
    console.log(airportCode)
    console.log(doc1)
    console.log(doc2)
    console.log(doc3)
    console.log(doc4)
    console.log(timestamp)
    this.state.socialNetwork.methods.createApp(airportCode, doc1,doc2,doc3,doc4,timestamp).send({ from: this.state.account })
    .on('confirmation', (reciept) => {
      this.setState({ loading: false })
      console.log(reciept)
      // window.location.reload()
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
      // this.setState({ loading: false })
    })
  }

  issueApp(id, timestamp) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.issueApp(id,timestamp).send({ from: this.state.account})
    .on('confirmation', (reciept) => {
      this.setState({ loading: false })
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
      this.setState({ loading: false })
    })
  }

  assignApp(id, timestamp) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.assignApp(id,timestamp).send({ from: this.state.account})
    .on('confirmation', (reciept) => {
      this.setState({ loading: false })
      // console.log(reciept)
      // window.location.reload()
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
      this.setState({ loading: false })
    })
  }

  approveApp(id, timestamp) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.approveApp(id,timestamp).send({ from: this.state.account})
    .on('confirmation', (reciept) => {
      this.setState({ loading: false })
      // console.log(reciept)
      // window.location.reload()
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
      this.setState({ loading: false })
    })
  }

  rejectApp(id, timestamp) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.rejectApp(id,timestamp).send({ from: this.state.account})
    .on('confirmation', (reciept) => {
      this.setState({ loading: false })
      // console.log(reciept)
      // window.location.reload()
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
      this.setState({ loading: false })
    })
  }
 
  grantApp(id, timestamp) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.grantApp(id,timestamp).send({ from: this.state.account})
    .on('confirmation', (reciept) => {
      this.setState({ loading: false })
      // console.log(reciept)
      // window.location.reload()
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
      this.setState({ loading: false })
    })
  }

  renewApp(id, timestamp) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.renewApp(id,timestamp).send({ from: this.state.account})
    .on('confirmation', (reciept) => {
      this.setState({ loading: false })
      // console.log(reciept)
      // window.location.reload()
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      socialNetwork: null,
      appCount: 0,
      docCount: 0,
      apps: [],
      docs:[],
      loading: true,
      doc1: '',
      doc2: '',
      doc3: '',
      doc4: '',
      buffer: null,
      currentUser:{}
    }
    this.createApp = this.createApp.bind(this)
    this.issueApp = this.issueApp.bind(this)
    this.assignApp = this.assignApp.bind(this)
    this.approveApp = this.approveApp.bind(this)
    this.rejectApp = this.rejectApp.bind(this)
    this.grantApp = this.grantApp.bind(this)
    this.renewApp = this.renewApp.bind(this)
    this.checkAuth = this.checkAuth.bind(this)
    this.returnDocs = this.returnDocs.bind(this)
  }
  returnDocs(){
    console.log(this.state.docs)
  } 
  checkAuth(){
    //   Check if the user has login or not if not then go back to login
    
    let islogin = localStorage.getItem('isLogin');
    // ?console.log("Auth Status",islogin);
    
    if(islogin !== 'true'){
      // console.log('Pushing Auth');
      this.props.history.push('/auth')
    }
    let currentAccount = JSON.parse(localStorage.getItem('currentLogin'));
    
    // if(this.state.account != currentAccount.address){
    //   console.log('login doesnt match');
    //   this.props.history.push('/metamasklogin')
    // }
    if(!this.state.currentUser.isapproved){
      
      // this.props.history.push('/notapproved')
    }

  }
  
  render() {
    
    if(this.state.currentUser.role == 'MoCA')
    {
      console.log('Member Address',this.state.currentUser.address);
      return(
        <div>
          <Navbar account={this.state.currentUser} />
          <MoCA
          account={this.state.account}
          apps={this.state.apps}
          docs = {this.state.docs}
          createApp={this.createApp}
          buffer = {this.state.buffer}
          returnDocs = {this.returnDocs}   
          />
          </div>
      );
    }
    else{
      if(this.state.currentUser.role == 'DoAS')
      { console.log('Member Address',this.state.currentUser.role);
        return(
          <div>
          <Navbar account={this.state.currentUser} />
          <DoAS 
          account={this.state.account}
          apps={this.state.apps}
          
          assignApp = {this.assignApp}
          grantApp = {this.grantApp}
          renewApp = {this.renewApp}
          buffer = {this.state.buffer}
          />
          </div>
        );
      }
      else if(this.state.currentUser.role == 'DGCA'){
        return(
          <div>
          <Navbar account={this.state.currentUser} />
          <DGCA
          account={this.state.account}
          apps={this.state.apps}
          docs = {this.state.docs}
          issueApp = {this.issueApp}
          />
          </div>
        );
        
      }
      else{
        console.log('Member Address',this.state.currentUser.role);
        return(
          <div>
          <Navbar account={this.state.currentUser} />
          <AI
          account={this.state.account}
          apps={this.state.apps}
          docs = {this.state.docs}
          approveApp = {this.approveApp}
          rejectApp = {this.rejectApp}
          />
          </div>
        );
      }
    }
    }
  
}

export default Dashboard;
