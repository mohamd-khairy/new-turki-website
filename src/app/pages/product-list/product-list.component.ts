import { Component, OnInit } from '@angular/core';
import { NzMarks } from 'ng-zorro-antd/slider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ThemeService } from '../../theme.service';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { Directionality, Direction } from '@angular/cdk/bidi';
import { ApiService } from '../../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NzDrawerPlacement } from 'ng-zorro-antd/drawer';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.less']
})
export class ProductListComponent implements OnInit {


  public categories: Array<any> = [];
  public bup_categories: Array<any> = [];
  public subcategories: Array<any> = [];

  public address_text_location:string = "";
  public country_iso_code: string = "";

  //
  lat: any = 24.7197986;
  lng: any = 47.2684408;



  items = [];

  topOrderedItems: any[] = [];
  marks: NzMarks = {
    0: '0',
    26: '26',
    37: '37',
    100: {
      style: {
        color: '#f50'
      },
      label: '<strong>100</strong>'
    }
  };
  isCheckedButton = true;
  isDisabledButton = false;
  filter = "topDown";
  public filterTxt = "الأعلى سعراً";

  products: any[] = [];
  public subcaty  = "";

  expandedIndex = 0;

  checkButton(cty: any, products: any): void {
    this.subcaty = cty;

    this.products = products.map((prod: any) => {
      prod.price = parseFloat(prod.price);
      prod.sale_price = parseFloat(prod.sale_price);
      // prod.pos_qty = 0;
      return prod;
    });

    this.changeFilter(this.filter);
    // this.isCheckedButton = !this.isCheckedButton;
  }

  constructor(private apiService: ApiService, private activeRoute: ActivatedRoute, private router: Router) { }

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
    if(this.activeRoute.snapshot.params['cat_id']) {
      if(/^[a-zA-Z]+$/.test(this.activeRoute.snapshot.params['cat_id'])) {
        this.router.navigateByUrl('products/list');
        return;
      }
    }

    // navigator.permissions.query({name:'geolocation'}).then((result) => {
    //     if(result.state == 'granted' || result.state == 'prompt') {
      this.lat = window.localStorage.getItem('user_location:latitude');
      this.lng = window.localStorage.getItem('user_location:longitude');
      this.country_iso_code = window.localStorage.getItem('user_location:iso_code');

      if(this.lat && this.lng && this.country_iso_code) {
        this.activeRoute.params.subscribe((params) => {
          if(params.cat_id) {
              // if(this.bup_categories.length) {
              // } else {
              this.loadCategories(this.country_iso_code, this.lat, this.lng, params.cat_id);
              // }
          } else {
              this.loadCategories(this.country_iso_code, this.lat, this.lng, params.cat_id ? params.cat_id : undefined);
          }
        });
      } else {
        navigator.geolocation.getCurrentPosition(this.success, this.error, this.options);

        this.activeRoute.params.subscribe((params) => {
          if(params.cat_id) {
              // if(this.bup_categories.length) {
              // } else {
              this.loadCategories(this.country_iso_code, this.lat, this.lng, params.cat_id);
              // }
          } else {
              this.loadCategories(this.country_iso_code, this.lat, this.lng, params.cat_id ? params.cat_id : undefined);
          }
        });
      }


    //     } else {
    //       alert('يتطلب تفعيل خدمة الوصول للموقع للإستفادة من الخدمة');
    //     }
    // });

    // this.loadSubCategories();
  } // end of ngOnInit

  registerEvents() {

    const reloadCategories = (event: any) => {
      this.lat = window.localStorage.getItem('user_location:latitude');
      this.lng = window.localStorage.getItem('user_location:longitude');
      this.country_iso_code = window.localStorage.getItem('user_location:iso_code');

      if(this.lat && this.lng && this.country_iso_code) {
        this.activeRoute.params.subscribe((params) => {
          if(params.cat_id) {
              // if(this.bup_categories.length) {
              // } else {
              this.loadCategories(this.country_iso_code, this.lat, this.lng, params.cat_id);
              // }
          } else {
              this.loadCategories(this.country_iso_code, this.lat, this.lng, params.cat_id ? params.cat_id : undefined);
          }
        });
      }
    }

    window.addEventListener("product_list:reload_categories", reloadCategories);
  }



  loadCategories(countryId: any, latitude: any, longitude: any, catId: any) {
    // countryId = 'SA', latitude: any, longitude: any
    this.apiService.getCategories(countryId, latitude, longitude).subscribe((res: any) => {
        if(res['code'] == "200") {

          this.bup_categories = res['data'];

          if(catId) {
            this.categories = this.bup_categories.filter((cate) => cate.id == catId);
          } else {
            this.categories =  this.bup_categories;
          }


          if(this.categories.length) {
            for(let i = 0; i < this.categories.length; i++) {
                let category = catId ? this.categories.filter((cate) => cate.id == catId)[0] : this.categories[i];
                let defCat;

              if(catId) {
                this.apiService.getCatProducts(this.country_iso_code, latitude, longitude, category.id).subscribe((result: any) => {
                  this.subcategories =  [...result['data']] ;
                  this.subcategories = this.subcategories.filter((subcat) => subcat.products.length);
                  defCat = this.subcategories.filter((cat) => catId ? cat.id == this.subcategories[0].id : cat.id == 106);

                  if(defCat.length) {
                    this.checkButton(defCat[0].id, defCat[0].products);
                  }

                  const updateUIEvent = new CustomEvent("update_ui_evt", {
                    detail: {
                      type: '',
                    },
                    bubbles: true,
                    cancelable: true,
                    composed: false,
                  });
                  window.dispatchEvent(updateUIEvent);
                });


                return;
              }
              // end
              this.apiService.getCatProducts(this.country_iso_code, latitude, longitude, category.id).subscribe((result: any) => {

                this.subcategories =  [...this.subcategories, ...result['data']] ;

                this.subcategories = this.subcategories.filter((subcat) => subcat.products.length);

                let defCat = this.subcategories.filter((cat) => catId ? cat.id == this.subcategories[0].id : cat.id == 106);

                if(defCat.length) {
                  this.checkButton(defCat[0].id, defCat[0].products);
                }

                const updateUIEvent = new CustomEvent("update_ui_evt", {
                detail: {
                  type: '',
                },
                bubbles: true,
                cancelable: true,
                composed: false,
              });

              window.dispatchEvent(updateUIEvent);
            });
            }
          }
        }
    });
  }

  changeFilter(filter: any) {

    if(filter == "topDown") {
      this.products.sort((a, b) => {
        return b.price - a.price;
      });
      this.filterTxt = "الأعلى سعراً";

    }else if(filter == "downTop") {
      this.products.sort((a, b) => {
        return a.price - b.price;
      });
      this.filterTxt = "الأقل سعراً";

    }else if(filter == "leastCal") {
      this.products.sort((a, b) => {
        return a.calories - b.calories;
      });
      this.filterTxt = "الأقل سعرة حرارية";

    }else if(filter == "mostCal") {
      this.products.sort((a, b) => {
        return b.calories - a.calories;
      });
      this.filterTxt = "الأعلى سعرة حرارية";

    }

    this.filter = filter;
  }




  // loadSubCategories() {
  //   this.apiService.getSuCategories().subscribe((res: any) => {
  //     if(res['code'] == "200") {
  //       this.subcategories = res['data'];
  //       let defCat = this.subcategories.filter((cat) => cat.id == 106);

  //       this.checkButton(defCat[0].id, defCat[0].products);
  //     }
  //   });
  // }


}
