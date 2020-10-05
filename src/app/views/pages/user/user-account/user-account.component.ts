import { Component, OnInit, AfterViewInit } from "@angular/core";
import { NgModel } from "@angular/forms";
import { CredentialXrp } from "src/app/shared/models/credential.interface";
import { User } from "src/app/shared/models/user";
import { AuthService } from "src/app/shared/services/auth.service";
import { PayIdService } from "src/app/shared/services/pay-id.service";

@Component({
  selector: "app-user-account",
  templateUrl: "./user-account.component.html",
  styleUrls: ["./user-account.component.scss"],
})
export class UserAccountComponent implements OnInit {
  // Enable Update Button
  showBalance = false;
  balance = null;
  credential: CredentialXrp;
  addressWallet = "";
  passwordWallet = "";
  constructor(
    public authService: AuthService,
    private payIdService: PayIdService
  ) {}

  ngOnInit(): void {
    this.credential = this.payIdService.getCredential();
    this.addressWallet = this.credential.address ?? "";
    this.passwordWallet = this.credential.key ?? "";
    this.payIdService
      .getBalance(this.addressWallet)
      .then((balance) => (this.balance = balance.xrpBalance));
  }

  setCredential(addressXrp: string, keyXrp: string) {
    const userXrpData = {
      address: addressXrp,
      key: keyXrp,
    };
    console.log(
      "UserAccountComponent -> setCredential -> userXrpData",
      userXrpData
    );

    this.payIdService.setCredential(userXrpData);
  }
}
