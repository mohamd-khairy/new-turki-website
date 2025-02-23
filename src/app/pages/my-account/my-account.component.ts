import { IfStmt } from '@angular/compiler';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';


@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.less']
})
export class MyAccountComponent implements OnInit, AfterViewInit {

  // login() {
  //   // const eventAwesome = new Event('awesome', {}, false);
  //   const loginEvent = new CustomEvent("login_evt", {
  //     detail: {
  //       userId: "123456789",
  //     },
  //     bubbles: true,
  //     cancelable: true,
  //     composed: false,
  //   });


  //   window.dispatchEvent(loginEvent);
  // }
  @ViewChild('myNameElem') test;
  @ViewChild('searchInput') search_input;

  public map: any;
  public marker: any;
  public zoom: any = 14;

  public isSearching = false;

  public lat: any = 24.80606;
  public lng: any = 46.6485743;

  // { lat: this.lat ?? 24.80606, lng: this.lng ?? 46.6485743}

  isVisibleModal = false;

  public isLoggedIn: boolean = false;

  // loader
  public isLoadingOrders: boolean = true;

  // profile data
  public gender: any;
  public user_name: any;
  public email: any;
  public age: any;


  // user
  public access_token: any;
  public user: any;
  public addresses: any = [];
  public orders: any = [];


  // address
  public address_note: any;
  public address_text_location: any = "";
  public address_search_txt: any = "";
  public last_address_search_txt: any = "";
  public country_iso_code: any = "";

  // payment types
  public payment_types: any = [];


  public address_label: any;

  public search_results: Array<any>;

  //
  public currentOrder;

  // sacrifice_products & nonsacrifice_products
  public sacproducts: any = [];
  public nonsacproducts: any = [];





  // loginModal() {
  //   const loginModalViewEvent = new CustomEvent("login_view_evt", {
  //     detail: {},
  //     bubbles: true,
  //     cancelable: true,
  //     composed: false,
  //   });

  //   window.dispatchEvent(loginModalViewEvent);
  // }

  searchText() {

  }

  ngAfterViewInit(): void {

  }

  getValue() {
    this.setCurrentPosition();
  } // end of getValue

  options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: Infinity
  };

  private setCurrentPosition() {
    // if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        window.localStorage.removeItem('user:gps'); // remove block from GPS access

        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.geoCodeLatLng();
        this.map = new google.maps.Map(
          this.test.nativeElement,
          {
            zoom: this.zoom,
            center: { lat: this.lat, lng: this.lng },
            mapTypeId: "terrain",
          }
        );


        let image = "/assets/icons/pin.png";

        this.marker = new google.maps.Marker({
          position: { lat: this.lat, lng: this.lng},
          draggable: true,
          map: this.map,
          icon: image,
          title: "",
        });


        this.map.addListener("click", this.watchMapClick);

        // this.marker.addListener("click", () => {
        //   this.map.setZoom(this.zoom++);
        //   this.map.setCenter(this.marker.getPosition() as google.maps.LatLng);
        // });

        this.marker.addListener("mouseup", (event: any) => {
          this.lat = event.latLng.lat();
          this.lng = event.latLng.lng();


          if(this.zoom >= 20){
            --this.zoom;
          }else {
            ++this.zoom;
          }



          this.map.setZoom(this.zoom);

          this.map.setCenter(this.marker.getPosition() as google.maps.LatLng);
          this.geoCodeLatLng();
        });

      });

      // if GPS access id blocked by user
      if(window.localStorage.getItem('user:gps') == 'denied') {
        if(this.test) {


          ;
          ;

          this.map = new google.maps.Map(
            this.test.nativeElement,
            {
              zoom: this.zoom,
              center: { lat: this.lat ?? 24.80606, lng: this.lng ?? 46.6485743},
              mapTypeId: "terrain",
            }
          );

          let image = "/assets/icons/pin.png";
          // let image = "../../assets/icons/pin.png";

          this.marker = new google.maps.Marker({
            position: { lat: this.lat ?? 24.80606, lng: this.lng ?? 46.6485743 },
            draggable: true,
            map: this.map,
            icon: image,
            title: "",
          });


          if(this.map) {
            this.map.addListener("click", this.watchMapClick);

            // this.marker.addListener("click", () => {
            //   this.map.setZoom(this.zoom++);
            //   this.map.setCenter(this.marker.getPosition() as google.maps.LatLng);
            // });

            this.marker.addListener("mouseup", (event: any) => {
              this.lat = event.latLng.lat();
              this.lng = event.latLng.lng();



              if(this.zoom >= 20){
                --this.zoom;
              }else {
                ++this.zoom;
              }


              if(this.map) {
                this.map.setZoom(this.zoom);
              }


              this.map.setCenter(this.marker.getPosition() as google.maps.LatLng);
              this.geoCodePickedUserLoc();
            });
          }
        }
      }
    // }
  } // end of setCurrentPosition

  private geoCodePickedUserLoc() {
    let geocoder = new google.maps.Geocoder();

    var request = {
      location: {lat: this.lat, lng: this.lng}
    };

    geocoder.geocode(request, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {

        this.address_text_location = results[0].formatted_address;

        let country = results[0].address_components.filter((address) => address.types.includes('country'));

        if(country.length) {
          this.country_iso_code = country[0].short_name;
        }else {
          this.country_iso_code = "SA";
        }

        // this.loadFavorites();
        // this.loadCartProducts();

      }
    });
} // end of geoCodeLatLng


  watchMapClick = (event: any) => {

    // if(this.zoom >= 19) {
    //   this.zoom = 18;
    //   this.map.setZoom(18);
    // }else {
    //   this.zoom = 16;
    //   this.map.setZoom(16);
    // }

    this.lat = event.latLng.lat();
    this.lng = event.latLng.lng();

    this.marker.setPosition(
      new google.maps.LatLng(
        event.latLng.lat(),
        event.latLng.lng()
      )
    );

    if(this.map) {
      this.map.setCenter(this.marker.getPosition() as google.maps.LatLng);
    }

    this.geoCodeLatLng();
    // this.addPolygon(event.latLng.lat(), event.latLng.lng());
      // polygon.getPath().insertAt(this.selectedAreaPoints.length, {lat: 25.774, lng: -80.19});
  } // end of watchMapClick

  pickAddress(result) {

    this.lat = result.location.lat;
    this.lng = result.location.lng;

    this.address_text_location = result.name;
    this.marker.setPosition(
      new google.maps.LatLng(
        this.lat,
        this.lng
      )
    )
    this.map.setCenter(this.marker.getPosition() as google.maps.LatLng);
    this.isSearching = false;
  } // end of pickAddress


  geoCodeLatLng() {
    let geocoder = new google.maps.Geocoder();

      var request = {
        location: {lat: this.lat, lng: this.lng}
      };

      geocoder.geocode(request, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          // let temp_res = [];

          // for (var i = 0; i < results.length; i++) {
          //   let lat = results[i].geometry.location.lat();
          //   let lng = results[i].geometry.location.lng();
          //   temp_res.push({name: `${results[i].name}, ${results[i].formatted_address}`, location: {lat: lat, lng: lng}});
          // }


          // this.search_results = temp_res;
          // this.isSearching = true;
          this.address_text_location = results[0].formatted_address;

          let country = results[0].address_components.filter((address) => address.types.includes('country'));
          if(country.length) {
            this.country_iso_code = country[0].short_name;
          }else {
            this.country_iso_code = "";
          }

        }
      })
    // geocoder.geocode({lat: this.lat, lng: this.lng} )
    // .then((response) => {
    //   if (response.results[0]) {
    //     map.setZoom(11);

    //     const marker = new google.maps.Marker({
    //       position: latlng,
    //       map: map,
    //     });

    //     infowindow.setContent(response.results[0].formatted_address);
    //     infowindow.open(map, marker);
    //   } else {
    //     window.alert("No results found");
    //   }
    // })
    // .catch((e) => window.alert("Geocoder failed due to: " + e));
  } // end of geoCodeLatLng

  handleAddressSearch(txt) {
    // last_search_txt
    // if input_search_txt == last_search_txt (don't search)
    // if input_search_txt != last_search_txt (do search)
    // if input_search_txt.length < 1 (clear last_search_txt)

      if(this.address_search_txt.length < 1) {
          this.last_address_search_txt = "";
          this.isSearching = false;
      }

      if(this.last_address_search_txt != this.address_search_txt){
        if(this.address_search_txt.length >= 3) {
          var request = {
            query: this.address_search_txt,
            radius: 5000,
            location: {lat: this.lat, lng: this.lng}

            // fields: ['name', 'geometry'],
          };

          var service = new google.maps.places.PlacesService(this.map);

          service.textSearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              let temp_res = [];

              for (var i = 0; i < results.length; i++) {
                let lat = results[i].geometry.location.lat();
                let lng = results[i].geometry.location.lng();
                temp_res.push({name: `${results[i].name}, ${results[i].formatted_address}`, location: {lat: lat, lng: lng}});
              }


              this.search_results = temp_res;
              this.isSearching = true;


            }
          });
        }
      }
  } // handleAddressSearch


  handleOkMiddle(): void {
    // this.authPhase = 0;
    // this.clearCounter();
    this.isVisibleModal = false;
  }

  handleOpenModal(): void {
    this.isVisibleModal = true;
    this.getValue();
  }

  handleToggleModal(): void {
    this.isVisibleModal = !this.isVisibleModal;
  }

  showModalMiddle(): void {
    this.isVisibleModal = true;
    this.getValue();
  }



  logOut() {
    this.isLoggedIn = false;
    const logOutEvent = new CustomEvent("logout_evt", {
      detail: {},
      bubbles: true,
      cancelable: true,
      composed: false,
    });

    window.dispatchEvent(logOutEvent);
  } // end of logOut


  addToCart() {
    const addToCartEvent = new CustomEvent("add_item_to_cart_evt", {
      detail: {},
      bubbles: true,
      cancelable: true,
      composed: false,
    });

    window.dispatchEvent(addToCartEvent);
  } // end of addToCart


  removeFromCart() {
    const removeFromCartEvent = new CustomEvent("remove_item_from_cart_evt", {
      detail: {},
      bubbles: true,
      cancelable: true,
      composed: false,
    });

    window.dispatchEvent(removeFromCartEvent);
  } // end of removeFromCart



  addToFavorites() {
    const addToFavoritesEvent = new CustomEvent("add_item_to_favorites_evt", {
      detail: {},
      bubbles: true,
      cancelable: true,
      composed: false,
    });

    window.dispatchEvent(addToFavoritesEvent);
  } // end of addToFavorites

  removeFromFavorites() {
    const removeFromFavoritesEvent = new CustomEvent("remove_item_from_favorites_evt", {
      detail: {},
      bubbles: true,
      cancelable: true,
      composed: false,
    });

    window.dispatchEvent(removeFromFavoritesEvent);
  } // end of removeFromFavorites


  selectedTabIndex: any = 0;
  paymentType: any = "";

  ordersViewCtrl: any = 'list'; // list | detail

  scrollItems:any;

  tabs = [
    {
      id: 1,
      name: 'طلباتي',
      name_en: 'orders',
      active_icon: 'orders-tab-active',
      inactive_icon: 'order-tab-grey'
    },
    {
      id: 2,
      name: 'عناويني',
      name_en: 'addresses',
      active_icon: 'location-tab-active',
      inactive_icon: 'location-tab-grey'
    },
    // {
    //   id: 3,
    //   name: 'المحفظة',
    //   name_en: 'wallet',
    //   active_icon: 'wallet-tab-active',
    //   inactive_icon: 'wallet-tab-grey'
    // },
    // {
    //   id: 4,
    //   name: 'نقاطي',
    //   name_en: 'points',
    //   active_icon: 'points-tab-active',
    //   inactive_icon: 'points-tab-grey'
    // },
    // {
    //   id: 5,
    //   name: 'العروض',
    //   name_en: 'offers',
    //   active_icon: 'offers-tab-active',
    //   inactive_icon: 'offers-tab-grey'
    // },
    {
      id: 3,
      name: 'بياناتي',
      name_en: 'profile',
      active_icon: 'my-info-tab-active',
      inactive_icon: 'my-info-tab-grey'
    },
  ];



  constructor(private apiService: ApiService, private router: Router) {
    let loginStatus =  window.localStorage.getItem('is_logged_in');
    let user =  window.localStorage.getItem('user');

    if(user) {
      this.access_token = this.getAccessToken(user);
    }

    if(loginStatus != null && user != null) {
        user = JSON.parse(user);


        this.isLoggedIn = true;
        this.loadUserData(user);
        this.loadUserAddresses();

        this.loadPaymentTypes();
    }else {
      this.router.navigateByUrl('/');
    }

  } // end of constructor





  public loadUserAddresses() {
    // this.addresses = [];

    let user: any = window.localStorage.getItem('user');

    if(user) {
       this.apiService.getAddresses(this.access_token).subscribe((res: any) => {
        if(res.code == '200') {

          this.addresses = res.data;

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



  public loadUserOrders() {
    // this.orders = [];
    this.isLoadingOrders = true;
    let user: any = window.localStorage.getItem('user');

    if(user) {
      this.apiService.getOrders(this.access_token).subscribe((res: any) => {
        if(res.code == 200) {
          //
          this.orders = res.data.data;
          // let index = 0;

          // for(index; index < 5; ++index) {
          //   this.orders.push(res.data[index]);
          // }

          for(let i = 0; i < this.orders.length; ++i) {
            // for(let product of order.order_products){
              this.orders[i].orderProducts.filter((prod) => {
                if(prod.product.category_id == 34) {
                  this.orders[i]['is_sacrifice'] = true;
                }
              });

              this.orders[i].orderProducts.filter((prod) => {
                if(prod.product.category_id != 34) {
                  this.orders[i]['is_sacrifice'] = false;
                }
              });
            // }
          }



          this.isLoadingOrders = false;
          // const updateUIEvent = new CustomEvent("update_ui_evt", {
          //   detail: {type: 'orders', value: res.data},
          //   bubbles: true,
          //   cancelable: true,
          //   composed: false,
          // });

          // window.dispatchEvent(updateUIEvent);
        }
      });
    }

  } // end of loadUserOrders

  public loadPaymentTypes() {
    this.apiService.getPaymentTypes().subscribe((res: any) => {
      //
      if(res['code'] == 200) {
        this.payment_types = res.data;

      }
    });
  } // end of loadPaymentTypes

  mapOrderItemNames(products) {
    return products.map((prod) => prod.product.name_ar);
  }

  mapDate(date) {
    let mydate = new Date(date);
     return mydate.toLocaleDateString('en-SA', {year: 'numeric'}) + '-' + (parseInt(mydate.toLocaleDateString('en-SA', {month: 'numeric'})) < 9 ? `0${mydate.toLocaleDateString('en-SA', {month: 'numeric'})}` : mydate.toLocaleDateString('en-SA', {month: 'numeric'})) + '-' + (parseInt(mydate.toLocaleDateString('en-SA', {day: 'numeric'})) < 9 ? `0${mydate.toLocaleDateString('en-SA', {day: 'numeric'})}` : mydate.toLocaleDateString('en-SA', {day: 'numeric'}));
  }

  mapPaymentTypes(type) {
    if(this.payment_types.filter((ty) => ty.id == type.payment_type_id)[0].name_en == "cash" && type.is_sacrifice) {
      return 'الدفع المسبق';
    }
    return this.payment_types.filter((ty) => ty.id == type.payment_type_id)[0].name_ar;
  } //



  public loadUserData(user: any) {
    this.apiService.viewProfile(user.access_token).subscribe((res: any) => {
      if(res.code == 200) {
        this.user = res.data;
        this.gender = res.data.gender;
        this.user_name = res.data.name;
        this.email = res.data.email == null ? '' : res.data.email;
        this.age = res.data.age == null ? '' : res.data.age;
      } else {
        this.user = user;
      }
    });
  } // end of loadUserData


  public updateProfileData() {

    let user: any = window.localStorage.getItem('user');

    if(user) {
      let req_data: any = {};
      if(this.user_name != null) {
        req_data.name = this.user_name;
      }

      if(this.email != null && this.email != "" && this.email != this.user.email){

        req_data.email = this.email;
      }

      if(this.gender != null) {
        req_data.gender = this.gender;
      }

      if(this.age != null && this.age != "") {
        req_data.age = this.age;
      }



      this.apiService.updateProfile(req_data, this.access_token).subscribe((res: any) => {

        if(res.code == 200) {
          alert("تم تحديث بيانات المستخدم بنجاح");
          return;
        } else {
          alert("حدث خطأ أثناء محاولة تحديث بيانات البروفايل");
          return;
        }

      });
    }


  } // end of updateProfileData


  addNewAddress() {
      if(this.address_text_location == "" || !this.address_text_location) {
        alert("يجب تحديد موقع العنوان");
        return;
      }
      let user: any = window.localStorage.getItem('user');

      if(user) {
        let address = {
          country_iso_code: this.country_iso_code,
          address: this.address_text_location,
          comment: this.address_note ? this.address_note : this.address_text_location,
          label: this.address_label ? this.address_label : this.address_text_location,
          is_default: 0,
          long: this.lng,
          lat: this.lat
        };

        // return;
        this.apiService.addNewAdddress(address, this.access_token).subscribe((res) => {
          if(res['code'] == '200') {
            this.handleToggleModal();
            this.loadUserAddresses();
            alert("تم إضافة العنوان بنجاح");

            const reloadAddressEvent = new CustomEvent("reload_addresses", {
              detail: {
                type: '',
                value: []
              },
              bubbles: true,
              cancelable: true,
              composed: false,
            });

            window.dispatchEvent(reloadAddressEvent);
          }
        });
      }

  } // end of addNewAddress


  deleteAddress(address: any) {
    if(confirm("هل أنت متأكد من حذف العنوان؟")) {
      let user: any = window.localStorage.getItem('user');


      if(user) {

        this.apiService.deleteAdddress(address.id, this.access_token).subscribe((res) => {



          if(res['massage'] == "Successfully Deleted!") {
            alert("تم حذف العنوان بنجاح");
            this.loadUserAddresses();
            const reloadAddressEvent = new CustomEvent("reload_addresses", {
              detail: {
                type: '',
                value: []
              },
              bubbles: true,
              cancelable: true,
              composed: false,
            });

            window.dispatchEvent(reloadAddressEvent);
          }
          // this.loadUserAddresses();
        });
      }
    }
  } // end of deleteAddress



  getAccessToken(user: any) {
    let us = JSON.parse(user);
    return us.access_token;
  }

  handleGenderChange(val: any) {
  }


  ngOnInit(): void {
    let user_iso_code = window.localStorage.getItem("user_location:iso_code");
    this.country_iso_code = user_iso_code;
    let user: any = window.localStorage.getItem('user');
    // if(this.user) {
      if(user) {
        this.loadUserOrders();
      }

    // }
  }


  handleTabChange(tab: any) {
  }

  handleSelectedIndexChange(index: any) {
    this.selectedTabIndex = index;
  }

  paymentSelect(pay: any) {
    this.paymentType = pay;
  }

  changeOrdersView(view: any, order: any) {
    if(order == '') {
      this.ordersViewCtrl = view;
      this.currentOrder = null;
      return;
    }

    this.ordersViewCtrl = view;
    this.currentOrder = order;
    let user_iso_code = window.localStorage.getItem("user_location:iso_code");
    this.country_iso_code = user_iso_code;

  } // end of changeOrdersView


  mapPrice(price) {
    return parseFloat(price);
  } //end of mapPrice

}
