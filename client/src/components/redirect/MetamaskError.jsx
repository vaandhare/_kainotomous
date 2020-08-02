import React from "react";
import Web3 from "web3";
import error403 from "../../assets/error_401.jpg";
import "../../styles/usernotapproved.css";
let currentAccount = JSON.parse(localStorage.getItem("currentLogin"));
console.log(currentAccount);
window.ethereum.on("accountsChanged", handleAccountsChanged);
let checked = localStorage.getItem("checkedMeta");
// For now, 'eth_accounts' will continue to always return an array
async function handleAccountsChanged() {
  window.web3 = new Web3(window.ethereum);
  await window.ethereum.enable();
  const accounts = await window.web3.eth.getAccounts();
  const account = accounts[0];
  console.log(account);
  // const accounts = await web3.eth.getAccounts()
  if (account === currentAccount.address && checked != "true") {
    localStorage.setItem("checkedMeta", true);
    console.log("It finally Match Yeepee");
    window.location.href = "/";
  } else {
    console.log("It Still Doesnt");
  }
}

function MetamaskError() {
  return (
    <div className="errordiv">
      <img src={error403} width="500" height="auto" />
      <h2>Need Metamask Authorization Too</h2>
      <h2>Select the Correct Metamask Login To Continue</h2>

      {/* <img src={Image403} width="500" height="auto"/> */}
    </div>
  );
}

export default MetamaskError;
