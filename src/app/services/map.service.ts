import { Injectable, NgZone } from '@angular/core';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { Observable, Observer } from 'rxjs';

declare var google: any;

@Injectable()
export class MapsService extends GoogleMapsAPIWrapper {
    constructor(private __loader: MapsAPILoader, private __zone: NgZone) {
        super(__loader, __zone);
    }



    getLatLong(address: string): Observable<any> {
        console.log('Getting address: ', address);
        let geocoder = new google.maps.Geocode();
        return Observable.create(observer => {
            geocoder.geocode({ 'address': address }, (results, status) => {
                if (status == google.maps.GeocoderStatus.OK) {
                    observer.next(results[0].geometry.location);
                    observer.complete();
                } else {
                    console.log('Error: ', results, ' & Status: ', status);
                    observer.next();
                    observer.complete();
                }
            });
        });
    }

    getGeoLocation(lat: number, lng: number): Observable<google.maps.GeocoderResult> {
        if (navigator.geolocation) {
            let geocoder = new google.maps.Geocoder();
            let latlng = new google.maps.LatLng(lat, lng);
            let request = { latLng: latlng };
            return Observable.create(observer => {
                geocoder.geocode(request, (results, status) => {
                    if (status == google.maps.GeocoderStatus.OK) {
                        console.log(results[0]);
                        observer.next(results[0])
                        observer.complete();
                    } else {
                        console.log('Error: ', results, ' & Status: ', status);
                        observer.next();
                        observer.complete();
                    }
                });
            });
        }
    }

/*    getAutocompleteResponse(): Observable<any> {
        this.__loader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(document.getElementById("autocompleteInput"), {});
            return Observable.create(observer => {
                autocomplete.getPlace( 
                    (place: google.maps.Place) => {
                        observer.next(place);
                        observer.complete();
                    },
                    (error: Object) => {
                        console.log(error);
                        observer.error(error);
                    }
                );
            });
        });
    }*/

    getCurrentPosition(): Observable<Position> {
        return new Observable((observer: Observer<Position>) => {
            navigator.geolocation.getCurrentPosition(
                (position: Position) => {
                    observer.next(position);
                    observer.complete();
                },
                (error: PositionError) => {
                    console.log('Geolocation service: ' + error.message);
                    observer.error(error);
                }
            );
        });
    }
}