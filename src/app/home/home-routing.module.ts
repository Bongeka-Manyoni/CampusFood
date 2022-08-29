import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'shop',
        loadChildren: () => import('../pages/shop/shop.module').then( m => m.ShopPageModule)
      },
      {
        path: 'my-profile',
        loadChildren: () => import('../pages/my-profile/my-profile.module').then( m => m.MyProfilePageModule)
      },
      {
        path: 'order',
        loadChildren: () => import('../pages/order/order.module').then( m => m.OrderPageModule)
      },
      {
        path: 'my-cart',
        loadChildren: () => import('../pages/my-cart/my-cart.module').then(m => m.MyCartPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
