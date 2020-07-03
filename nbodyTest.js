var Benchmark = require('benchmark');
var createObject = require('./tests/objectNBody');
var createArraySim = require('./tests/arrayNBody');
var createNativeArraySim = require('./tests/nativeArray')
var bodyCount = 1000;
var iterationCount = 1;
var suite = new Benchmark.Suite;
var objectAvg, arrayAvg, nativeArrayAvg;

suite.add('Compute n-body with Vector(x, y, z)', function() {
  let sim = createObject(bodyCount)
  for (let i = 0; i < iterationCount; ++i) {
    sim.updatedForces();
  }
  objectAvg = sim.getAverageLength();
})
.add('Compute n-body with array[x, y, z]', function() {
  let sim = createArraySim(bodyCount)
  for (let i = 0; i < iterationCount; ++i) {
    sim.updatedForces();
  }
  arrayAvg = sim.getAverageLength();
})
.add('Compute n-body with Float64Array(3)', function() {
  let sim = createNativeArraySim(bodyCount)
  for (let i = 0; i < iterationCount; ++i) {
    sim.updatedForces();
  }
  nativeArrayAvg = sim.getAverageLength();
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
  console.log('Object avg position length: ' + objectAvg);
  console.log('Array avg position length: ' + arrayAvg);
  console.log('Float64Array avg position length: ' + nativeArrayAvg);
})
.run({ 'async': true });

