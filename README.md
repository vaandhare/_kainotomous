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
# Aerodrome Licensing Application & Approval 
![licensing](https://user-images.githubusercontent.com/50493250/89174577-b61d9900-d5a3-11ea-83a7-94e8fd320846.JPG)


## Entities:

|Entities|Description|
|-----|-----|
| Aerodrome Director (AD) | Under AAI Operator & Single Point of contact between Aerodrome & DGCA|
|ED License| Reviews the Documents Sent by AD before sending to DGCA|
|DGCA|Grants the license for the aerodrome operator . Has Multiple Entities Working under this body|
|Aerodrome Inspector (AI)|Works Under DGCA . Does Onsite & Offite Document Verification Before granting License|
|Directorate  of Aerodrome Standards (DOAS)| Works under DGCA , Responsible for issuing the License for AAI Operator |


Features:
1) Upload files to IPFS
2) Approve Files 
3) List Files 
4) Login 
5) Register
6) Add user to Mongodb

Prerequisites:
1) NPM & Node must me installed 
2) Truffle & Ganache must be installed 
3) Metamask
4) IPFS API@3.1.1

Installation Steps:
1) clone this repo & go to the directory
```sh 
git clone https://github.com/vaandhare/_kainotomous/
cd _kainotomous
```

2) Install all Required packages using NPM.
```sh 
"npm install" 
```

3) After Installation . Run the nbelow command 
```sh
 nodemon src/app.js
 ```
 your server should start and terminal should say mongodb connected. 

4) open another terminal in client Folder and run below command ( it may take a while )
```sh
npm install
```
*****[Check the truffle-config.json , change the port number according to your ganache client port! ]****

5) in client terminal , Run Command - 
```sh
truffle compile
```
then
```sh
truffle test
```
check if all tests are passing , you can skip this step but its easier to know if there is anything wrong before migrating 

6) If all tests are passed , Run Command - 
```sh
truffle migrate --reset
```
then 
```sh
npm start
```
7) your client will start  and you can see the login page in the browser ( after logging in your metamask wallet)
 register yourself first - use anyone of the address from your ganache client. 
 
 ### Hopefully , you can see the UI Now  !! Congratulations! 




