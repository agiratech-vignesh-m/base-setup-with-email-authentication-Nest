import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BrowserProvider, JsonRpcProvider, Wallet, ethers } from 'ethers'; // Import ethers library and Contract class
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { IWeb3PublicTransfer } from 'src/utils/interface.utils';

const tokenPath = './abi/token.json';
console.log('tokenPath', tokenPath);
@Injectable()
export class Web3Service {
  private readonly tokenContractAddress: string;
  // private readonly registrationContractAddress: string;

  constructor(private readonly configService: ConfigService) {
    const contractConfig = this.configService.get('contract');
    this.tokenContractAddress = contractConfig.token;
  }

  async initiateTokenContract(): Promise<any> {
    try {
      // Load ABI
      const tokenPath = path.join(__dirname, 'abi', 'token.json');
      const tokenAbi = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));

      // Initialize contract
      const web3 = this.configService.get('web3');
      const provider = new JsonRpcProvider(web3.provider);
      const tokenContract = new ethers.Contract(
        this.tokenContractAddress,
        tokenAbi,
        provider,
      );

      // Create the signer to interact with contract
      const wallet = new ethers.Wallet(web3.private_key);
      const walletSigner = wallet.connect(provider);
      const tokenSigner = tokenContract.connect(walletSigner);
      
      return { tokenContract, tokenSigner, provider };
    } catch (error) {
      console.error('Error initializing token contract:', error);
      throw new Error(error?.message);
    }
  }

  async publicTransfer({
    wallet_address,
    amount
  }: IWeb3PublicTransfer): Promise<any> {
    const { tokenContract, tokenSigner, provider } =
      await this.initiateTokenContract();
    try {
      // Create coupon web3 method
      const order = await tokenSigner.publicTransfer(
        wallet_address,
        amount,
        {
          gasLimit: ethers.toBeHex(1000000),
        },
      );
      // Waiting for transaction 
      const receipt = await provider.waitForTransaction(order.hash);
      console.log('status', receipt.status);

      // Validating the status
      if (receipt.status === 1) {
        return receipt;
      }

      // getting the transaction details 
      const tx = await provider.getTransaction(order.hash);
      console.log('getTx', tx);

      // We need to pass the Tx details to call function and it will fetch the error data and throw it to catch
      await provider.call(
        {
          to: tx.to,
          from: tx.from,
          nonce: tx.nonce,
          gasLimit: tx.gasLimit,
          gasPrice: tx.gasPrice,
          data: tx.data,
          value: tx.value,
          chainId: tx.chainId,
          type: tx.type ?? undefined,
          accessList: tx.accessList,
        },
        tx.blockNumber,
      );
    } catch (error) {
      console.log('err-err', error);
      // Capture the error from provider.call and decoding it
      if (error && error.data) {
        const decodedError = tokenContract.interface.parseError(error.data);
        const message = `Transaction failed: ${decodedError?.args[0]}`;
        throw new HttpException(message, HttpStatus.UNPROCESSABLE_ENTITY);
      } else {
        console.log(`Error in widthrawContract:`, error);
        throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
  }
}
