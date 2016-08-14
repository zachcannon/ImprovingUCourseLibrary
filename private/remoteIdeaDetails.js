function RemoteIdeaDetails(remoteIdeaOffice) {
    this.title = remoteIdeaOffice.remoteIdea.idea.title;
    this.abstract = '';
    this.editAbstract = '';
    this.editing = false;

    this.takeVotes = ko.observableArray();
    this.teachVotes = ko.observableArray();
    this.recommendVotes = ko.observableArray();
    function watchVotes(type, observable) {
        return [
            j.watch(remoteIdeaOffice, [votesForIdea(type), userForVote, namesForUser],
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