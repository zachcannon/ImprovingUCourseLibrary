var j = new Jinaga();
j.sync(new JinagaDistributor("ws://localhost:3000/"));

var viewModel = {
    user: ko.observable(),
    displayName: ko.observable(),
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
        window.location = "http://localhost:3000/public/login.html";
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

var semester = {
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

function submitNewIdea() {
    if (viewModel.newIdeaTitle()) {
        j.fact({
            type: "ImprovingU.Idea",
            semester: semester,
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

j.watch(semester, [ideasForSemester], addTo(viewModel.ideas), removeFrom(viewModel.ideas));

function addTo(observableArray) {
    return function (fact) {
        observableArray.push(fact);
        return fact;
    };
}

function removeFrom(observableArray) {
    return function (fact) {
        observableArray.remove(fact);
    };
}
