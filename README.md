###Knowledge-Management-System using Blockchain 

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
  



