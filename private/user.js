function UserViewModel() {
    OfficeViewModel.call(this, null);

    this.error = ko.observable();
    this.queueCount = ko.observable();
    this.showError = function () {
        if (this.error()) {
            $("#error-dialog").modal();
        }
    };

    this.user = ko.observable();
    this.displayName = ko.observable();

    this.status = ko.computed(function () {
        return this.error()
            ? "Error"
            : this.queueCount() > 0
            ? "Saving..."
            : "";
    }, this);

    initializeJinaga(this);

    function initializeJinaga(viewModel) {
        j.onError(function (message) { viewModel.error(message); });
        j.onProgress(function (queueCount) { viewModel.queueCount(queueCount); });

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
    }
}
