### PSID_AK-15
### TEAM KAINOTOMOUS
# Knowledge Management System Using Blockchain

#### Problem statement :
>“A web based application using Block chain technology is sought from Airport Licensing to retrieve important and relevant Project Related information from pool of data source i.e. SAP, E-mail, E-office, Scan documents and Database. Below features are desired in an application: 
> - Concerned Officers can upload relevant data related to Airport Licensing from 	Airports. 
> - Seamless Approval process, Centralized Monitoring and Suggestion Mechanism. 
> - Relevant information should be fetched from data source, linked to a 	particular project which can 	be used in the hour of need.”
##### In short, a knowledge management system that runs blockchain at it’s core.

### Technology Stack:

| Name | Description |
| ------ | ------ |
| Etherium | Open Source Blockchain Featuring Smart Contracts |
| Solidity | Programming language for writing SMART CONTRACTS for Etherium Blockchain |
| Node JS |  JavaScript runtime environment (Backend) |
| React JS |  JavaScript library for building Dynamic user interfaces (Frontend) |
| IPFS |  InterPlanetary File System for storing uploaded documents in a distributed file system |
|Mongo DB| NoSQL database for Storing User Management System|
|Mongo DB| NoSQL database for Storing User Management System|
|Ganache| Ethereum Ganache tool - Provides Ethers & gas for local deployment of blockchain for development and testing |
|Metamask| An chrome extension for accessing Ethereum enabled applications, or "Dapps" in your browser  |

![licensing](https://user-images.githubusercontent.com/50493250/89174577-b61d9900-d5a3-11ea-83a7-94e8fd320846.JPG)


Entities:
1) Deputy /Member - Upload files 
2) Chief / Hod - Approve Files 
3) Chairman - Monitor Files

Features:
1) Upload files to IPFS
2) Approve Files 
3) List Files 
4) Login 
5) Register
6) Add user to Mongodb

Prerequisites:
1) Geth
2) Ganache
3) Truffle
4) Node.js
5) Metamask
6) IPFS API@3.1.1

Steps:
1) Delete the previous repo
2) clone this repo again
3) cd Knowledge-Management-System 
4) "npm install"
5) "nodemon src/app.js"  ---  your server should start and mongodb should be connected. 
6) open another terminal in Knowledge-Management-System/client
7) "npm install"
*****[Check the truffle-config.json , change the port number according to your ganache client port! ]****
8) delete the abis folder in client/src/ 
9) in client terminal -- i.e cd Knowledge-Management-System/ client , "truffle compile"
10) truffle test - check if all tests are passing , you can skip this step but its easier to know if there is anything wrong before migrating 
11) truffle migrate --reset
12) npm start
13) your client will start  and you can see the login page in the browser (obviously after logging in your metamask wallet)
14) register yourself first - use anyone of the address from your ganache client. 
15) login 
16) Hopefully , you can see the UI !! Congratulations! 
  



