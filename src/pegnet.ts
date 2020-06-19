import { JSONRPCClient, JSONRPCRequest, JSONRPCResponse } from "json-rpc-2.0";
import { FactomCli } from 'factom';
import fetch from 'node-fetch';

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
    pegnetd?: string;  // instance of pegnetd
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
export class Pegnet implements IPegnet{
  private pegnetd: string;
  private pegnetChain: string;
  private cli: FactomCli;

  constructor(config?: IConfig) {
    this.pegnetd = config?.pegnetd || "https://api.pegnetd.com";
    this.pegnetChain = config?.pegnetChain || "cffce0f409ebba4ed236d49d89c70e4bd1f1367d86402a3363366683265a242d";

    this.cli = new FactomCli({
        factomd: {
            host: config?.server || "localhost",
            port: config?.server ? 443 : 8088,
            protocol: config?.server ? 'https' : 'http'
        },
        walletd: {
            host: config?.wallet || 'localhost',
            user: config?.walletUser || "",
            password: config?.walletPass || ""
        }
    })
  }

  private client: JSONRPCClient = new JSONRPCClient(
    (jsonRPCRequest: JSONRPCRequest) =>
      fetch(this.pegnetd, {
        method: "POST",
        headers: {
          "content-type": "text/plain"
        },
        body: JSON.stringify(jsonRPCRequest)
      }).then(response => {
        if (response.status === 200) {
          return response.json().then((jsonRPCResponse: JSONRPCResponse) => this.client.receive(jsonRPCResponse));
        } else if (jsonRPCRequest.id !== undefined) {
          return Promise.reject(new Error(response.statusText));
        }
      })
  );

  public getSyncStatus = async () => {
    const method = 'get-sync-status';
    return await this.client.request(method);
  }

  public getTransaction = async (txid: string) => {
    const method = 'get-transaction';
    const params = { txid };
    return await this.client.request(method, params);
  };

  public getPegnetIssuance = async () => {
    const method = 'get-pegnet-issuance';
    return await this.client.request(method);
  };

  public getPegnetBalances = async (address: string) => {
    const method = 'get-pegnet-balances';
    const params = { address };
    return await this.client.request(method, params);
  };

  public getPegnetRates = async (height?: number) => {
    const method = 'get-pegnet-rates';
    const params = { height };
    return await this.client.request(method, params);
  };

  public getTransactionStatus = async (entryhash: string) => {
    const method = 'get-transaction-status';
    const params = { entryhash };
    return await this.client.request(method, params);
  };

  public getTransactions = async (params: IGetTransactions) => {
    if(! (params.entryHash || params.address || params.height)) {
      throw new Error(`You must specify an entryHeight, address, or height.`);
    }
    const method = 'get-transactions';
    return await this.client.request(method, params);
  };

  public getRichList = async (params: IGetRichList) => {
    const method = 'get-rich-list';
    return await this.client.request(method, params);
  };


  private validateInput = (input: ITransactionInput) => {
    if(!input || !input.address || !input.type || !input.amount) {
      throw new Error(`Transaction input invalid.`);
    }
  };

  public createTransfer = (request: ITransfer) => {
    if(!request) {
      throw new Error(`Invalid create transfer request`);
    }
    this.validateInput(request.input);
    if(!request || !request.transfers || request.transfers.length <= 0) {
      throw new Error(`Transfers must have at least one destination`);
    }
    const totalReceived = request.transfers.reduce((acc: number, { amount }) => {
      return(acc+amount);
    }, 0);

    if(totalReceived != request.input.amount) {
      throw new Error(`Destination amounts don't total to input amount`);
    }

    return(request);
  };

  public createConversion = (request: IConversion) => {
    if(!request) {
      throw new Error(`Invalid create conversion request`);
    }
    this.validateInput(request.input);

    if(!request.conversion){
      throw new Error(`Conversion token ticker must be specified`);
    }
    return(request);
  };

  public createBatch = (request: [IConversion | ITransfer]) => {
    if(!request || request.length < 1) {
      throw new Error(`Batches must have at least one transaction`);
    }
    return({
      version: 1,
      transactions: request
    });
  }
}
