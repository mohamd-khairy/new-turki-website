import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';


@Component({
  selector: 'app-my-favorites',
  templateUrl: './my-favorites.component.html',
  styleUrls: ['./my-favorites.component.less']
})
export class MyFavoritesComponent implements OnInit {

  public isLoggedIn: boolean = false;

  lat:any = 24.7197986;
  lng:any = 47.2684408;

  // user
  public access_token: any;
  public user: any;
  public favorites: any = [];

  // loader
  public isLoadingFavorites: boolean = true;


  // address
  public address_text_location: any = "";
  public country_iso_code: any = "";



  constructor(private apiService: ApiService, private router: Router) {
    let loginStatus =  window.localStorage.getItem('is_logged_in');
    let user =  window.localStorage.getItem('user');

    if(user) {
      this.access_token =  this.getAccessToken(user);
    }


    if(loginStatus != null && user != null) {
        user = JSON.parse(user);

        this.isLoggedIn = true;
        // this.loadUserData(user);
        // this.loadUserAddresses();
        // this.setCurrentPosition();
    }else {
      this.router.navigateByUrl('/');
    }
  }

  getAccessToken(user: any) {
    let us = JSON.parse(user);
    return us.access_token;
  }

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

        this.lat = crd.latitude;
        this.lng = crd.longitude;


        this.loadFavorites();
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




  private loadFavorites() {
    this.isLoadingFavorites = true;

    this.apiService.getUserWishlist(this.lat, this.lng, this.country_iso_code, this.access_token).subscribe((res) => {
      if(res['code'] == '200') {
        this.favorites = res['data']['data'];
        this.isLoadingFavorites = false;
        const updateUIEvent = new CustomEvent("update_ui_evt", {
          detail: {type: 'favorites', value: res['data']['data']},
          bubbles: true,
          cancelable: true,
          composed: false,
        });

        window.dispatchEvent(updateUIEvent);
      }
    });
  } // end of loadFavorites


  deleteFavorite(id: number) {
    if(confirm('هل تود حذف المنتج من المفضلة؟')) {
      this.apiService.removeItemFromWishlist(id, this.lat, this.lng, this.country_iso_code, this.access_token).subscribe((res: any) => {

        if(res['code'] == '200') {
          alert('تم حذف المنتج بنجاح');
          this.loadFavorites();
        }


        // const updateUIEvent = new CustomEvent("update_ui_evt", {
        //   detail: {
        //     type: 'cart',
        //     value: res['data']['cart']['data']
        //   },
        //   bubbles: true,
        //   cancelable: true,
        //   composed: false,
        // });

        // window.dispatchEvent(updateUIEvent);
      });
    }

  } // end of deleteFavorite

  ngOnInit(): void {
    this.lat = window.localStorage.getItem('user_location:latitude');
    this.lng = window.localStorage.getItem('user_location:longitude');
    this.country_iso_code = window.localStorage.getItem('user_location:iso_code');
    if(this.lat && this.lng && this.country_iso_code) {
      this.loadFavorites();
    } else {
      navigator.geolocation.getCurrentPosition(this.success, this.error, this.options);
    }
  } // end of ngOnInit

}



