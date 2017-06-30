var j = new Jinaga();
(function () {
    var distributor = new JinagaDistributor(distributorUrl || "ws://localhost:8080/");
    j.sync(distributor);
})();
var jko = new JinagaKnockout(j, ko);

function createUserName(user, value, prior) {
    return j.fact({
        type: "ImprovingU.UserName",
        prior: prior,
        from: user,
        value: value
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

function userForFact(r) {
    r.has("from");
    r.from.type = "Jinaga.User";
    return r.from;
}
