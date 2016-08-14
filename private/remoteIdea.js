function RemoteIdeaViewModel(user, remoteIdea, semester) {
    this.title = remoteIdea.idea.title + ' (Remote)';
    this.takeCount = ko.observable(0);
    this.teachCount = ko.observable(0);
    this.recommendCount = ko.observable(0);
    this.takeVotes = ko.observableArray();
    this.teachVotes = ko.observableArray();
    this.recommendVotes = ko.observableArray();
    this.authorNameFact = ko.observable();
    this.abstractFact = ko.observable();

    var remoteIdeaOffice = createRemoteIdeaOffice(remoteIdea, semester);
    var ideaConsumer = createRemoteIdeaOfficeConsumer(remoteIdeaOffice, user);

    this.visible = remoteIdea.idea.semester.office.name !== semester.office.name;
    this.authorName = ko.computed(function () {
        return this.authorNameFact() ? this.authorNameFact().value : "";
    }, this);
    this.abstract = ko.computed(function () {
        return this.abstractFact() ? converter.makeHtml(this.abstractFact().value) : "";
    }, this);

    function watchVotes(type, votesObservable) {
        return [
            j.watch(ideaConsumer, [votesForIdeaConsumer(type)],
                addTo(votesObservable),
                removeFrom(votesObservable))
        ];
    }
    var watches = []
        .concat(watchVotes("ImprovingU.TakeVote", this.takeVotes))
        .concat(watchVotes("ImprovingU.TeachVote", this.teachVotes))
        .concat(watchVotes("ImprovingU.RecommendVote", this.recommendVotes));

    function toggleVote(type, votesObservable) {
        return function() {
            if (votesObservable().length) {
                createRescindVote(user, votesObservable());
            }
            else {
                createVote(type, user, ideaConsumer);
            }
        };
    }
    function rescindVote(votesObservable) {
        return function() {
            if (votesObservable().length) {
                createRescindVote(user, votesObservable());
            }
        };
    }
    this.toggleTakeVote = toggleVote("ImprovingU.TakeVote", this.takeVotes);
    this.toggleTeachVote = toggleVote("ImprovingU.TeachVote", this.teachVotes);
    this.toggleRecommendVote = toggleVote("ImprovingU.RecommendVote", this.recommendVotes);
    this.rescindTakeVote = rescindVote(this.takeVotes);
    this.rescindTeachVote = rescindVote(this.teachVotes);
    this.rescindRecommendVote = rescindVote(this.recommendVotes);
    this.showDetails = function () {
        //
    };
    this.dispose = dispose(watches);
}
