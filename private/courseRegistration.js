function CourseRegistrationViewModel(course, user) {
    this.titleFact = ko.observableArray();
    this.title = ko.computed(function () {
        return this.titleFact() ? this.titleFact().value : '';
    }, this);
    this.notes = ko.observable();
    this.registrations = ko.observableArray();

    this.agree = function () {
        j.fact(createCourseRegistration(user, course, this.notes()));
        $('#course-registration-dialog').modal('toggle');
    }

    initializeWatches(this);

    function initializeWatches(viewModel) {
        var registrationsWatch = j.watch(course, [registrationsForCourse],
            addTo(viewModel.registrations, function (r) {
                return new RegistrationViewModel(r); 
            }),
            removeFrom(viewModel.registrations));
        registrationsWatch.watch([userForFact, namesForUser],
            setChildValue('nameFact'));

        var watches = [
            j.watch(course, [titlesForCourse], setValue(viewModel.titleFact)),
            registrationsWatch
        ];
        viewModel.dispose = dispose(watches);
    }

    function RegistrationViewModel(registration) {
        this.nameFact = ko.observable();
        this.name = ko.computed(function () {
            return this.nameFact() ? this.nameFact().value : '';
        }, this);
        this.notes = registration.notes ? registration.notes.split('\n') : [];
    }
}