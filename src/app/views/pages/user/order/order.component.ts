import { Component, OnInit } from "@angular/core";
import { map } from "rxjs/operators";
import { User } from "src/app/shared/models/user";
import { AuthService } from "src/app/shared/services/auth.service";
import { ShippingService } from "src/app/shared/services/shipping.service";

@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.scss"],
})
export class OrderComponent implements OnInit {
  elements: any = [];

  headElements = [
    "address1",
    "address2",
    "country",
    "email",
    "firstName",
    "lastName",
    "products",
    "state",
    "totalPrice",
    "zip",
  ];
  user = {} as User;
  bills = null;
  constructor(
    private shippingService: ShippingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.bills = this.shippingService
      .getshippings()
      .valueChanges()
      .subscribe((db) => {
        this.elements = db;
      });
    this.authService.user$.pipe(
      map((currentUser: User) => {
        this.user = currentUser;
        this.elements = this.elements.filter(
          (item) => item.email === this.user.emailId
        );
      })
    );
  }
}
