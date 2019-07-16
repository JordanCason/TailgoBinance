import React, { Component } from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components'
import {BigNumber} from 'bignumber.js';
import { ABIs, testTokens } from '../../ethereum/data'
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/v3/b3f4e16768c240bd9e76f7c64e15aa84'));
//const web3 = new Web3('https://rinkeby.infura.io/v3/b3f4e16768c240bd9e76f7c64e15aa84')
const account = web3.eth.accounts.privateKeyToAccount('426BFFF3B8BCFBDB8B8289C92F3C8649AA7DEC10F95B706E079E4781D2654C3B');
const daiContract = new web3.eth.Contract(ABIs.dai, testTokens.DAI.contractAddress)
const cDAIcontract = new web3.eth.Contract(ABIs.cDAI, testTokens.cDAI.contractAddress)
const proxyContractAddress = '0x7f09ffd7e8995b63b9fd51075d8b7e6be6bf36a3'
const proxyContract = new web3.eth.Contract(ABIs.proxyContract, proxyContractAddress)
const userAddress = '0x8f16722fEB20dBb52ea6391EC74aE8D53003051c'

class Wallet extends Component {
  constructor (props) {
    super(props);
    this.state = {
      stakedDaiBalance: '',
      balance: 'none',
      balanceOf: 'none',
    }
    this.ownerDraw = this.ownerDraw.bind(this);
    this.approveContract = this.approveContract.bind(this);
    this.DAIEarned = this.DAIEarned.bind(this);
    this.subscribeToChain = this.subscribeToChain.bind(this);
    this.handleAmountInput = this.handleAmountInput.bind(this);
    this.getDaiStakeBalance = this.getDaiStakeBalance.bind(this);

  }

  componentDidMount() {
    this.getDaiStakeBalance()
    this.DAIEarned()
    this.getDaiBalance()
    this.subscribeToChain()
  }


  approveContract = () => {
    web3.eth.getTransactionCount(userAddress).then((txCount) => { // public address of sender
      const txObject = {
        nonce: web3.utils.toHex(txCount),
        to: testTokens.DAI.contractAddress,
        gasLimit: web3.utils.toHex(800000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
        data: daiContract.methods.approve(proxyContractAddress, // contract address to approve for spending of users tokens
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff").encodeABI() // amount contract is allowed to spend
      } //
      account.signTransaction(txObject, account.privateKey).then((signed) => {
          console.log(signed)
          web3.eth.sendSignedTransaction(signed.rawTransaction)
          .once('transactionHash', (hash) => { console.log(hash) })
          .once('receipt', (receipt) => { console.log(receipt) })
          .once('confirmation', (confNumber, receipt) => { console.log(receipt) })
          //.on('confirmation', (confNumber, receipt) => { console.log(confNumber) })
          .on('error', (error) => { console.log(error) })
          //.then((receipt) => {console.log(receipt)})
      })
    })
  }

  ownerDraw = () => {
    console.log('drawing owner interest')
    web3.eth.getTransactionCount(userAddress).then((txCount) => {
      const txObject = {
        nonce: web3.utils.toHex(txCount),
        to: proxyContractAddress,
        gasLimit: web3.utils.toHex(800000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
        data: proxyContract.methods.ownerDraw().encodeABI()
      }
      account.signTransaction(txObject, account.privateKey).then((signed) => {
          web3.eth.sendSignedTransaction(signed.rawTransaction)
          .once('confirmation', (confNumber, receipt) => {
            this.getDaiStakeBalance()
            console.log('confermed ownerDraw')
            console.log(receipt)

          })
          .on('error', (error) => { console.log(error) })
      })
    })
  }


  DAIEarned = () => {
    cDAIcontract.methods.balanceOfUnderlying(proxyContractAddress).call().then((result) => {
      proxyContract.methods.totalUsersStake().call().then((totalUsersStake) => {
        result = !result ? BigNumber(0) : result
        totalUsersStake = !totalUsersStake ? BigNumber(0) : totalUsersStake
        this.setState({
          DAIEarned: web3.utils.fromWei(BigNumber(result.toString()).minus(BigNumber(totalUsersStake.toString())).toString(), 'ether')
        })
      })
    })
  }

  getDaiBalance = () => {
    daiContract.methods.balanceOf(userAddress).call().then((result) => {
      result = !result ? BigNumber(0) : result
      this.setState({
        DAIBalance: web3.utils.fromWei(result.toString(), 'ether')
      })
    })
  }

  subscribeToChain = () => {
    const subscription = web3.eth.subscribe('newBlockHeaders');
    subscription.on('data', (block, error) => {
      this.DAIEarned()
    });
  }

  getDaiStakeBalance = () => {
    proxyContract.methods.DAIbalance(userAddress).call().then((result) => {
      this.setState({
        stakedDaiBalance: web3.utils.fromWei(result.toString(), 'ether')
      })
    })
  }

  addFundsToContract = () => {
    web3.eth.getTransactionCount(userAddress).then((txCount) => {
      const txObject = {
        nonce: web3.utils.toHex(txCount),
        to: proxyContractAddress,
        gasLimit: web3.utils.toHex(800000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
        data: proxyContract.methods.addFunds(web3.utils.toWei(this.state.StakeDaiAmount, 'ether')).encodeABI()
      }
      account.signTransaction(txObject, account.privateKey).then((signed) => {
          console.log(signed)
          web3.eth.sendSignedTransaction(signed.rawTransaction)
          .once('confirmation', (confNumber, receipt) => {
            this.getDaiStakeBalance()
            this.getDaiBalance()
          })
          .on('error', (error) => { console.log(error) })
      })
    })
  }


  withdrawFundsToContract = () => {
    web3.eth.getTransactionCount(userAddress).then((txCount) => {
      const txObject = {
        nonce: web3.utils.toHex(txCount),
        to: proxyContractAddress,
        gasLimit: web3.utils.toHex(800000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
        data: proxyContract.methods.removeFunds(web3.utils.toWei(this.state.withdrawDaiAmount, 'ether')).encodeABI()
      }
      account.signTransaction(txObject, account.privateKey).then((signed) => {
          console.log(signed)
          web3.eth.sendSignedTransaction(signed.rawTransaction)
          .once('confirmation', (confNumber, receipt) => {
            this.getDaiStakeBalance()
            this.getDaiBalance()
          })
          .on('error', (error) => { console.log(error) })
      })
    })
  }


  handleAmountInput = e => {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value
    })
  }


  render() {
    return (
      <WalletStyle>
        <br/>
        <a>Wallet Balance: {this.state.DAIBalance}</a><br/>
        <a>Total DAI Staked: {this.state.stakedDaiBalance}</a><br/>
        <br/>
        <a>Staked DAI:</a><br/>
        <input onChange={this.handleAmountInput} value={this.state.amount} name='StakeDaiAmount'/>
        <input onClick={this.addFundsToContract} type='button' value='Stake DAI'/><br/>
        <br/>
        <a>withdraw DAI:</a><br/>
        <input onChange={this.handleAmountInput} value={this.state.amount} name='withdrawDaiAmount'/>
        <input onClick={this.withdrawFundsToContract} type='button' value='Withdraw DAI'/><br/>
        <br/>
        <br/>
        <br/>
        <a>Debuging/Owner INFO</a>
        <br/>
        <div>
          <a>Interest Earned: {this.state.DAIEarned}</a><br/>
          <input onClick={this.ownerDraw} type='button' value='ownerDraw'/><br/>
          <input onClick={this.approveContract} type='button' value='approveContract'/><br/>
        </div>
      </WalletStyle>
    );
  }
}

const mapStateToProps = state => ({
})

const mapActionsToProps = {
}

export default connect(mapStateToProps, mapActionsToProps)(Wallet)

const WalletStyle = styled.div`
`



// sighnSendTransaction = () => {
//   web3.eth.getTransactionCount(userAddress).then((txCount) => {
//     const txObject = {
//       nonce: web3.utils.toHex(txCount),
//       to: testTokens.DAI.contractAddress,
//       gasLimit: web3.utils.toHex(800000),
//       gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
//       data: daiContract.methods.transfer('0x75d70AD2A551BaD5E6065faD59f92D584828082f', web3.utils.toWei('1', 'ether')).encodeABI()
//     }
//     account.signTransaction(txObject, account.privateKey).then((signed) => {
//         console.log(signed)
//         web3.eth.sendSignedTransaction(signed.rawTransaction)
//         .once('transactionHash', (hash) => { console.log(hash) })
//         .once('receipt', (receipt) => { console.log(receipt) })
//         .once('confirmation', (confNumber, receipt) => { console.log(receipt) })
//         .on('confirmation', (confNumber, receipt) => { console.log(confNumber) })
//         .on('error', (error) => { console.log(error) })
//         .then((receipt) => {console.log(receipt)})
//     })
//   })
// }
//
//
// sighnSendEth = () => {
//   console.log(account)
//   web3.eth.getTransactionCount(userAddress).then((txCount) => {
//     const txObject = {
//       nonce: web3.utils.toHex(txCount),
//       to: '0x75d70AD2A551BaD5E6065faD59f92D584828082f',
//       value: web3.utils.toHex(web3.utils.toWei('0.001', 'ether')),
//       gasLimit: web3.utils.toHex(21000),
//       gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
//
//     }
//     account.signTransaction(txObject, account.privateKey).then((signed) => {
//         console.log(signed)
//         web3.eth.sendSignedTransaction(signed.rawTransaction)
//         .once('transactionHash', (hash) => { console.log(hash) })
//         .once('receipt', (receipt) => { console.log(receipt) })
//         .once('confirmation', (confNumber, receipt) => { console.log(receipt) })
//         .on('confirmation', (confNumber, receipt) => { console.log(confNumber) })
//         .on('error', (error) => { console.log(error) })
//         .then((receipt) => {console.log(receipt)})
//     })
//   }).catch((err) => {
//     console.log(err)
//   })
// }
