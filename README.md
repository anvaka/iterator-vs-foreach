# Comparing iterators performance in javascript

This repository is a microbenchmark that measures speed of various iteration approaches
in javascript.

We measured the following approaches:

``` js
// Option 1: regular forEach
array.forEach(cb);

// Option 2: Plain for loop:
for (let i = 0; i < array.length; ++i) cb(array[i])

// Option 3: for .. of loop:
for (let v of array) cb(v)

// Option 4: over iterator:
let iterator = array[Symbol.iterator]();
for (let v of iterator) cb(v);

// Option 4: yield* operator:
yield *array;
```

## The benchmark

[The benchmark](arrayIterators.js) initializes `10,000` vectors vectors, and then computes a square sum of the `x` dimension

``` js
for(let v of vectors) {
  sum += v.x * v.x
}
```

## Results

``` 
Running in node v16.4.0
array.forEach(cb) x 6,751 ops/sec ±7.00% (81 runs sampled)
for (let i = 0; i < array.length; ++i) cb(array[i]) x 8,820 ops/sec ±4.04% (83 runs sampled)
for (let item of array) cb(item) x 8,322 ops/sec ±3.79% (86 runs sampled)
iterator x 4,147 ops/sec ±1.66% (85 runs sampled)
yield * x 2,228 ops/sec ±1.57% (88 runs sampled)
Fastest is for (let i = 0; i < array.length; ++i) cb(array[i]),array.forEach(cb)
```

### Set iterators

We also performed the same set of tests with a `Set` object. Obviously, we couldn't do plain old
`for` loop, but the rest of the approaches are still applicable.

```
node setIterators.js 
Running in node v16.4.0
set.forEach(cb) x 5,545 ops/sec ±2.04% (86 runs sampled)
for (let item of set) cb(item) x 8,019 ops/sec ±4.93% (83 runs sampled)
iterator x 5,580 ops/sec ±12.76% (68 runs sampled)
yield * x 2,063 ops/sec ±6.32% (82 runs sampled)
Fastest is for (let item of set) cb(item)
```

### Map iterators


```
» node mapIterators.js
Running in node v16.4.0
map.forEach(cb) x 5,135 ops/sec ±2.69% (86 runs sampled)
for (let item of map) cb(item) x 5,486 ops/sec ±3.41% (83 runs sampled)
iterator x 4,904 ops/sec ±1.97% (84 runs sampled)
yield * x 1,962 ops/sec ±1.49% (88 runs sampled)
entriesForOfLoop x 5,855 ops/sec ±1.62% (87 runs sampled)
entriesForOfLoopKV x 4,040 ops/sec ±3.32% (84 runs sampled)
valuesForOfLoop x 8,280 ops/sec ±3.37% (84 runs sampled)
Fastest is valuesForOfLoop
```

## Feedback

If you want to add other tests - please do so. Pull requests are very much welcomed!

## Other benchmarks

* [Array vs Object](https://github.com/anvaka/array-vs-object) - what is faster:
store array of vectors, or encode vectors into array?
* [Set vs Object](https://github.com/anvaka/set-vs-object) - what is faster:
use object fields or Map/Set collections?

## License

MIT
