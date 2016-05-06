var j = new Jinaga();
j.sync(new JinagaDistributor(distributorUrl || "ws://localhost:8080/"));
j.onError(function (message) { viewModel.error(message); });
j.onProgress(function (queueCount) { viewModel.queueCount(queueCount); });

function listSemester(office, fact) {
    return {
        office: office,
        fact: fact
    };
}

function getOffice() {
    if (window.location.hash && window.location.hash.length > 1 && window.location.hash[0] === '#') {
        return window.location.hash.slice(1);
    }
    else {
        var value = Cookies.get('ImprovingU.Office');
        if (value) {
            return value;
        }
        else {
            return 'Dallas';
        }
    }
}

var viewModel = {
    error: ko.observable(),
    queueCount: ko.observable(),
    showError: showError,
    showSummary: showSummary,

    user: ko.observable(),
    displayName: ko.observable(),
    office: ko.observable(getOffice()),
    newIdeaTitle: ko.observable(),
    submitNewIdea: submitNewIdea,
    ideas: ko.observableArray(),
    details: ko.observable()
};
viewModel.status = ko.computed(function () {
    return viewModel.error()
        ? "Error"
        : viewModel.queueCount() > 0
        ? "Saving..."
        : "";
});
viewModel.semester = ko.computed(function () {
    return {
        type: "ImprovingU.Semester",
        name: "Summer 2016",
        office: {
            type: "ImprovingU.Office",
            name: viewModel.office(),
            company: {
                type: "ImprovingU.Company",
                name: "Improving"
            }
        }
    };
})

ko.applyBindings(viewModel);

window.addEventListener('hashchange', hashChanged, false);
function hashChanged() {
    Cookies.set('ImprovingU.Office', window.location.hash.slice(1));
    viewModel.office(window.location.hash.slice(1));
};

function showError() {
    $("#error-dialog").modal();
}

function showSummary() {
    $("#summary-dialog").modal();
}

function nameIsCurrent(n) {
    return j.not({
        type: "ImprovingU.UserName",
        prior: n
    });
}

function namesForUser(u) {
    return j.where({
        type: "ImprovingU.UserName",
        from: u
    }, [nameIsCurrent]);
}

j.login(function (u, profile) {
    if (!u) {
        window.location = loginUrl || "http://localhost:8080/public/login.html";
    }
    else {
        viewModel.user(u);
        j.query(u, [namesForUser], function(names) {
            if (names.length != 1 || names[0].value !== profile.displayName) {
                j.fact({
                    type: "ImprovingU.UserName",
                    prior: names,
                    from: u,
                    value: profile.displayName
                });
            }
        });
    }
});

viewModel.user.subscribe(function (u) {
    j.watch(u, [namesForUser], function (n) {
        viewModel.displayName(n.value);
    });
});

function submitNewIdea() {
    if (viewModel.newIdeaTitle()) {
        j.fact({
            type: "ImprovingU.Idea",
            semester: viewModel.semester(),
            from: viewModel.user(),
            createdAt: new Date(),
            title: viewModel.newIdeaTitle()
        });
        viewModel.newIdeaTitle("");
    }
}

function ideasForSemester(s) {
    return {
        type: "ImprovingU.Idea",
        semester: s
    };
}

var ideasWatch;
viewModel.semester.subscribe(function (s) {
    if (ideasWatch) {
        ideasWatch.stop();
        ideasWatch = null;
    }

    viewModel.ideas().forEach(function (idea) {
        idea.dispose();
    });
    viewModel.ideas.removeAll();
    if (s) {
        ideasWatch = j.watch(s, [ideasForSemester],
            addTo(viewModel.ideas, IdeaViewModel),
            removeFrom(viewModel.ideas));
    }
});


////////////////////////////////
// Idea view model

function IdeaViewModel(idea) {
    var user = viewModel.user();
    var ideaViewModel = {
        title: idea.title,
        takeCount: ko.observable(0),
        teachCount: ko.observable(0),
        recommendCount: ko.observable(0),
        takeVotes: ko.observableArray(),
        teachVotes: ko.observableArray(),
        recommendVotes: ko.observableArray(),
        authorNameFact: ko.observable()
    };
    var ideaConsumer = {
        type: "ImprovingU.IdeaConsumer",
        idea: idea,
        consumer: user
    };

    ideaViewModel.authorName = ko.computed(function () {
        return ideaViewModel.authorNameFact() ? ideaViewModel.authorNameFact().value : "";
    });


    function watchVotes(type, countObservable, votesObservable) {
        return [
            j.watch(idea, [votesForIdea(type)],
                increment(countObservable),
                decrement(countObservable)),
            j.watch(ideaConsumer, [votesForIdeaConsumer(type)],
                addTo(votesObservable),
                removeFrom(votesObservable))
        ];
    }
    var watches = []
        .concat(watchVotes("ImprovingU.TakeVote", ideaViewModel.takeCount, ideaViewModel.takeVotes))
        .concat(watchVotes("ImprovingU.TeachVote", ideaViewModel.teachCount, ideaViewModel.teachVotes))
        .concat(watchVotes("ImprovingU.RecommendVote", ideaViewModel.recommendCount, ideaViewModel.recommendVotes))
        .concat(j.watch(idea.from, [namesForUser], setValue(ideaViewModel.authorNameFact)));

    function toggleVote(type, votesObservable) {
        return function() {
            if (votesObservable().length) {
                j.fact({
                    type: "ImprovingU.RescindVote",
                    from: user,
                    vote: votesObservable()
                });
            }
            else {
                j.fact({
                    type: type,
                    from: user,
                    createdAt: new Date(),
                    ideaConsumer: ideaConsumer
                });
            }
        };
    }
    ideaViewModel.toggleTakeVote = toggleVote("ImprovingU.TakeVote", ideaViewModel.takeVotes);
    ideaViewModel.toggleTeachVote = toggleVote("ImprovingU.TeachVote", ideaViewModel.teachVotes);
    ideaViewModel.toggleRecommendVote = toggleVote("ImprovingU.RecommendVote", ideaViewModel.recommendVotes);
    ideaViewModel.showDetails = showDetails(idea);
    ideaViewModel.dispose = dispose(watches);
    return ideaViewModel;
}

function voteIsNotRescinded(v) {
    return j.not({
        type: "ImprovingU.RescindVote",
        vote: v
    });
}

function votesForIdea(type) {
    return function(i) {
        return j.where({
            type: type,
            ideaConsumer: {
                type: "ImprovingU.IdeaConsumer",
                idea: i
            }
        }, [voteIsNotRescinded]);
    };
}

function votesForIdeaConsumer(type) {
    return function(ic) {
        return j.where({
            type: type,
            ideaConsumer: ic
        }, [voteIsNotRescinded]);
    };
}

function showDetails(idea) {
    return function() {
        if (viewModel.details())
            viewModel.details().dispose();
        viewModel.details(new IdeaDetails(idea));
        $("#idea-details").modal();
    };
}


/////////////////////////////////
// Details

var converter = new showdown.Converter();

function IdeaDetails(idea) {
    this.title = idea.title;
    this.abstractValues = ko.observableArray();
    this.abstract = ko.computed(function () {
        var values = this.abstractValues();
        return values.length == 0
            ? ""
            : converter.makeHtml(values[0].value);
    }, this);
    this.editing = ko.observable(false);
    this.editAbstract = ko.computed({
        read: function () {
            var values = this.abstractValues();
            return values.length == 0
                ? ""
                : values[0].value;
        },
        write: function (value) {
            j.fact({
                type: "ImprovingU.Abstract",
                idea: idea,
                prior: this.abstractValues(),
                from: viewModel.user(),
                value: value
            });
        },
        owner: this
    });

    this.toggleEditAbstract = function () {
        this.editing(!this.editing());
    };

    this.takeVotes = ko.observableArray();
    this.teachVotes = ko.observableArray();
    this.recommendVotes = ko.observableArray();
    function watchVotes(type, observable) {
        return [
            j.watch(idea, [votesForIdea(type), userForVote, namesForUser],
                addTo(observable),
                removeFrom(observable))
        ]
    }
    var watches = [
        j.watch(idea, [abstractsInIdea], addTo(this.abstractValues), removeFrom(this.abstractValues))
    ];
    watches = watches
        .concat(watchVotes("ImprovingU.TakeVote", this.takeVotes))
        .concat(watchVotes("ImprovingU.TeachVote", this.teachVotes))
        .concat(watchVotes("ImprovingU.RecommendVote", this.recommendVotes));
    this.dispose = dispose(watches);
}

function abstractsInIdea(i) {
    return j.where({
        type: "ImprovingU.Abstract",
        idea: i
    }, [abstractIsCurrent]);
}

function abstractIsCurrent(a) {
    return j.not({
        type: "ImprovingU.Abstract",
        prior: a
    });
}

function userForVote(v) {
    v.has("from");
    v.from.type = "Jinaga.User";
    return v.from;
}


/////////////////////////////////
// Utilities

function addTo(observableArray, map) {
    map = map || function (o) { return o; };
    return function (fact) {
        var obj = map(fact);
        observableArray.push(obj);
        return obj;
    };
}

function removeFrom(observableArray) {
    return function (obj) {
        if (obj.dispose)
            obj.dispose();
        observableArray.remove(obj);
    };
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

function setValue(observable) {
    return function (v) {
        observable(v);
    }
}

function dispose(watches) {
    return function() {
        watches.forEach(function (watch) {
            watch.stop();
        });
    };
}