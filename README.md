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

Are inconclusive. Most of the time plain old `for (let i = 0; i < array.length; ++i)` wins, but quite often `for .. of`
and `array.forEach()` take the first place.

Iterators and generators were consistently the slowest.

``` 
> node --version
v16.4.0

> node arrayIterators.js
array.forEach(cb) x 4,064 ops/sec ±12.47% (59 runs sampled)
for (let i = 0; i < array.length; ++i) cb(array[i]) x 6,181 ops/sec ±12.71% (70 runs sampled)
for (let item of array) cb(item) x 6,121 ops/sec ±8.85% (68 runs sampled)
iterator x 3,380 ops/sec ±6.61% (77 runs sampled)
yield * x 2,099 ops/sec ±2.61% (87 runs sampled)
Fastest is for (let item of array) cb(item)
```

### Set iterators
We also performed the same set of tests with a `Set` object. Obviously, we couldn't do plain old
`for` loop, but the rest of the approaches are still applicable. Here `iterators` were consistently
the fastest.

```
node setIterators.js
set.forEach(cb) x 3,340 ops/sec ±3.35% (84 runs sampled)
for (let item of set) cb(item) x 4,364 ops/sec ±5.84% (77 runs sampled)
iterator x 5,919 ops/sec ±1.90% (85 runs sampled)
yield * x 1,616 ops/sec ±2.47% (87 runs sampled)
Fastest is iterator
```

### Map iterators

Again, iterators were faster with maps than any other iteration method:

``` 
node mapIterators.js
map.forEach(cb) x 2,214 ops/sec ±4.71% (68 runs sampled)
for (let item of map) cb(item) x 2,060 ops/sec ±9.39% (62 runs sampled)
iterator x 2,454 ops/sec ±5.68% (62 runs sampled)
yield * x 838 ops/sec ±8.09% (54 runs sampled)
Fastest is iterator
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
