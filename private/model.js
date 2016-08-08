var j = new Jinaga();
j.sync(new JinagaDistributor(distributorUrl || "ws://localhost:8080/"));

function createUserName(user, value, prior) {
    return j.fact({
        type: "ImprovingU.UserName",
        prior: prior,
        from: user,
        value: value
    });
}

function createIdea(semester, user, title) {
    return j.fact({
        type: "ImprovingU.Idea",
        semester: semester,
        from: user,
        createdAt: new Date(),
        title: title
    });
}

function createIdeaConsumer(idea, user) {
    return j.fact({
        type: "ImprovingU.IdeaConsumer",
        idea: idea,
        consumer: user
    });
}

function createAbstract(idea, user, value, prior) {
    return j.fact({
        type: "ImprovingU.Abstract",
        idea: idea,
        prior: prior,
        from: user,
        value: value
    });
}

function createVote(type, user, ideaConsumer) {
    return j.fact({
        type: type,
        from: user,
        createdAt: new Date(),
        ideaConsumer: ideaConsumer
    });
}

function createRescindVote(user, vote) {
    return j.fact({
        type: "ImprovingU.RescindVote",
        from: user,
        vote: vote
    });
}

////////////////////////
// Template functions

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

function ideasForSemester(s) {
    return {
        type: "ImprovingU.Idea",
        semester: s
    };
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

function userForVote(v) {
    v.has("from");
    v.from.type = "Jinaga.User";
    return v.from;
}

function userForIdea(i) {
    i.has("from");
    i.from.type = "Jinaga.User";
    return i.from;
}