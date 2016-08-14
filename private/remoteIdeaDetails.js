function RemoteIdeaDetails(remoteIdeaOffice) {
    this.title = remoteIdeaOffice.remoteIdea.idea.title;
    this.abstract = '';
    this.editAbstract = '';
    this.editing = ko.observable(false);
    this.toggleEditAbstract = function () { };
    this.isRemote = false;
    this.deleteIdea = function () { };

    this.takeVotes = ko.observableArray();
    this.teachVotes = ko.observableArray();
    this.recommendVotes = ko.observableArray();
    function watchVotes(type, observable) {
        return [
            j.watch(remoteIdeaOffice, [votesForRemoteIdeaOffice(type), userForVote, namesForUser],
                addTo(observable),
                removeFrom(observable))
        ]
    }
    var watches = []
        .concat(watchVotes("ImprovingU.TakeVote", this.takeVotes))
        .concat(watchVotes("ImprovingU.TeachVote", this.teachVotes))
        .concat(watchVotes("ImprovingU.RecommendVote", this.recommendVotes));
    this.dispose = dispose(watches);
}