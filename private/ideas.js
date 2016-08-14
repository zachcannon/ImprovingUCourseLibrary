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

window.addEventListener('hashchange', hashChanged, false);
function hashChanged() {
    Cookies.set('ImprovingU.Office', window.location.hash.slice(1));
    viewModel.office(window.location.hash.slice(1));
};

function MainViewModel() {
    this.error = ko.observable();
    this.queueCount = ko.observable();
    this.showError = function () {
        if (this.error()) {
            $("#error-dialog").modal();
        }
    };
    this.showSummary = function () {
        $("#summary-dialog").modal();
    };

    this.user = ko.observable();
    this.displayName = ko.observable();
    this.offices = ['Dallas', 'Columbus', 'Houston', 'Minneapolis', 'College Station', 'Calgary'];
    this.office = ko.observable(getOffice());
    this.newIdeaTitle = ko.observable();
    this.submitNewIdea = function () {
        if (this.newIdeaTitle()) {
            createIdea(this.semester(), this.user(), this.newIdeaTitle());
            this.newIdeaTitle("");
        }
    };
    this.ideas = ko.observableArray();
    this.details = ko.observable();

    this.status = ko.computed(function () {
        return this.error()
            ? "Error"
            : this.queueCount() > 0
            ? "Saving..."
            : "";
    }, this);

    this.semester = ko.computed(function () {
        return {
            type: "ImprovingU.Semester",
            name: "Fall 2016",
            office: {
                type: "ImprovingU.Office",
                name: this.office(),
                company: {
                    type: "ImprovingU.Company",
                    name: "Improving"
                }
            }
        };
    }, this);
    this.onlineSemester = {
        type: "ImprovingU.OnlineSemester",
        name: "Fall 2016",
        company: {
            type: "ImprovingU.Company",
            name: "Improving"
        }
    };

    this.context = ko.computed(function () {
        return {
            user: this.user(),
            semester: this.semester()
        };
    }, this);
}
var viewModel = new MainViewModel();
j.onError(function (message) { viewModel.error(message); });
j.onProgress(function (queueCount) { viewModel.queueCount(queueCount); });

ko.applyBindings(viewModel);


j.login(function (u, profile) {
    if (!u) {
        window.location = loginUrl || "http://localhost:8080/public/login.html";
    }
    else {
        viewModel.user(u);
        j.query(u, [namesForUser], function(names) {
            if (names.length != 1 || names[0].value !== profile.displayName) {
                createUserName(u, profile.displayName, names);
            }
        });
    }
});

var userWatches = [];

viewModel.context.subscribe(function (c) {
    dispose(userWatches)();
    viewModel.ideas.removeAll();

    if (c && c.user && c.semester) {
        var ideaWatch = j.watch(c.semester, [ideasForSemester],
            addTo(viewModel.ideas, function (idea) { return new IdeaViewModel(c.user, idea, viewModel.onlineSemester); }),
            removeFrom(viewModel.ideas));
        watchIdeaForVotes(ideaWatch, "ImprovingU.TakeVote", "takeCount");
        watchIdeaForVotes(ideaWatch, "ImprovingU.TeachVote", "teachCount");
        watchIdeaForVotes(ideaWatch, "ImprovingU.RecommendVote", "recommendCount");
        ideaWatch.watch([userForIdea, namesForUser], setChildValue("authorNameFact"));
        ideaWatch.watch([abstractsInIdea], setChildValue("abstractFact"));

        var remoteIdeaWatch = j.watch(viewModel.onlineSemester, [remoteIdeasForOnlineSemester],
            addTo(viewModel.ideas, function (remoteIdea) { return new RemoteIdeaViewModel(c.user, remoteIdea, c.semester)}),
            removeFrom(viewModel.ideas));
        remoteIdeaWatch.watch([ideaForRemoteIdea, userForIdea, namesForUser], setChildValue("authorNameFact"));
        remoteIdeaWatch.watch([ideaForRemoteIdea, abstractsInIdea], setChildValue("abstractFact"));

        userWatches = [
            j.watch(c.user, [namesForUser], function (n) {
                viewModel.displayName(n.value);
            }),
            ideaWatch,
            remoteIdeaWatch
        ];
    }
    else {
        userWatches = [];
    }
});

function watchIdeaForVotes(ideaWatch, type, observableName) {
    ideaWatch.watch([votesForIdea(type)],
        incrementChild(observableName),
        decrementChild);
}