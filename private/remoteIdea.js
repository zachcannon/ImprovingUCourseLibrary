function RemoteIdeaViewModel(user, remoteIdea, onlineSemester) {
    this.title = remoteIdea.idea.title;
    this.takeCount = ko.observable(0);
    this.teachCount = ko.observable(0);
    this.recommendCount = ko.observable(0);
    this.takeVotes = ko.observableArray();
    this.teachVotes = ko.observableArray();
    this.recommendVotes = ko.observableArray();
    this.authorNameFact = ko.observable();
    this.abstractFact = ko.observable();

    this.authorName = ko.computed(function () {
        return this.authorNameFact() ? this.authorNameFact().value : "";
    }, this);
    this.abstract = ko.computed(function () {
        return this.abstractFact() ? converter.makeHtml(this.abstractFact().value) : "";
    }, this);

    var watches = [];

    function toggleVote(type, votesObservable) {
        return function () { };
    }
    function rescindVote(votesObservable) {
        return function () { };
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
