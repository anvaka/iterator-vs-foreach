// Measures iteration over map items
var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;
if (typeof process !== 'undefined') console.log('Running in node', process.version);

class Vector {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  add(other) {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
  }
}

class VectorCollection {
  constructor(count) {
    this.buffer = new Map();
    for (let i = 0; i < count; ++i) {
      this.buffer.set(i, new Vector(i, i, i));
    }
  }

  forEachNative(callback) {
    this.buffer.forEach(callback);
  }

  forOfLoop(callback) {
    for (let item of this.buffer) callback(item);
  }

  getIterator(callback) {
    return this.buffer[Symbol.iterator]();
  }

  *yielder() {
    yield *this.buffer;
  }

  entriesForOfLoop(callback) {
    for (let item of this.buffer.entries()) callback(item);
  }

  valuesForOfLoop(callback) {
    for (let item of this.buffer.values()) callback(item);
  }
}

let nativeSum = 0;
let forLoop = 0;
let forOfLoop = 0;
let iterator = 0;
let yielder = 0;
let entriesForOfLoop = 0;
let entriesForOfLoopKV = 0;
let valuesForOfLoop = 0;
let testCollection = new VectorCollection(10000);

suite.add('map.forEach(cb)', function() {
  nativeSum = 0;
  testCollection.forEachNative((v, _) => {
    nativeSum += v.x * v.x
  });
})
.add('for (let item of map) cb(item)', function() {
  forOfLoop = 0;
  testCollection.forOfLoop(v => {
    forOfLoop += v[1].x * v[1].x
 });
})
.add('iterator', function() {
  iterator = 0;
  for (let v of testCollection.getIterator()) {
    iterator += v[1].x * v[1].x
  };
})
.add('yield *', function() {
  yielder = 0;
  for (let v of testCollection.yielder()) {
    yielder += v[1].x * v[1].x
  };
})
.add('entriesForOfLoop', function() {
  entriesForOfLoop = 0;
  testCollection.entriesForOfLoop(v => {
    entriesForOfLoop += v[1].x * v[1].x
  });
})
.add('entriesForOfLoopKV', function() {
  entriesForOfLoopKV = 0;
  testCollection.entriesForOfLoop(([k,v]) => {
    entriesForOfLoopKV += v.x * v.x
  });
})
.add('valuesForOfLoop', function() {
  valuesForOfLoop = 0;
  testCollection.valuesForOfLoop(v => {
    valuesForOfLoop += v.x * v.x
  });
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
  console.log('')
  if ((forOfLoop !== nativeSum) || 
     (iterator !== nativeSum) ||
     (yielder !== nativeSum) ||
     (entriesForOfLoop !== nativeSum) ||
     (entriesForOfLoopKV !== nativeSum) ||
     (valuesForOfLoop !== nativeSum)
     ) throw new Error('Invalid test. Sums do not match');
})
.run({ 'async': true });
