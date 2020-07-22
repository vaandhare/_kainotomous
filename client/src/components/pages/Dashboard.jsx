import React,{ Fragment } from "react";
import Web3 from 'web3';
import '../../styles/Dashboard.css';
import Navbar from './Navbar'
import SocialNetwork from '../../abis/SocialNetwork.json'
import Deputy from './Deputy'
import Chief from './Chief'
import Chairman from './Chairman'




class Dashboard extends React.Component {
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  // async getAccount() {
  
  //   const accounts = await window.ethereum.enable();
  //   const accounts = await web3.eth.getAccounts()
  //   const account = accounts[0];
  //   this.setState({ account: accounts[0] })
  //   // do something with new account here
  //   return account
  // }

  async  loadWeb3() {
    if (window.ethereum) {
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

  createPost(articleName , content,filehash) {
    this.setState({ loading: true })
    console.log(content)
    console.log(articleName)
    console.log(filehash)
    this.state.socialNetwork.methods.createPost(articleName,content,filehash).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }


  modifyPost(prevId,articleName , content,filehash) {
    this.setState({ loading: true })
    console.log(prevId)
    console.log(content)
    console.log(articleName)
    console.log(filehash)
    this.state.socialNetwork.methods.modifyPost(prevId,articleName,content,filehash).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })

    })
  }

  approvePost(id) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.approvePost(id).send({ from: this.state.account})
    .once('receipt', (receipt) => {
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
      deputyaddress:'0x47917cd8164660681F16E73c52F7a133112AD465'
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
    const result = islogin ? "User has Already Login" : this.props.history.push('/auth')
  }

  render() {
    this.checkAuth()
    if(this.state.account === '0x47fcb933Bcd2d6471480b04967B1b0024b9cDff0')
    {
      return(
        <div>
          <Navbar account={this.state.account} />
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
      if(this.state.account === '0xd7B24b894Ea0CA70A604Cbd1981592bb4B0F12B6')
      {
        return(
          <div>
          <Navbar account={this.state.account} />
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
          <Navbar account={this.state.account} />
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
