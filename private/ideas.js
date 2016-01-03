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
    ideas: ko.observableArray()
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
        takeVotes: ko.observableArray(),
        toggleTakeVote: toggleTakeVote
    };
    var watches = [];
    watches.push(j.watch(idea, [takeVotesForIdea],
        increment(ideaViewModel.takeCount),
        decrement(ideaViewModel.takeCount)));
    var ideaConsumer = {
        type: "ImprovingU.IdeaConsumer",
        idea: idea,
        consumer: user
    };
    watches.push(j.watch(ideaConsumer, [takeVotesForIdeaConsumer],
        addTo(ideaViewModel.takeVotes),
        removeFrom(ideaViewModel.takeVotes)));
    function toggleTakeVote() {
        if (ideaViewModel.takeVotes().length) {
            j.fact({
                type: "ImprovingU.RescindVote",
                from: user,
                vote: ideaViewModel.takeVotes()
            });
        }
        else {
            j.fact({
                type: "ImprovingU.TakeVote",
                from: user,
                createdAt: new Date(),
                ideaConsumer: ideaConsumer
            });
        }
    }
    ideaViewModel.dispose = dispose(watches);
    return ideaViewModel;
}

function voteIsNotRescinded(v) {
    return j.not({
        type: "ImprovingU.RescindVote",
        vote: v
    });
}

function takeVotesForIdea(i) {
    return j.where({
        type: "ImprovingU.TakeVote",
        ideaConsumer: {
            type: "ImprovingU.IdeaConsumer",
            idea: i
        }
    }, [voteIsNotRescinded]);
}

function takeVotesForIdeaConsumer(ic) {
    return j.where({
        type: "ImprovingU.TakeVote",
        ideaConsumer: ic
    }, [voteIsNotRescinded]);
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

function dispose(watches) {
    return function() {
        watches.forEach(function (watch) {
            watch.stop();
        });
    };
}
