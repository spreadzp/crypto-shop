import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from "./toastr.service";
import { CredentialXrp } from "../models/credential.interface";
const RippleAPI = require("ripple-lib").RippleAPI;

@Injectable({
  providedIn: "root",
})
export class PayIdService {
  api = null;
  grpcUrl = null;
  ilpClient = null;
  xrpClient = null;
  payIdClient = null;
  ownerAddress = "rJbWARGgCEwHcMn2vKqo4ho76AtzzPGC7X";
  constructor(
    private httpClient: HttpClient,
    private toastrService: ToastrService
  ) {
    this.api = new RippleAPI({
      server: "wss://s.altnet.rippletest.net:51233", // Public rippled server
    });
  }

  getSellerAddress() {
    return this.ownerAddress;
  }

  getBalance(address: string) {
    return this.api.connect().then(() => {
      // console.log("getting account info for", this.ownerAddress);
      return this.api.getAccountInfo(address);
    });
  }

  getPaymentHistory(address: string) {
    return this.api.connect().then(() => {
      // console.log("getting account info for", this.ownerAddress);
      return this.api.getPaymentHistory(address);
    });
  }

  async doPayment(sum: number, senderAddress: string, secret: string) {
    // this.api = new RippleAPI({
    //   server: "wss://s.altnet.rippletest.net:51233" // Public rippled server
    // });
    return this.api
      .connect()
      .then(() => {
        return this.doPrepare(senderAddress, sum);
      })
      .then((tx) => {
        console.log(tx);

        return this.sign(tx, secret);

        /* end custom code -------------------------------------- */
      })
      .then((txBlob) => {
        return this.doSubmit(txBlob);
      })
      .catch(console.error);
  }

  async doPrepare(sender: string, sum: number) {
    const preparedTx = await this.api.prepareTransaction(
      {
        TransactionType: "Payment",
        Account: sender,
        Amount: await this.api.xrpToDrops(sum),
        Destination: this.getSellerAddress(),
      },
      {
        // Expire this transaction if it doesn"t execute within ~5 minutes:
        maxLedgerVersionOffset: 75,
      }
    );
    console.log("preparedTx :>> ", preparedTx);
    // const maxLedgerVersion = preparedTx.instructions.maxLedgerVersion;
    // console.log("Prepared transaction instructions:", preparedTx.txJSON);
    // console.log("Transaction cost:", preparedTx.instructions.fee, "XRP");
    // console.log("Transaction expires after ledger:", maxLedgerVersion);
    return preparedTx.txJSON;
  }

  async sign(tx: string, secret: string) {
    console.log("@@@@@tx :>> ", tx);
    const response = await this.api.sign(tx, secret);
    const txID = response.id;
    console.log("Identifying hash:", txID);
    const txBlob = response.signedTransaction;
    console.log("Signed blob:", txBlob);
    return txBlob;
  }

  // use txBlob from the previous example
  async doSubmit(txBlob) {
    console.log("PayIdService -> doSubmit -> txBlob", txBlob);
    const latestLedgerVersion = await this.api.getLedgerVersion();

    const result = this.api.submit(txBlob);
    console.log("PayIdService -> doSubmit -> result", result);

    // console.log("Tentative result code:", result.resultCode);
    // console.log("Tentative result message:", result.resultMessage);

    // Return the earliest ledger index this transaction could appear in
    // as a result of this submission, which is the first one after the
    // validated ledger at time of submission.
    return latestLedgerVersion + 1;
  }

  setCredential(credential: CredentialXrp) {
    // console.log("credential :>> ", credential);
    localStorage.setItem("credential", JSON.stringify(credential));
    this.toastrService.wait("Adding Credential", "Adding Credential");
  }

  getCredential(): CredentialXrp {
    const credential: CredentialXrp =
      JSON.parse(localStorage.getItem("credential")) || ({} as Credential);
    return credential;
  }
}
