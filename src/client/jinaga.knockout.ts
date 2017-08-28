class JinagaKnockout {

    constructor (
        private j: any,
        private ko: any) {
    }

    root(ctor: any, fields: any) {
        var spec = {
            load: load
        };
        return spec;

        function load(fact: Object) {
            var obj = new ctor(),
                field,
                watches: any = [],
                watch,
                result = {
                    viewModel: obj,
                    onLoaded: onLoaded,
                    unload: unload
                };

            for (var f in fields) {
                (function (field) {
                    var childSpec = fields[field],
                        observable = childSpec.createObservable(fact);

                    obj[field] = observable;
                    watch = childSpec.watch(function (templates: any, add: any, remove: any) {
                        return this.j.watch(fact, templates, function (fact: any) {
                            return add(observable, fact);
                        }, remove);
                    });
                    if (watch) {
                        watches.push(watch);
                    }
                })(f);
            }
            return result;

            function onLoaded(done: any) {
                var subscribed = true;

                j.onLoading(function (loading: any) {
                    if (!loading && subscribed) {
                        done(result);
                        subscribed = false;
                    }
                });
            }

            function unload() {
                watches.forEach(function (w: any) {
                    w.stop();
                });
                watches = [];
            }
        }
    };

    collection(templates: any, ctor: any, fields: any) {
        return {
            createObservable: createObservable,
            watch: watch
        };

        function createObservable(fact: any) {
            return ko.observableArray();
        }

        function watch(createWatch: any) {
            var watch = createWatch(templates, function (observable: any, fact: any) {
                var child = new ctor(),
                    field;

                for (field in fields) {
                    var spec = fields[field];
                    child[field] = spec.createObservable(fact);
                }
                observable.push(child);
                return { observable: observable, child: child };
            }, function (pair: any) {
                pair.observable.remove(pair.child);
            });

            for (var f in fields) {
                (function (field) {
                    var spec = fields[field];

                    spec.watch(function (templates: any, add: any, remove: any) {
                        watch.watch(templates, function (pair: any, fact: any) {
                            return add(pair.child[field], fact);
                        }, remove);
                    });
                })(f);
            }

            return watch;
        }
    };

    property(templates: any, defaultValue: any, valueField: any) {
        valueField = valueField || 'value';

        return {
            createObservable: createObservable,
            watch: watch
        };

        function createObservable(fact: any) {
            return ko.observable(defaultValue);
        }

        function watch(createWatch: any) {
            return createWatch(templates, function (observable: any, fact: any) {
                observable(fact[valueField]);
            });
        }
    }

    fact() {
        return {
            createObservable: createObservable,
            watch: watch
        };

        function createObservable(fact: any) {
            return fact;
        }

        function watch(createWatch: any): any {
            return null;
        }
    };

    field(name: any) {
        return {
            createObservable: createObservable,
            watch: watch
        };

        function createObservable(fact: any) {
            return fact[name];
        }

        function watch(createWatch: any): any {
            return null;
        }
    };

    map(selector: any) {
        return {
            createObservable: createObservable,
            watch: watch
        };

        function createObservable(fact: any) {
            return selector(fact);
        }

        function watch(createWatch: any): any {
            return null;
        }
    };
}