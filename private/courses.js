function getOffice() {
    if (window.location.hash && window.location.hash.length > 1 && window.location.hash[0] === '#') {
        return window.location.hash.slice(1);
    }
    else {
        var value = Cookies.get('ImprovingU.Office');
        if (value) {
            return value;
        }
        else {
            return 'Dallas';
        }
    }
}

window.addEventListener('hashchange', hashChanged, false);
function hashChanged() {
    Cookies.set('ImprovingU.Office', window.location.hash.slice(1));
    viewModel.office(window.location.hash.slice(1));
};

function MainViewModel() {
    this.error = ko.observable();
    this.queueCount = ko.observable();
    this.showError = function () {
        if (this.error()) {
            $("#error-dialog").modal();
        }
    };

    this.user = ko.observable();
    this.displayName = ko.observable();
    this.offices = ['Dallas', 'Columbus', 'Houston', 'Minneapolis', 'College Station', 'Calgary'];
    this.office = ko.observable(getOffice());

    this.status = ko.computed(function () {
        return this.error()
            ? "Error"
            : this.queueCount() > 0
            ? "Saving..."
            : "";
    }, this);

}
var viewModel = new MainViewModel();
j.onError(function (message) { viewModel.error(message); });
j.onProgress(function (queueCount) { viewModel.queueCount(queueCount); });

ko.applyBindings(viewModel);


j.login(function (u, profile) {
    if (!u) {
        window.location = loginUrl || "http://localhost:8080/public/login.html";
    }
    else {
        viewModel.user(u);
        viewModel.displayName(profile.displayName);
        j.query(u, [namesForUser], function(names) {
            if (names.length != 1 || names[0].value !== profile.displayName) {
                createUserName(u, profile.displayName, names);
            }
        });
    }
});