var work = require('webworkify');
import store from './store';
import { stepsProgressed, stepsChanged, updateStepMessage } from './actions/actions';

var myWorker = work(require('./worker.js'));

function sumObjectValues(o) {
  return Object.keys(o).reduce((s, k) => s + o[k], 0);
}

export function workerGetRelicSteps(gamestate, settings) {
  if (sumObjectValues(gamestate.heroes.levels) == 0 && settings.method != 0) {
    store.dispatch(updateStepMessage("Fill out your hero levels! Check the FAQ if you're confused on how"));
  } else if (sumObjectValues(gamestate.pets.levels) == 0 && settings.method != 0) {
    store.dispatch(updateStepMessage("Fill out your pet levels! Check the FAQ if you're confused on how"));
  } else if (sumObjectValues(gamestate.skills) == 0 && settings.method != 0) {
    store.dispatch(updateStepMessage("Fill out your skill levels! Check the FAQ if you're confused on how"));
  } else {
    myWorker.postMessage({
      type: "GET_RELIC_STEPS",
      gamestate,
      settings,
    });
  }
}

myWorker.addEventListener('message', function (ev) {
  console.log("message from worker: ", ev.data);
  switch (ev.data.type) {
    case "RELIC_PROGRESS_UPDATE":
      store.dispatch(stepsProgressed(Math.round(ev.data.progress * 100)));
      break;
    case "RELIC_DONE":
      var r = ev.data.results;
      if (r.steps.length == 0) {
        store.dispatch(updateStepMessage("Need more relics for your next most efficient step (or try 1. Putting in more relics, 2. Using steps instead of relics as the limit, or 3. Using the advanced option for using all relic steps"));
      } else {
        store.dispatch(stepsChanged(r.steps, r.summarySteps));
      }
      break;
    default:
      break;
  }
});

myWorker.onerror = function(event){
    throw new Error(event.message + " (" + event.filename + ":" + event.lineno + ")");
};