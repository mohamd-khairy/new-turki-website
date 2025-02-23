import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from './theme.service';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { Directionality, Direction } from '@angular/cdk/bidi';
import { ApiService } from './api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { getAnalytics, logEvent } from "firebase/analytics";



// languages
import ar from './i18n/ar';
import en from './i18n/en';
// import { ConsoleReporter } from 'jasmine';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {


  public isCollapsed = true;
  public direction = 'ltr';
  public trans: any = ar;
  public isLoggedIn: boolean = false;
  public cartItemsCount: number = 0;
  public favoriteItemsCount: number = 0;
  public user_mobile: string = '';
  public user_name: string = '';
  public userStatusCode: string = '';

  public timeCounter: number = 59;

  public selectedCountry: string = 'ksa';

  public counterInterval: any;

  // temp access token
  public temp_access_token: any;
  public temp_user: any;

  public searchTxt: any = "";
  public search_results: any = [];
  public search_results_u_loc: any = [];

  // loaders
  public isLoading: boolean = false;

  public isLoadingAddresses: boolean = false;


  // favorites & cartItems
  public favorites: any = [];
  public products: any = [];
  public addresses: any = [];
  public default_address: any = [];


  public lat: any = 24.7905057;
  public lng: any = 46.6578704;

  // user
  public access_token: any;
  public user: any;
  // address
  public address_text_location: any = "";
  public country_iso_code: any = "SA";

  public analytics;


  // verification code digits
  @ViewChild("digitOne") private _oneElement: any;
  @ViewChild("digitTwo") private _twoElement: any;
  @ViewChild("digitThree") private _threeElement: any;
  @ViewChild("digitFour") private _fourElement: any;


  digitOne: any;
  digitTwo: any;
  digitThree: any;
  digitFour: any;

  isVisibleModal = false;
  isVisiblePickUserLocModal = false;
  isVisibleAddressModal = false;
  isVisibleBranchModal = false;


  // pick user location
  public isSearching = false;
  public isSearchingPickUserLoc = false;
  public address_search_txt: any = "";
  public last_address_search_txt: any = "";
  public map: any;
  public marker: any;
  public zoom: any = 14;

  @ViewChild('userLocElem') private test;

  authPhase: number = 0;

  public categories: Array<any> = [];


  handleOkMiddle(): void {
    this.authPhase = 0;
    this.clearCounter();
    this.isVisibleModal = false;
  }

  handleOkPickUserLocMiddle(): void {
    this.isVisiblePickUserLocModal = false;
  }

  handleAddressOkMiddle(): void {
    // this.authPhase = 0;
    // this.clearCounter();
    this.isVisibleAddressModal = false;
  }

  handleBranchOkMiddle(): void {
    // this.authPhase = 0;
    // this.clearCounter();
    this.isVisibleBranchModal = false;
  }

  handleOpenModal(): void {
    this.isVisibleModal = true;
  }

  handleOpenPickUserLocModal() {
    this.isVisiblePickUserLocModal = true;

    if (this.test) {

      this.map = new google.maps.Map(
        this.test.nativeElement,
        {
          zoom: this.zoom,
          center: { lat: this.lat ?? 24.7136, lng: this.lng ?? 46.6753 },
          mapTypeId: "terrain",
        }
      );

      let image = "/assets/icons/pin.png";

      this.marker = new google.maps.Marker({
        position: { lat: this.lat ?? 24.7136, lng: this.lng ?? 46.6753 },
        draggable: true,
        map: this.map,
        icon: image,
        title: "Hello World!",
      });


      if (this.map) {
        this.map.addListener("click", this.watchMapClick);

        // this.marker.addListener("click", () => {
        //   this.map.setZoom(this.zoom++);
        //   this.map.setCenter(this.marker.getPosition() as google.maps.LatLng);
        // });

        this.marker.addListener("mouseup", (event: any) => {
          this.lat = event.latLng.lat();
          this.lng = event.latLng.lng();



          if (this.zoom >= 20) {
            --this.zoom;
          } else {
            ++this.zoom;
          }


          if (this.map) {
            this.map.setZoom(this.zoom);
          }


          this.map.setCenter(this.marker.getPosition() as google.maps.LatLng);
          this.geoCodePickedUserLoc();
        });
      }
    }
  } // end of handleOpenPickUserLoc

  handleOpenAddressModal(): void {

    let loginStatus = window.localStorage.getItem('is_logged_in');
    let user = window.localStorage.getItem('user');

    if (user) {
      this.access_token = this.getAccessToken(user);
    }

    if (loginStatus != null && user != null) {
      this.isVisibleAddressModal = true;
    } else {
      // this.router.navigateByUrl('/');
      this.isVisibleModal = true;
    }
  } // end of func


  handleOpenBranchModal(): void {

    let loginStatus = window.localStorage.getItem('is_logged_in');
    let user = window.localStorage.getItem('user');

    if (user) {
      this.access_token = this.getAccessToken(user);
    }

    if (loginStatus != null && user != null) {
      this.isVisibleBranchModal = true;
    } else {
      // this.router.navigateByUrl('/');
      this.isVisibleModal = true;
    }
  } // end of func

  handleToggleModal(): void {
    this.isVisibleModal = !this.isVisibleModal;
  }

  handleTogglePickUserLocModal(): void {
    this.isVisibleAddressModal = !this.isVisibleAddressModal;

  } // end of handleTogglePickUserLoc


  handleToggleAddressModal(): void {
    if (this.isLoggedIn) {
      this.isVisibleAddressModal = !this.isVisibleAddressModal;
    } else {
      this.isVisibleModal = !this.isVisibleModal;
    }
  }


  handleToggleBranchModal(): void {
    if (this.isLoggedIn) {
      this.isVisibleBranchModal = !this.isVisibleBranchModal;
    } else {
      this.isVisibleModal = !this.isVisibleModal;
    }
  }

  showModalMiddle(): void {
    this.isVisibleModal = true;
  }

  showAddressModalMiddle(): void {

    let loginStatus = window.localStorage.getItem('is_logged_in');
    let user = window.localStorage.getItem('user');

    if (user) {
      this.access_token = this.getAccessToken(user);
    }

    if (loginStatus != null && user != null) {
      this.isVisibleAddressModal = true;
    } else {
      // this.router.navigateByUrl('/');
      this.isVisibleModal = true;
    }
  } // end of func


  showBranchModalMiddle(): void {

    let loginStatus = window.localStorage.getItem('is_logged_in');
    let user = window.localStorage.getItem('user');

    if (user) {
      this.access_token = this.getAccessToken(user);
    }

    if (loginStatus != null && user != null) {
      this.isVisibleBranchModal = true;
    } else {
      // this.router.navigateByUrl('/');
      this.isVisibleModal = true;
    }
  } // end of func


  resendVerifiCode() {

  }


  handleDigitOneCtrl(val: any) {
    if (val.data == null) {
      return;
    }
    if (val.data) {
      this.digitOne = val.data;
      this.inputFocusCtrl(null, this._twoElement);
    }
  }

  handleDigitTwoCtrl(val: any) {
    if (val.data == null) {
      this.inputFocusCtrl(this._oneElement, null);
      return;
    }
    if (val.data) {
      this.digitTwo = val.data;
      this.inputFocusCtrl(null, this._threeElement);
    }
  }

  handleDigitThreeCtrl(val: any) {
    if (val.data == null) {
      this.inputFocusCtrl(this._twoElement, null);
      return;
    }
    if (val.data) {
      this.digitThree = val.data;
      this.inputFocusCtrl(null, this._fourElement);
    }
  }

  handleDigitFourCtrl(val: any) {
    if (val.data == null) {
      this.inputFocusCtrl(this._threeElement, null);
      return;
    }
    if (val.data) {
      // do check if the values match the sent code
      this.digitFour = val.data;

      this.validateVerificationCode(this.digitOne + this.digitTwo + this.digitThree + this.digitFour);
    }
  }

  verifyMobile() {


    if (!this.user_mobile.trim()) {
      alert("رقم الجوال مطلوب");
      return;
    }


    if (this.user_mobile.indexOf('05') == 0 || this.user_mobile.indexOf('+') == 0) {
      this.user_mobile = this.user_mobile.substring(1);
      // alert(this.user_mobile)
    }

    if (this.user_mobile.length <= 8) {
      alert("رقم الجوال ناقص");
      return;
    }

    // if(this.user_mobile.length == 9) {
    //   this.user_mobile =  +  this.user_mobile;
    //   // alert("mobile: " + this.user_mobile);
    // }

    // return;
    // if(!this.user_mobile.startsWith('+')){
    //   alert("يجب أن يبدأ رقم الجوال بكود المنطقة");
    //   return;
    // }

    if ((this.mapSelectedCountry(this.selectedCountry) + this.user_mobile).length < 13) {
      alert("رقم الجوال غير صحيح");
      return;
    }

    this.isLoading = true;

    this.apiService.sendOTP({ mobile: this.mapSelectedCountry(this.selectedCountry) + this.user_mobile.trim() }).subscribe((res: any) => {
      this.user_mobile = this.mapSelectedCountry(this.selectedCountry) + this.user_mobile.trim();

      this.isLoading = false;
      if (res['success'] == true) {
        this.authPhase = 1;
        this.userStatusCode = res['code'];


        this.startCounter();
        // this.inputFocusCtrl(null, this._oneElement);


      } else {
        alert("حدث خطأ حاول مجددا في وقت لاحق");
      }
    });

  }

  mapSelectedCountry(country) {
    if (country == "ksa") {
      return '+966';
    }
    if (country == "uae") {
      return '+971';
    }
  }


  validateVerificationCode(code: string) {
    if (code.replace(' ', '').trim().length < 4) {
      alert("كود التفعيل ناقص");
      return;
    }

    this.isLoading = true;

    this.apiService.verifyOTP({ mobile: this.user_mobile, mobile_verification_code: code }).subscribe((res: any) => {


      if (res['success'] == true) {

        this.isLoading = false;



        if (res.data.name == null || res.data.name == "") {
          this.authPhase = 2;
          this.temp_access_token = res.data.access_token;
          this.temp_user = res.data;
          this.clearCounter();
          return;
          // window.localStorage.setItem('is_logged_in', JSON.stringify(true));
          // window.localStorage.setItem('user', JSON.stringify(res.data));
          // this.isLoggedIn = true;
        }

        this.authPhase = 3;

        const loginEvent = new CustomEvent("login_evt", {
          detail: res.data,
          bubbles: true,
          cancelable: true,
          composed: false,
        });

        window.dispatchEvent(loginEvent);

        setTimeout(() => {
          this.handleOkMiddle();
        }, 3000);
      } else {
        this.isLoading = false;
        alert("كود التفعيل غير صحيح");
        return;
      }
    });
  }

  updateName() {
    if (this.user_name.trim() == "") {
      alert("حقل الإسم مطلوب");
      return;
    }

    if (this.user_name.length < 3) {
      alert("يجب أن يكون اسم المستخدم أكثر من حرفين");
      return;
    }

    this.isLoading = true;

    this.apiService.updateProfile({ name: this.user_name }, this.temp_access_token).subscribe((res: any) => {
      this.isLoading = false;

      if (res.code == 200) {
        this.authPhase = 3;
        this.temp_user.name = this.user_name;

        const loginEvent = new CustomEvent("login_evt", {
          detail: this.temp_user,
          bubbles: true,
          cancelable: true,
          composed: false,
        });

        window.dispatchEvent(loginEvent);

        setTimeout(() => {
          this.handleOkMiddle();
        }, 3000);
      } else {
        this.isLoading = false;

        alert("لم يتم تحديث اسم المستخدم");
        return;
      }

    });
  } // end of updateName

  inputFocusCtrl(prevEle: any, nextEle: any) {
    if (prevEle == null && nextEle != null) {
      nextEle.nativeElement.focus();
    }

    if (prevEle != null && nextEle == null) {
      prevEle.nativeElement.focus();
    }
  } // end of inputFocusCtrl


  clearCounter() {
    clearInterval(this.counterInterval);
  } // clearCounter

  startCounter() {
    this.timeCounter = 59;

    this.counterInterval = setInterval(() => {
      this.timeCounter--;
      if (this.timeCounter == 0) {
        clearInterval(this.counterInterval);
      }
    }, 1000);
  } // startCounter


  // start pick user location
  handleAddressSearch(txt) {
    // last_search_txt
    // if input_search_txt == last_search_txt (don't search)
    // if input_search_txt != last_search_txt (do search)
    // if input_search_txt.length < 1 (clear last_search_txt)

    if (this.address_search_txt.length < 1) {
      this.last_address_search_txt = "";
      this.isSearchingPickUserLoc = false;
    }

    if (this.last_address_search_txt != this.address_search_txt) {
      if (this.address_search_txt.length >= 3) {
        var request = {
          query: this.address_search_txt,
          radius: 5000,
          location: { lat: this.lat ?? 24.7136, lng: this.lng ?? 46.6753 }

          // fields: ['name', 'geometry'],
        };

        var service = new google.maps.places.PlacesService(this.map);

        service.textSearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            let temp_res = [];

            for (var i = 0; i < results.length; i++) {
              let lat = results[i].geometry.location.lat();
              let lng = results[i].geometry.location.lng();
              temp_res.push({ name: `${results[i].name}, ${results[i].formatted_address}`, location: { lat: lat, lng: lng } });
            }


            this.search_results_u_loc = temp_res;
            this.isSearchingPickUserLoc = true;


          }
        });
      }
    }
  } // handleAddressSearch

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
    this.isSearchingPickUserLoc = false;
  } // end of pickAddress


  submitAddress() {
    if (this.address_text_location == "" || !this.address_text_location) {
      alert("يجب تحديد موقع العنوان");
      return;
    }


    window.localStorage.setItem('user_location:latitude', `${this.lat}`);
    window.localStorage.setItem('user_location:longitude', `${this.lng}`);
    window.localStorage.setItem('user_location:iso_code', `${this.country_iso_code}`);

    this.loadCategories(this.country_iso_code, this.lat, this.lng);

    const reloadHomeCatEvent = new CustomEvent("home:reload_categories", {
      detail: {
        type: '',
        value: []
      },
      bubbles: true,
      cancelable: true,
      composed: false,
    });

    window.dispatchEvent(reloadHomeCatEvent);

    if (this.isLoggedIn) {
      this.loadUserAddresses();
    }

    this.handleOkPickUserLocMiddle();

  } // end of submitAddress

  watchMapClick = (event: any) => {

    if (this.zoom >= 19) {
      this.zoom = 18;
      this.map.setZoom(18);
    } else {
      this.zoom = 16;
      this.map.setZoom(16);
    }

    this.lat = event.latLng.lat();
    this.lng = event.latLng.lng();

    this.marker.setPosition(
      new google.maps.LatLng(
        event.latLng.lat(),
        event.latLng.lng()
      )
    )

    if (this.map) {
      this.map.setCenter(this.marker.getPosition() as google.maps.LatLng);
    }

    this.geoCodePickedUserLoc();
    // this.addPolygon(event.latLng.lat(), event.latLng.lng());
    // polygon.getPath().insertAt(this.selectedAreaPoints.length, {lat: 25.774, lng: -80.19});
  } // end of watchMapClick
  // end pick user location

  constructor(private themeService: ThemeService, private msgService: NzMessageService, private configService: NzConfigService, private readonly dir: Directionality, private apiService: ApiService, private router: Router) {
    // window.localStorage.clear();
    // return;
    // window.localStorage.setItem('is_logged_in', JSON.stringify(true));
    // window.localStorage.setItem('user', JSON.stringify(true));

    // window.localStorage.removeItem('is_logged_in');
    // window.localStorage.removeItem('user');

    let loginStatus = window.localStorage.getItem('is_logged_in');
    let user = window.localStorage.getItem('user');

    if (user) {
      this.access_token = this.getAccessToken(user);
    }


    if (loginStatus != null && user != null) {
      this.isLoggedIn = true;

      this.setCurrentPosition();
    }

    this.analytics = getAnalytics();
  } // end of constructor


  createMessage(type: string): void {
    // {{country_iso_code == 'SA' ? '+9668001110103' : '+971563055557'}}
    navigator.clipboard.writeText(this.country_iso_code == 'SA' ? '+9668001110103' : '+971563055557');
    this.msgService.create(type, `تم نسخ رقم التواصل`);
  }


  getAccessToken(user: any) {
    let us = JSON.parse(user);
    return us.access_token;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme().then();
  } // end of toggleTheme

  options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: Infinity
  };

  success = (pos: any) => {
    var crd = pos.coords;


    window.localStorage.setItem('user_location:latitude', `${this.lat}`);
    window.localStorage.setItem('user_location:longitude', `${this.lng}`);
    window.localStorage.setItem('user_location:iso_code', `SA`);

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

        this.lat = crd.latitude;
        this.lng = crd.longitude;


        window.localStorage.setItem('user_location:latitude', `${this.lat}`);
        window.localStorage.setItem('user_location:longitude', `${this.lng}`);
        window.localStorage.setItem('user_location:iso_code', `${this.country_iso_code}`);

        this.loadCategories(this.country_iso_code, this.lat, this.lng);

        const reloadHomeCatEvent = new CustomEvent("home:reload_categories", {
          detail: {
            type: '',
            value: []
          },
          bubbles: true,
          cancelable: true,
          composed: false,
        });

        window.dispatchEvent(reloadHomeCatEvent);

        if (this.isLoggedIn) {
          this.loadUserAddresses();
        }




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

    this.lat = window.localStorage.getItem('user_location:latitude');
    this.lng = window.localStorage.getItem('user_location:longitude');
    this.country_iso_code = window.localStorage.getItem('user_location:iso_code');

    if (err.message == 'User denied Geolocation' && !this.lat && !this.lng && !this.country_iso_code) {

      window.localStorage.setItem('user:gps', 'denied');

      if (confirm('قمت برفض طلب الوصول لموقعك الجغرافي, هل ترغب في تحديده على الخريطة؟')) {

        this.handleOpenPickUserLocModal();
      }

    }
    // return false;
  }



  ngOnInit(): void {
    this.registerEvents();
    if (localStorage.getItem('lang') == 'ar') {
      this.trans = ar;
      this.direction = 'rtl';
    } else {
      this.trans = en;
      this.direction = 'ltr';
    }

    if (this.isLoggedIn) {
      this.loadUserAddresses();
    } else {
      this.setCurrentPosition()
    }

    this.loadCategories(this.country_iso_code, this.lat, this.lng);

  } // end of ngOnInit

  public loadUserAddresses() {
    // this.addresses = [];
    this.isLoadingAddresses = true;

    let user: any = window.localStorage.getItem('user');

    if (user) {
      this.access_token = this.getAccessToken(user);
    }

    if (user) {
      this.apiService.getAddresses(this.access_token).subscribe((res: any) => {
        if (res.code == '200') {
          this.addresses = res.data;

          if (this.addresses.length) {
            this.default_address = this.addresses.filter((address) => address.is_default == "1");
            window.localStorage.setItem('user_location:latitude', `${this.default_address[0]?.lat}`);
            window.localStorage.setItem('user_location:longitude', `${this.default_address[0]?.long}`);
            window.localStorage.setItem('user_location:iso_code', `${this.default_address[0]?.country_iso_code}`);
            this.addresses = this.addresses.filter((address) => address.is_default != "1");

          }

          this.isLoadingAddresses = false;

          const updateUIEvent = new CustomEvent("update_ui_evt", {
            detail: {
              type: '',
              data: []
            },
            bubbles: true,
            cancelable: true,
            composed: false,
          });

          window.dispatchEvent(updateUIEvent);
        }
      });
    } else {
      this.setCurrentPosition()
    }

  } // end of loadUserAddresses


  setDefaultAddress(item) {
    // this.addresses = [];
    // this.default_address = [];
    window.localStorage.setItem('user_location:latitude', `${item.lat}`);
    window.localStorage.setItem('user_location:longitude', `${item.long}`);
    window.localStorage.setItem('user_location:iso_code', `${item.country_iso_code}`);

    let user: any = window.localStorage.getItem('user');

    if (user) {


      this.apiService.selectAdddress(item.id, this.access_token).subscribe((res: any) => {

        if (res.code == '200') {
          this.loadUserAddresses();
          this.loadCategories(item.country_iso_code, item.lat, item.long);

          // home:reload_categories

          const reloadHomeCatEvent = new CustomEvent("home:reload_categories", {
            detail: {
              type: '',
              value: []
            },
            bubbles: true,
            cancelable: true,
            composed: false,
          });

          const reloadProductListCatEvent = new CustomEvent("product_list:reload_categories", {
            detail: {
              type: '',
              value: []
            },
            bubbles: true,
            cancelable: true,
            composed: false,
          });

          window.dispatchEvent(reloadHomeCatEvent);
          window.dispatchEvent(reloadProductListCatEvent);
          // this.addresses = res.data;

          // this.isLoadingAddresses = false;

          // const updateUIEvent = new CustomEvent("update_ui_evt", {
          //   detail: {
          //     type: 'orders',
          //     value: res['data']
          //   },
          //   bubbles: true,
          //   cancelable: true,
          //   composed: false,
          // });

          // window.dispatchEvent(updateUIEvent);
        }
      });
    }
  }

  loadCategories(countryId: any, latitude: any, longitude: any) {
    // countryId = 'SA', latitude: any, longitude: any

    this.apiService.getCategories(countryId, latitude, longitude).subscribe((res: any) => {
      if (res['code'] == "200") {
        this.categories = res['data'];


        if (this.categories.length) {
          // for(let i = 0; i < this.categories.length; i++) {
          // let category = this.categories[i];



          const updateUIEvent = new CustomEvent("update_ui_evt", {
            detail: {
              type: '',
            },
            bubbles: true,
            cancelable: true,
            composed: false,
          });

          window.dispatchEvent(updateUIEvent);

          // }
        }
      }
    });
  }

  private setCurrentPosition() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.country_iso_code = "SA";

      window.localStorage.setItem('user_location:latitude', `${this.lat}`);
      window.localStorage.setItem('user_location:longitude', `${this.lng}`);
      window.localStorage.setItem('user_location:iso_code', `${this.country_iso_code}`);
      this.geoCodeLatLng();
    });
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

        this.loadFavorites();
        this.loadCartProducts();
      } else {
        this.country_iso_code = "SA";
      }
    });
  } // end of geoCodeLatLng


  private geoCodePickedUserLoc() {
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
        // this.loadCartProducts();
      }
    });
  } // end of geoCodeLatLng



  toggleDirection(): void {
    if (this.direction == 'ltr') {
      this.setArabic();
    } else {
      this.setEnglish();
    }
  } // end of toggleDirection

  handleLoginStatus(event: any) {
  } // end of handleLoginStatus


  openProduct(id) {
    this.search_results = [];
    this.router.navigateByUrl(`products/${id}`);
  } // end of openProduct

  searchText() {
    this.search_results = [];

    if (this.searchTxt.trim()) {
      this.apiService.searchText(this.searchTxt.trim(), this.country_iso_code, this.lat, this.lng).subscribe((res: any) => {

        if (res.length) {
          this.search_results = res;
        }

      })
    }
  } // end of searchText

  setArabic(): void {
    this.direction = 'rtl';
    localStorage.setItem('lang', 'ar');
    this.trans = ar;
  } // end of setArabic

  setEnglish(): void {
    this.direction = 'ltr';
    localStorage.setItem('lang', 'en');
    this.trans = en;
  } // end of setEnglish



  registerEvents() {

    const handleLogin = (event: any) => {

      window.localStorage.setItem('is_logged_in', JSON.stringify(true));
      window.localStorage.setItem('user', JSON.stringify(event.detail));
      this.isLoggedIn = true;
      // this.router.navigateByUrl('/');
      // this.isVisibleModal = false;
      this.isVisibleAddressModal = false;
      this.isVisibleBranchModal = false;

      if (this.isLoggedIn) {
        this.loadUserAddresses();
      }


      logEvent(this.analytics, 'login_web', {
        user: JSON.stringify(event.detail)
      });
    }; // end of handleLogin

    const handleLogout = (event: any) => {

      window.localStorage.removeItem('is_logged_in');
      window.localStorage.removeItem('user');
      this.isLoggedIn = false;
      this.router.navigateByUrl('/');

    }; // end of handleLogout

    const handleAddItemToCart = (event: any) => {
      // if(this.products.length) {
      this.products.push(event.detail);
      // }
    }; // end of handleAddItemToCart

    const handleRemoveItemFromCart = (event: any) => {

      if (this.products.length) {
        this.products.pop();
      }

    }; // end of handleRemoveItemFromCart

    const handleAddItemToFavorites = (event: any) => {

      // if(this.products.length) {
      this.favorites.push(event.detail);
      // }

    }; // end of handleAddItemToFavorites

    const handleRemoveItemFromFavorites = (event: any) => {

      if (this.favorites.length) {
        this.favorites.pop();
      }

    }; // end of handleRemoveItemFromFavorites

    const handleChangeTheme = (event: any) => {
    }; // end of handleChangeTheme

    const reloadAddresses = (event: any) => {
      // this.addresses = [];
      // this.default_address = [];
      this.loadUserAddresses();
    }

    const handleChangeLang = (event: any) => {
    }; // end of handleChangeLang

    const handleModalView = (event: any) => {

      this.isVisibleModal = true;

    }; // end of handleModalView

    const handleAddressModalView = (event: any) => {
      this.isVisibleAddressModal = true;
    }; // end of handleModalView



    const handleBranchModalView = (event: any) => {
      this.isVisibleAddressModal = true;
    }; // end of handleModalView


    const updateUI = (event: any) => {
      if (event.detail.type == 'cart') {
        this.products = event.detail.value;
      } else if (event.detail.type == 'favorites') {
        this.favorites = event.detail.value;
      }
    }

    window.addEventListener("login_evt", handleLogin);

    window.addEventListener("logout_evt", handleLogout);

    window.addEventListener("add_item_to_cart_evt", handleAddItemToCart);
    window.addEventListener("remove_item_from_cart_evt", handleRemoveItemFromCart);

    window.addEventListener("add_item_to_favorites_evt", handleAddItemToFavorites);
    window.addEventListener("remove_item_from_favorites_evt", handleRemoveItemFromFavorites);

    window.addEventListener("change_theme_evt", handleChangeTheme);

    window.addEventListener("change_lang_evt", handleChangeLang);

    window.addEventListener("login_view_evt", handleModalView);

    window.addEventListener("address_select_view_evt", handleAddressModalView);

    window.addEventListener("update_ui_evt", updateUI);

    window.addEventListener("reload_addresses", reloadAddresses)
  } // end of registerEvents



  private loadFavorites() {
    this.apiService.getUserWishlist(this.lat, this.lng, this.country_iso_code, this.access_token).subscribe((res) => {
      if (res['code'] == '200') {
        this.favorites = res['data']['data'];

        const updateUIEvent = new CustomEvent("update_ui_evt", {
          detail: { type: 'favorites', value: res['data']['data'] },
          bubbles: true,
          cancelable: true,
          composed: false,
        });

        window.dispatchEvent(updateUIEvent);
      }
    });
  } // end of loadFavorites


  private loadCartProducts() {
    this.apiService.getUserShoppingCart(this.lat, this.lng, this.country_iso_code, this.access_token).subscribe((res) => {


      // if(res['code'] == '200') {
      this.products = res['data']['cart']['data'];

      const updateUIEvent = new CustomEvent("update_ui_evt", {
        detail: { type: 'cart', value: res['data']['cart']['data'] },
        bubbles: true,
        cancelable: true,
        composed: false,
      });

      window.dispatchEvent(updateUIEvent);

      // }
    });
  } // end of loadCartProducts


  openCategory(catId) {
    this.router.navigateByUrl(`products/list/${catId}`);
  }

  selectCountry(country) {
    this.selectedCountry = country;
  }
}
