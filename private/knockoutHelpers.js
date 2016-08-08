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
        return { parent, obj };
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
