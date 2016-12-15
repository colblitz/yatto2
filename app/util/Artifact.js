import { BonusType, stringToBonus } from './BonusType';
// var fs = require('fs');


// var artifactData = require('../data/ArtifactInfo.csv');

export class Artifact {
  constructor(id, name, costc, coste, maxLevel, effects) {
    this.id = id;
    this.name = name;
    this.costc = costc;
    this.coste = coste;
    this.maxLevel = maxLevel == 0 ? null : maxLevel;
    this.effects = effects;
    this.adpl = this.effects[BonusType.ArtifactDamage];
  }

  // TODO: precompute
  getCostToLevelUp(cLevel) {
    if (cLevel == 0 || (this.maxLevel != null && cLevel >= this.maxLevel)) {
      return Infinity;
    } else {
      return Math.round(costc * Math.pow(cLevel + 1, coste));
    }
  }

  getAD(cLevel) {
    return cLevel > 0 ? adpl * cLevel : 0;
  }
}

export const ArtifactInfo = {};

console.log("artifact data:");
// console.log(artifactData);

// console.log(fs);
console.log("asdf");

// console.log(process.cwd());
// // var buffer = fs.readFileSync('public/data/ArtifactInfo.csv');
// // console.log(buffer);



// // var transform = require('stream-transform');

// // var output = [];
// // var parser = parse({delimiter: ','})
// // var input = fs.createReadStream('public/data/ArtifactInfo.csv');

// var a = {};
// a[5] = 3;
// console.log(a);

// // var csvData=[];
// fs.createReadStream('public/data/ArtifactInfo.csv')
//   .pipe(parse({delimiter: ',', columns: true}))
//   .on('data', function(artifact) {
//     var id = parseInt(artifact.ArtifactID.substring(8));
//     ArtifactInfo[id] = new Artifact(
//       id,
//       artifact.Name,
//       parseFloat(artifact.CostCoef),
//       parseFloat(artifact.CostExpo),
//       parseInt(artifact.MaxLevel),
//       {
//         [BonusType.ArtifactDamage] : parseFloat(artifact.DamageBonus),
//         [stringToBonus[artifact.BonusType]]: parseFloat(artifact.EffectPerLevel),
//       }
//     );
//     // console.log(csvrow);
//     //do something with csvrow
//         // csvData.push(csvrow);
//   })
//   .on('end',function() {
//     console.log("Done loading ArtifactInfo");
//     // console.log(ArtifactInfo);
//   });



// // var transformer = transform(function(record, callback){
// //   setTimeout(function(){
// //     callback(null, record.join(' ')+'\n');
// //   }, 500);
// // }, {parallel: 10});
// // input.pipe(parser).pipe(transformer).pipe(process.stdout);

// console.log("lakjsdlfjlakjsdf");
// csv("/data/ArtifactInfo.csv", function(data) {
//   for (var artifact of data) {
//     console.log(artifact);
//     console.log("alskdjflakjsldkjfas");
//     var id = parseInt(artifact.ArtifactID.substring(8));
//     ArtifactInfo[id] = new Artifact(
//       id,
//       artifact.Name,
//       parseFloat(artifact.CostCoef),
//       parseFloat(artifact.CostExpo),
//       parseInt(artifact.MaxLevel),
//       {
//         [BonusType.ArtifactDamage] : parseFloat(artifact.DamageBonus),
//         [stringToBonus[artifact.BonusType]]: parseFloat(artifact.EffectPerLevel),
//       }
//     );
//   }
//   console.log("done loading ArtifactInfo");
// });