import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// import {  shareReplay, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private url: string = "";

  // private baseUrl = "https://turkidabayeh.com/dashboard/api/v2";
  // private baseUrl = "https://almaraacompany.com/dashboard/api/v2";
  private baseUrl = "http://new-turki-project-backend.test/api/v2";
  private products_url: string = `${this.baseUrl}/products`;
  private categories_url: string = `${this.baseUrl}/categories`;
  private discount_cat_url: string = `${this.baseUrl}/discounts/categories`;
  private periods_url: string = `${this.baseUrl}/delivery-period`;
  private send_otp_url: string = `${this.baseUrl}/sendOtpCode`; //verfiyOtpCode
  private verify_otp_code_url: string = `${this.baseUrl}/verfiyOtpCode`;
  private customers_url: string = `${this.baseUrl}/customers`;

  // product
  private upload_product_images: string = `${this.products_url}/add-product-images`;
  private best_seller: string = `${this.products_url}/best-seller`;

  // user
  private update_user: string = `${this.customers_url}/edit-profile`;
  private view_user: string = `${this.customers_url}/show-profile`;
  private user_addresses: string = `${this.customers_url}/get-addresses`;
  private user_orders: string = `${this.baseUrl}/orders/get-order`;
  private create_orders: string = `${this.baseUrl}/orders`;
  private user_wishlist: string = `${this.baseUrl}/wishlists`;
  private user_cart: string = `${this.baseUrl}/carts`;
  private add_address: string = `${this.customers_url}/add-address`;
  private delete_address: string = `${this.customers_url}/delete-address`;
  private select_address: string = `${this.customers_url}/selected-address`;


  // cart endpoints
  private add_to_cart: string = `${this.user_cart}/add-to-cart`;
  private update_cart: string = `${this.user_cart}/update-cart`;
  private delete_from_cart: string = `${this.user_cart}/delete-cart`;
  private check_coupon: string = `${this.user_cart}/check-coupon`;


  // wishlist enpoints
  private add_to_wishlist: string = `${this.user_wishlist}/add-to-wishlist`;
  private remove_from_wishlist: string = `${this.user_wishlist}/remove-from-wishlist`;

  // payment types
  private payment_type: string = `${this.baseUrl}/payment-types`;

  // delivery dates
  private delivery_date_periods: string = `${this.baseUrl}/delivery-period`;

  // submit order
  private create_order: string = `${this.create_orders}/add-order`;


  constructor(private http: HttpClient) { }

  getProducts(current_page: number, num_of_results: number) {
    return this.http.get(`${this.products_url}?page=${current_page}&per_page=${num_of_results}`);
  }

  getProduct(productId: number, countryId = 'SA', latitude: any, longitude: any) {
    return this.http.get(`${this.products_url}/getProduct/${productId}?countryId=${countryId}&latitude=${latitude}&longitude=${longitude}`);
  }

  getCategories(countryId = 'SA', latitude: any, longitude: any) {
    // categories/categories-app?longitude=46.65078446080913&latitude=24.806303456835685&countryId=SA
    return this.http.get(`${this.categories_url}/categories-app?longitude=${longitude}&latitude=${latitude}&countryId=${countryId}`);
  }

  getCatProducts(countryId = 'SA', latitude: any, longitude: any, categoryId: any) {
    return this.http.get(`${this.products_url}/by-category/${categoryId}?longitude=${longitude}&latitude=${latitude}&countryId=${countryId}`);
  }

  searchText(searchTxt: string, countryId = 'SA', latitude: any, longitude: any) {
    return this.http.get(`${this.products_url}/search/${searchTxt}?longitude=${longitude}&latitude=${latitude}&countryId=${countryId}`);
  }


  sendOTP(data: any) {
    // mobile
    let headers = new HttpHeaders();

    // headers = headers.append("Content-Type", "application/json");
    // headers = headers.append("Accept", "application/json");
    // headers.set("Content-Type", "multipart/form-data");
    // headers = headers.append("Authorization", "Bearer 18200|jqUznUj1fXPO11KvQN3sa6BETNrphDr5GKea9oS3");
    // headers = headers.append("Cookie", "XSRF-TOKEN=eyJpdiI6InBlQVhCOE5ScVVkU29YYlFLejJCaVE9PSIsInZhbHVlIjoiK2xGVHVlSXVmVEdhMU5yT3RQNGtNSUlnaWZFQm0yOEo5eVU0Wks2UGxIOHBVVkZlQUllSnpoS01KT0lSVnU4UnZKc1JzbmE3NGtxQUIzUllCSTZZY1U2N1NkNGMxVkJoWERra3dodmVTNGltdytneE9INnAyRGRwQ0JjUzZad0oiLCJtYWMiOiJhYTI3MGE2NzEyMGQzYjg5Y2VlYjgwMWUwYjkxZjI0ODQ3YTc5NzMyZDhmY2RjYjY3ZDk2YmFiMTAwY2IwOGEyIiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6IlhBRmx4MHpCRy9tUXBYU1dDRkRjTEE9PSIsInZhbHVlIjoiS1lidmpRdnVvUk1FUFpuOVp6UUsrMDZKd2c4MTgzUy9hSkJ5SmxsUEprTi9iSTBuQWltanRKSTFKRlp3c0oyeDJ4K0RvYjF1UnNkNVRtZ0srWW5IVldqMzdPM2g4bEdyRFJlaDRKMkpxeXFDVFM2SGNvOTJHRXRneExzYVhheFQiLCJtYWMiOiJmZDFjYzc1OGMwMDI3MGE1NTUxMDk5ZjBjMWI3YmMyZGE4MGZlNjI4Yzk4MDJjOTg4ODFiZjZjNWI1OTM2NTFhIiwidGFnIjoiIn0%3D");

    return this.http.post(this.send_otp_url, data, { 'headers': headers });
  }


  verifyOTP(data: any) {
    // mobile
    // mobile_verification_code
    let headers = new HttpHeaders();

    // headers = headers.append("Content-Type", "application/json");
    // headers = headers.append("Accept", "application/json");
    // headers.set("Content-Type", "multipart/form-data");
    // headers = headers.append("Authorization", "Bearer 18200|jqUznUj1fXPO11KvQN3sa6BETNrphDr5GKea9oS3");
    // headers = headers.append("Cookie", "XSRF-TOKEN=eyJpdiI6InBlQVhCOE5ScVVkU29YYlFLejJCaVE9PSIsInZhbHVlIjoiK2xGVHVlSXVmVEdhMU5yT3RQNGtNSUlnaWZFQm0yOEo5eVU0Wks2UGxIOHBVVkZlQUllSnpoS01KT0lSVnU4UnZKc1JzbmE3NGtxQUIzUllCSTZZY1U2N1NkNGMxVkJoWERra3dodmVTNGltdytneE9INnAyRGRwQ0JjUzZad0oiLCJtYWMiOiJhYTI3MGE2NzEyMGQzYjg5Y2VlYjgwMWUwYjkxZjI0ODQ3YTc5NzMyZDhmY2RjYjY3ZDk2YmFiMTAwY2IwOGEyIiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6IlhBRmx4MHpCRy9tUXBYU1dDRkRjTEE9PSIsInZhbHVlIjoiS1lidmpRdnVvUk1FUFpuOVp6UUsrMDZKd2c4MTgzUy9hSkJ5SmxsUEprTi9iSTBuQWltanRKSTFKRlp3c0oyeDJ4K0RvYjF1UnNkNVRtZ0srWW5IVldqMzdPM2g4bEdyRFJlaDRKMkpxeXFDVFM2SGNvOTJHRXRneExzYVhheFQiLCJtYWMiOiJmZDFjYzc1OGMwMDI3MGE1NTUxMDk5ZjBjMWI3YmMyZGE4MGZlNjI4Yzk4MDJjOTg4ODFiZjZjNWI1OTM2NTFhIiwidGFnIjoiIn0%3D");

    return this.http.post(this.verify_otp_code_url, data, { 'headers': headers });
  }



  updateProfile(data: any, access_token: string) {
    // name - email - avatar - age - gender - nationality -
    // mobile_verification_code
    let headers = new HttpHeaders();

    // headers = headers.append("Content-Type", "application/json");
    // headers = headers.append("Accept", "application/json");
    // headers.set("Content-Type", "multipart/form-data");
    headers = headers.append("Authorization", `Bearer ${access_token}`);
    // headers = headers.append("Cookie", "XSRF-TOKEN=eyJpdiI6InBlQVhCOE5ScVVkU29YYlFLejJCaVE9PSIsInZhbHVlIjoiK2xGVHVlSXVmVEdhMU5yT3RQNGtNSUlnaWZFQm0yOEo5eVU0Wks2UGxIOHBVVkZlQUllSnpoS01KT0lSVnU4UnZKc1JzbmE3NGtxQUIzUllCSTZZY1U2N1NkNGMxVkJoWERra3dodmVTNGltdytneE9INnAyRGRwQ0JjUzZad0oiLCJtYWMiOiJhYTI3MGE2NzEyMGQzYjg5Y2VlYjgwMWUwYjkxZjI0ODQ3YTc5NzMyZDhmY2RjYjY3ZDk2YmFiMTAwY2IwOGEyIiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6IlhBRmx4MHpCRy9tUXBYU1dDRkRjTEE9PSIsInZhbHVlIjoiS1lidmpRdnVvUk1FUFpuOVp6UUsrMDZKd2c4MTgzUy9hSkJ5SmxsUEprTi9iSTBuQWltanRKSTFKRlp3c0oyeDJ4K0RvYjF1UnNkNVRtZ0srWW5IVldqMzdPM2g4bEdyRFJlaDRKMkpxeXFDVFM2SGNvOTJHRXRneExzYVhheFQiLCJtYWMiOiJmZDFjYzc1OGMwMDI3MGE1NTUxMDk5ZjBjMWI3YmMyZGE4MGZlNjI4Yzk4MDJjOTg4ODFiZjZjNWI1OTM2NTFhIiwidGFnIjoiIn0%3D");

    return this.http.post(this.update_user, data, { 'headers': headers });
  } // end of updateProfile


  addNewAdddress(data: any, access_token: string) {
    // name - email - avatar - age - gender - nationality -
    // mobile_verification_code
    let headers = new HttpHeaders();

    // headers = headers.append("Content-Type", "application/json");
    // headers = headers.append("Accept", "application/json");
    // headers.set("Content-Type", "multipart/form-data");
    headers = headers.append("Authorization", `Bearer ${access_token}`);
    // headers = headers.append("Cookie", "XSRF-TOKEN=eyJpdiI6InBlQVhCOE5ScVVkU29YYlFLejJCaVE9PSIsInZhbHVlIjoiK2xGVHVlSXVmVEdhMU5yT3RQNGtNSUlnaWZFQm0yOEo5eVU0Wks2UGxIOHBVVkZlQUllSnpoS01KT0lSVnU4UnZKc1JzbmE3NGtxQUIzUllCSTZZY1U2N1NkNGMxVkJoWERra3dodmVTNGltdytneE9INnAyRGRwQ0JjUzZad0oiLCJtYWMiOiJhYTI3MGE2NzEyMGQzYjg5Y2VlYjgwMWUwYjkxZjI0ODQ3YTc5NzMyZDhmY2RjYjY3ZDk2YmFiMTAwY2IwOGEyIiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6IlhBRmx4MHpCRy9tUXBYU1dDRkRjTEE9PSIsInZhbHVlIjoiS1lidmpRdnVvUk1FUFpuOVp6UUsrMDZKd2c4MTgzUy9hSkJ5SmxsUEprTi9iSTBuQWltanRKSTFKRlp3c0oyeDJ4K0RvYjF1UnNkNVRtZ0srWW5IVldqMzdPM2g4bEdyRFJlaDRKMkpxeXFDVFM2SGNvOTJHRXRneExzYVhheFQiLCJtYWMiOiJmZDFjYzc1OGMwMDI3MGE1NTUxMDk5ZjBjMWI3YmMyZGE4MGZlNjI4Yzk4MDJjOTg4ODFiZjZjNWI1OTM2NTFhIiwidGFnIjoiIn0%3D");

    return this.http.post(this.add_address, data, { 'headers': headers });
  } // end of addNewAddress


  applyCoupon(data: any, access_token: string, lat: any, lng: any, iso_code: any) {

    let headers = new HttpHeaders();

    // headers = headers.append("Content-Type", "application/json");
    // headers = headers.append("Accept", "application/json");
    // headers.set("Content-Type", "multipart/form-data");
    headers = headers.append("Authorization", `Bearer ${access_token}`);
    // headers = headers.append("Cookie", "XSRF-TOKEN=eyJpdiI6InBlQVhCOE5ScVVkU29YYlFLejJCaVE9PSIsInZhbHVlIjoiK2xGVHVlSXVmVEdhMU5yT3RQNGtNSUlnaWZFQm0yOEo5eVU0Wks2UGxIOHBVVkZlQUllSnpoS01KT0lSVnU4UnZKc1JzbmE3NGtxQUIzUllCSTZZY1U2N1NkNGMxVkJoWERra3dodmVTNGltdytneE9INnAyRGRwQ0JjUzZad0oiLCJtYWMiOiJhYTI3MGE2NzEyMGQzYjg5Y2VlYjgwMWUwYjkxZjI0ODQ3YTc5NzMyZDhmY2RjYjY3ZDk2YmFiMTAwY2IwOGEyIiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6IlhBRmx4MHpCRy9tUXBYU1dDRkRjTEE9PSIsInZhbHVlIjoiS1lidmpRdnVvUk1FUFpuOVp6UUsrMDZKd2c4MTgzUy9hSkJ5SmxsUEprTi9iSTBuQWltanRKSTFKRlp3c0oyeDJ4K0RvYjF1UnNkNVRtZ0srWW5IVldqMzdPM2g4bEdyRFJlaDRKMkpxeXFDVFM2SGNvOTJHRXRneExzYVhheFQiLCJtYWMiOiJmZDFjYzc1OGMwMDI3MGE1NTUxMDk5ZjBjMWI3YmMyZGE4MGZlNjI4Yzk4MDJjOTg4ODFiZjZjNWI1OTM2NTFhIiwidGFnIjoiIn0%3D");


    return this.http.post(`${this.check_coupon}?longitude=${lng}&latitude=${lat}&countryId=${iso_code}`, data, { 'headers': headers });
  } // end of addNewAddress


  deleteAdddress(id: number, access_token: string) {
    // name - email - avatar - age - gender - nationality -
    // mobile_verification_code
    let headers = new HttpHeaders();

    // headers = headers.append("Content-Type", "application/json");
    // headers = headers.append("Accept", "application/json");
    // headers.set("Content-Type", "multipart/form-data");
    headers = headers.append("Authorization", `Bearer ${access_token}`);
    // headers = headers.append("Cookie", "XSRF-TOKEN=eyJpdiI6InBlQVhCOE5ScVVkU29YYlFLejJCaVE9PSIsInZhbHVlIjoiK2xGVHVlSXVmVEdhMU5yT3RQNGtNSUlnaWZFQm0yOEo5eVU0Wks2UGxIOHBVVkZlQUllSnpoS01KT0lSVnU4UnZKc1JzbmE3NGtxQUIzUllCSTZZY1U2N1NkNGMxVkJoWERra3dodmVTNGltdytneE9INnAyRGRwQ0JjUzZad0oiLCJtYWMiOiJhYTI3MGE2NzEyMGQzYjg5Y2VlYjgwMWUwYjkxZjI0ODQ3YTc5NzMyZDhmY2RjYjY3ZDk2YmFiMTAwY2IwOGEyIiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6IlhBRmx4MHpCRy9tUXBYU1dDRkRjTEE9PSIsInZhbHVlIjoiS1lidmpRdnVvUk1FUFpuOVp6UUsrMDZKd2c4MTgzUy9hSkJ5SmxsUEprTi9iSTBuQWltanRKSTFKRlp3c0oyeDJ4K0RvYjF1UnNkNVRtZ0srWW5IVldqMzdPM2g4bEdyRFJlaDRKMkpxeXFDVFM2SGNvOTJHRXRneExzYVhheFQiLCJtYWMiOiJmZDFjYzc1OGMwMDI3MGE1NTUxMDk5ZjBjMWI3YmMyZGE4MGZlNjI4Yzk4MDJjOTg4ODFiZjZjNWI1OTM2NTFhIiwidGFnIjoiIn0%3D");

    return this.http.post(`${this.delete_address}/${id}`, {}, { 'headers': headers });
  } // end of deleteAddress


  selectAdddress(id: number, access_token: string) {
    // name - email - avatar - age - gender - nationality -
    // mobile_verification_code
    let headers = new HttpHeaders();

    // headers = headers.append("Content-Type", "application/json");
    // headers = headers.append("Accept", "application/json");
    // headers.set("Content-Type", "multipart/form-data");
    headers = headers.append("Authorization", `Bearer ${access_token}`);
    // headers = headers.append("Cookie", "XSRF-TOKEN=eyJpdiI6InBlQVhCOE5ScVVkU29YYlFLejJCaVE9PSIsInZhbHVlIjoiK2xGVHVlSXVmVEdhMU5yT3RQNGtNSUlnaWZFQm0yOEo5eVU0Wks2UGxIOHBVVkZlQUllSnpoS01KT0lSVnU4UnZKc1JzbmE3NGtxQUIzUllCSTZZY1U2N1NkNGMxVkJoWERra3dodmVTNGltdytneE9INnAyRGRwQ0JjUzZad0oiLCJtYWMiOiJhYTI3MGE2NzEyMGQzYjg5Y2VlYjgwMWUwYjkxZjI0ODQ3YTc5NzMyZDhmY2RjYjY3ZDk2YmFiMTAwY2IwOGEyIiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6IlhBRmx4MHpCRy9tUXBYU1dDRkRjTEE9PSIsInZhbHVlIjoiS1lidmpRdnVvUk1FUFpuOVp6UUsrMDZKd2c4MTgzUy9hSkJ5SmxsUEprTi9iSTBuQWltanRKSTFKRlp3c0oyeDJ4K0RvYjF1UnNkNVRtZ0srWW5IVldqMzdPM2g4bEdyRFJlaDRKMkpxeXFDVFM2SGNvOTJHRXRneExzYVhheFQiLCJtYWMiOiJmZDFjYzc1OGMwMDI3MGE1NTUxMDk5ZjBjMWI3YmMyZGE4MGZlNjI4Yzk4MDJjOTg4ODFiZjZjNWI1OTM2NTFhIiwidGFnIjoiIn0%3D");

    return this.http.post(`${this.select_address}/${id}`, {}, { 'headers': headers });
  } // end of selectAddress


  viewProfile(access_token: string) {
    let headers = new HttpHeaders();

    // headers = headers.append("Content-Type", "application/json");
    // headers = headers.append("Accept", "application/json");
    // headers.set("Content-Type", "multipart/form-data");
    headers = headers.append("Authorization", `Bearer ${access_token}`);


    return this.http.get(this.view_user, { 'headers': headers });
  } // end of viewProfile

  getAddresses(access_token: string) {
    let headers = new HttpHeaders();

    // headers = headers.append("Content-Type", "application/json");
    // headers = headers.append("Accept", "application/json");
    // headers.set("Content-Type", "multipart/form-data");
    headers = headers.append("Authorization", `Bearer ${access_token}`);


    return this.http.get(this.user_addresses, { 'headers': headers });
  } // end of getAddresses


  getDeliveryPeriods(access_token: string) {
    let headers = new HttpHeaders();

    // headers = headers.append("Content-Type", "application/json");
    // headers = headers.append("Accept", "application/json");
    // headers.set("Content-Type", "multipart/form-data");
    headers = headers.append("Authorization", `Bearer ${access_token}`);


    return this.http.get(this.delivery_date_periods, { 'headers': headers });
  } // end of getDeliveryPeriods


  getOrders(access_token: string) {
    let headers = new HttpHeaders();

    // headers = headers.append("Content-Type", "application/json");
    // headers = headers.append("Accept", "application/json");
    // headers.set("Content-Type", "multipart/form-data");
    headers = headers.append("Authorization", `Bearer ${access_token}`);


    return this.http.get(this.user_orders, { 'headers': headers });
  } // end of getOrders


  getUserWishlist(lat: any, lng: any, iso_code: any, access_token: string) {
    let headers = new HttpHeaders();

    // headers = headers.append("Content-Type", "application/json");
    // headers = headers.append("Accept", "application/json");
    // headers.set("Content-Type", "multipart/form-data");
    headers = headers.append("Authorization", `Bearer ${access_token}`);


    return this.http.get(`${this.user_wishlist}?longitude=${lng}&latitude=${lat}&countryId=${iso_code}&page=1&per_page=1000`, { 'headers': headers });
  } // end of getUserWishlist


  getUserShoppingCart(lat: any, lng: any, iso_code: any, access_token: string) {
    let headers = new HttpHeaders();

    // headers = headers.append("Content-Type", "application/json");
    // headers = headers.append("Accept", "application/json");
    // headers.set("Content-Type", "multipart/form-data");
    headers = headers.append("Authorization", `Bearer ${access_token}`);


    return this.http.get(`${this.user_cart}?longitude=${lng}&latitude=${lat}&countryId=${iso_code}&page=1&per_page=1000`, { 'headers': headers });
  } // end of getUserShoppingCart


  addItemToCart(data: any, lat: any, lng: any, iso_code: string, access_token: string) {
    // name - email - avatar - age - gender - nationality -
    // mobile_verification_code
    let headers = new HttpHeaders();
    // ?longitude=46.65079518939412&latitude=24.80643980136584&countryId=SA
    // headers = headers.append("Content-Type", "application/json");
    // headers = headers.append("Accept", "application/json");
    // headers.set("Content-Type", "multipart/form-data");
    headers = headers.append("Authorization", `Bearer ${access_token}`);
    // headers = headers.append("Cookie", "XSRF-TOKEN=eyJpdiI6InBlQVhCOE5ScVVkU29YYlFLejJCaVE9PSIsInZhbHVlIjoiK2xGVHVlSXVmVEdhMU5yT3RQNGtNSUlnaWZFQm0yOEo5eVU0Wks2UGxIOHBVVkZlQUllSnpoS01KT0lSVnU4UnZKc1JzbmE3NGtxQUIzUllCSTZZY1U2N1NkNGMxVkJoWERra3dodmVTNGltdytneE9INnAyRGRwQ0JjUzZad0oiLCJtYWMiOiJhYTI3MGE2NzEyMGQzYjg5Y2VlYjgwMWUwYjkxZjI0ODQ3YTc5NzMyZDhmY2RjYjY3ZDk2YmFiMTAwY2IwOGEyIiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6IlhBRmx4MHpCRy9tUXBYU1dDRkRjTEE9PSIsInZhbHVlIjoiS1lidmpRdnVvUk1FUFpuOVp6UUsrMDZKd2c4MTgzUy9hSkJ5SmxsUEprTi9iSTBuQWltanRKSTFKRlp3c0oyeDJ4K0RvYjF1UnNkNVRtZ0srWW5IVldqMzdPM2g4bEdyRFJlaDRKMkpxeXFDVFM2SGNvOTJHRXRneExzYVhheFQiLCJtYWMiOiJmZDFjYzc1OGMwMDI3MGE1NTUxMDk5ZjBjMWI3YmMyZGE4MGZlNjI4Yzk4MDJjOTg4ODFiZjZjNWI1OTM2NTFhIiwidGFnIjoiIn0%3D");


    return this.http.post(`${this.add_to_cart}?longitude=${lng}&latitude=${lat}&countryId=${iso_code}`, data, { 'headers': headers });
  } // end of addItemToCart


  updateCart(id: number, data: any, lat: any, lng: any, iso_code: string, access_token: string) {
    // name - email - avatar - age - gender - nationality -
    // mobile_verification_code
    let headers = new HttpHeaders();
    // ?longitude=46.65079518939412&latitude=24.80643980136584&countryId=SA
    // headers = headers.append("Content-Type", "application/json");
    // headers = headers.append("Accept", "application/json");
    // headers.set("Content-Type", "multipart/form-data");
    headers = headers.append("Authorization", `Bearer ${access_token}`);
    // headers = headers.append("Cookie", "XSRF-TOKEN=eyJpdiI6InBlQVhCOE5ScVVkU29YYlFLejJCaVE9PSIsInZhbHVlIjoiK2xGVHVlSXVmVEdhMU5yT3RQNGtNSUlnaWZFQm0yOEo5eVU0Wks2UGxIOHBVVkZlQUllSnpoS01KT0lSVnU4UnZKc1JzbmE3NGtxQUIzUllCSTZZY1U2N1NkNGMxVkJoWERra3dodmVTNGltdytneE9INnAyRGRwQ0JjUzZad0oiLCJtYWMiOiJhYTI3MGE2NzEyMGQzYjg5Y2VlYjgwMWUwYjkxZjI0ODQ3YTc5NzMyZDhmY2RjYjY3ZDk2YmFiMTAwY2IwOGEyIiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6IlhBRmx4MHpCRy9tUXBYU1dDRkRjTEE9PSIsInZhbHVlIjoiS1lidmpRdnVvUk1FUFpuOVp6UUsrMDZKd2c4MTgzUy9hSkJ5SmxsUEprTi9iSTBuQWltanRKSTFKRlp3c0oyeDJ4K0RvYjF1UnNkNVRtZ0srWW5IVldqMzdPM2g4bEdyRFJlaDRKMkpxeXFDVFM2SGNvOTJHRXRneExzYVhheFQiLCJtYWMiOiJmZDFjYzc1OGMwMDI3MGE1NTUxMDk5ZjBjMWI3YmMyZGE4MGZlNjI4Yzk4MDJjOTg4ODFiZjZjNWI1OTM2NTFhIiwidGFnIjoiIn0%3D");


    return this.http.post(`${this.update_cart}/${id}?longitude=${lng}&latitude=${lat}&countryId=${iso_code}`, data, { 'headers': headers });
  } // end of updateCart

  deleteFromCart(id: number, lat: any, lng: any, iso_code: string, access_token: string) {
    // name - email - avatar - age - gender - nationality -
    // mobile_verification_code
    let headers = new HttpHeaders();
    // ?longitude=46.65079518939412&latitude=24.80643980136584&countryId=SA
    // headers = headers.append("Content-Type", "application/json");
    // headers = headers.append("Accept", "application/json");
    // headers.set("Content-Type", "multipart/form-data");
    headers = headers.append("Authorization", `Bearer ${access_token}`);

    // headers = headers.append("Cookie", "XSRF-TOKEN=eyJpdiI6InBlQVhCOE5ScVVkU29YYlFLejJCaVE9PSIsInZhbHVlIjoiK2xGVHVlSXVmVEdhMU5yT3RQNGtNSUlnaWZFQm0yOEo5eVU0Wks2UGxIOHBVVkZlQUllSnpoS01KT0lSVnU4UnZKc1JzbmE3NGtxQUIzUllCSTZZY1U2N1NkNGMxVkJoWERra3dodmVTNGltdytneE9INnAyRGRwQ0JjUzZad0oiLCJtYWMiOiJhYTI3MGE2NzEyMGQzYjg5Y2VlYjgwMWUwYjkxZjI0ODQ3YTc5NzMyZDhmY2RjYjY3ZDk2YmFiMTAwY2IwOGEyIiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6IlhBRmx4MHpCRy9tUXBYU1dDRkRjTEE9PSIsInZhbHVlIjoiS1lidmpRdnVvUk1FUFpuOVp6UUsrMDZKd2c4MTgzUy9hSkJ5SmxsUEprTi9iSTBuQWltanRKSTFKRlp3c0oyeDJ4K0RvYjF1UnNkNVRtZ0srWW5IVldqMzdPM2g4bEdyRFJlaDRKMkpxeXFDVFM2SGNvOTJHRXRneExzYVhheFQiLCJtYWMiOiJmZDFjYzc1OGMwMDI3MGE1NTUxMDk5ZjBjMWI3YmMyZGE4MGZlNjI4Yzk4MDJjOTg4ODFiZjZjNWI1OTM2NTFhIiwidGFnIjoiIn0%3D");

    return this.http.delete(`${this.delete_from_cart}/${id}?longitude=${lng}&latitude=${lat}&countryId=${iso_code}`, { 'headers': headers });
  } // end of updateCart

  addItemToWishlist(id: number, lat: any, lng: any, iso_code: string, access_token: string) {
    // name - email - avatar - age - gender - nationality -
    // mobile_verification_code
    let headers = new HttpHeaders();
    // ?longitude=46.65079518939412&latitude=24.80643980136584&countryId=SA
    // headers = headers.append("Content-Type", "application/json");
    // headers = headers.append("Accept", "application/json");
    // headers.set("Content-Type", "multipart/form-data");
    headers = headers.append("Authorization", `Bearer ${access_token}`);

    // headers = headers.append("Cookie", "XSRF-TOKEN=eyJpdiI6InBlQVhCOE5ScVVkU29YYlFLejJCaVE9PSIsInZhbHVlIjoiK2xGVHVlSXVmVEdhMU5yT3RQNGtNSUlnaWZFQm0yOEo5eVU0Wks2UGxIOHBVVkZlQUllSnpoS01KT0lSVnU4UnZKc1JzbmE3NGtxQUIzUllCSTZZY1U2N1NkNGMxVkJoWERra3dodmVTNGltdytneE9INnAyRGRwQ0JjUzZad0oiLCJtYWMiOiJhYTI3MGE2NzEyMGQzYjg5Y2VlYjgwMWUwYjkxZjI0ODQ3YTc5NzMyZDhmY2RjYjY3ZDk2YmFiMTAwY2IwOGEyIiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6IlhBRmx4MHpCRy9tUXBYU1dDRkRjTEE9PSIsInZhbHVlIjoiS1lidmpRdnVvUk1FUFpuOVp6UUsrMDZKd2c4MTgzUy9hSkJ5SmxsUEprTi9iSTBuQWltanRKSTFKRlp3c0oyeDJ4K0RvYjF1UnNkNVRtZ0srWW5IVldqMzdPM2g4bEdyRFJlaDRKMkpxeXFDVFM2SGNvOTJHRXRneExzYVhheFQiLCJtYWMiOiJmZDFjYzc1OGMwMDI3MGE1NTUxMDk5ZjBjMWI3YmMyZGE4MGZlNjI4Yzk4MDJjOTg4ODFiZjZjNWI1OTM2NTFhIiwidGFnIjoiIn0%3D");

    return this.http.get(`${this.add_to_wishlist}/${id}?longitude=${lng}&latitude=${lat}&countryId=${iso_code}`, { 'headers': headers });
  } // end of addItemToCart


  removeItemFromWishlist(id: number, lat: any, lng: any, iso_code: string, access_token: string) {
    // name - email - avatar - age - gender - nationality -
    // mobile_verification_code
    let headers = new HttpHeaders();
    // ?longitude=46.65079518939412&latitude=24.80643980136584&countryId=SA
    // headers = headers.append("Content-Type", "application/json");
    // headers = headers.append("Accept", "application/json"s);
    // headers.set("Content-Type", "multipart/form-data");
    headers = headers.append("Authorization", `Bearer ${access_token}`);
    headers = headers.append("Accept", `application/json`);
    headers = headers.append("Content-Type", `application/json`);
    // headers = headers.append("Cookie", "XSRF-TOKEN=eyJpdiI6InBlQVhCOE5ScVVkU29YYlFLejJCaVE9PSIsInZhbHVlIjoiK2xGVHVlSXVmVEdhMU5yT3RQNGtNSUlnaWZFQm0yOEo5eVU0Wks2UGxIOHBVVkZlQUllSnpoS01KT0lSVnU4UnZKc1JzbmE3NGtxQUIzUllCSTZZY1U2N1NkNGMxVkJoWERra3dodmVTNGltdytneE9INnAyRGRwQ0JjUzZad0oiLCJtYWMiOiJhYTI3MGE2NzEyMGQzYjg5Y2VlYjgwMWUwYjkxZjI0ODQ3YTc5NzMyZDhmY2RjYjY3ZDk2YmFiMTAwY2IwOGEyIiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6IlhBRmx4MHpCRy9tUXBYU1dDRkRjTEE9PSIsInZhbHVlIjoiS1lidmpRdnVvUk1FUFpuOVp6UUsrMDZKd2c4MTgzUy9hSkJ5SmxsUEprTi9iSTBuQWltanRKSTFKRlp3c0oyeDJ4K0RvYjF1UnNkNVRtZ0srWW5IVldqMzdPM2g4bEdyRFJlaDRKMkpxeXFDVFM2SGNvOTJHRXRneExzYVhheFQiLCJtYWMiOiJmZDFjYzc1OGMwMDI3MGE1NTUxMDk5ZjBjMWI3YmMyZGE4MGZlNjI4Yzk4MDJjOTg4ODFiZjZjNWI1OTM2NTFhIiwidGFnIjoiIn0%3D");

    return this.http.delete(`${this.remove_from_wishlist}/${id}?longitude=${lng}&latitude=${lat}&countryId=${iso_code}`, { 'headers': headers });
  } // end of addItemToCart

  getPaymentTypes() {
    return this.http.get(`${this.payment_type}`);
  }


  createOrder(data: any, lat: any, lng: any, iso_code: string, access_token: string) {
    // name - email - avatar - age - gender - nationality -
    // mobile_verification_code
    let headers = new HttpHeaders();
    // ?longitude=46.65079518939412&latitude=24.80643980136584&countryId=SA
    // headers = headers.append("Content-Type", "application/json");
    // headers = headers.append("Accept", "application/json");
    // headers.set("Content-Type", "multipart/form-data");
    headers = headers.append("Authorization", `Bearer ${access_token}`);
    // headers = headers.append("Cookie", "XSRF-TOKEN=eyJpdiI6InBlQVhCOE5ScVVkU29YYlFLejJCaVE9PSIsInZhbHVlIjoiK2xGVHVlSXVmVEdhMU5yT3RQNGtNSUlnaWZFQm0yOEo5eVU0Wks2UGxIOHBVVkZlQUllSnpoS01KT0lSVnU4UnZKc1JzbmE3NGtxQUIzUllCSTZZY1U2N1NkNGMxVkJoWERra3dodmVTNGltdytneE9INnAyRGRwQ0JjUzZad0oiLCJtYWMiOiJhYTI3MGE2NzEyMGQzYjg5Y2VlYjgwMWUwYjkxZjI0ODQ3YTc5NzMyZDhmY2RjYjY3ZDk2YmFiMTAwY2IwOGEyIiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6IlhBRmx4MHpCRy9tUXBYU1dDRkRjTEE9PSIsInZhbHVlIjoiS1lidmpRdnVvUk1FUFpuOVp6UUsrMDZKd2c4MTgzUy9hSkJ5SmxsUEprTi9iSTBuQWltanRKSTFKRlp3c0oyeDJ4K0RvYjF1UnNkNVRtZ0srWW5IVldqMzdPM2g4bEdyRFJlaDRKMkpxeXFDVFM2SGNvOTJHRXRneExzYVhheFQiLCJtYWMiOiJmZDFjYzc1OGMwMDI3MGE1NTUxMDk5ZjBjMWI3YmMyZGE4MGZlNjI4Yzk4MDJjOTg4ODFiZjZjNWI1OTM2NTFhIiwidGFnIjoiIn0%3D");


    return this.http.post(`${this.create_order}?longitude=${lng}&latitude=${lat}&countryId=${iso_code}`, data, { 'headers': headers });
  } // end of updateCart


  getMostOrderedItems(lat: any, lng: any, iso_code: any) {
    let headers = new HttpHeaders();

    // headers = headers.append("Content-Type", "application/json");
    // headers = headers.append("Accept", "application/json");
    // headers.set("Content-Type", "multipart/form-data");
    // headers = headers.append("Authorization", `Bearer ${access_token}`);


    return this.http.get(`${this.best_seller}?longitude=${lng}&latitude=${lat}&countryId=${iso_code}`, { 'headers': headers });
  } // end of getUserWishlist

  // TODO: about to deleted
  // getSizes () {
  //   return this.http.get(this.sizes_url);
  // }

  // getCuts () {
  //   return this.http.get(this.cuts_url);
  // }

}
