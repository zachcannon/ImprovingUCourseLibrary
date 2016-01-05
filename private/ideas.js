var j = new Jinaga();
j.sync(new JinagaDistributor(distributorUrl || "ws://localhost:8080/"));

function listSemester(office, fact) {
    return {
        office: office,
        fact: fact
    };
}

var semesterDallas = {
    type: "ImprovingU.Semester",
    name: "Spring 2016",
    office: {
        type: "ImprovingU.Office",
        name: "Dallas",
        company: {
            type: "ImprovingU.Company",
            name: "Improving"
        }
    }
};

var semesterColumbus = {
    type: "ImprovingU.Semester",
    name: "Spring 2016",
    office: {
        type: "ImprovingU.Office",
        name: "Columbus",
        company: {
            type: "ImprovingU.Company",
            name: "Improving"
        }
    }
};

var viewModel = {
    user: ko.observable(),
    displayName: ko.observable(),
    semesters: ko.observableArray([
        listSemester("Columbus", semesterColumbus),
        listSemester("Dallas", semesterDallas)
    ]),
    selectedSemester: ko.observable(),
    newIdeaTitle: ko.observable(),
    submitNewIdea: submitNewIdea,
    ideas: ko.observableArray(),
    details: ko.observable()
};

ko.applyBindings(viewModel);

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
    if (viewModel.newIdeaTitle() && viewModel.selectedSemester()) {
        j.fact({
            type: "ImprovingU.Idea",
            semester: viewModel.selectedSemester().fact,
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
viewModel.selectedSemester.subscribe(function (semester) {
    if (ideasWatch) {
        ideasWatch.stop();
        ideasWatch = null;
    }

    viewModel.ideas().forEach(function (idea) {
        idea.dispose();
    });
    viewModel.ideas.removeAll();
    if (semester) {
        ideasWatch = j.watch(semester.fact, [ideasForSemester],
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

function IdeaDetails(idea) {
    this.title = idea.title;
    this.abstractValues = ko.observableArray();
    this.abstract = ko.computed(function () {
        var values = this.abstractValues();
        return values.length == 0
            ? ""
            : values[0].value
    }, this);
    this.editing = ko.observable(false);
    this.editAbstract = ko.computed({
        read: function () {
            return this.abstract();
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

    var watches = [
        j.watch(idea, [abstractsInIdea], addTo(this.abstractValues), removeFrom(this.abstractValues))
    ];
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


/////////////////////////////////
// Utilities

function addTo(observableArray, map) {
    map = map || function (o) { return o; };
    return function (fact) {
        observableArray.push(map(fact));
        return map(fact);
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
