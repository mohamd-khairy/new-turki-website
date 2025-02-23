import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NguCarousel, NguCarouselConfig } from '@ngu/carousel';
import { ApiService } from 'src/app/api.service';


import { getAnalytics, logEvent } from "firebase/analytics";
import { animate } from '@angular/animations';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent  implements OnInit {
  name = 'Angular';
  slideNo = 0;
  withAnim = true;
  resetAnim = true;
  showScroll: boolean = false;

  isVisibleMiddle = false;

  public lat: any = 24.7905057;
  public lng: any = 46.6578704;


  orderSelectedAddress: any = "";

  // address
  public address_text_location: any = "";
  public country_iso_code: any = "SA";


  public categories: Array<any> = [];

  public analytics;


  scrollItems: any[] = [];
  topOrderedItems: any[] = [];

  @ViewChild('myCarousel') myCarousel: any;
  @ViewChild('slideTitle', { read: ElementRef, static:false }) slideTtl: any;

  carouselConfig: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    load: 3,
    interval: {timing: 4000, initialDelay: 1000},
    loop: true,
    touch: true,
    velocity: 0.2,
    animation: 'lazy'
  }

  carouselItems =
  [
    {
      id: 1,
      title: "إستمتع بأشهى اللحوم الطازجة",
      btn_title: "تسوق الآن",
      src: "/assets/images/header/slider-bg-old.png"
    },
    // {
    //   id: 1,
    //   title: "إستمتع بأشهى اللحوم الطازجة",
    //   btn_title: "تسوق الآن",
    //   src: "/assets/images/header/slider-bg-old.png"
    // },
    // {
    //   id: 2,
    //   title: "Enjoy The most appetizing fresh meat",
    //   btn_title: "Shop Now",
    //   src: "/assets/images/header/slider-bg-old.png"
    // }
  ];
  // "/assets/images/header/slider-bg.png", "/assets/images/header/slider-bg.png", "/assets/images/header/slider-bg.png"

  constructor(private cdr: ChangeDetectorRef, private router: Router, private apiService: ApiService) {
    this.analytics = getAnalytics();
  }

  showModalMiddle(): void {
    this.isVisibleMiddle = true;
  }

  handleOkMiddle(): void {
    this.isVisibleMiddle = false;
  }

  handleCancelMiddle(): void {
    this.isVisibleMiddle = false;
  }

  handleToggleModal(): void {
   this.isVisibleMiddle = !this.isVisibleMiddle;
  }

  handleOpenModal(): void {
    this.isVisibleMiddle = true;
  }

//   private setCurrentPosition() {

//     if(this.orderSelectedAddress) {
//         this.lat = parseFloat(this.orderSelectedAddress.lat);
//         this.lng = parseFloat(this.orderSelectedAddress.long);

//         this.geoCodeLatLng();


//     }else {
//       navigator.geolocation.getCurrentPosition((position) => {
//         this.lat = position.coords.latitude;
//         this.lng = position.coords.longitude;

//         this.geoCodeLatLng();
//         // this.loadMostOrdered();

//       });
//     }

// } // end of setCurrentPosition


// private setCurrentPosition() {
//   navigator.geolocation.getCurrentPosition((position) => {
//     this.lat = position.coords.latitude;
//     this.lng = position.coords.longitude;
//     this.geoCodeLatLng();

//   });
// } // end of setCurrentPosition

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

      this.address_text_location = results[0].formatted_address;

      let country = results[0].address_components.filter((address) => address.types.includes('country'));

      if(country.length) {
        this.country_iso_code = country[0].short_name;
      }else {
        this.country_iso_code = "SA";
      }

      this.loadMostOrdered();
      this.loadCategories(this.country_iso_code, this.lat, this.lng);


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


ngOnInit(): void {

  this.registerEvents();
  this.lat = window.localStorage.getItem('user_location:latitude');
  this.lng = window.localStorage.getItem('user_location:longitude');
  this.country_iso_code = window.localStorage.getItem('user_location:iso_code');

  if(this.lat && this.lng && this.country_iso_code) {
    // loadCategories
    this.loadMostOrdered();
    this.loadCategories(this.country_iso_code, this.lat, this.lng);
  } else {
    navigator.geolocation.getCurrentPosition(this.success, this.error, this.options);
    this.loadCategories('SA','24.8059573', '46.6508903');
    this.loadMostOrdered('24.8059573', '46.6508903','SA');
  }

  // logEvent(this.analytics, 'open_web_app', {
  //   username: 'true',
  //   mobile: 'true'
  // });

  // logEvent()

} // end of ngOnInit

registerEvents() {

  const reloadCategories = (event: any) => {
    // this.addresses = [];
    // this.default_address = [];

    this.lat = window.localStorage.getItem('user_location:latitude');
    this.lng = window.localStorage.getItem('user_location:longitude');
    this.country_iso_code = window.localStorage.getItem('user_location:iso_code');

    if(this.lat && this.lng && this.country_iso_code) {
      // loadCategories
      this.loadMostOrdered();
      this.loadCategories(this.country_iso_code, this.lat, this.lng);
    }
    // this.loadUserAddresses();
  }

  window.addEventListener("home:reload_categories", reloadCategories);
} // end of resigterEvents

mapFirstColor(category) {

  return category['background color 1'];
}

mapSecondColor(category) {
  return category['background color 2'];
}


  loadMostOrdered(lat = this.lat, lng = this.lng, country_iso_code = this.country_iso_code) {
    this.apiService.getMostOrderedItems(lat, lng, country_iso_code).subscribe((res: any) => {


      if(res['code'] == '200') {
        // this.topOrderedItems = res['data'];
        this.topOrderedItems = res['data'].map((prod: any) => {
          prod.price = parseFloat(prod.price);
          prod.sale_price = parseFloat(prod.sale_price);
          return prod;
        });
      }
    });
  } // end of loadMostOrdered


  // private geoCodeLatLng() {
  //   let geocoder = new google.maps.Geocoder();

  //   var request = {
  //     location: {lat: this.lat, lng: this.lng}
  //   };

  //   geocoder.geocode(request, (results, status) => {
  //     if (status === google.maps.GeocoderStatus.OK) {

  //       this.address_text_location = results[0].formatted_address;

  //       let country = results[0].address_components.filter((address) => address.types.includes('country'));

  //       if(country.length) {
  //         this.country_iso_code = country[0].short_name;
  //         this.loadMostOrdered();
  //         this.loadCategories(this.country_iso_code, this.lat, this.lng);
  //       }else {
  //         this.country_iso_code = "SA";
  //         this.loadMostOrdered();
  //         this.loadCategories(this.country_iso_code, this.lat, this.lng);
  //       }

  //       // this.loadFavorites();
  //       // this.loadCartProducts();
  //       // this.loadPaymentTypes();
  //       // this.loadDeliveryPeriods();
  //       // this.loadUserAddresses();

  //
  //     }
  //   });
  // } // end of geoCodeLatLng

  loadCategories(countryId: any, latitude: any , longitude: any) {
    // countryId = 'SA', latitude: any, longitude: any
    this.apiService.getCategories(countryId, latitude, longitude).subscribe((res: any) => {
        if(res['code'] == "200") {

          // for(let i = 0; i < res['data'].length; i++) {
          //   res['data'][i]['background_color_1'] = res['data'][i]['background color 1'];
          //   res['data'][i]['background_color_2'] = res['data'][i]['background color 2'];

          //
          // }

          this.categories = res['data'];


          if(this.categories.length) {
            // for(let i = 0; i < this.categories.length; i++) {
              // let category = this.categories[i];

              logEvent(this.analytics, 'categories_web', {});


              // const updateUIEvent = new CustomEvent("update_ui_evt", {
              //   detail: {
              //     type: '',
              //   },
              //   bubbles: true,
              //   cancelable: true,
              //   composed: false,
              // });

              // window.dispatchEvent(updateUIEvent);

            // }
          }
        }
    });
  }


  setStyle(category) {
    let styles = {
      // 'background': 'linear-gradient( '  + category['background color 2'] + ', ' + category['background color 1'] + ' )',
      'background': 'linear-gradient( #6D1442  ,#6D1442b2)',
      'border-radius': '24px',
      'margin': '10px 10px'
    };
    return styles;
  }


  onmoveFn(event) {
    // this.slideTtl.nativeElement.classList.value = ""
    // this.slideTtl.nativeElement.classList.add("animate__animated");
    // this.slideTtl.nativeElement.classList.add("animate__fadeInUp");

    // setTimeout(() => {
      // this.slideTtl.nativeElement.classList = [];

      // this.slideTtl.nativeElement.classList.remove("animate__animated animate__fadeInUp");
    // }, 100);

    // setTimeout(() => {
      // this.namebutton.nativeElement.classList.remove('class-to-remove')

    // }, 300);


  }

  carouselTileLoad(event) {
    setTimeout(() => {
      this.slideTtl.nativeElement.classList.remove('animate__animated');
      this.slideTtl.nativeElement.classList.remove("animate__fadeInUp");
    }, 100);


    setTimeout(() => {
      this.slideTtl.nativeElement.classList.add("animate__animated");
      this.slideTtl.nativeElement.classList.add("animate__fadeInUp");
    }, 200);
  }




  openCategory(catId) {
    this.router.navigateByUrl(`products/list/${catId}`);
  }




  openProduct(id: number) {
    // href="#/products/{{product.id}}"
    this.router.navigateByUrl(`products/${id}`);
    // this.ngOnInit();
  } // end of openProduct


  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  reset() {
    this.myCarousel.reset(!this.resetAnim);
  }

  moveTo(slide: any) {
    this.myCarousel.moveTo(slide, !this.withAnim);
  }

}
