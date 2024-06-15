import { Injectable } from '@angular/core';
import { Web3Service } from '../blockchain/web3.service';
import { Poll, PollForm } from '../types';
import { fromAscii, toAscii } from 'web3-utils';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PollService {
  constructor(private web3: Web3Service) {}

  createPoll(poll: PollForm) {
    console.log(poll);
    const result =
    this.web3.executeTransaction(
      'createPoll',
      poll.question,
      poll.thumbnail || '',
      poll.options.map((opt) => fromAscii(opt))
    );
    console.log(result);
  }

  vote(pollId: number, voteNumber: number) {
    console.log(pollId, voteNumber);
    this.web3.executeTransaction('vote', pollId, voteNumber);
  }

  private normalizeVoter(voter: any[][]) {
    return {
      id: voter[0],
      votedIds: voter[1].map((vote) => parseInt(vote)),
    };
  }

  private normalizePoll(pollRaw: any, voter: any): Poll {
    return {
      id: parseInt(pollRaw[0]),
      question: pollRaw[1],
      thumbnail: pollRaw[2],
      results: pollRaw[3].map((vote: any) => parseInt(vote)),
      options: pollRaw[4].map((opt: any) =>
        toAscii(opt).replace(/\u0000/g, '')
      ),
      voted:
        voter.votedIds.length &&
        voter.votedIds.find(
          (votedId: any) => votedId === parseInt(pollRaw[0])
        ) != undefined,
    };
  }

  onEvent(name: string) {
    return this.web3.onEvents(name);
  }

  async getPolls(): Promise<Poll[]> {
    const polls: Poll[] = [];
    const totalPolls = await this.web3.call('getTotalPolls');
    const acc = await this.web3.getAccount();
    const voter = await this.web3.call('getVoter', acc);
    const voterNormalized = this.normalizeVoter(voter);

    for (let i = 0; i < totalPolls; i++) {
      const pollRaw = await this.web3.call('getPoll', i);
      const pollNormalized = this.normalizePoll(pollRaw, voterNormalized);
      polls.push(pollNormalized);
    }

    return polls;
  }

  /* getPolls(): Observable<Poll[]> {
    return of([
      {
        id: 1,
        question: 'Do you like dogs or cats?',
        thumbnail:
          'https://blockchain-poll.vsoft.be/images/Dog-and-cat.jpg',
        results: [0, 5, 7],
        options: ['Cats', 'Dogs', 'None'],
        voted: true,
      },
      {
        id: 2,
        question: 'Best month for summer holidays?',
        thumbnail:
          'https://blockchain-poll.vsoft.be/images/holiday.jpg',
        results: [1, 6, 4],
        options: ['June', 'July', 'August'],
        voted: false,
      },      
      {
        id: 3,
        question: 'Favourite hair colour?',
        thumbnail:
          'https://blockchain-poll.vsoft.be/images/hair-colors.jpg',
        results: [1, 6, 4],
        options: ['Black', 'Blond', 'Red'],
        voted: false,
      },
      {
        id: 4,
        question: 'Preferred breakfast?',
        thumbnail:
          'https://blockchain-poll.vsoft.be/images/breakfast.jpg',
        results: [1, 6, 4],
        options: ['English', 'Continental', 'Full Scottish'],
        voted: false,
      },
    ]).pipe(delay(2000));
  } */
}
