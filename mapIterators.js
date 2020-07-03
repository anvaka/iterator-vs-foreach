// Measures iteration over map items
var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

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
}

let nativeSum = 0;
let forLoop = 0;
let forOfLoop = 0;
let iterator = 0;
let yielder = 0;
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
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
  console.log('')
  if ((forOfLoop !== nativeSum) || 
     (iterator !== nativeSum) ||
     (yielder !== nativeSum)
     ) throw new Error('Invalid test. Sums do not match');
})
.run({ 'async': true });