var converter = new showdown.Converter();

function IdeaDetails(idea, onlineSemester, user) {
    this.titleFacts = ko.observableArray();
    this.title = mutableValue(this.titleFacts, partial(createIdeaTitle, idea), idea.title);
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
            createAbstract(idea, user, value, this.abstractValues());
        },
        owner: this
    });

    this.toggleEditAbstract = function () {
        this.editing(!this.editing());
    };

    this.remoteIdeas = ko.observableArray([]);
    this.isRemote = ko.computed({
        read: function () {
            return this.remoteIdeas().length > 0;
        },
        write: function (value) {
            var prior = this.remoteIdeas();
            if (prior.length === 0) {
                createRemoteIdea(idea, onlineSemester);
            }
            else {
                createRemoteIdeaDeletion(prior);
            }
        },
        owner: this
    });

    this.deleteIdea = function () {
        if (window.confirm('Do you want to delete this idea?')) {
            createIdeaDeletion(idea);
            $('#idea-details').modal('toggle');
        }
    }

    this.takeVotes = ko.observableArray();
    this.teachVotes = ko.observableArray();
    this.recommendVotes = ko.observableArray();
    function watchVotes(type, observable) {
        return [
            j.watch(idea, [votesForIdea(type), userForFact, namesForUser],
                addTo(observable),
                removeFrom(observable))
        ]
    }
    var watches = []
        .concat([
            j.watch(idea, [abstractsInIdea], addTo(this.abstractValues), removeFrom(this.abstractValues)),
            j.watch(idea, [remoteIdeasForIdea], addTo(this.remoteIdeas), removeFrom(this.remoteIdeas)),
            j.watch(idea, [titlesForIdea], addTo(this.titleFacts), removeFrom(this.titleFacts))
        ])
        .concat(watchVotes("ImprovingU.TakeVote", this.takeVotes))
        .concat(watchVotes("ImprovingU.TeachVote", this.teachVotes))
        .concat(watchVotes("ImprovingU.RecommendVote", this.recommendVotes));
    this.dispose = dispose(watches);
}
