import { getRelicSteps } from './util/Calculator';

// onmessage = function(e) {
//   console.log("message received from main: ", e.data);
//   var workerResult = 'done!';
//   console.log("sending result back");
//   postMessage(workerResult);
// }

module.exports = function (self) {
  self.addEventListener('message',function (ev){
    console.log("message from main: ", ev.data);
    var workerResult = "aslkdjflkj!";
    console.log("sending result back");
    self.postMessage(workerResult);

    setInterval(function() {
      self.postMessage(Math.random());
    }, 1000);

    // var startNum = parseInt(ev.data); // ev.data=4 from main.js

    // setInterval(function () {
    //   var r = startNum / Math.random() - 1;
    //   self.postMessage([ startNum, r, gamma(r) ]);
    // }, 500);
  });
};