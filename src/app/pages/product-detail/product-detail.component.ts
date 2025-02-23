import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { threadId } from 'worker_threads';
import { ApiService } from '../../api.service';

import { getAnalytics, logEvent } from "firebase/analytics";


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.less']
})
export class ProductDetailComponent implements OnInit {

  scrollItems: any[] = [];
  product: any;

  isRas: boolean = false;
  isKarashah: boolean = false;
  isKwar3: boolean = false;
  isLyh: boolean = false;
  itemQty: number = 1;
  isShalwata: boolean = false;
  //
  selectedSize: any;
  selectedCut: any;
  selectedPrepare: any;

  //
  lat: any = 24.7197986;
  lng: any = 47.2684408;

  // user
  public access_token: any;
  public user: any;
  public addresses: any = [];
  public orders: any = [];
  public sacSelectedDay;

  public cart_products: any = [];


  // address
  public address_note: any;
  // public address_text_location: any = "";
  // public address_search_txt: any = "";
  // public last_address_search_txt: any = "";
  public country_iso_code: any = "";

  public isLoggedIn: boolean = false;

  public analytics;


  constructor(private activeRoute: ActivatedRoute, private apiService: ApiService, private router: Router) {
    let loginStatus =  window.localStorage.getItem('is_logged_in');
    let user =  window.localStorage.getItem('user');

    if(user) {
      this.access_token =  this.getAccessToken(user);
    }


    if(loginStatus != null && user != null) {
        user = JSON.parse(user);

        this.isLoggedIn = true;
        this.loadUserData(user);
        // this.loadUserAddresses();
        // this.setCurrentPosition();

    }

    this.analytics = getAnalytics();
  }


  authenticateUser () {
    let loginStatus =  window.localStorage.getItem('is_logged_in');
    let user =  window.localStorage.getItem('user');

    if(user) {
      this.access_token =  this.getAccessToken(user);
    }


    if(loginStatus != null && user != null) {
        user = JSON.parse(user);

        this.isLoggedIn = true;
        this.loadUserData(user);
        // this.loadUserAddresses();
        // this.setCurrentPosition();

        return true;
    }

    return false;
  } // end of authenticateUser


   options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: Infinity
   };

   success = (pos: any) => {
    var crd = pos.coords;



    let geocoder = new google.maps.Geocoder();

    var request = {
      location: {lat: crd.latitude, lng: crd.longitude}
    };

    geocoder.geocode(request, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {

        // this.address_text_location = results[0].formatted_address;

        let country = results[0].address_components.filter((address) => address.types.includes('country'));

        if(country.length) {
          this.country_iso_code = country[0].short_name;
        }else {
          this.country_iso_code = "SA";
        }

        // this.loadMostOrdered();
        // this.loadCategories(this.country_iso_code, this.lat, this.lng);
        this.lat = crd.latitude;
        this.lng = crd.longitude;

        this.loadProduct(this.activeRoute.snapshot.params['id'], crd.latitude, crd.longitude, this.country_iso_code);

        window.localStorage.setItem('user_location:latitude', `${crd.latitude}`);
        window.localStorage.setItem('user_location:longitude', `${crd.longitude}`);
        window.localStorage.setItem('user_location:iso_code', `${this.country_iso_code}`);

        // this.loadFavorites();
        this.loadCartProducts();

      }
    });

    // this.loadProduct(this.activeRoute.snapshot.params['id'], crd.latitude, crd.longitude);
  }

  error = (err: any) => {
    // alert(`ERROR(${err.code}): ${err.message}`);
    // alert('يمكنك تفعيل');
    return false;
  }

  private loadCartProducts() {

    this.apiService.getUserShoppingCart(this.lat, this.lng, this.country_iso_code, this.access_token).subscribe((res) => {

        this.cart_products = res['data']['cart']['data'];

    });
  } // end of loadCartProducts

  //
  ngOnInit(): void {

    if(/^[a-zA-Z]+$/.test(this.activeRoute.snapshot.params['id'])) {
      this.router.navigateByUrl('products/list');
      return;
    }


    this.lat = window.localStorage.getItem('user_location:latitude');
    this.lng = window.localStorage.getItem('user_location:longitude');
    this.country_iso_code = window.localStorage.getItem('user_location:iso_code');


    if(this.lat && this.lng && this.country_iso_code) {
      // loadCategories
      // this.loadMostOrdered();
      // this.loadCategories(this.country_iso_code, this.lat, this.lng);
      this.activeRoute.params.subscribe((params) => {
        if(params.id) {
            // if(this.bup_categories.length) {
            // } else {
            // }
            this.loadProduct(params.id, this.lat, this.lng, this.country_iso_code);
            this.loadCartProducts();
        } else {
            this.loadProduct(params.id, this.lat, this.lng, this.country_iso_code);
            this.loadCartProducts();
        }
      });


    } else {
      navigator.geolocation.getCurrentPosition(this.success, this.error, this.options);
    }

    // navigator.permissions.query({name:'geolocation'}).then((result) => {
    //   if(result.state == 'granted' || result.state == 'prompt') {
    //     navigator.geolocation.getCurrentPosition(this.success, this.error, this.options);
    //   } else {
    //     alert('يتطلب تفعيل خدمة الوصول للموقع للإستفادة من الخدمة');
    //   }
    // });
  }


  // private setCurrentPosition() {
  //   // if ('geolocation' in navigator) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       this.lat = position.coords.latitude;
  //       this.lng = position.coords.longitude;
  //       this.geoCodeLatLng();

  //     });
  //   // }
  // } // end of setCurrentPosition

  // geoCodeLatLng() {
  //   let geocoder = new google.maps.Geocoder();

  //   var request = {
  //     location: {lat: this.lat, lng: this.lng}
  //   };

  //     geocoder.geocode(request, (results, status) => {
  //       if (status === google.maps.GeocoderStatus.OK) {

  //         let country = results[0].address_components.filter((address) => address.types.includes('country'));

  //         if(country.length) {
  //           this.country_iso_code = country[0].short_name;
  //         }else {
  //           this.country_iso_code = "";
  //         }
  //
  //       }
  //     });
  // } // end of geoCodeLatLng


  loadProduct(productId: number, latitude: any, longitude: any, iso_code: any) {
    this.product = null;
    this.sacSelectedDay = null;

    this.apiService.getProduct(productId, iso_code, latitude, longitude).subscribe((res: any) => {


        if(res['code'] == "200") {
          this.product = res['data'];

          this.product.price = parseFloat(this.product.price.toString());
          this.product['sale_price'] = parseFloat(this.product['sale_price'].toString());
          this.loadSimiProducts(this.product.sub_category, latitude, longitude);


          logEvent(this.analytics, 'product_detail_web', {
            product_id: this.product.id
          });
        }
    }, (err) => {
      this.router.navigateByUrl('404');
      return;
    });
  } // end of loadProduct


  selectSacDay(day) {
    this.selectedCut = null;
    this.selectedPrepare = null;

    this.sacSelectedDay = day;
  }



  loadSimiProducts(category: any, latitude: any, longitude: any) {
    // load similar products here
    // this.scrollItems = [1,2,3];
    this.apiService.getCatProducts(this.country_iso_code, latitude, longitude, category.category_id).subscribe((res: any) =>
    {

      let similarProducts = res['data'].filter((categ: any) => categ.id == category.id);
      // this.scrollItems = similarProducts;
      if(similarProducts.length) {
        this.scrollItems = similarProducts[0].products.filter((prod: any) => this.product.id != prod.id);
      }


    })
  } // loadSimiProducts


  addToCart(product: any) {

    if(this.authenticateUser()) {

      if(this.access_token) {

        if(this.product.sizes.length && !this.selectedSize) {
          alert("يجب تحديد حجم المنتج");
          return;
        }

        if(this.product.cuts.length && !this.selectedCut) {
          alert("يجب تحديد نوع التقطيع");
          return;
        }

        if(this.product.preparations.length && !this.selectedPrepare) {
          alert("يجب تحديد نوع التجهيز");
          return;
        }

        if(product.sub_category.category_id == 34) {
          let sac_products = this.cart_products.filter((prod) => prod.product.category_id == 34);
          let nonsac_products = this.cart_products.filter((prod) => prod.product.category_id != 34);



          if(nonsac_products.length > 0) {
            alert("لا يمكن إضافة منتج من  قسم الأضاحي مع منتجات من أقسام أخرى داخل عربة التسوق");
            return;
          }

        } else {
          let sac_products = this.cart_products.filter((prod) => prod.product.category_id == 34);
          let nonsac_products = this.cart_products.filter((prod) => prod.product.category_id != 34);

          if(sac_products.length > 0) {
            alert(" لايمكن إضافة هذا المنتج  لوجود منتجات من قسم الأضاحي داخل عربة التسوق");
            return;
          }
        }

        let reqData = {
          product_id: product.id,
          quantity: this.itemQty,
          is_shalwata: this.isShalwata ? 1 : 0,
          preparation_id: this.selectedPrepare ? this.selectedPrepare : null,
          size_id: this.selectedSize ? this.selectedSize : null,
          cut_id: this.selectedCut ? this.selectedCut : null,
          is_kwar3: this.isKwar3 ? 1 : 0,
          is_Ras: this.isRas ? 1 : 0,
          is_lyh: this.isLyh ? 1 : 0,
          is_karashah: this.isKarashah ? 1 : 0,
          comment: ""
        };


        this.apiService.addItemToCart(reqData, this.lat, this.lng, this.country_iso_code, this.access_token).subscribe((res: any) => {


          const addToCartEvent = new CustomEvent("add_item_to_cart_evt", {
            detail: {},
            bubbles: true,
            cancelable: true,
            composed: false,
          });

          window.dispatchEvent(addToCartEvent);

          alert("تم إضافة المنتج إلى عربة التسوق");

          logEvent(this.analytics, 'add_to_cart_web', {
            product_id: this.product.id
          });
        });
      }
    }  else {
      // login_view_evt
      const loginEvent = new CustomEvent("login_view_evt", {
        detail: {},
        bubbles: true,
        cancelable: true,
        composed: false,
      });

      window.dispatchEvent(loginEvent);
    }


  } // end of addToCart

  addToFavorites(id: number) {
    if(this.authenticateUser()) {

      if(this.access_token) {

        this.apiService.addItemToWishlist(id, this.lat, this.lng, this.country_iso_code, this.access_token).subscribe((res: any) => {



          const addToFavoritesEvent = new CustomEvent("add_item_to_favorites_evt", {
            detail: {},
            bubbles: true,
            cancelable: true,
            composed: false,
          });

          window.dispatchEvent(addToFavoritesEvent);

          alert("تم إضافة المنتج إلى قائمة المفضلة");

          logEvent(this.analytics, 'add_to_favorites_web', {
            product_id: this.product.id
          });
        });
      }
    } else {
      // login_view_evt
      const loginEvent = new CustomEvent("login_view_evt", {
        detail: {},
        bubbles: true,
        cancelable: true,
        composed: false,
      });

      window.dispatchEvent(loginEvent);
    }
  } // end of addToFavorites


  // removeFromCart() {
  //   const removeFromCartEvent = new CustomEvent("remove_item_from_cart_evt", {
  //     detail: {},
  //     bubbles: true,
  //     cancelable: true,
  //     composed: false,
  //   });

  //   window.dispatchEvent(removeFromCartEvent);
  // } // end of removeFromCart

  // removeFromFavorites() {
  //   const removeFromFavoritesEvent = new CustomEvent("remove_item_from_favorites_evt", {
  //     detail: {},
  //     bubbles: true,
  //     cancelable: true,
  //     composed: false,
  //   });

  //   window.dispatchEvent(removeFromFavoritesEvent);
  // } // end of removeFromFavorites


  openProduct(id: number) {
    // href="#/products/{{product.id}}"
    this.router.navigateByUrl(`products/${id}`);
    this.ngOnInit();
  } // end of openProduct

  public loadUserData(user: any) {
    this.apiService.viewProfile(user.access_token).subscribe((res: any) => {
      if(res.code == 200) {
        this.user = res.data;
      } else {
        this.user = user;
      }
    });
  } // end of loadUserData

  getAccessToken(user: any) {
    let us = JSON.parse(user);
    return us.access_token;
  } // end of getAccessToken

  toggleRas = () =>  this.isRas = !this.isRas;
  toggleKarashah = () =>  this.isKarashah = !this.isKarashah;
  toggleKwar3 = () =>  this.isKwar3 = !this.isKwar3;
  toggleLyh = () =>  this.isLyh = !this.isLyh;
  toggleShalwata = () =>  this.isShalwata = !this.isShalwata;
  //
  handleSelectedSize = (id: number) => this.selectedSize = this.selectedSize == id ? null : id;
  handleSelectedCut = (id: number) => this.selectedCut = this.selectedCut == id ? null : id;
  handleSelectedPrepare = (id: number) => this.selectedPrepare = this.selectedPrepare == id ? null : id;
  //
  incrementQty = () => this.itemQty++;
  decrementQty = () => this.itemQty >= 2 ? this.itemQty-- : null;



}
