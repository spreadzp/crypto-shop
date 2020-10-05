import {
  AngularFireList,
  AngularFireObject,
  AngularFireDatabase,
} from "@angular/fire/database";
import { Billing } from "./../models/billing";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class BillingService {
  billings: AngularFireList<Billing>;
  billing: AngularFireObject<Billing>;
  constructor(private db: AngularFireDatabase) {
    this.getBillings("billings");
  }

  createBillings(data: Billing) {
    this.billings.push(data);
  }

  getBillings(dbName: string) {
    this.billings = this.db.list(dbName);
    return this.billings;
  }

  getBillingById(key: string) {
    this.billing = this.db.object("products/" + key);
    return this.billing;
  }

  updateBilling(data: Billing) {
    this.billings.update(data.$key, data);
  }

  deleteBilling(key: string) {
    this.billings.remove(key);
  }
}
