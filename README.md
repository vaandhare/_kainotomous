###Knowledge-Management-System using Blockchain 

Entities:
1) Deputy - Upload files 
2) Chief - Approve Files 
3) Chairman - Monitor Files

Features:
1) Upload files to IPFS
2) Approve Files 
3) List Files 

Prerequisites:
1) Geth
2) Ganache
3) Truffle
4) Node.js
5) Metamask
6) IPFS API@3.1.1

Steps:
1) Clone the repository 
2) Open the terminal in your project directory - "npm install" --- you will get a lot of warnings, just ignore - if any errors then try to solve or contact me. if you have time i would suggest doing. "npm-audit-fix"
3) open another terminal, and cd into client and do npm install.
4) change the truffle-config.js file - change the port number according to the port number of your ganache
5) Make sure you have imported all the accounts to metamask -refer this if you don't know how to - https://metamask.zendesk.com/hc/en-us/articles/360015489331-Importing-an-Account
6) Change the contract addresses in App.js and Navbar.js according to the addresses in your metamask wallet. (contact me if you don't understand.
7) if npm install has been completed, then :
8) open the terminal in your project directory - "rm -rf build" -- remove the build folder 
9) "truffle compile "
10) "truffle test" -- make sure all the tests are passing
11) "truffle migrate --reset"
12) npm run start - will show a lot of errors - try to solve or get back to me. 
13) login to your metamask and confirm, and you are done! You will see different UI for different addresses. 



