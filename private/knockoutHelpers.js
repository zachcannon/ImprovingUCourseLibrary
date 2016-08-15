function addTo(observableArray, map) {
    map = map || function (o) { return o; };
    return function (fact) {
        var obj = map(fact);
        observableArray.push(obj);
        return obj;
    };
}

function addToChild(propertyName, ctor) {
    return function (parent, fact) {
        var obj = ctor ? new ctor(fact) : fact;
        parent[propertyName].push(obj);
        return { parent: parent, obj: obj };
    }
}

function removeFrom(observableArray) {
    return function (obj) {
        if (obj.dispose)
            obj.dispose();
        observableArray.remove(obj);
    };
}

function removeFromChild(propertyName) {
    return function (pair) {
        pair.parent[propertyName].remove(pair.obj);
    }
}

function increment(value) {
    return function (v) {
        value(value() + 1);
    };
}

function decrement(value) {
    return function (v) {
        value(value() - 1);
    };
}

function incrementChild(observableName) {
    return function (parent, v) {
        var observable = parent[observableName];
        observable(observable() + 1);
        return observable;
    }
}

function decrementChild(observable) {
    observable(observable() - 1);
}

function setValue(observable) {
    return function (v) {
        observable(v);
    }
}

function setChildValue(observableName) {
    return function (parent, v) {
        parent[observableName](v);
    }
}

function dispose(watches) {
    return function() {
        watches.forEach(function (watch) {
            watch.stop();
        });
    };
}

function mutableValue(observable, createValue, defaultValue) {
    return ko.computed({
        read: function () {
            var candidates = observable();
            if (candidates.length === 0) {
                return defaultValue;
            }
            else {
                return candidates.reduce(function (sum, candidate) {
                    if (sum) {
                        return sum + ', ' + candidate.value;
                    }
                    else {
                        return candidate.value;
                    }
                }, null);
            }
        },
        write: function (value) {
            createValue(value, observable());
        }
    });
}

// http://benalman.com/news/2012/09/partial-application-in-javascript/
function partial(fn /*, args...*/) {
  // A reference to the Array#slice method.
  var slice = Array.prototype.slice;
  // Convert arguments object to an array, removing the first argument.
  var args = slice.call(arguments, 1);

  return function() {
    // Invoke the originally-specified function, passing in all originally-
    // specified arguments, followed by any just-specified arguments.
    return fn.apply(this, args.concat(slice.call(arguments, 0)));
  };
}