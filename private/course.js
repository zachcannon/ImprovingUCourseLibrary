function CourseViewModel(course, office, user, details, canWrite, registration) {
    this.titleFact = ko.observable();
    this.instructorFact = ko.observable();
    this.abstractFact = ko.observable();
    this.remoteFact = ko.observable();
    this.registrations = ko.observableArray();

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
        return myRegistrations(this.registrations());
    }, this);
    this.register = function () {
        registration(new CourseRegistrationViewModel(course, user()));
        $('#course-registration-dialog').modal();
    };
    this.viewRegistration = function () {
        registration(new CourseRegistrationViewModel(course, user()));
        $('#course-registered-dialog').modal();
    };

    function myRegistrations(allRegistrations) {
        return allRegistrations.find(function (r) {
            return r.from.publicKey === user().publicKey;
        });
    }
}