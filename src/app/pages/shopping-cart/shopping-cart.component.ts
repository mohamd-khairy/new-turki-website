import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { getAnalytics, logEvent } from "firebase/analytics";

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.less']
})
export class ShoppingCartComponent implements OnInit {

  // order status
  orderStatus: any = "cart";
  orderComment: any = "";
  orderDeliveryDate: any = "";
  orderDeliveryPeriod: any = "";
  paymentType: any = "";
  orderSelectedAddress: any = "";

  //
  public isLoggedIn: boolean = false;

  public isLoadingProducts: boolean = true;

  lat: any = 24.7197986;
  lng: any = 47.2684408;

  // user
  public access_token: any;
  public user: any;
  public products: any = [];

  public copunText: any = "";

  public cart_summary: any;

  // address
  public address_text_location: any = "";
  public country_iso_code: any = "";

  // user addresses
  public addresses: any = [];

  // order dates
  public order_dates: any = [];
  public order_delivery_periods: any = [];

  // payment types
  public payment_types: any = [];

  // sacrifice_products & nonsacrifice_products
  public sacproducts: any = [];
  public nonsacproducts: any = [];



  public isLoadingCoupon: boolean = false;
  public couponMsg: string = "";

  public isSubmitting = false;

  public analytics;

  options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: Infinity
  };


  ngOnInit(): void {
    this.lat = window.localStorage.getItem('user_location:latitude');
    this.lng = window.localStorage.getItem('user_location:longitude');
    this.country_iso_code = window.localStorage.getItem('user_location:iso_code');


    if (this.lat && this.lng && this.country_iso_code) {
      this.loadCartProducts();
      this.loadPaymentTypes();
      // this.loadDeliveryPeriods();
      this.loadUserAddresses();
    } else {
      navigator.geolocation.getCurrentPosition(this.success, this.error, this.options);
    }
  }

  success = (pos: any) => {
    var crd = pos.coords;

    let geocoder = new google.maps.Geocoder();

    var request = {
      location: { lat: crd.latitude, lng: crd.longitude }
    };

    geocoder.geocode(request, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {

        this.address_text_location = results[0].formatted_address;

        let country = results[0].address_components.filter((address) => address.types.includes('country'));

        if (country.length) {
          this.country_iso_code = country[0].short_name;
        } else {
          this.country_iso_code = "SA";
        }


        this.loadCartProducts();
        this.loadPaymentTypes();
        // this.loadDeliveryPeriods();
        this.loadUserAddresses();

        // this.loadMostOrdered();
        // this.loadCategories(this.country_iso_code, this.lat, this.lng);


        window.localStorage.setItem('user_location:latitude', `${crd.latitude}`);
        window.localStorage.setItem('user_location:longitude', `${crd.longitude}`);
        window.localStorage.setItem('user_location:iso_code', `${this.country_iso_code}`);

        // this.loadFavorites();
        // this.loadCartProducts();
      }
    });

    // return crd;
    //
  }

  error = (err: any) => {
    // alert(`ERROR(${err.code}): ${err.message}`);
    // alert('يمكنك تفعيل');
    return false;
  }


  constructor(private apiService: ApiService, private router: Router) {
    let loginStatus = window.localStorage.getItem('is_logged_in');
    let user = window.localStorage.getItem('user');

    if (user) {
      this.access_token = this.getAccessToken(user);
    }


    if (loginStatus != null && user != null) {

      this.isLoggedIn = true;

      // this.setCurrentPosition();
    }

    this.analytics = getAnalytics();
  } // end of constructor

  getAccessToken(user: any) {
    let us = JSON.parse(user);
    return us.access_token;
  }

  private loadCartProducts() {
    this.isLoadingProducts = true;
    this.order_dates = [];
    this.apiService.getUserShoppingCart(this.lat, this.lng, this.country_iso_code, this.access_token).subscribe((res) => {

      if (res['code'] == '200') {

        let c_products = res['data']['cart']['data'];

        this.sacproducts = c_products.filter((prod) => prod.product.category_id == 34);

        this.nonsacproducts = c_products.filter((prod) => prod.product.category_id != 34);

        let dates = res['currentCity']['dates'];

        this.order_delivery_periods = res['currentCity']['delivery_period'];

        for (let index = 0; index < dates.length; index++) {

          var myDate = new Date(dates[index]);

          this.order_dates.push({ date: myDate.toLocaleDateString('en-SA', { year: 'numeric' }) + '-' + (parseInt(myDate.toLocaleDateString('en-SA', { month: 'numeric' })) <= 9 ? `0${myDate.toLocaleDateString('en-SA', { month: 'numeric' })}` : myDate.toLocaleDateString('en-SA', { month: 'numeric' })) + '-' + (parseInt(myDate.toLocaleDateString('en-SA', { day: 'numeric' })) <= 9 ? `0${myDate.toLocaleDateString('en-SA', { day: 'numeric' })}` : myDate.toLocaleDateString('en-SA', { day: 'numeric' })), date_num: parseInt(myDate.toLocaleDateString('en-SA', { day: 'numeric' })) <= 9 ? `0${myDate.toLocaleDateString('en-SA', { day: 'numeric' })}` : myDate.toLocaleDateString('en-SA', { day: 'numeric' }), date_text: this.mapDay(myDate.getDay()) });

        }

        this.orderDeliveryDate = this.order_dates[0].date;

        this.cart_summary = res['data'];

        this.products = res['data']['cart']['data'];

        this.isLoadingProducts = false;

        const updateUIEvent = new CustomEvent("update_ui_evt", {
          detail: {
            type: 'cart',
            value: res['data']['cart']['data']
          },
          bubbles: true,
          cancelable: true,
          composed: false,
        });

        window.dispatchEvent(updateUIEvent);
      }
    });
  } // end of loadCartProducts

  mapPrice(price) {
    return parseFloat(price);
  }


  selectOrderDate(order_date: any) {

    this.orderDeliveryDate = order_date.date;
  } // end of selectOrderDate

  selectOrderPeriod(order_period: any) {
    this.orderDeliveryPeriod = order_period;
  }

  mapFullDate(date) {

    let date_parts = date.split('-');

    let year = date_parts[0];
    let month = date_parts[1];
    let day = date_parts[2];

    // let date_day = {'': '01', '': '02'};
    // let date_month = {'': '01', '': '02'};
    // let date_year = {'': '01', '': '02'};

    return date;
  }


  mapDay(day) {
    let ar_days = { '0': 'الأحد', '1': 'الإثنين', '2': 'الثلاثاء', '3': 'الأربعاء', '4': 'الخميس', '5': 'الجمعة', '6': 'السبت' };
    return ar_days[`${day}`];
  }


  incrementQty(id, qty, index) {
    this.products[index].quantity = (qty + 1);

    let req = {
      quantity: (qty + 1),
      comment: ""
    };

    this.products = [];
    this.isLoadingProducts = true;

    this.apiService.updateCart(id, req, this.lat, this.lng, this.country_iso_code, this.access_token).subscribe((res: any) => {

      this.loadCartProducts();

    });
  } // end of incrementQty

  decrementQty(id, qty, index) {
    if ((qty - 1) >= 1) {
      this.products[index].quantity = (qty - 1);

      let req = {
        quantity: (qty - 1),
        comment: ""
      };

      this.products = [];
      this.isLoadingProducts = true;

      this.apiService.updateCart(id, req, this.lat, this.lng, this.country_iso_code, this.access_token).subscribe((res: any) => {

        this.loadCartProducts();

      });
    }
  } // end of decrementQty

  deleteFromCart(id: number) {

    if (confirm('هل تود حذف العنصر من عربة التسوق؟')) {
      this.apiService.deleteFromCart(id, this.lat, this.lng, this.country_iso_code, this.access_token).subscribe((res: any) => {

        if (res['code'] == '200') {
          alert("تم حذف العنصر من عربة التسوق");
          this.loadCartProducts();

          logEvent(this.analytics, 'remove_from_cart_web', {
            product_id: id
          });
        }
      });
    }

  } // end of deleteFromCart


  addToFavorites(id: number) {
    if (this.access_token) {

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
          product_id: id
        });
      });
    }

  } // end of addToFavorites


  private setCurrentPosition() {

    if (this.orderSelectedAddress) {
      this.lat = parseFloat(this.orderSelectedAddress.lat);
      this.lng = parseFloat(this.orderSelectedAddress.long);

      this.geoCodeLatLng();
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.geoCodeLatLng();

      });
    }

  } // end of setCurrentPosition


  private geoCodeLatLng() {
    let geocoder = new google.maps.Geocoder();

    var request = {
      location: { lat: this.lat, lng: this.lng }
    };

    geocoder.geocode(request, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {

        this.address_text_location = results[0].formatted_address;

        let country = results[0].address_components.filter((address) => address.types.includes('country'));

        if (country.length) {
          this.country_iso_code = country[0].short_name;
        } else {
          this.country_iso_code = "SA";
        }

        // this.loadFavorites();
        this.loadCartProducts();
        this.loadPaymentTypes();
        // this.loadDeliveryPeriods();
        this.loadUserAddresses();

      }
    });
  } // end of geoCodeLatLng


  public loadPaymentTypes() {
    this.apiService.getPaymentTypes().subscribe((res: any) => {
      if (res['code'] == 200) {

        if (this.country_iso_code == 'SA') {
          this.payment_types = res.data.filter((pay) => pay.code != 'Ngenius');
          this.payment_types = this.payment_types.filter((pay) => pay.code != 'MyFatoorah');
        } else {
          this.payment_types = res.data.filter((pay) => pay.code != 'ARB');
        }

        this.payment_types = this.payment_types.filter((pay) => pay.active == 1);
        this.payment_types = this.payment_types.filter((pay) => pay.code != 'Wallet');

      }
    });
  } // end of loadPaymentTypes


  public loadDeliveryPeriods() {
    this.apiService.getDeliveryPeriods(this.access_token).subscribe((res: any) => {

      if (res['code'] == '200') {
        this.order_delivery_periods = res['data'];
      }

    });
  } // end of loadDeliveryPeriods

  changeStatus(status: any) {
    this.orderStatus = status;
  }

  applyCopun() {
    if (this.copunText.trim()) {
      this.isLoadingCoupon = true;
      this.couponMsg = "";

      let reqData = {
        code: this.copunText
      }

      this.apiService.applyCoupon(reqData, this.access_token, this.lat, this.lng, this.country_iso_code).subscribe((res: any) => {
        if (res['code'] == '200') {
          this.isLoadingCoupon = false;
          this.couponMsg = "success";
          this.copunText = "";


          logEvent(this.analytics, 'applied_coupon_web', {
            coupon_text: this.copunText
          });


          setTimeout(() => {
            this.couponMsg = "";
            this.loadCartProducts();
          }, 2000)
        }


      }, (error: any) => {
        alert("كود الخصم غير صحيح");
        this.isLoadingCoupon = false;
        this.couponMsg = "";
      });
    } else {
      alert("أدخل كود الخصم")
    }

    // if(this.copunText.trim()) {
    // }

    // alert("yeah, it worrrrrrrks!")
  }

  paymentSelect(pay: any) {
    this.paymentType = pay;
  }

  goLocation() {
    this.orderStatus = 'location';
  }

  goPayment() {
    this.orderStatus = 'payment';
  }

  mapSacDay(indx: number) {
    if (indx == 0) {
      return 'اليوم الأول';
    } else if (indx == 1) {
      return 'اليوم الثاني';
    } else if (indx == 2) {
      return 'اليوم الثالث';
    } else if (indx == 3) {
      return 'اليوم الرابع';
    }
  }

  submitOrder() {
    if (!this.orderDeliveryDate) {
      alert('لم تقم باختيار  موعد التوصيل');
      this.orderStatus = 'location';
      return;
    }

    if (this.nonsacproducts.length && !this.orderDeliveryPeriod) {
      alert('لم تقم باختيار فترة التوصيل');
      this.orderStatus = 'location';
      return;
    }

    // if(!this.orderComment) {
    //   alert('لم تقم بكتابة ملاحظات');
    //   this.orderStatus = 'location';
    //   return;
    // }

    if (!this.paymentType) {
      alert('لم تقم باختيار طريقة الدفع');
      this.orderStatus = 'payment';
      return;
    }

    let dateparts = this.orderDeliveryDate.split('-');

    // return;

    let reqData = {
      delivery_date: this.orderDeliveryDate,//dateparts[1] + "-" + dateparts[2],
      delivery_period_id: this.sacproducts.length ? 5 : this.orderDeliveryPeriod.id,
      using_wallet: 0,
      payment_type_id: this.paymentType.id,
      address_id: this.orderSelectedAddress.id
    };



    if (this.paymentType.code == 'tamara') {
      reqData['tamara_payment_name'] = 'PAY_BY_INSTALMENTS';
      reqData['no_instalments'] = 3;

      // return;
      //   "tamara_payment_name":"PAY_BY_INSTALMENTS",
      // "no_instalments":3,
    }

    // return;
    this.isSubmitting = true;

    this.apiService.createOrder(reqData, this.lat, this.lng, this.country_iso_code, this.access_token).subscribe((res: any) => {
      this.isSubmitting = false;

      if (res['code'] == '200') {

        if (res['data']['invoiceURL']) {
          window.location.href = res['data']['invoiceURL'];


          logEvent(this.analytics, 'new_purchase_web', {
            payment_type: this.paymentType.code
          });
        }

        if (res['data']['checkout_url']) {
          window.location.href = res['data']['checkout_url'];

          logEvent(this.analytics, 'new_purchase_web', {
            payment_type: this.paymentType.code
          });
        }

        if (res['data']['address_id']) {
          this.orderStatus = 'submitted';

          logEvent(this.analytics, 'new_purchase_web', {
            payment_type: this.paymentType.code
          });

          const updateUIEvent = new CustomEvent("update_ui_evt", {
            detail: {},
            bubbles: true,
            cancelable: true,
            composed: false,
          });

          window.dispatchEvent(updateUIEvent);
        }


        //
        // return;

      }
    }, (err: any) => {

      this.isSubmitting = false;

      if (err.error.description == "minimum order value should be more that or equal 60 SAR!") {
        alert("يجب أن يكون إجمالي مبلغ الطلب أكثر من 60 ريال");
      }
    });
    // this.orderStatus = 'submitted';
  } // end of submitOrder


  public loadUserAddresses() {

    let user: any = window.localStorage.getItem('user');

    if (user) {
      this.apiService.getAddresses(this.access_token).subscribe((res: any) => {
        if (res.code == '200') {
          this.addresses = res.data.filter((address) => address.is_default == '1');
          this.orderSelectedAddress = this.addresses.filter(addrs => addrs.is_default == '1')[0];

          const updateUIEvent = new CustomEvent("update_ui_evt", {
            detail: {
              type: 'orders',
              value: res['data']
            },
            bubbles: true,
            cancelable: true,
            composed: false,
          });

          window.dispatchEvent(updateUIEvent);
        }
      });
    }

  } // end of loadUserAddresses

} // end of class
