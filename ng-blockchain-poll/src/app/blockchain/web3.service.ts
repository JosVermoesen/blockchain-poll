import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import Web3 from 'web3';
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
  private web3!: Web3;
  private contract!: Contract;

  // Görli
  private contractAddress = '0x3bf420dFb1b6E50d17aA7EdFBFe413e6f3695aD1';

  constructor(private zone: NgZone) {
    if (window.web3) {
      this.web3 = new Web3(window.ethereum);
      this.contract = new this.web3.eth.Contract(
        contractAbi,
        this.contractAddress
      );

      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .catch((err: any) => {
          console.log(err);
        });
    } else {
      console.warn('Metamask not found. Install or enable Metamask.');
    }
  }

  getAccount(): Promise<string> {
    return this.web3.eth.getAccounts().then((accounts) => accounts[0] || '');
  }

  // executeTransaction("vote", pollId, vote)
  // executeTransaction("createPoll", question, thumb, opt)
  async executeTransaction(fnName: string, ...args: any[]): Promise<void> {
    const acc = await this.getAccount();
    this.contract.methods[fnName](...args).send({ from: acc });
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
