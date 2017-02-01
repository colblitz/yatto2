var work = require('webworkify');
import store from './store';
import { test } from './actions/actions';

var myWorker = work(require('./worker.js'));

export function callWorker() {
  myWorker.postMessage("lakjsdf");
  console.log("message posted to worker");
}

myWorker.addEventListener('message', function (ev) {
  console.log(ev.data);
  store.dispatch(test(ev.data));
});

// myWorker.onmessage = function(e) {
//   var result = e.data;
//   console.log('Message received from worker: ', result);
// }