import { Component, OnInit } from '@angular/core';
// geolocationn module
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder/ngx';
import { HereService } from '../utils/services/here.service';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {


  public geoAddress: string;
  public geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  // here service
  public position: string;
  public userAddress: string = "";

  constructor(private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder, private here: HereService) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getLocation();
  }

  getLocation() {

    // native geo-coder test
    this.geolocation.getCurrentPosition(
      {
        maximumAge: 1000, timeout: 5000,
        enableHighAccuracy: true
      }
    ).then((resp) => {
      console.log(resp.coords);
      this.position = resp.coords.latitude + "," + resp.coords.longitude;
      this.getAddressFromLatLng();
      // Street address from cordova 
      this.nativeGeocoder.reverseGeocode(52.5072095, 13.1452818, this.geoencoderOptions)
        .then((result: NativeGeocoderReverseResult[]) => {
          this.geoAddress = this.generateAddress(result[0]);
          console.log(this.geoAddress);
        })
        .catch((error: any) => {
          console.log('Error getting location' + JSON.stringify(error));
        });
    }, er => {
      //alert("error getting location")
      alert('Can not retrieve Location')
    }).catch((error) => {
      //alert('Error getting location'+JSON.stringify(error));
      alert('Error getting location - ' + JSON.stringify(error))
    });
  }

  //Return Comma saperated address
  generateAddress(addressObj) {
    let obj = [];
    let address = "";
    for (let key in addressObj) {
      obj.push(addressObj[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if (obj[val].length)
        address += obj[val] + ', ';
    }
    return address.slice(0, -2);
  }


  getAddressFromLatLng() {
    if (this.position != "") {
      this.here.getAddressFromLatLng(this.position).then(result => {
        console.log(result[0]['Location']['Address']);
        this.userAddress = result[0]['Location']['Address']['District'] + ', ' + result[0]['Location']['Address']['City']
      }, error => {
        console.error(error);
      });
    }
  }
}
