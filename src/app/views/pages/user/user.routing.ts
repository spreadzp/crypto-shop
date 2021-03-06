import { UserComponent } from "./user.component";
import { UserAccountComponent } from "./user-account/user-account.component";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "src/app/shared/services/auth_gaurd";
import { OrderComponent } from "./order/order.component";

export const UserRoutes: Routes = [
  {
    path: "",
    component: UserComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        component: UserAccountComponent,
        outlet: "profileOutlet",
      },
    ],
  },
  {
    path: "order",
    component: OrderComponent,
    canActivate: [AuthGuard],
  },
];
