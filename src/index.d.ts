declare module 'pegnet' {

  export interface IPegnet {
    getSyncStatus(): Promise<ISyncStatus>;
    getTransaction(txn: string): Promise<ITransaction>;
    getPegnetIssuance(): Promise<IIssuance>;
    getPegnetBalances(address: string): Promise<IBalances>;
    getPegnetRates(height?: number): Promise<IRates>;
    getTransactionStatus(entryHash: string): Promise<ITransactionStatus>;
    getTransactions(req: IGetTransactions): Promise<IGetTransactions>;
    getRichList(req: IGetRichList): Promise<[IRichList]>;

    createTransfer(req: ITransfer): ITransfer;
    createConversion(req: IConversion): IConversion;
    createBatch(req: [IConversion | ITransfer]) : IBatch;
  }
  export interface IConfig {
    pegnetd: string;  // instance of pegnetd
    server?: string;  // instance of factom
    wallet?: string;  // instance of factom-wallet
    walletUser?: string;  // wallet username
    walletPass?: string;  // wallet password
    pegnetChain?: string;  // hash of pegnet chain on factom
  }

  export interface ITransaction {
    actions: [IAction];
    count: number;
    nextoffset: number;
  }
  
  export interface IAction {
    hash: string;
    txid: string;
    height: number;
    timestamp: Date;
    executed: number;
    txindex: number;
    txaction: number;
    fromaddress: string;
    fromasset: string;
    fromamount: number;
    toasset?: string;
    toamount?: number;
    outputs?: [{
      address: string;
      amount: number;
    }]
  }
  export interface ISyncStatus {
    syncheight: number,
    factomheight: number,
  }

  export interface IIssuance {
    synchstatus: ISyncStatus;
    issuance: {
      [key: string]: number;
    }
  }

  export interface IBalances {
    [key: string]: number;
  }

  export interface IRates {
    [key: string]: number;
  }

  export interface ITransactionStatus {
    height: number;
    executed: number;
  }

  export interface IGetTransactions {
    entryHash?: string;
    address?: string;
    height?: number;
    offset?: number;
    desc?: boolean;
    transfer?: boolean;
    conversion?: boolean;
    coinbase?: boolean;
    burn?: boolean;
  }
  
  export interface ITransactions{
    actions?: [ IAction ];
    count: number;
    nextOffset: number;
  }

  export interface IGetRichList {
    asset?: string;
    count: number;
  }

  export interface IRichList {
    address: string;
    amount: number;
    pusd: number;
  }

  export interface ITransactionInput {
    address: string;
    type:  string;
    amount: number;
  }

  export interface ITransfer {
    input: ITransactionInput;
    transfers: [{
          address: string,
          amount: number;
    }];
    metadata?: {};
  }

  export interface IConversion {
    input: ITransactionInput;
    conversion: string;
    metadata?: {};
  }

  export interface IBatch {
    version: number;
    transactions: [ITransfer | IConversion];
  }
}
