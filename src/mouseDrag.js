import {Observable} from 'rxjs';
export default (cb, el) => {

  let mouseisdown = false;

  Observable.fromEvent(el, "mousedown")
    .subscribe((e) => {
    mouseisdown = true;
  });

  Observable.fromEvent(document, "mouseup")
    .subscribe(e => mouseisdown = false); 


  Observable
    .fromEvent(document, "mousemove")
    .filter(e => mouseisdown)
    .throttleTime(30)
    .subscribe(cb);
}
