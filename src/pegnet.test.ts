import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Pegnet } from './pegnet';
import { ISyncStatus, ITransaction, IIssuance, IBalances, IRates, ITransactions, ITransactionStatus } from 'pegnet';

const config = {
  pegnetd: 'https://api.pegnetd.com',
  pegnetChain: 'cffce0f409ebba4ed236d49d89c70e4bd1f1367d86402a3363366683265a242d',
};

const pegnet = new Pegnet(config);

describe('Getters', () => {
  describe('#getSyncStatus()', () => {
    let response: ISyncStatus;
    before(async () => {
       response = await pegnet.getSyncStatus();
    });
    it('should get syncheight', () => {
      expect(response, 'status[syncheight]').to.have.property('syncheight');
    });
    it('should get factomheight', () => {
      expect(response, 'status[factomheight]').to.have.property('factomheight');
    });
  });
  

  describe('#getTransaction()', () => {
    const txn = '00-c99dedea0e4e0c40118fe7e4d515b23cc0489269c8cef187b4f15a4ccbd880be';
    let response: ITransaction;
    before(async () => {
      response = await pegnet.getTransaction(txn);
    });
    it('should have a count equal to 1', () => {
      expect(response, 'transaction[count]').to.have.property('count');
      expect(response.count, 'transaction[count]').to.equal(1);
    });
    it('should have an actions array of length 1', () => {
      expect(response, 'transaction[actions]').to.have.property('actions');
      expect(response.actions, 'transaction[actions]').to.have.length(1);
     });
  });

  describe('#getPegnetIssuance()', () => {
    let response: IIssuance;
    before(async () => {
      response = await pegnet.getPegnetIssuance();
    });

    it('should have syncstatus and issuance',  () => {
      expect(response, 'issuance[syncstatus]').to.have.property('syncstatus');
      expect(response, 'issuance[issuance]').to.have.property('issuance');
    });
    it('issuance should at least have PEG and its issued amount',  () => {
      expect(response.issuance, 'issuance[PEG]').to.have.property('PEG');
      expect(response.issuance.PEG).to.be.a('number');
    });
  });

  describe('#getPegnetBalances()', () => {
    let response: IBalances;
    before(async () => {
      response = await pegnet.getPegnetBalances('FA28MV2VvvsdjjgXoHwsadtMWqM5mt7bZU3hMjLuDLLN1DBhK48g');
    });
    
    it('should have a PEG balance', () => {
      expect(response, 'balances').to.have.property('PEG');
      expect(response.PEG, 'balances[PEG]').to.be.a('number');
    });
  });

  describe('#getPegnetRates()', () => {
    let response: IRates;
    before(async () => {
      response = await pegnet.getPegnetRates();
    });

    it('should have a rate for PEG',  () => {
      expect(response, 'balances').to.have.property('PEG');
      expect(response.PEG, 'balances[PEG]').to.be.a('number');
    });
  });

  describe('#getTransactionStatus()', () => {
    const txn = 'a33d4f334a2658c17d3f44158af75f1c32cc6b2f3de9ddc337064c93043d8db0';
    let response: ITransactionStatus;
    before(async () => {
      response = await pegnet.getTransactionStatus(txn);
    });

    it('should have a proper height',  () => {
      expect(response, 'status[height]').to.have.property('height');
      expect(response.height, 'status[height]').to.be.a('number');
    });
    it('should have a proper executed',  () => {
      expect(response, 'status[executed]').to.have.property('executed');
      expect(response.executed, 'status[executed]').to.be.a('number');
    });
  });

  describe('#getTransactions()', () => {
    it('should get transactions, given an entryHash',  async () => {
      const entryHash = 'a33d4f334a2658c17d3f44158af75f1c32cc6b2f3de9ddc337064c93043d8db0';
      const response = await pegnet.getTransactions({entryHash});
      expect(response, 'transactions[entryHash]').to.have.property('actions');
      expect(response, 'transactions[entryHash]').to.have.property('count');
      expect(response.actions).to.have.lengthOf.at.most(50);
    });
    it('should get transactions, given an address',  async () => {
      const address = 'FA28MV2VvvsdjjgXoHwsadtMWqM5mt7bZU3hMjLuDLLN1DBhK48g';
      const response = await pegnet.getTransactions({address});
      expect(response, 'transactions[entryHash]').to.have.property('actions');
      expect(response, 'transactions[entryHash]').to.have.property('count');
      expect(response.actions).to.have.lengthOf.at.most(50);
    });
    it('should get transactions, given a height',  async () => {
      const height = 213000;
      const response = await pegnet.getTransactions({height});
      expect(response, 'transactions[entryHash]').to.have.property('actions');
      expect(response, 'transactions[entryHash]').to.have.property('count');
      expect(response.actions).to.have.lengthOf.at.most(50);
    });
  });

});