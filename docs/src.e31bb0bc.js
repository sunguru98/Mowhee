// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var global = arguments[3];
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() {
    return this || (typeof self === "object" && self);
  })() || Function("return this")()
);

},{}],"../node_modules/regenerator-runtime/runtime-module.js":[function(require,module,exports) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() {
  return this || (typeof self === "object" && self);
})() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = require("./runtime");

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

},{"./runtime":"../node_modules/regenerator-runtime/runtime.js"}],"../node_modules/@babel/runtime/regenerator/index.js":[function(require,module,exports) {
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":"../node_modules/regenerator-runtime/runtime-module.js"}],"../node_modules/@babel/runtime/helpers/asyncToGenerator.js":[function(require,module,exports) {
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;
},{}],"../node_modules/@babel/runtime/helpers/arrayWithoutHoles.js":[function(require,module,exports) {
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
}

module.exports = _arrayWithoutHoles;
},{}],"../node_modules/@babel/runtime/helpers/iterableToArray.js":[function(require,module,exports) {
function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

module.exports = _iterableToArray;
},{}],"../node_modules/@babel/runtime/helpers/nonIterableSpread.js":[function(require,module,exports) {
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

module.exports = _nonIterableSpread;
},{}],"../node_modules/@babel/runtime/helpers/toConsumableArray.js":[function(require,module,exports) {
var arrayWithoutHoles = require("./arrayWithoutHoles");

var iterableToArray = require("./iterableToArray");

var nonIterableSpread = require("./nonIterableSpread");

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;
},{"./arrayWithoutHoles":"../node_modules/@babel/runtime/helpers/arrayWithoutHoles.js","./iterableToArray":"../node_modules/@babel/runtime/helpers/iterableToArray.js","./nonIterableSpread":"../node_modules/@babel/runtime/helpers/nonIterableSpread.js"}],"../node_modules/axios/lib/helpers/bind.js":[function(require,module,exports) {
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],"../node_modules/is-buffer/index.js":[function(require,module,exports) {
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],"../node_modules/axios/lib/utils.js":[function(require,module,exports) {
'use strict';

var bind = require('./helpers/bind');
var isBuffer = require('is-buffer');

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};

},{"./helpers/bind":"../node_modules/axios/lib/helpers/bind.js","is-buffer":"../node_modules/is-buffer/index.js"}],"../node_modules/axios/lib/helpers/normalizeHeaderName.js":[function(require,module,exports) {
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":"../node_modules/axios/lib/utils.js"}],"../node_modules/axios/lib/core/enhanceError.js":[function(require,module,exports) {
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};

},{}],"../node_modules/axios/lib/core/createError.js":[function(require,module,exports) {
'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":"../node_modules/axios/lib/core/enhanceError.js"}],"../node_modules/axios/lib/core/settle.js":[function(require,module,exports) {
'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":"../node_modules/axios/lib/core/createError.js"}],"../node_modules/axios/lib/helpers/buildURL.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":"../node_modules/axios/lib/utils.js"}],"../node_modules/axios/lib/helpers/parseHeaders.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":"../node_modules/axios/lib/utils.js"}],"../node_modules/axios/lib/helpers/isURLSameOrigin.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);

},{"./../utils":"../node_modules/axios/lib/utils.js"}],"../node_modules/axios/lib/helpers/btoa.js":[function(require,module,exports) {
'use strict';

// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;

},{}],"../node_modules/axios/lib/helpers/cookies.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);

},{"./../utils":"../node_modules/axios/lib/utils.js"}],"../node_modules/axios/lib/adapters/xhr.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

var settle = require('./../core/settle');

var buildURL = require('./../helpers/buildURL');

var parseHeaders = require('./../helpers/parseHeaders');

var isURLSameOrigin = require('./../helpers/isURLSameOrigin');

var createError = require('../core/createError');

var btoa = typeof window !== 'undefined' && window.btoa && window.btoa.bind(window) || require('./../helpers/btoa');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false; // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.

    if ("development" !== 'test' && typeof window !== 'undefined' && window.XDomainRequest && !('withCredentials' in request) && !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;

      request.onprogress = function handleProgress() {};

      request.ontimeout = function handleTimeout() {};
    } // HTTP basic authentication


    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true); // Set the request timeout in MS

    request.timeout = config.timeout; // Listen for ready state

    request[loadEvent] = function handleLoad() {
      if (!request || request.readyState !== 4 && !xDomain) {
        return;
      } // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request


      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      } // Prepare the response


      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };
      settle(resolve, reject, response); // Clean up request

      request = null;
    }; // Handle low level network errors


    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request)); // Clean up request

      request = null;
    }; // Handle timeout


    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', request)); // Clean up request

      request = null;
    }; // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.


    if (utils.isStandardBrowserEnv()) {
      var cookies = require('./../helpers/cookies'); // Add xsrf header


      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    } // Add headers to the request


    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    } // Add withCredentials to request if needed


    if (config.withCredentials) {
      request.withCredentials = true;
    } // Add responseType to request if needed


    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    } // Handle progress if needed


    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    } // Not all browsers support upload events


    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel); // Clean up request

        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    } // Send the request


    request.send(requestData);
  });
};
},{"./../utils":"../node_modules/axios/lib/utils.js","./../core/settle":"../node_modules/axios/lib/core/settle.js","./../helpers/buildURL":"../node_modules/axios/lib/helpers/buildURL.js","./../helpers/parseHeaders":"../node_modules/axios/lib/helpers/parseHeaders.js","./../helpers/isURLSameOrigin":"../node_modules/axios/lib/helpers/isURLSameOrigin.js","../core/createError":"../node_modules/axios/lib/core/createError.js","./../helpers/btoa":"../node_modules/axios/lib/helpers/btoa.js","./../helpers/cookies":"../node_modules/axios/lib/helpers/cookies.js"}],"../node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../node_modules/axios/lib/defaults.js":[function(require,module,exports) {
var process = require("process");
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

},{"./utils":"../node_modules/axios/lib/utils.js","./helpers/normalizeHeaderName":"../node_modules/axios/lib/helpers/normalizeHeaderName.js","./adapters/xhr":"../node_modules/axios/lib/adapters/xhr.js","./adapters/http":"../node_modules/axios/lib/adapters/xhr.js","process":"../node_modules/process/browser.js"}],"../node_modules/axios/lib/core/InterceptorManager.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":"../node_modules/axios/lib/utils.js"}],"../node_modules/axios/lib/core/transformData.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

},{"./../utils":"../node_modules/axios/lib/utils.js"}],"../node_modules/axios/lib/cancel/isCancel.js":[function(require,module,exports) {
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],"../node_modules/axios/lib/helpers/isAbsoluteURL.js":[function(require,module,exports) {
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

},{}],"../node_modules/axios/lib/helpers/combineURLs.js":[function(require,module,exports) {
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],"../node_modules/axios/lib/core/dispatchRequest.js":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');
var isAbsoluteURL = require('./../helpers/isAbsoluteURL');
var combineURLs = require('./../helpers/combineURLs');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"./../utils":"../node_modules/axios/lib/utils.js","./transformData":"../node_modules/axios/lib/core/transformData.js","../cancel/isCancel":"../node_modules/axios/lib/cancel/isCancel.js","../defaults":"../node_modules/axios/lib/defaults.js","./../helpers/isAbsoluteURL":"../node_modules/axios/lib/helpers/isAbsoluteURL.js","./../helpers/combineURLs":"../node_modules/axios/lib/helpers/combineURLs.js"}],"../node_modules/axios/lib/core/Axios.js":[function(require,module,exports) {
'use strict';

var defaults = require('./../defaults');
var utils = require('./../utils');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, {method: 'get'}, this.defaults, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"./../defaults":"../node_modules/axios/lib/defaults.js","./../utils":"../node_modules/axios/lib/utils.js","./InterceptorManager":"../node_modules/axios/lib/core/InterceptorManager.js","./dispatchRequest":"../node_modules/axios/lib/core/dispatchRequest.js"}],"../node_modules/axios/lib/cancel/Cancel.js":[function(require,module,exports) {
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],"../node_modules/axios/lib/cancel/CancelToken.js":[function(require,module,exports) {
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":"../node_modules/axios/lib/cancel/Cancel.js"}],"../node_modules/axios/lib/helpers/spread.js":[function(require,module,exports) {
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],"../node_modules/axios/lib/axios.js":[function(require,module,exports) {
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./utils":"../node_modules/axios/lib/utils.js","./helpers/bind":"../node_modules/axios/lib/helpers/bind.js","./core/Axios":"../node_modules/axios/lib/core/Axios.js","./defaults":"../node_modules/axios/lib/defaults.js","./cancel/Cancel":"../node_modules/axios/lib/cancel/Cancel.js","./cancel/CancelToken":"../node_modules/axios/lib/cancel/CancelToken.js","./cancel/isCancel":"../node_modules/axios/lib/cancel/isCancel.js","./helpers/spread":"../node_modules/axios/lib/helpers/spread.js"}],"../node_modules/axios/index.js":[function(require,module,exports) {
module.exports = require('./lib/axios');
},{"./lib/axios":"../node_modules/axios/lib/axios.js"}],"js/views/base.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGenres = exports.getConfigData = exports.clearLoader = exports.bringLoader = exports.recieveGenres = exports.recieveConfigData = exports.apiKey = exports.getDomElements = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getDomElements = {
  // For basic animation requirements
  moviesLogoSideBar: document.querySelector(".sidebar .sidebar__logo"),
  moviesLogoUserPanel: document.querySelector(".movies__user-panel .sidebar__logo"),
  moviesSection: document.querySelector(".movies"),
  moviesNowPlaying: document.querySelector(".movies__categories--1"),
  moviesTopRated: document.querySelector(".movies__categories--2"),
  moviesDetailClass: document.querySelector(".movies-detail"),
  searchText: document.querySelector(".movies__search--text"),
  searchButton: document.querySelector(".movies__search--btn"),
  favouriteButton: document.querySelector(".movies-detail__link--favourite"),
  userPanel: document.querySelector(".movies__user-panel"),
  navBtn: document.querySelector(".navigation__button"),
  nav: document.querySelector(".movies__navigation"),
  overlayDiv: document.querySelector('.overlay'),
  html: document.getElementsByTagName('html')[0],
  moviesSpecific: document.querySelector(".movies__specific"),
  moviesFavouritesPanel: document.querySelector('.movies__likes'),
  moviesSpecificButton: document.querySelector(".movies__specific-button"),
  moviesDetail: document.querySelector(".movies-detail__group"),
  moviesCategories: document.querySelector('.movies__categories'),
  moviesLikesList: document.querySelector('.movies__likes-list')
};
exports.getDomElements = getDomElements;
var apiKey = "7d0cf763ad63814289ad165396c4738d";
exports.apiKey = apiKey;

var recieveConfigData = function recieveConfigData() {
  return JSON.parse(localStorage.getItem("configData"));
};

exports.recieveConfigData = recieveConfigData;

var recieveGenres = function recieveGenres() {
  console.log(JSON.parse(localStorage.getItem("genresData")));
  return JSON.parse(localStorage.getItem("genresData"));
};

exports.recieveGenres = recieveGenres;

var bringLoader = function bringLoader(position) {
  var element = "\n    <div class=\"loader\">\n    </div>\n    ";
  position.insertAdjacentHTML("afterbegin", element);
};

exports.bringLoader = bringLoader;

var clearLoader = function clearLoader() {
  var loader = document.querySelector(".loader");
  if (loader) loader.parentNode.removeChild(loader);
};

exports.clearLoader = clearLoader;

var getConfigData =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var configData;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _axios.default)("https://api.themoviedb.org/3/configuration?api_key=".concat(apiKey));

          case 2:
            configData = _context.sent;
            return _context.abrupt("return", {
              changeKeys: configData.data.change_keys,
              images: configData.data.images,
              baseUrl: configData.data.images.secure_base_url
            });

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getConfigData() {
    return _ref.apply(this, arguments);
  };
}();

exports.getConfigData = getConfigData;

var getGenres =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2() {
    var genresMovie, genresTv, genres;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _axios.default)("https://api.themoviedb.org/3/genre/movie/list?api_key=".concat(apiKey, "&language=en-US"));

          case 2:
            genresMovie = _context2.sent;
            _context2.next = 5;
            return (0, _axios.default)("https://api.themoviedb.org/3/genre/tv/list?api_key=".concat(apiKey, "&language=en-US"));

          case 5:
            genresTv = _context2.sent;
            genres = {
              data: {
                genres: null
              }
            };
            genres.data.genres = Array.from(new Set([].concat((0, _toConsumableArray2.default)(genresMovie.data.genres), (0, _toConsumableArray2.default)(genresTv.data.genres))));
            return _context2.abrupt("return", genres.data);

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getGenres() {
    return _ref2.apply(this, arguments);
  };
}();

exports.getGenres = getGenres;
},{"@babel/runtime/helpers/toConsumableArray":"../node_modules/@babel/runtime/helpers/toConsumableArray.js","@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","axios":"../node_modules/axios/index.js"}],"../node_modules/@babel/runtime/helpers/classCallCheck.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
},{}],"../node_modules/@babel/runtime/helpers/createClass.js":[function(require,module,exports) {
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;
},{}],"js/model/Search.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _axios = _interopRequireDefault(require("axios"));

var _base = require("../views/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Search =
/*#__PURE__*/
function () {
  function Search(query) {
    (0, _classCallCheck2.default)(this, Search);
    this.query = query;
    this.allMovies = [];
    this.allNowPlaying = [];
    this.allTopRated = [];
    this.categoryMovies = [];
    this.tvOnTheAirMovies = [];
    this.upcomingMovies = [];
    this.popularMovies = [];
  }

  (0, _createClass2.default)(Search, [{
    key: "getBrowsedMovies",
    value: function () {
      var _getBrowsedMovies = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(choice) {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.t0 = choice;
                _context.next = _context.t0 === "top" ? 3 : _context.t0 === "tv" ? 6 : _context.t0 === "popular" ? 9 : _context.t0 === "upcoming" ? 12 : 15;
                break;

              case 3:
                _context.next = 5;
                return this.getTopRated();

              case 5:
                return _context.abrupt("return", this.allTopRated);

              case 6:
                _context.next = 8;
                return this.getTvOnTheAirMovies();

              case 8:
                return _context.abrupt("return", this.tvOnTheAirMovies);

              case 9:
                _context.next = 11;
                return this.getPopularMovies();

              case 11:
                return _context.abrupt("return", this.popularMovies);

              case 12:
                _context.next = 14;
                return this.getUpcomingMovies();

              case 14:
                return _context.abrupt("return", this.upcomingMovies);

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getBrowsedMovies(_x) {
        return _getBrowsedMovies.apply(this, arguments);
      }

      return getBrowsedMovies;
    }()
  }, {
    key: "getTvOnTheAirMovies",
    value: function () {
      var _getTvOnTheAirMovies = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2() {
        var _this = this;

        var movieData, totalPages, pageNumber;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return (0, _axios.default)("https://api.themoviedb.org/3/tv/on_the_air?api_key=".concat(_base.apiKey, "&page=1&language=en-US"));

              case 3:
                movieData = _context2.sent;
                movieData.data.results.map(function (result) {
                  return _this.tvOnTheAirMovies.push(result);
                });
                totalPages = movieData.data.total_pages > 5 ? 5 : movieData.data.total_pages;
                pageNumber = 2;

              case 7:
                if (!(pageNumber <= totalPages)) {
                  _context2.next = 15;
                  break;
                }

                _context2.next = 10;
                return (0, _axios.default)("https://api.themoviedb.org/3/tv/on_the_air?api_key=".concat(_base.apiKey, "&language=en-US&page=").concat(pageNumber));

              case 10:
                movieData = _context2.sent;
                movieData.data.results.map(function (result) {
                  return _this.tvOnTheAirMovies.push(result);
                });

              case 12:
                pageNumber++;
                _context2.next = 7;
                break;

              case 15:
                _context2.next = 20;
                break;

              case 17:
                _context2.prev = 17;
                _context2.t0 = _context2["catch"](0);
                alert(_context2.t0);

              case 20:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 17]]);
      }));

      function getTvOnTheAirMovies() {
        return _getTvOnTheAirMovies.apply(this, arguments);
      }

      return getTvOnTheAirMovies;
    }()
  }, {
    key: "getUpcomingMovies",
    value: function () {
      var _getUpcomingMovies = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee3() {
        var _this2 = this;

        var movieData, totalPages, pageNumber;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return (0, _axios.default)("https://api.themoviedb.org/3/movie/upcoming?api_key=".concat(_base.apiKey, "&page=1&language=en-US"));

              case 3:
                movieData = _context3.sent;
                movieData.data.results.map(function (result) {
                  return _this2.upcomingMovies.push(result);
                });
                totalPages = movieData.data.total_pages > 5 ? 5 : movieData.data.total_pages;
                pageNumber = 2;

              case 7:
                if (!(pageNumber <= totalPages)) {
                  _context3.next = 15;
                  break;
                }

                _context3.next = 10;
                return (0, _axios.default)("https://api.themoviedb.org/3/movie/upcoming?api_key=".concat(_base.apiKey, "&language=en-US&page=").concat(pageNumber));

              case 10:
                movieData = _context3.sent;
                movieData.data.results.map(function (result) {
                  return _this2.upcomingMovies.push(result);
                });

              case 12:
                pageNumber++;
                _context3.next = 7;
                break;

              case 15:
                _context3.next = 20;
                break;

              case 17:
                _context3.prev = 17;
                _context3.t0 = _context3["catch"](0);
                alert(_context3.t0);

              case 20:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 17]]);
      }));

      function getUpcomingMovies() {
        return _getUpcomingMovies.apply(this, arguments);
      }

      return getUpcomingMovies;
    }()
  }, {
    key: "getPopularMovies",
    value: function () {
      var _getPopularMovies = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee4() {
        var _this3 = this;

        var movieData, totalPages, pageNumber;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return (0, _axios.default)("https://api.themoviedb.org/3/movie/popular?api_key=".concat(_base.apiKey, "&page=1&language=en-US"));

              case 3:
                movieData = _context4.sent;
                movieData.data.results.map(function (result) {
                  return _this3.popularMovies.push(result);
                });
                totalPages = movieData.data.total_pages > 5 ? 5 : movieData.data.total_pages;
                pageNumber = 2;

              case 7:
                if (!(pageNumber <= totalPages)) {
                  _context4.next = 15;
                  break;
                }

                _context4.next = 10;
                return (0, _axios.default)("https://api.themoviedb.org/3/movie/popular?api_key=".concat(_base.apiKey, "&language=en-US&page=").concat(pageNumber));

              case 10:
                movieData = _context4.sent;
                movieData.data.results.map(function (result) {
                  return _this3.popularMovies.push(result);
                });

              case 12:
                pageNumber++;
                _context4.next = 7;
                break;

              case 15:
                _context4.next = 20;
                break;

              case 17:
                _context4.prev = 17;
                _context4.t0 = _context4["catch"](0);
                alert(_context4.t0);

              case 20:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 17]]);
      }));

      function getPopularMovies() {
        return _getPopularMovies.apply(this, arguments);
      }

      return getPopularMovies;
    }()
  }, {
    key: "getCategoryMovies",
    value: function () {
      var _getCategoryMovies = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee5(genreId) {
        var _this4 = this;

        var movieData, totalPages, pageNumber;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return (0, _axios.default)("https://api.themoviedb.org/3/discover/movie?api_key=".concat(_base.apiKey, "&page=1&language=en-US&with_genres=").concat(genreId));

              case 3:
                movieData = _context5.sent;
                movieData.data.results.map(function (result) {
                  return _this4.categoryMovies.push(result);
                });
                totalPages = movieData.data.total_pages > 5 ? 5 : movieData.data.total_pages;
                pageNumber = 2;

              case 7:
                if (!(pageNumber <= totalPages)) {
                  _context5.next = 15;
                  break;
                }

                _context5.next = 10;
                return (0, _axios.default)("https://api.themoviedb.org/3/discover/movie?api_key=".concat(_base.apiKey, "&page=").concat(pageNumber, "&language=en-US&with_genres=").concat(genreId));

              case 10:
                movieData = _context5.sent;
                movieData.data.results.map(function (result) {
                  return _this4.categoryMovies.push(result);
                });

              case 12:
                pageNumber++;
                _context5.next = 7;
                break;

              case 15:
                _context5.next = 20;
                break;

              case 17:
                _context5.prev = 17;
                _context5.t0 = _context5["catch"](0);
                alert(_context5.t0);

              case 20:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 17]]);
      }));

      function getCategoryMovies(_x2) {
        return _getCategoryMovies.apply(this, arguments);
      }

      return getCategoryMovies;
    }()
  }, {
    key: "getMovies",
    value: function () {
      var _getMovies = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee6() {
        var _this5 = this;

        var movieData, totalPages, pageNumber;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _context6.next = 3;
                return (0, _axios.default)("https://api.themoviedb.org/3/search/movie?api_key=".concat(_base.apiKey, "&language=en-US&query=").concat(this.query, "&page=1&include_adult=false"));

              case 3:
                movieData = _context6.sent;
                movieData.data.results.map(function (result) {
                  return _this5.allMovies.push(result);
                });
                totalPages = movieData.data.total_pages > 5 ? 5 : movieData.data.total_pages;
                pageNumber = 2;

              case 7:
                if (!(pageNumber <= totalPages)) {
                  _context6.next = 15;
                  break;
                }

                _context6.next = 10;
                return (0, _axios.default)("https://api.themoviedb.org/3/search/movie?api_key=".concat(_base.apiKey, "&language=en-US&query=").concat(this.query, "&page=").concat(pageNumber, "&include_adult=false"));

              case 10:
                movieData = _context6.sent;
                movieData.data.results.map(function (result) {
                  return _this5.allMovies.push(result);
                });

              case 12:
                pageNumber++;
                _context6.next = 7;
                break;

              case 15:
                _context6.next = 20;
                break;

              case 17:
                _context6.prev = 17;
                _context6.t0 = _context6["catch"](0);
                alert(_context6.t0);

              case 20:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 17]]);
      }));

      function getMovies() {
        return _getMovies.apply(this, arguments);
      }

      return getMovies;
    }()
  }, {
    key: "getTopRated",
    value: function () {
      var _getTopRated = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee7() {
        var _this6 = this;

        var movieData, totalPages, pageNumber;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                _context7.next = 3;
                return (0, _axios.default)("https://api.themoviedb.org/3/movie/top_rated?api_key=".concat(_base.apiKey, "&page=1&language=en-US"));

              case 3:
                movieData = _context7.sent;
                movieData.data.results.map(function (result) {
                  return _this6.allTopRated.push(result);
                });
                totalPages = movieData.data.total_pages > 5 ? 5 : movieData.data.total_pages;
                pageNumber = 2;

              case 7:
                if (!(pageNumber <= totalPages)) {
                  _context7.next = 15;
                  break;
                }

                _context7.next = 10;
                return (0, _axios.default)("https://api.themoviedb.org/3/movie/top_rated?api_key=".concat(_base.apiKey, "&language=en-US&page=").concat(pageNumber));

              case 10:
                movieData = _context7.sent;
                movieData.data.results.map(function (result) {
                  return _this6.allTopRated.push(result);
                });

              case 12:
                pageNumber++;
                _context7.next = 7;
                break;

              case 15:
                _context7.next = 20;
                break;

              case 17:
                _context7.prev = 17;
                _context7.t0 = _context7["catch"](0);
                alert(_context7.t0);

              case 20:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 17]]);
      }));

      function getTopRated() {
        return _getTopRated.apply(this, arguments);
      }

      return getTopRated;
    }()
  }, {
    key: "getNowPlaying",
    value: function () {
      var _getNowPlaying = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee8() {
        var _this7 = this;

        var movieData, totalPages, pageNumber;
        return _regenerator.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.prev = 0;
                _context8.next = 3;
                return (0, _axios.default)("https://api.themoviedb.org/3/movie/now_playing?api_key=".concat(_base.apiKey, "&page=1&language=en-US"));

              case 3:
                movieData = _context8.sent;
                movieData.data.results.map(function (result) {
                  return _this7.allNowPlaying.push(result);
                });
                totalPages = movieData.data.total_pages > 5 ? 5 : movieData.data.total_pages;
                pageNumber = 2;

              case 7:
                if (!(pageNumber <= totalPages)) {
                  _context8.next = 15;
                  break;
                }

                _context8.next = 10;
                return (0, _axios.default)("https://api.themoviedb.org/3/movie/now_playing?api_key=".concat(_base.apiKey, "&page=").concat(pageNumber, "&language=en-US"));

              case 10:
                movieData = _context8.sent;
                movieData.data.results.map(function (result) {
                  return _this7.allNowPlaying.push(result);
                });

              case 12:
                pageNumber++;
                _context8.next = 7;
                break;

              case 15:
                _context8.next = 20;
                break;

              case 17:
                _context8.prev = 17;
                _context8.t0 = _context8["catch"](0);
                alert(_context8.t0);

              case 20:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, null, [[0, 17]]);
      }));

      function getNowPlaying() {
        return _getNowPlaying.apply(this, arguments);
      }

      return getNowPlaying;
    }()
  }]);
  return Search;
}();

var _default = Search;
exports.default = _default;
},{"@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js","axios":"../node_modules/axios/index.js","../views/base":"js/views/base.js"}],"../node_modules/@babel/runtime/helpers/arrayWithHoles.js":[function(require,module,exports) {
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;
},{}],"../node_modules/@babel/runtime/helpers/iterableToArrayLimit.js":[function(require,module,exports) {
function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;
},{}],"../node_modules/@babel/runtime/helpers/nonIterableRest.js":[function(require,module,exports) {
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

module.exports = _nonIterableRest;
},{}],"../node_modules/@babel/runtime/helpers/slicedToArray.js":[function(require,module,exports) {
var arrayWithHoles = require("./arrayWithHoles");

var iterableToArrayLimit = require("./iterableToArrayLimit");

var nonIterableRest = require("./nonIterableRest");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;
},{"./arrayWithHoles":"../node_modules/@babel/runtime/helpers/arrayWithHoles.js","./iterableToArrayLimit":"../node_modules/@babel/runtime/helpers/iterableToArrayLimit.js","./nonIterableRest":"../node_modules/@babel/runtime/helpers/nonIterableRest.js"}],"js/model/Movie.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _axios = _interopRequireDefault(require("axios"));

var _base = require("../views/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Movie =
/*#__PURE__*/
function () {
  function Movie(id) {
    (0, _classCallCheck2.default)(this, Movie);
    this.movie = {};
    this.movie.id = id;
  }

  (0, _createClass2.default)(Movie, [{
    key: "getMovieDetails",
    value: function () {
      var _getMovieDetails = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        var movieData, _movieData$release_da, _movieData$release_da2, year, month, day;

        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _axios.default)("https://api.themoviedb.org/3/movie/".concat(this.movie.id, "?api_key=").concat(_base.apiKey, "&language=en-US&append_to_response=videos,credits"));

              case 2:
                movieData = _context.sent;
                movieData = movieData.data;
                _movieData$release_da = movieData.release_date.split("-"), _movieData$release_da2 = (0, _slicedToArray2.default)(_movieData$release_da, 3), year = _movieData$release_da2[0], month = _movieData$release_da2[1], day = _movieData$release_da2[2];
                this.movie.backdropPath = movieData.backdrop_path;
                this.movie.posterPath = movieData.poster_path;
                this.movie.title = movieData.original_title;
                this.movie.rating = movieData.vote_average / 2;
                if (movieData.genres.length > 0) this.movie.genre = movieData.genres[0].name;
                this.movie.runHrs = Math.floor(parseInt(movieData.runtime) / 60);
                this.movie.runMins = movieData.runtime - 60 * this.movie.runHrs;
                this.movie.releaseYear = year;
                this.movie.overView = movieData.overview;
                if (movieData.videos.results.length > 0) this.movie.trailerLink = "https://www.youtube.com/watch?v=".concat(movieData.videos.results[0].key);
                movieData.credits.cast.length > 5 ? this.movie.cast = movieData.credits.cast.slice(0, 6) : this.movie.cast = movieData.credits.cast;
                this.movie.direction = movieData.credits.crew.filter(function (crewObj) {
                  return crewObj.job === "Director";
                });

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getMovieDetails() {
        return _getMovieDetails.apply(this, arguments);
      }

      return getMovieDetails;
    }()
  }]);
  return Movie;
}();

var _default = Movie;
exports.default = _default;
},{"@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/slicedToArray":"../node_modules/@babel/runtime/helpers/slicedToArray.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js","axios":"../node_modules/axios/index.js","../views/base":"js/views/base.js"}],"js/model/Favourite.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _axios = _interopRequireDefault(require("axios"));

var _base = require("../views/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Favourite =
/*#__PURE__*/
function () {
  function Favourite() {
    (0, _classCallCheck2.default)(this, Favourite);
    this.favouriteMoviesArray = [];
  }

  (0, _createClass2.default)(Favourite, [{
    key: "addToFavourites",
    value: function addToFavourites(movieId, movieTitle, moviePosterImage, movieGenre) {
      var likedMovie = {
        movieId: movieId,
        movieTitle: movieTitle,
        movieGenre: movieGenre,
        moviePosterImage: moviePosterImage
      };
      this.favouriteMoviesArray.push(likedMovie);
      this.storeFavourites();
    }
  }, {
    key: "deleteFavourites",
    value: function deleteFavourites(movieId) {
      var selectedMovieIndex = this.favouriteMoviesArray.findIndex(function (movie) {
        return movie.movieId === movieId;
      });
      this.favouriteMoviesArray.splice(selectedMovieIndex, 1);
      this.storeFavourites();
    }
  }, {
    key: "isMovieFavourite",
    value: function isMovieFavourite(movieId) {
      return this.favouriteMoviesArray.findIndex(function (movie) {
        return movie.movieId === movieId;
      }) != -1;
    }
  }, {
    key: "getAllMovies",
    value: function getAllMovies() {
      return this.favouriteMoviesArray.length;
    }
  }, {
    key: "storeFavourites",
    value: function storeFavourites() {
      localStorage.setItem("favourites", JSON.stringify(this.favouriteMoviesArray));
    }
  }, {
    key: "getFavourites",
    value: function getFavourites() {
      var recievedFavouriteMovies = JSON.parse(localStorage.getItem("favourites"));
      if (recievedFavouriteMovies) this.favouriteMoviesArray = recievedFavouriteMovies;
    }
  }]);
  return Favourite;
}();

var _default = Favourite;
exports.default = _default;
},{"@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js","axios":"../node_modules/axios/index.js","../views/base":"js/views/base.js"}],"js/views/searchView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderMoviesToUI = exports.renderTopRatedToUI = exports.renderNowPlayingToUI = exports.clearTopRated = exports.clearNowPlaying = exports.clearMovies = exports.clearSearchField = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _base = require("./base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var configurationData = (0, _base.recieveConfigData)();
var genresData = (0, _base.recieveGenres)();
console.log(configurationData, genresData);

var clearSearchField = function clearSearchField() {
  _base.getDomElements.searchText.value = "";
};

exports.clearSearchField = clearSearchField;

var clearMovies = function clearMovies() {
  _base.getDomElements.moviesCategories.innerHTML = "";
  _base.getDomElements.moviesSection.style.backgroundImage = "";
  _base.getDomElements.moviesDetail.innerHTML = "";
  _base.getDomElements.moviesSpecific.innerHTML = "";
  _base.getDomElements.moviesTopRated.innerHTML = "";
  _base.getDomElements.moviesNowPlaying.innerHTML = "";
};

exports.clearMovies = clearMovies;

var clearNowPlaying = function clearNowPlaying() {
  _base.getDomElements.moviesNowPlaying.innerHTML = "";
};

exports.clearNowPlaying = clearNowPlaying;

var clearTopRated = function clearTopRated() {
  _base.getDomElements.moviesTopRated.innerHTML = "";
};

exports.clearTopRated = clearTopRated;

var renderMovies = function renderMovies(movies, cssClass) {
  var movieItem = "";
  var genre = {};
  movies.forEach(function (movie) {
    var _movie$first_air_date, _movie$first_air_date2, _movie$release_date$s, _movie$release_date$s2;

    var year, month, day;
    movie.first_air_date ? (_movie$first_air_date = movie.first_air_date.split("-"), _movie$first_air_date2 = (0, _slicedToArray2.default)(_movie$first_air_date, 3), year = _movie$first_air_date2[0], month = _movie$first_air_date2[1], day = _movie$first_air_date2[2], _movie$first_air_date) : (_movie$release_date$s = movie.release_date.split("-"), _movie$release_date$s2 = (0, _slicedToArray2.default)(_movie$release_date$s, 3), year = _movie$release_date$s2[0], month = _movie$release_date$s2[1], day = _movie$release_date$s2[2], _movie$release_date$s);
    var posterImagePath = configurationData.baseUrl + configurationData.images.poster_sizes[6];
    movie.poster_path ? posterImagePath += movie.poster_path : posterImagePath = '/noposter.png';

    if (movie.genre_ids.length > 0) {
      genre = genresData.genres.find(function (genreObject) {
        return genreObject.id === movie.genre_ids[0];
      });
    } else {
      genre.id = 0;
      genre.name = "General";
    }

    movieItem += "<li class=\"movies__".concat(cssClass, "-item\">\n        <a href=\"#").concat(movie.id, "\" class=\"movies__").concat(cssClass, "-link\">\n            <img src=\"").concat(posterImagePath, "\" alt=\"Movie Poster Image\" class=\"movies__").concat(cssClass, "-item--image\">\n        <h2 class=\"movies__").concat(cssClass, "-item--name\">").concat(movie.original_name ? movie.original_name : movie.title, "</h2>\n        <span class=\"movies__").concat(cssClass, "-item--description\">").concat(genre.name, "</span>\n        <span class=\"movies__").concat(cssClass, "-item--release-year\">").concat(year, "</span>\n        </a>\n        </li>");
    genre = {};
  });
  return movieItem;
}; //export const renderMoviesToUI 
//export const renderNowPlayingToUI
// export const renderTopRatedToUI


var renderNowPlayingToUI = function renderNowPlayingToUI(movies) {
  var currentPageNumber = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var numberOfMoviesInOnePage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  var startingMovie = (currentPageNumber - 1) * numberOfMoviesInOnePage;
  var endingMovie = currentPageNumber * numberOfMoviesInOnePage;
  var slicedMovies = movies.slice(startingMovie, endingMovie);
  var element = "\n    <div class=\"movies__categories-nowplaying\">\n        <h1 class=\"primary-heading movies__categories-nowplaying-title\">Now Playing</h1>\n        <ul class=\"movies__categories-nowplaying-list\">\n            ".concat(renderMovies(slicedMovies, "categories-nowplaying"), "\n        </ul>\n    </div>\n    <div class=\"movies__categories-button\">\n        ").concat(renderButtons(currentPageNumber, movies.length, numberOfMoviesInOnePage, "categories"), "\n    </div>");

  _base.getDomElements.moviesNowPlaying.insertAdjacentHTML("afterbegin", element);
};

exports.renderNowPlayingToUI = renderNowPlayingToUI;

var renderTopRatedToUI = function renderTopRatedToUI(movies) {
  var currentPageNumber = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var numberOfMoviesInOnePage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  var startingMovie = (currentPageNumber - 1) * numberOfMoviesInOnePage;
  var endingMovie = currentPageNumber * numberOfMoviesInOnePage;
  var slicedMovies = movies.slice(startingMovie, endingMovie);
  var element = "\n    <div class=\"movies__categories-recommended\">\n        <h1 class=\"primary-heading movies__categories-recommended-title\">Top Rated</h1>\n        <ul class=\"movies__categories-recommended-list\">\n        ".concat(renderMovies(slicedMovies, "categories-recommended"), "\n        </ul>\n    </div>\n    <div class=\"movies__categories-button\">\n        ").concat(renderButtons(currentPageNumber, movies.length, numberOfMoviesInOnePage, "categories"), "\n    </div>");

  _base.getDomElements.moviesTopRated.insertAdjacentHTML("afterbegin", element);
};

exports.renderTopRatedToUI = renderTopRatedToUI;

var renderMoviesToUI = function renderMoviesToUI(movies, h1Text) {
  var currentPageNumber = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var numberOfMoviesInOnePage = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 20;
  var startingMovie = (currentPageNumber - 1) * numberOfMoviesInOnePage;
  var endingMovie = currentPageNumber * numberOfMoviesInOnePage;
  var slicedMovies = movies.slice(startingMovie, endingMovie);
  var element = "\n    <h1 class=\"primary-heading movies__specific-title\">".concat(h1Text, "</h1>\n    <ul class=\"movies__specific-list\">\n        ").concat(renderMovies(slicedMovies, "specific"), "\n    </ul>\n    <div class=\"movies__specific-button\">\n        ").concat(renderButtons(currentPageNumber, movies.length, numberOfMoviesInOnePage, "specific"), "\n    </div>\n    ");

  _base.getDomElements.moviesSpecific.insertAdjacentHTML("beforeend", element);
};

exports.renderMoviesToUI = renderMoviesToUI;

var renderButtons = function renderButtons(currentPageNumber, totalMovies, numberOfMoviesInOnePage, cssClass) {
  var buttonToBeCreated;
  var totalNumberOfPages = Math.ceil(totalMovies / numberOfMoviesInOnePage);

  if (totalNumberOfPages > 1 && currentPageNumber == 1) {
    buttonToBeCreated = createButton(currentPageNumber, "next", cssClass);
  } else if (currentPageNumber < totalNumberOfPages) {
    buttonToBeCreated = "".concat(createButton(currentPageNumber, 'prev', cssClass), "\n         ").concat(createButton(currentPageNumber, 'next', cssClass), "\n        ");
  } else if (totalNumberOfPages > 1 && currentPageNumber == totalNumberOfPages) {
    buttonToBeCreated = createButton(currentPageNumber, "prev", cssClass);
  } else buttonToBeCreated = "";

  return buttonToBeCreated;
};

var createButton = function createButton(currentPageNumber, typeOfButton, cssClass) {
  var buttonMarkup = "\n    <button class=\"btn-inline movies__".concat(cssClass, "-button--").concat(typeOfButton, "\" data-gotoPage=").concat(typeOfButton === 'next' ? currentPageNumber + 1 : currentPageNumber - 1, "\">\n        <img src=\"").concat(typeOfButton, ".svg\" alt=\"").concat(typeOfButton, " icon\" class=\"button-icon\">\n    </button>\n    ");
  return buttonMarkup;
};
},{"@babel/runtime/helpers/slicedToArray":"../node_modules/@babel/runtime/helpers/slicedToArray.js","./base":"js/views/base.js"}],"js/views/movieView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearMovies = exports.getMovieDetails = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _base = require("./base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var configurationData = (0, _base.recieveConfigData)();
var genresData = (0, _base.recieveGenres)();

var renderCast = function renderCast(movieCast) {
  var markup = "";
  var name = "";
  var firstName = "",
      lastName = "";
  movieCast.forEach(function (cast) {
    if (cast.name.split(" ").length > 1) {
      var _cast$name$split = cast.name.split(" ");

      var _cast$name$split2 = (0, _slicedToArray2.default)(_cast$name$split, 2);

      firstName = _cast$name$split2[0];
      lastName = _cast$name$split2[1];
    } else name = cast.name;

    var posterImagePath = configurationData.baseUrl + configurationData.images.profile_sizes[3];
    cast.profile_path ? posterImagePath += cast.profile_path : posterImagePath = '/noposter.png';
    markup += "<figure class=\"movies-detail__cast-detail--".concat(cast.cast_id, "\">\n            <img src=\"").concat(posterImagePath, "\" alt=\"Picture ").concat(cast.cast_id, "\">\n            <figcaption>").concat(cast.name.split(" ").length > 1 ? firstName + '<br>' + lastName : name, "</figcaption>\n        </figure>");
  });
  return markup;
};

var renderDirectors = function renderDirectors(movieDirectors) {
  var markup = "";
  movieDirectors.forEach(function (director, index) {
    markup += "<p class=\"movies-detail__direction--".concat(index + 1, "\">").concat(director.name, "</p>");
  });
  return markup;
};

var renderStars = function renderStars(rating) {
  var markup = "";

  for (var count = 0; count < rating; count++) {
    markup += "\n        <svg class=\"title__stars-icon\">\n            <use xlink:href=\"sprite.svg#icon-star\"></use>\n        </svg>";
  }

  for (var _count = 0; _count < 5 - rating; _count++) {
    markup += "\n        <svg class=\"title__stars-icon grey\">\n            <use xlink:href=\"sprite.svg#icon-star\"></use>\n        </svg>";
  }

  return markup;
};

var getMovieDetails = function getMovieDetails(movieObject, isFavouriteMovie) {
  var favouriteButtonMessage;
  var favouriteButtonColor;
  var favouriteButtonBackgroundColor;

  if (isFavouriteMovie) {
    favouriteButtonMessage = "<i class=\"fas fa-heart\"></i>Added to Favorites";
    favouriteButtonColor = "#fff";
    favouriteButtonBackgroundColor = "#EB2F06";
  } else {
    favouriteButtonMessage = "<i class=\"fas fa-heart\"></i>Add to Favorites";
    favouriteButtonColor = "#EB2F06";
    favouriteButtonBackgroundColor = "transparent";
  }

  var backdropImagePath = configurationData.baseUrl + configurationData.images.backdrop_sizes[3];
  var posterImagePath = configurationData.baseUrl + configurationData.images.poster_sizes[6];
  movieObject.backdropPath ? backdropImagePath += movieObject.backdropPath : backdropImagePath = '/noposter.png';
  movieObject.posterPath ? posterImagePath += movieObject.posterPath : posterImagePath = '/noposter.png';
  var elementMarkup = "\n    <h1 class=\"movies-detail__title\">".concat(movieObject.title, "</h1>\n    <div class=\"movies-detail__description\">\n        <div class=\"movies-detail__rating\">\n            <div class=\"movies-detail__rating--stars\">\n                ").concat(renderStars(Math.round(movieObject.rating)), "\n            </div>\n            <div class=\"movies-detail__rating--number\">\n                <span class=\"movies-detail__stars--rating\"><span class=\"white\">").concat(movieObject.rating, "</span> /5</span>\n            </div>\n        </div>\n        <div class=\"movies-detail__type\">\n            <span>Action &middot; ").concat(movieObject.runHrs, "hr ").concat(movieObject.runMins, "mins &middot; ").concat(movieObject.releaseYear, "</span>\n        </div>\n    </div>\n    <div class=\"movies-detail__paragraph\">\n        <p>").concat(movieObject.overView, "</p>\n    </div>\n    <div class=\"movies-detail__links\">\n        <a href=\"").concat(movieObject.trailerLink ? movieObject.trailerLink : '#', "\" target=\"_blank\" class=\"movies-detail__link movies-detail__link--trailer\"><img src=\"play.svg\" alt=\"Play icon\"> ").concat(movieObject.trailerLink ? 'Watch Trailer' : 'Trailer Not Available', "</a>\n        <button class=\"movies-detail__link movies-detail__link--favourite\"><i class=\"fas fa-heart\"></i>Add to Favorites</button>\n    </div>\n    <div class=\"movies-detail__cast\">\n        <h3 class=\"movies-detail__cast-title\">Cast</h3>\n        <div class=\"movies-detail__cast-detail\">\n            ").concat(renderCast(movieObject.cast), "\n        </div>\n    </div>\n    <div class=\"movies-detail__direction\">\n        <h3 class=\"movies-detail__direction-title\">Directed By</h3>\n        ").concat(renderDirectors(movieObject.direction), "\n    </div>\n    <div class=\"movies-detail__poster\">\n        <img src=\"").concat(posterImagePath, "\" alt=\"Movie Poster\">\n    </div>\n    ");

  _base.getDomElements.moviesSection.classList.add("movies-detail");

  _base.getDomElements.moviesSection.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.70), rgba(0,0,0,0.75)), url('".concat(backdropImagePath, "')");

  _base.getDomElements.moviesDetail.insertAdjacentHTML("afterbegin", elementMarkup);

  document.querySelector(".movies-detail__link--favourite").innerHTML = favouriteButtonMessage;
  document.querySelector(".movies-detail__link--favourite").style.color = favouriteButtonColor;
  document.querySelector(".movies-detail__link--favourite").style.background = favouriteButtonBackgroundColor;
};

exports.getMovieDetails = getMovieDetails;

var clearMovies = function clearMovies() {
  _base.getDomElements.moviesSection.classList.remove("movies-detail");

  _base.getDomElements.moviesSection.style.backgroundImage = "";
  _base.getDomElements.moviesDetail.innerHTML = "";
};

exports.clearMovies = clearMovies;
},{"@babel/runtime/helpers/slicedToArray":"../node_modules/@babel/runtime/helpers/slicedToArray.js","./base":"js/views/base.js"}],"js/views/favouriteView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showOrHideFavouritesPanel = exports.deleteFavouriteMovieInPanel = exports.createFavouriteMovieInPanel = exports.toggleFavouriteAnimation = void 0;

var _base = require("./base");

var toggleFavouriteAnimation = function toggleFavouriteAnimation(isFavourite) {
  if (isFavourite) {
    document.querySelector(".movies-detail__link--favourite").style.color = "#fff";
    document.querySelector(".movies-detail__link--favourite").style.background = "#EB2F06";
    document.querySelector(".movies-detail__link--favourite").innerHTML = "<i class=\"fas fa-heart\"></i>Added to Favorites";
  } else {
    document.querySelector(".movies-detail__link--favourite").style.color = "#EB2F06";
    document.querySelector(".movies-detail__link--favourite").style.background = "transparent";
    document.querySelector(".movies-detail__link--favourite").innerHTML = "<i class=\"fas fa-heart\"></i>Add to Favorites";
  }
};

exports.toggleFavouriteAnimation = toggleFavouriteAnimation;

var createFavouriteMovieInPanel = function createFavouriteMovieInPanel(movieId, movieTitle, moviePosterImage, movieGenre) {
  var element = "\n    <li class=\"movies__likes-item\">\n        <a href=\"#".concat(movieId, "\" class=\"movies__likes-link\">\n            <img src=\"").concat(moviePosterImage, "\" alt=\"").concat(movieTitle, "\" class=\"movies__likes-link--img\">\n            <div class=\"movies__likes-link-data\">\n                <h3 class=\"movies__likes-link-data--name\">").concat(movieTitle, "</h3>\n                <p class=\"movies__likes-link-data--author\">").concat(movieGenre, "</p>   \n            </div>\n        </a>\n        <span class=\"movies__likes-delete\">\n            <img src=\"/cross.svg\" alt=\"Delete Like\" class=\"movies__likes-delete-icon\">\n        </span>\n    </li>\n    ");

  _base.getDomElements.moviesLikesList.insertAdjacentHTML("afterbegin", element);
};

exports.createFavouriteMovieInPanel = createFavouriteMovieInPanel;

var deleteFavouriteMovieInPanel = function deleteFavouriteMovieInPanel(movieId) {
  var element = document.querySelector(".movies__likes-link[href='#".concat(movieId, "']")).parentElement;
  element.parentNode.removeChild(element);
};

exports.deleteFavouriteMovieInPanel = deleteFavouriteMovieInPanel;

var showOrHideFavouritesPanel = function showOrHideFavouritesPanel(numberOfFavourites) {
  _base.getDomElements.moviesFavouritesPanel.style.display = numberOfFavourites > 0 ? "block" : "none";
};

exports.showOrHideFavouritesPanel = showOrHideFavouritesPanel;
},{"./base":"js/views/base.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _base = require("./js/views/base");

var _Search = _interopRequireDefault(require("./js/model/Search"));

var _Movie = _interopRequireDefault(require("./js/model/Movie"));

var _Favourite = _interopRequireDefault(require("./js/model/Favourite"));

var searchView = _interopRequireWildcard(require("./js/views/searchView"));

var movieView = _interopRequireWildcard(require("./js/views/movieView"));

var favouriteView = _interopRequireWildcard(require("./js/views/favouriteView"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var state = {};
window.state = state;

var capitaliseLetters = function capitaliseLetters(string) {
  return string.charAt(0).toUpperCase().concat(string.slice(1));
};
/*------------------------------------------------ START OF PROGRAM FLOW ----------------*/


var getMoviesBasedOnCategory =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var allGenres, gId;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            allGenres = (0, _base.recieveGenres)().genres;
            gId = allGenres.find(function (genre) {
              return genre.name == capitaliseLetters(window.location.hash.replace("#", ""));
            }).id;
            state.categoryObj = new _Search.default("category");
            searchView.clearMovies();
            (0, _base.bringLoader)(_base.getDomElements.moviesSpecific);
            _context.next = 7;
            return state.categoryObj.getCategoryMovies(gId);

          case 7:
            (0, _base.clearLoader)();
            searchView.renderMoviesToUI(state.categoryObj.categoryMovies, capitaliseLetters(window.location.hash.replace("#", "")));

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getMoviesBasedOnCategory() {
    return _ref.apply(this, arguments);
  };
}();

var getMoviesBasedOnBrowse =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(choice) {
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            state.browseObj = new _Search.default("Browse");
            searchView.clearMovies();
            (0, _base.bringLoader)(_base.getDomElements.moviesSpecific);
            _context2.next = 5;
            return state.browseObj.getBrowsedMovies(choice);

          case 5:
            state.receivedMovies = _context2.sent;
            (0, _base.clearLoader)();
            searchView.renderMoviesToUI(state.receivedMovies, capitaliseLetters(window.location.hash.replace("#", "")));

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getMoviesBasedOnBrowse(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var bringMainMenu =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3() {
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            state.searchObj = new _Search.default("loadingMovies");
            searchView.clearMovies();
            (0, _base.bringLoader)(_base.getDomElements.moviesNowPlaying);
            (0, _base.bringLoader)(_base.getDomElements.moviesTopRated);
            _context3.next = 6;
            return state.searchObj.getTopRated();

          case 6:
            _context3.next = 8;
            return state.searchObj.getNowPlaying();

          case 8:
            searchView.renderTopRatedToUI(state.searchObj.allTopRated);
            searchView.renderNowPlayingToUI(state.searchObj.allNowPlaying);
            (0, _base.clearLoader)();
            (0, _base.clearLoader)();

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function bringMainMenu() {
    return _ref3.apply(this, arguments);
  };
}();

var getMovies =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4(searchQuery) {
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!searchQuery) {
              _context4.next = 9;
              break;
            }

            state.searchObj = new _Search.default(searchQuery);
            searchView.clearSearchField();
            searchView.clearMovies();
            (0, _base.bringLoader)(_base.getDomElements.moviesSpecific);
            _context4.next = 7;
            return state.searchObj.getMovies();

          case 7:
            (0, _base.clearLoader)();
            searchView.renderMoviesToUI(state.searchObj.allMovies, "Search Results");

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function getMovies(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

var getMovieDetails =
/*#__PURE__*/
function () {
  var _ref5 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee5(hashId) {
    var id, movieObject;
    return _regenerator.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (!hashId) {
              _context5.next = 11;
              break;
            }

            id = parseInt(hashId.replace("#", ""));
            movieObject = new _Movie.default(id);
            state.movieObj = movieObject;
            searchView.clearMovies();
            movieView.clearMovies();
            (0, _base.bringLoader)(_base.getDomElements.moviesDetail);
            _context5.next = 9;
            return state.movieObj.getMovieDetails();

          case 9:
            (0, _base.clearLoader)();
            movieView.getMovieDetails(state.movieObj.movie, state.favouriteObj.isMovieFavourite(id));

          case 11:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function getMovieDetails(_x3) {
    return _ref5.apply(this, arguments);
  };
}();

var addMovieToFavourite = function addMovieToFavourite() {
  if (!state.favouriteObj) state.favouriteObj = new _Favourite.default();
  var currentMovieId = state.movieObj.movie.id;
  var movieName = state.movieObj.movie.title;
  var movieGenre = state.movieObj.movie.genre;
  var moviePosterPath = state.movieObj.movie.posterPath;
  var movieUrl = JSON.parse(localStorage.getItem("configData")).baseUrl + JSON.parse(localStorage.getItem("configData")).images.poster_sizes[6] + moviePosterPath;

  if (!state.favouriteObj.isMovieFavourite(currentMovieId)) {
    state.favouriteObj.addToFavourites(currentMovieId, movieName, movieUrl, movieGenre);
    favouriteView.toggleFavouriteAnimation(true);
    favouriteView.createFavouriteMovieInPanel(currentMovieId, movieName, movieUrl, movieGenre);
  } else {
    state.favouriteObj.deleteFavourites(currentMovieId);
    favouriteView.toggleFavouriteAnimation(false);
    favouriteView.deleteFavouriteMovieInPanel(currentMovieId);
  }

  favouriteView.showOrHideFavouritesPanel(state.favouriteObj.getAllMovies());
};

document.addEventListener('keypress', function (event) {
  if (event.keyCode === 13 && event.target.value) {
    getMovies(event.target.value);
    history.pushState("", document.title, window.location.pathname + window.location.search);
  }
}); //Initial Basic Settings 

window.addEventListener("load",
/*#__PURE__*/
(0, _asyncToGenerator2.default)(
/*#__PURE__*/
_regenerator.default.mark(function _callee6() {
  var configData, genres;
  return _regenerator.default.wrap(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _base.getDomElements.overlayDiv.style.display = "none";
          _base.getDomElements.html.style.overflow = "visible";
          state.favouriteObj = new _Favourite.default();
          state.favouriteObj.getFavourites();

          if (!(localStorage.getItem("hasCodeRunThrough") === null)) {
            _context6.next = 14;
            break;
          }

          _context6.next = 7;
          return (0, _base.getConfigData)();

        case 7:
          configData = _context6.sent;
          _context6.next = 10;
          return (0, _base.getGenres)();

        case 10:
          genres = _context6.sent;
          //Save the config data to local storage
          localStorage.setItem("configData", JSON.stringify(configData));
          localStorage.setItem("genresData", JSON.stringify(genres)); //Make sure it doesnt load again and waste resources

          localStorage.setItem("hasCodeRunThrough", true);

        case 14:
          if (_base.getDomElements.moviesDetailClass || window.location.hash) {
            if (["#action", "#comedy", "#drama", "#family", "#horror", "#music", "#thriller"].findIndex(function (cat) {
              return cat == window.location.hash;
            }) === -1) {
              if (["#top", "#tv", "#popular", "#upcoming"].findIndex(function (cat) {
                return cat == window.location.hash;
              }) === -1) {
                getMovieDetails(window.location.hash);
              } else {
                getMoviesBasedOnBrowse(window.location.hash.replace("#", ""));
              }
            } else {
              getMoviesBasedOnCategory();
            }
          } else {
            bringMainMenu();
          }

          favouriteView.showOrHideFavouritesPanel(state.favouriteObj.getAllMovies());
          state.favouriteObj.favouriteMoviesArray.forEach(function (movie) {
            favouriteView.createFavouriteMovieInPanel(movie.movieId, movie.movieTitle, movie.moviePosterImage, movie.movieGenre);
          });

        case 17:
        case "end":
          return _context6.stop();
      }
    }
  }, _callee6);
}))); //Functional Listeners 

_base.getDomElements.moviesSpecific.addEventListener('click', function (event) {
  if (event.target.matches('.btn-inline, .btn-inline *')) {
    var pageNumber = parseInt(event.target.closest(".btn-inline").dataset.gotopage);
    searchView.clearMovies(); // if("#action" || "#comedy" || "#drama" || "#family" || "#horror" || "#music" || "#thriller" || "#top" || "#tv" || "#popular" || "#upcoming" in window.location.hash)
    //     searchView.renderNowPlayingToUI(state.searchObj.allNowPlaying, pageNumber)
    // else
    //     searchView.renderNowPlayingToUI(state.searchObj.allNowPlaying, pageNumber);
    // }

    if (["#action", "#comedy", "#drama", "#family", "#horror", "#music", "#thriller"].findIndex(function (cat) {
      return cat == window.location.hash;
    }) === -1) {
      if (["#top", "#tv", "#popular", "#upcoming"].findIndex(function (cat) {
        return cat == window.location.hash;
      }) === -1) {
        searchView.renderMoviesToUI(state.searchObj.allMovies, "Search Results", pageNumber);
      } else {
        searchView.renderMoviesToUI(state.receivedMovies, capitaliseLetters(window.location.hash.replace("#", "")), pageNumber);
      }
    } else {
      searchView.renderMoviesToUI(state.categoryObj.categoryMovies, capitaliseLetters(window.location.hash.replace("#", "")), pageNumber);
    }
  }
});

_base.getDomElements.moviesTopRated.addEventListener('click', function (event) {
  if (event.target.matches('.btn-inline, .btn-inline *')) {
    console.log("clicked");
    var pageNumber = parseInt(event.target.closest(".btn-inline").dataset.gotopage);
    searchView.clearTopRated();
    searchView.renderTopRatedToUI(state.searchObj.allTopRated, pageNumber);
  }
});

_base.getDomElements.moviesNowPlaying.addEventListener('click', function (event) {
  if (event.target.matches('.btn-inline, .btn-inline *')) {
    var pageNumber = parseInt(event.target.closest(".btn-inline").dataset.gotopage);
    searchView.clearNowPlaying();
    searchView.renderNowPlayingToUI(state.searchObj.allNowPlaying, pageNumber);
  }
});

_base.getDomElements.moviesLogoUserPanel.addEventListener("click", function () {
  history.pushState("", document.title, window.location.pathname + window.location.search);
  bringMainMenu();
});

_base.getDomElements.moviesLogoSideBar.addEventListener("click", function () {
  history.pushState("", document.title, window.location.pathname + window.location.search);
  bringMainMenu();
});

_base.getDomElements.moviesSection.addEventListener("click", function (event) {
  if (event.target.matches('.movies-detail__link--favourite')) {
    addMovieToFavourite();
  }
});

_base.getDomElements.userPanel.addEventListener("click", function (event) {
  if (event.target.matches(".movies__likes-delete, .movies__likes-delete *")) {
    var currentMovieId = state.movieObj.movie.id;
    state.favouriteObj.deleteFavourites(currentMovieId);

    if (_base.getDomElements.moviesDetail.contains(document.querySelector(".movies__detail-group .movies__detail-link--favourite"))) {
      favouriteView.toggleFavouriteAnimation(false);
    }

    favouriteView.deleteFavouriteMovieInPanel(currentMovieId);
    favouriteView.showOrHideFavouritesPanel(state.favouriteObj.getAllMovies());
  }
});

window.addEventListener('hashchange', function () {
  if (["#action", "#comedy", "#drama", "#family", "#horror", "#music", "#thriller"].findIndex(function (cat) {
    return cat == window.location.hash;
  }) === -1) {
    if (["#top", "#tv", "#popular", "#upcoming"].findIndex(function (cat) {
      return cat == window.location.hash;
    }) === -1) {
      getMovieDetails(window.location.hash);
    } else {
      getMoviesBasedOnBrowse(window.location.hash.replace("#", ""));
    }
  } else {
    getMoviesBasedOnCategory();
  }
}); //All other Listeners for styling

_base.getDomElements.searchButton.addEventListener('click', function () {
  _base.getDomElements.searchText.style.width = "25rem";
  _base.getDomElements.searchText.style.paddingRight = "3.0rem";
  _base.getDomElements.searchText.style.marginRight = "-3.0rem";

  _base.getDomElements.searchText.focus();

  _base.getDomElements.searchText.style.cursor = "text";

  _base.getDomElements.searchText.setAttribute('placeholder', "Search here. Press Enter to search.");
});

_base.getDomElements.searchText.addEventListener('focusout', function () {
  _base.getDomElements.searchText.style.width = "4.0rem";
  _base.getDomElements.searchText.style.marginRight = "-2.75rem"; //document.querySelector(".movies__search--info").textContent = "";

  _base.getDomElements.searchText.style.paddingRight = "2rem";
  _base.getDomElements.searchText.value = "";
});

_base.getDomElements.overlayDiv.addEventListener('click', function () {
  _base.getDomElements.overlayDiv.style.display = "none";

  _base.getDomElements.navBtn.classList.toggle('active');
});

_base.getDomElements.nav.addEventListener('click', function () {
  _base.getDomElements.html.style.overflow = document.getElementsByTagName('html')[0].style.overflow === "visible" ? 'hidden' : 'visible';
  _base.getDomElements.overlayDiv.style.display = document.querySelector('.overlay').style.display === 'none' ? 'block' : 'none';

  _base.getDomElements.overlayDiv.classList.toggle("addFadeIn");

  _base.getDomElements.navBtn.classList.toggle('active');
});
},{"@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","./js/views/base":"js/views/base.js","./js/model/Search":"js/model/Search.js","./js/model/Movie":"js/model/Movie.js","./js/model/Favourite":"js/model/Favourite.js","./js/views/searchView":"js/views/searchView.js","./js/views/movieView":"js/views/movieView.js","./js/views/favouriteView":"js/views/favouriteView.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58351" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.map