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
v14.4.0

> node arrayIterators.js
array.forEach(cb) x 3,171 ops/sec ±7.49% (72 runs sampled)
for (let i = 0; i < array.length; ++i) cb(array[i]) x 4,989 ops/sec ±5.30% (85 runs sampled)
for (let item of array) cb(item) x 4,711 ops/sec ±3.82% (82 runs sampled)
iterator x 2,880 ops/sec ±4.22% (76 runs sampled)
yield * x 1,498 ops/sec ±1.45% (86 runs sampled)
Fastest is for (let i = 0; i < array.length; ++i) cb(array[i])
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

## License

MIT