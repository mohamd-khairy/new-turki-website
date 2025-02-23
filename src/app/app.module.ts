import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { NguCarouselModule } from '@ngu/carousel';
import { AppComponent } from './app.component';
import { NZ_I18N, ar_EG } from 'ng-zorro-antd/i18n';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzCarouselModule  } from 'ng-zorro-antd/carousel';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { registerLocaleData } from '@angular/common';
import ar from '@angular/common/locales/ar';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AppInitializerProvider } from './app-initializer.service';
import { IconsProviderModule } from './icons-provider.module';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { BidiModule } from '@angular/cdk/bidi';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageModule } from 'ng-zorro-antd/message';


// pages
import { HomeComponent } from './pages/home/home.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';
import { MyAccountComponent } from './pages/my-account/my-account.component';
import { MyFavoritesComponent } from './pages/my-favorites/my-favorites.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import * as firebase from 'firebase/app';
import { getAnalytics } from "firebase/analytics";



// import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { SwiperModule } from 'swiper/angular';


const firebaseConfig = {
  apiKey: "AIzaSyBOGyoZ9-JbFlXWCrBGBkvKoKR9iTcwrg4",
  authDomain: "turkieshop-c8917.firebaseapp.com",
  databaseURL: "https://turkieshop-c8917.firebaseio.com",
  projectId: "turkieshop-c8917",
  storageBucket: "turkieshop-c8917.appspot.com",
  messagingSenderId: "565100833915",
  appId: "1:565100833915:web:e08b51b0a5cb6a893d06de",
  measurementId: "G-WXZLTGRTH5"
};


const app = firebase.initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// fbana.initializeAnalyti;


registerLocaleData(ar);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PagenotfoundComponent,
    ProductListComponent,
    ProductDetailComponent,
    ShoppingCartComponent,
    MyAccountComponent,
    MyFavoritesComponent,
    PrivacyPolicyComponent,
    AboutUsComponent,
  ],
  imports: [
    // AngularFireAnalyticsModule,
    SwiperModule,
    ScrollingModule,
    BrowserModule,
    AppRoutingModule,
    NzMessageModule,
    FormsModule,
    HttpClientModule,
    NzLayoutModule,
    NzMenuModule,
    BidiModule,
    NzSpaceModule,
    NzListModule,
    NzRateModule,
    NzTagModule,
    NzCheckboxModule,
    NzDropDownModule,
    NzSliderModule,
    NzTabsModule,
    NzSelectModule,
    CdkAccordionModule,
    NzBreadCrumbModule,
    NzPaginationModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzModalModule,
    NguCarouselModule,
    NzCarouselModule,
    NzButtonModule,
    NzGridModule,
    NzInputModule,
  ],
  providers: [AppInitializerProvider,  { provide: NZ_I18N, useValue: ar_EG }, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }
