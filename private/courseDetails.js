function CourseDetailsViewModel(course, title, user, office, myRegistration, canWrite, registration) {
    this.title = title;

    this.abstractFact = ko.observable();
    this.abstract = ko.computed(function () {
        var a = this.abstractFact();
        var value = a ? a.value : '';
        return this.abstractFact() ? converter.makeHtml(value) : '';
    }, this);

    this.closed = ko.observableArray();
    this.isClosed = ko.computed(function () {
        return this.closed().length > 0;
    }, this);

    this.isRegistered = function () {
        var registration = myRegistration();
        return registration !== null;
    };

    this.register = function () {
        if (user() && (canWrite() || !this.isClosed())) {
            registration(new CourseRegistrationViewModel(createCourseRegistration(user(), course, office())));
            $('#course-registration-dialog').modal();
        }
    };
    this.viewRegistration = function () {
        if (user()) {
            registration(new CourseRegistrationViewModel(myRegistration()));
            $('#course-registered-dialog').modal();
        }
    };

    initializeWatches(this);

    function initializeWatches(viewModel) {
        var watches = [
            j.watch(course, [abstractsForCourse], setValue(viewModel.abstractFact)),
            j.watch(course, [courseIsClosed], addTo(viewModel.closed), removeFrom(viewModel.closed))
        ];
        viewModel.dispose = dispose(watches);
    }
}