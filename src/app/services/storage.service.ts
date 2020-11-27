import { Injectable } from '@angular/core';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  convertDataUrltoBlob(url: any) {
    const binary = atob(url.split(',')[1]);

    const array = [];

    for (let i  = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }

    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  }

  uploadToStorage(imageBlob: any, refPath: string) {
    const fileRef = firebase.storage().ref(refPath + '/' + imageBlob.fileName);
    const uploadTask = fileRef.put(imageBlob);

    return uploadTask;
  }
}
