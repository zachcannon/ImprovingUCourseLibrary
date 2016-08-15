function RemoteIdeaDetails(remoteIdeaOffice) {
    this.title = remoteIdeaOffice.remoteIdea.idea.title;
    this.titleFacts = ko.observableArray();
    this.title = mutableValue(this.titleFacts, null, remoteIdeaOffice.remoteIdea.idea.title);
    this.office = remoteIdeaOffice.remoteIdea.idea.semester.office.name;

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
    var watches = [
            j.watch(remoteIdeaOffice.remoteIdea.idea, [titlesForIdea], addTo(this.titleFacts), removeFrom(this.titleFacts))
        ]
        .concat(watchVotes("ImprovingU.TakeVote", this.takeVotes))
        .concat(watchVotes("ImprovingU.TeachVote", this.teachVotes))
        .concat(watchVotes("ImprovingU.RecommendVote", this.recommendVotes));
    this.dispose = dispose(watches);
}