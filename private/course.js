function CourseViewModel(course, office, user, courseEdit, courseDetails, canWrite, registration) {
    this.titleFact = ko.observable();
    this.instructorFact = ko.observable();
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
    this.isRemote = ko.computed(function () {
        var inThisOffice = course._in.office === office();
        return !inThisOffice && this.remoteFact();
    }, this);
    this.visible = ko.computed(function () {
        var inThisOffice = course._in.office === office();
        return inThisOffice || this.remoteFact();
    }, this);

    this.canEdit = ko.computed(function () {
        var inThisOffice = course._in.office === office();
        return inThisOffice && canWrite();
    }, this);
    this.edit = function () {
        if (courseEdit()) {
            courseEdit().dispose();
            courseEdit(null);
        }
        courseEdit(new CourseEditViewModel(course, user()));
        $("#course-edit-dialog").modal();
    };
    this.isRegistered = ko.computed(function () {
        return myRegistrationFrom(this.registrations());
    }, this);
    this.details = function () {
        courseDetails(new CourseDetailsViewModel(course, this.title, user, office, myRegistration(this), canWrite, registration));
        $('#course-details-dialog').modal();
    }

    function myRegistration(viewModel) {
        return function () {
            return myRegistrationFrom(viewModel.registrations());
        }
    }

    function myRegistrationFrom(allRegistrations) {
        var mine = allRegistrations.filter(function (r) {
            return r.from && user() && (r.from.publicKey === user().publicKey);
        });
        return (mine.length > 0) ? mine[0] : null;
    }
}