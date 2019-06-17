import React, { Component } from "react";
import ipfs from './ipfs';
// import html2canvas from 'html2canvas';
import getWeb3, { getGanacheWeb3 } from "./utils/getWeb3";
// import Web3Info from "./components/Web3Info/index.js";
import Dashboard from "./components/Dashboard/index.js";
import Header from "./components/Header/index.js";
import Footer from "./components/Footer/index.js";
// import template from "./Templates/sample.jpg"
import { Loader } from 'rimble-ui';

import { zeppelinSolidityHotLoaderOptions } from '../config/webpack';

import styles from './App.module.scss';

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    route: window.location.pathname.replace("/","")
  };

  getGanacheAddresses = async () => {
    if (!this.ganacheProvider) {
      this.ganacheProvider = getGanacheWeb3();
    }
    if (this.ganacheProvider) {
      return await this.ganacheProvider.eth.getAccounts();
    }
    return [];
  }

  componentDidMount = async () => {
    const hotLoaderDisabled = zeppelinSolidityHotLoaderOptions.disabled;
    let CertificateToken = {};
    try {
      CertificateToken = require("../../contracts/CertificateToken.sol");
    } catch (e) {
      console.log(e);
    }
    try {
      const isProd = process.env.NODE_ENV === 'production';
      if (!isProd) {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
        const ganacheAccounts = await this.getGanacheAddresses();
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const networkType = await web3.eth.net.getNetworkType();
        const isMetaMask = web3.currentProvider.isMetaMask;
        let balance = accounts.length > 0 ? await web3.eth.getBalance(accounts[0]): web3.utils.toWei('0');
        balance = web3.utils.fromWei(balance, 'ether');
        let instance = null;
        let deployedNetwork = null;
        if (CertificateToken.networks) {
          deployedNetwork = CertificateToken.networks[networkId.toString()];
          if (deployedNetwork) {
            instance = new web3.eth.Contract(
              CertificateToken.abi,
              deployedNetwork && deployedNetwork.address,
            );
          }
        }
        if (instance) {
          // Set web3, accounts, and contract to the state
          this.setState({ web3, ganacheAccounts, accounts, balance, networkId, networkType,
                          hotLoaderDisabled, isMetaMask, contract: instance });
        }
        else {
          this.setState({ web3, ganacheAccounts, accounts, balance, networkId, networkType, hotLoaderDisabled, isMetaMask });
        }
      }
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  /*updateTemplate = async (event) => {
    here we update template with event data
    let canva = null;
    await html2canvas(document.body).then(function(canvas) {
        document.body.appendChild(canvas);
        console.log(canvas);
        canva = canvas;
    });
    await canva.toBlob(function(blob) {
   blob ready, download it
  console.log(blob);
  let reader = new window.FileReader();
    reader.readAsArrayBuffer(blob);
    setTimeout(function() {
      App.uploadCertificate(reader);
    },3000);
    reader.onloadend = () => 
  let link = document.createElement('a');
  link.download = 'example.png';
  
  link.href = URL.createObjectURL(blob);
  link.click();

   delete the internal blob reference, to let the browser clear memory from it
  URL.revokeObjectURL(link.href);
}, 'image/png');
    
  }

  uploadCertificate = async (reader) => {
    console.log(reader);
    const buffer = await Buffer.from(reader.result);
    console.log(buffer);
    await ipfs.add(buffer, {wrapWithDirectory: true}, (err, ipfsHash) => {
      console.log(err,ipfsHash);
      this.setState({
        URL: "https://ipfs.io/ipfs/" + ipfsHash[1].hash + "/sample.jpg",
      });
    })
  }*/



  handleSubmit = async (event) => {
    event.preventDefault();
    console.log(event);
    /*let imageURL = await this.updateTemplate(event);*/
    // console.log(this.state.URL);
    let parseData = {
      issueAddress: event.target.address.value,
      courseName: event.target.name.value,
      courseDescription: event.target.description.value,
      dateOfIssue: event.target.date.value,
      organizationName: event.target.organization.value
    };
    let jsonData = {
        "title": "Asset Metadata",
        "type": "object",
        "properties": {
            "Owner Address": {
                "type": "string",
                "description": parseData.issueAddress
            },
            "Course Name": {
              "type": "string",
              "description": parseData.courseName
            },
            "Course Description": {
                "type": "string",
                "description": parseData.courseDescription
            },
            "Date of issue": {
                "type": "string",
                "description": parseData.dateOfIssue
            },
            "Organization Name": {
                "type": "string",
                "description": parseData.organizationName
            },
            /*"image": {
                "type": "string",
                "description": this.state.URL
            }*/
        }
    }
    console.log(jsonData);
    await ipfs.add(Buffer.from(JSON.stringify(jsonData))).then(function(value) {
        console.log(value);
        this.createToken("https://ipfs.io/ipfs/" + value[0].hash, parseData);
      });
  }

   createToken = async (metaDataURL, attributes) => {
    console.log("success");
    const { accounts, contract, web3 } = this.state;
    await contract.methods.createCertificate()(web3.utils.asciiToHex(attributes.courseName),
                                               web3.utils.asciiToHex(attributes.courseDescription),
                                               web3.utils.asciiToHex(attributes.dateOfIssue),
                                               web3.utils.asciiToHex(attributes.organizationName),
                                               web3.utils.asciiToHex(attributes.issueAddress),
                                               metaDataURL).send({ from: accounts[0] });
    console.log("Token successfully created");
  }

  renderLoader() {
    return (
      <div className={styles.loader}>
        <Loader size="80px" color="red" />
        <h3> Loading Web3, accounts, and contract...</h3>
        <p> Unlock your metamask </p>
      </div>
    );
  }

  render() {
    if (!this.state.web3) {
      return this.renderLoader();
    }
    return (
      <div className={styles.App}>
        <Header />
        {/*<h1>Good to Go!</h1>
        <p>Zepkit has created your app.</p>
        <h2>See your web3 info below:</h2>
        <Web3Info {...this.state} />*/}
        <Dashboard handleSubmit={this.handleSubmit}/>
        <Footer />
      </div>
    );
  }
}

export default App;
