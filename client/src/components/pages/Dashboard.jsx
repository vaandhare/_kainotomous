import React from "react";
import Web3 from 'web3';
import '../../styles/Dashboard.css';
import Navbar from './Navbar'
import SocialNetwork from '../../abis/SocialNetwork.json'
import Deputy from './Deputy'
import Chief from './Chief'
import Chairman from './Chairman'
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
  if (account !== currentAccount) {
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
      const postCount = await socialNetwork.methods.postCount().call()
      this.setState({ postCount })
      // Load Posts
      for (var i = 1; i <= postCount; i++) {
        const post = await socialNetwork.methods.posts(i).call()
        this.setState({
          posts: [...this.state.posts, post]
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

  createPost(articleName , content,filehash) {
    this.setState({ loading: true })
    console.log(content)
    console.log(articleName)
    console.log(filehash)
    this.state.socialNetwork.methods.createPost(articleName,content,filehash).send({ from: this.state.account })
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


  modifyPost(prevId,articleName , content,filehash) {
    this.setState({ loading: true })
    console.log(prevId)
    console.log(content)
    console.log(articleName)
    console.log(filehash)
    this.state.socialNetwork.methods.modifyPost(prevId,articleName,content,filehash).send({ from: this.state.account })
    .on('confirmation', (reciept) => {
      this.setState({ loading: false })
      console.log(reciept)
      // window.location.reload()
    })
    .once('receipt', (receipt) => {
      
      this.setState({ loading: false })

    })
  }

  approvePost(id) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.approvePost(id).send({ from: this.state.account})
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

  returnLink(id) {
   var filehash = this.state.socialNetwork.methods.getHash(id);
    var link = "https://ipfs.infura.io/ipfs/"
    link = link.concat(filehash)
    console.log(link)
    return link
    //return prevId
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      socialNetwork: null,
      postCount: 0,
      posts: [],
      loading: true,
      filehash: '',
      buffer: null,
      files:null,
      currentUser:{}
    }
    this.createPost = this.createPost.bind(this)
    this.approvePost = this.approvePost.bind(this)
    this.modifyPost = this.modifyPost.bind(this)
    this.returnLink = this.returnLink.bind(this)
    this.checkAuth = this.checkAuth.bind(this)
  }

  checkAuth(){
    //   Check if the user has login or not if not then go back to login
    
    let islogin = localStorage.getItem('isLogin');
    // ?console.log("Auth Status",islogin);
    if(islogin === 'false'){
      // console.log('Pushing Auth');
      this.props.history.push('/auth')
    }
    let currentAccount = JSON.parse(localStorage.getItem('currentLogin'));
    
    if(this.state.account !== currentAccount.address){
      console.log('login doesnt match');
      this.props.history.push('/metamasklogin')
    }
    if(!this.state.currentUser.isapproved){
      this.props.history.push('/notapproved')
    }

  }
  
  render() {
    
    if(this.state.currentUser.role === 'Member (Operational)')
    {
      console.log('Member Address',this.state.currentUser.address);
      return(
        <div>
          <Navbar account={this.state.currentUser} />
          <Deputy
          account={this.state.account}
          posts={this.state.posts}
          addressStatus = {this.state.addressStatus}
          createPost={this.createPost}
          tipPost={this.tipPost}
          modifyPost = {this.modifyPost}
          buffer = {this.state.buffer}
          returnLink = {this.returnLink}
          
          />
          </div>
      );
    }
    else{
      if(this.state.currentUser.role === 'Head Of Department')
      { console.log('Member Address',this.state.currentUser.role);
        return(
          <div>
          <Navbar account={this.state.currentUser} />
          <Chief account={this.state.account}
          posts={this.state.posts}
          addressStatus = {this.state.addressStatus}
          createPost={this.createPost}
          approvePost = {this.approvePost}
          tipPost={this.tipPost}
          modifyPost={this.modifyPost}
          />
          </div>
        );
      }
      else{
        return(
          <div>
          <Navbar account={this.state.currentUser} />
          <Chairman account={this.state.account}
           posts={this.state.posts}
           addressStatus = {this.state.addressStatus}
          createPost={this.createPost}
          tipPost={this.tipPost}
          reportFake={this.reportFake}
          reportTrue = {this.reportTrue}
          listFakeArticle = {this.listFakeArticle}
          listTrueArticle = {this.listTrueArticle}
          addBlockAddress = {this.addBlockAddress}
          />
          </div>
        );
      }
    }
  }
}

export default Dashboard;
