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
    this.web3.executeTransaction(
      'createPoll',
      poll.question,
      poll.thumbnail || '',
      poll.options.map((opt) => fromAscii(opt))
    );
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
          'https://img1.thelist.com/img/gallery/dogs-vs-cats-survey-reveals-which-pet-the-majority-of-people-prefer/intro-1608217241.jpg',
        results: [0, 5, 7],
        options: ['Cats', 'Dogs', 'None'],
        voted: true,
      },
      {
        id: 2,
        question: 'Best month for summer holidays?',
        thumbnail:
          'https://www.premier-travel.co.uk/__data/assets/image/0003/570378/Summer-Sun.jpg',
        results: [1, 6, 4],
        options: ['June', 'July', 'August'],
        voted: false,
      },
      {
        id: 3,
        question: 'Best life insurance company in Belgium?',
        thumbnail:
          'https://writingviews.com/wp-content/uploads/2020/07/lifeinsurance.jpg',
        results: [1, 6, 4],
        options: ['Patronale Life', 'Athora', 'Vivium'],
        voted: false,
      },
      {
        id: 4,
        question: 'Your prefered breakfast?',
        thumbnail:
          'https://themodemag.com/wp-content/uploads/2020/02/english-breakfast-fried-eggs-sausages-bacon.jpg',
        results: [1, 6, 4],
        options: ['English', 'Continental', 'Full Scottish'],
        voted: false,
      },
      {
        id: 5,
        question: 'Your favourit hair colour?',
        thumbnail:
          'https://www.byrdie.com/thmb/WToJxf6ubncHuvU4Hg9_HhY9LVM=/938x794/filters:fill(auto,1)/ScreenShot2020-05-15at3.45.49PM-6fa8cb8dbe314270b58a3a04f0cce8d4.png',
        results: [1, 6, 4],
        options: ['Black', 'Blond', 'Red'],
        voted: false,
      },
    ]).pipe(delay(2000));
  } */
}
