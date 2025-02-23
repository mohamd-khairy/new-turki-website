import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';
import { MyAccountComponent } from './pages/my-account/my-account.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { MyFavoritesComponent } from './pages/my-favorites/my-favorites.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';



const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'products/list',
    component: ProductListComponent
  },
  {
    path: 'products/list/:cat_id',
    component: ProductListComponent
  },
  {
    path: 'products/cart',
    component: ShoppingCartComponent
  },
  {
    path: 'products/:id',
    component: ProductDetailComponent
  },
  {
    path: 'about-us',
    component: AboutUsComponent
  },
  {
    path: 'favorites',
    component: MyFavoritesComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'user/account',
    component: MyAccountComponent
  },
  { 
    path: '404',
    component: PagenotfoundComponent
  },
  { 
    path: '**', pathMatch: 'full', 
    component: PagenotfoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
