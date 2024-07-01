import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Web3 } from 'web3';
import { Contract } from 'web3-eth-contract';

// Localhost Ganache UI
// const contractAbi = require('./contractABI.json');

// Rinkeby
const contractAbi = require('./contractABI.json');

declare var window: any;

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  private isBusySource = new BehaviorSubject<boolean | null>(false);
  isBusy$ = this.isBusySource.asObservable();

  private web3 = new Web3(window.ethereum);
  private contract!: any;
  private contractAddress = '0xAd511E843EeEee5538be46C0a723b86fF4235df8';

  constructor(private zone: NgZone) {
    if (window.web3) {
      this.contract = new this.web3.eth.Contract(
        contractAbi,
        this.contractAddress
      );

      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .catch((err: any) => {
          // console.log(err);
          alert(err);
        });
    } else {
      alert(
        'Metamask not found. Install or enable Metamask. Be sure to run Sepolia test network'
      );
    }
  }

  setBusy(isBusy: boolean) {
    this.isBusySource.next(isBusy);
  }

  getBusy() {
    return this.isBusySource.value;
  }

  getAccount(): Promise<string> {
    return this.web3.eth.getAccounts().then((accounts) => accounts[0] || '');
  }

  async getOwner(): Promise<any> {
    const owner = await this.call('owner');

    return owner;
  }

  async ownerIsUser(): Promise<boolean> {
    const owner = await this.call('owner');
    const acc = await this.getAccount();

    if (owner == acc) {
      return true;
    } else {
      return false;
    }
  }

  // executeTransaction("vote", pollId, vote)
  // executeTransaction("createPoll", question, thumb, opt)
  async executeTransaction(fnName: string, ...args: any[]): Promise<void> {
    const acc = await this.getAccount();
    this.contract.methods[fnName](...args)
      .send({ from: acc })
      .on('transactionHash', (hash: any) => {
        console.log('Transaction hash', hash);
      });
  }

  async call(fnName: string, ...args: any[]) {
    const acc = await this.getAccount();
    return this.contract.methods[fnName](...args).call({ from: acc });
  }

  onEvents(event: string) {
    return new Observable((observer) => {
      this.contract.events[event]().on(
        'data',
        (data: { event: any; returnValues: any }) => {
          // THIS MUST RUN INSIDE ANGULAR ZONE AS IT'S LISTENING FOR 'ON'
          this.zone.run(() => {
            observer.next({
              event: data.event,
              payload: data.returnValues,
            });
          });
        }
      );
    });
  }
}
