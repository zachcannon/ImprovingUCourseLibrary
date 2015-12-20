var j = new Jinaga();
j.sync(new JinagaDistributor("ws://localhost:3000/"));

var viewModel = {
    user: ko.observable(),
    displayName: ko.observable()
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
