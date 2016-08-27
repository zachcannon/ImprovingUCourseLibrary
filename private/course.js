function CourseViewModel(course, office, user, details, canWrite, registration) {
    this.titleFact = ko.observable();
    this.instructorFact = ko.observable();
    this.abstractFact = ko.observable();
    this.remoteFact = ko.observable();

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
    this.register = function () {
        registration(new CourseRegistrationViewModel(course, user()));
        $('#course-registration-dialog').modal();
    }
}