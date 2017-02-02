var work = require('webworkify');
import store from './store';
import { stepsProgressed, stepsChanged } from './actions/actions';

var myWorker = work(require('./worker.js'));

export function workerGetRelicSteps(gamestate, settings) {
  myWorker.postMessage({
    type: "GET_RELIC_STEPS",
    gamestate,
    settings,
  });
}

myWorker.addEventListener('message', function (ev) {
  console.log("message from worker: ", ev.data);
  switch (ev.data.type) {
    case "RELIC_PROGRESS_UPDATE":
      store.dispatch(stepsProgressed(Math.round(ev.data.progress * 100)));
      break;
    case "RELIC_DONE":
      var r = ev.data.results;
      store.dispatch(stepsChanged(r.steps, r.summarySteps));
      break;
    default:
      break;
  }
});