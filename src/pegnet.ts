import { JSONRPCClient, JSONRPCRequest, JSONRPCResponse } from "json-rpc-2.0";
import { IPegnet, IConfig, IGetTransactions, ITransaction, IGetRichList, ITransfer, IConversion, ITransactionInput } from 'pegnet';
import { FactomCli } from 'factom';
import fetch from 'node-fetch';

export class Pegnet implements IPegnet{
  private pegnetd: string;
  private pegnetChain: string;
  private cli: FactomCli;

  constructor(config: IConfig) {
    this.pegnetd = config.pegnetd || "https://api.pegnetd.com";
    this.pegnetChain = config.pegnetChain || "cffce0f409ebba4ed236d49d89c70e4bd1f1367d86402a3363366683265a242d";

    this.cli = new FactomCli({
        factomd: {
            host: config.server || "localhost",
            port: config.server ? 443 : 8088,
            protocol: config.server ? 'https' : 'http'
        },
        walletd: {
            host: config.wallet || 'localhost',
            user: config.walletUser || "",
            password: config.walletPass || ""
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
      throw new Error(`Batches must have at least one transation`);
    }
    return({
      version: 1,
      transactions: request
    });
  }
}
