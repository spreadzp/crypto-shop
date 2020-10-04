import { Component, OnInit, DoCheck } from "@angular/core";
import { PayIdService } from "src/app/shared/services/pay-id.service";
// import { PayIdService } from "src/app/shared/services/pay-id.service";

@Component({
  selector: "app-balance",
  templateUrl: "./balance.component.html",
  styleUrls: ["./balance.component.scss"],
})
export class BalanceComponent implements OnInit {
  balance = null;
  //
  constructor(private payIdService: PayIdService) {}
  ngOnInit(): void {
    this.payIdService
      .getBalance()
      .then((bal) => (this.balance = bal.xrpBalance));
  }
}
