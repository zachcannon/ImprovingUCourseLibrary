function CourseViewModel(course, office, user, details, canWrite, registration) {
    this.titleFact = ko.observable();
    this.instructorFact = ko.observable();
    this.abstractFact = ko.observable();
    this.remoteFact = ko.observable();
    this.registrations = ko.observableArray();
    this.closed = ko.observableArray();

    this.title = ko.computed(function () {
        var t = this.titleFact();
        var value = t ? t.value : '';
        return value;
    }, this);
    this.instructor = ko.computed(function () {
        return this.instructorFact() ? this.instructorFact().value : "";
    }, this);
    this.abstract = ko.computed(function () {
        return this.abstractFact() ? converter.makeHtml(this.abstractFact().value) : "";
    }, this);
    this.isRemote = ko.computed(function () {
        var inThisOffice = course._in.office === office();
        return !inThisOffice && this.remoteFact();
    }, this);
    this.visible = ko.computed(function () {
        var inThisOffice = course._in.office === office();
        return inThisOffice || this.remoteFact();
    }, this);

    this.showDetails = function () {
        if (details()) {
            details().dispose();
            details(null);
        }
        var inThisOffice = course._in.office === office();
        if (inThisOffice && canWrite()) {
            details(new CourseDetailViewModel(course, user()));
            $("#course-detail-dialog").modal();
        }
    };
    this.isRegistered = ko.computed(function () {
        return myRegistration(this.registrations());
    }, this);
    this.register = function () {
        if (user() && (canWrite() || !this.isClosed())) {
            registration(new CourseRegistrationViewModel(createCourseRegistration(user(), course, office())));
            $('#course-registration-dialog').modal();
        }
    };
    this.viewRegistration = function () {
        if (user()) {
            registration(new CourseRegistrationViewModel(myRegistration(this.registrations())));
            $('#course-registered-dialog').modal();
        }
    };

    this.isClosed = ko.computed(function () {
        return this.closed().length > 0;
    }, this);

    function myRegistration(allRegistrations) {
        var mine = allRegistrations.filter(function (r) {
            return r.from && user() && (r.from.publicKey === user().publicKey);
        });
        return (mine.length > 0) ? mine[0] : null;
    }
}