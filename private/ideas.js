function IdeasViewModel() {
    UserViewModel.call(this, null);

    this.showSummary = function () {
        $("#summary-dialog").modal();
    };

    this.newIdeaTitle = ko.observable();
    this.submitNewIdea = function () {
        if (this.newIdeaTitle()) {
            createIdea(this.semester(), this.user(), this.newIdeaTitle());
            this.newIdeaTitle("");
        }
    };
    this.ideas = ko.observableArray();
    this.details = ko.observable();
    this.remoteDetails = ko.observable();

    this.semester = ko.computed(function () {
        return {
            type: "ImprovingU.Semester",
            name: "Spring 2017",
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
        name: "Fall 2017",
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

    initializeWatches(this);

    function initializeWatches(viewModel) {
        var userWatches = [];

        viewModel.context.subscribe(function (c) {
            dispose(userWatches)();
            viewModel.ideas.removeAll();

            if (c && c.user && c.semester) {
                var ideaWatch = j.watch(c.semester, [ideasForSemester],
                    addTo(viewModel.ideas, function (idea) { return new IdeaViewModel(c.user, idea, viewModel.onlineSemester, viewModel.details); }),
                    removeFrom(viewModel.ideas));
                watchIdeaForVotes(ideaWatch, "ImprovingU.TakeVote", "takeCount");
                watchIdeaForVotes(ideaWatch, "ImprovingU.TeachVote", "teachCount");
                watchIdeaForVotes(ideaWatch, "ImprovingU.RecommendVote", "recommendCount");
                ideaWatch.watch([titlesForIdea], setChildValue("titleFact"));
                ideaWatch.watch([userForFact, namesForUser], setChildValue("authorNameFact"));
                ideaWatch.watch([abstractsInIdea], setChildValue("abstractFact"));

                var remoteIdeaWatch = j.watch(viewModel.onlineSemester, [remoteIdeasForOnlineSemester],
                    addTo(viewModel.ideas, function (remoteIdea) { return new RemoteIdeaViewModel(c.user, remoteIdea, c.semester, viewModel.remoteDetails)}),
                    removeFrom(viewModel.ideas));
                watchRemoteIdeaForVotes(remoteIdeaWatch, "ImprovingU.TakeVote", "takeVotesAll");
                watchRemoteIdeaForVotes(remoteIdeaWatch, "ImprovingU.TeachVote", "teachVotesAll");
                watchRemoteIdeaForVotes(remoteIdeaWatch, "ImprovingU.RecommendVote", "recommendVotesAll");
                remoteIdeaWatch.watch([ideaForRemoteIdea, titlesForIdea], setChildValue("titleFact"));
                remoteIdeaWatch.watch([ideaForRemoteIdea, userForFact, namesForUser], setChildValue("authorNameFact"));
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
    }

    function watchIdeaForVotes(ideaWatch, type, observableName) {
        ideaWatch.watch([votesForIdea(type)],
            incrementChild(observableName),
            decrementChild);
    }

    function watchRemoteIdeaForVotes(remoteIdeaWatch, type, observableName) {
        remoteIdeaWatch.watch([votesForRemoteIdea(type)],
            addToChild(observableName),
            removeFromChild(observableName));
    }
}
