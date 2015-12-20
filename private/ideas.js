var j = new Jinaga();
j.sync(new JinagaDistributor("ws://localhost:3000/"));

j.login(function (u, profile) {
    if (!u) {
        window.location = "http://jinaga.cloudapp.net/login";
    }
    else {
        console.log("Logged in: " + profile.displayName);
    }
});
