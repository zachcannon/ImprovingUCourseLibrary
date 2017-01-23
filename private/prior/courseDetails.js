function CourseDetailsViewModel(course, title, user, office, myRegistration, canWrite, registration) {
    this.title = title;
    this.registrations = ko.observableArray();

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

    initializeWatches(this);

    function initializeWatches(viewModel) {
        var watches = [
            j.watch(course, [abstractsForCourse], setValue(viewModel.abstractFact)),
            initializeRegistrations(viewModel),
            initializeSessions(viewModel, course, user)
        ];
        viewModel.dispose = dispose(watches);
    }

    function initializeRegistrations(viewModel) {
        var registrationsWatch = j.watch(course, [registrationsForCourse],
            addTo(viewModel.registrations, function (r) {
                return new RegistrationViewModel(r); 
            }),
            removeFrom(viewModel.registrations));
        registrationsWatch.watch([userForFact, namesForUser],
            setChildValue('nameFact'));
        registrationsWatch.watch([notesForRegistration], addToChild('noteFacts'), removeFromChild('noteFacts'));

        return registrationsWatch;
    }

    function RegistrationViewModel(registration) {
        this.registration = registration;
        this.nameFact = ko.observable();
        this.name = ko.computed(function () {
            return this.nameFact() ? this.nameFact().value : '';
        }, this);
        this.office = registration.office;
        this.noteFacts = ko.observableArray();
        this.notes = ko.computed(function () {
            return [].concat.apply([], this.noteFacts().map(function (note) {
                return note.value ? note.value.split('\n') : [];
            }));
        }, this);
    }
}

function byRegistrationCreatedAt(a, b) {
    if (a.registration.createdAt < b.registration.createdAt)
        return -1;
    if (a.registration.createdAt > b.registration.createdAt)
        return 1;
    return 0;
}
