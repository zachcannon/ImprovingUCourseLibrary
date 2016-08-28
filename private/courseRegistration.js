function CourseRegistrationViewModel(registration) {
    this.titleFact = ko.observableArray();
    this.title = ko.computed(function () {
        return this.titleFact() ? this.titleFact().value : '';
    }, this);
    this.noteFacts = ko.observableArray();
    this.noteValue = ko.observable();
    this.noteChanged = ko.observable(false);
    this.notes = ko.computed({
        read: function () {
            if (this.noteChanged()) {
                return this.noteValue();
            }
            else {
                return this.noteFacts().reduce(function (sum, candidate) {
                    if (sum) {
                        return sum + '\n' + candidate.value;
                    }
                    else {
                        return candidate.value;
                    }
                }, '');
            }
        },
        write: function (value) {
            this.noteValue(value);
            this.noteChanged(true);
        },
        owner: this
    });
    this.registrations = ko.observableArray();

    this.agree = function () {
        j.fact(registration);
        if (this.noteChanged() && this.noteFacts.length !== 1 || this.noteFacts()[0].value !== this.noteValue()) {
            j.fact(createCourseRegistrationNote(registration.user, registration, this.noteValue(), this.noteFacts()));
        }
        $('#course-registration-dialog').modal('toggle');
    }
    this.save = function () {
        if (this.noteChanged() && this.noteFacts.length !== 1 || this.noteFacts()[0].value !== this.noteValue()) {
            j.fact(createCourseRegistrationNote(registration.user, registration, this.noteValue(), this.noteFacts()));
        }
        $('#course-registered-dialog').modal('toggle');
    }
    this.cancel = function () {
        if (window.confirm('Do you want to cancel your registration?')) {
            j.fact(createCourseRegistrationDeletion(registration.user,
                registration));
            $('#course-registered-dialog').modal('toggle');
        }
    }

    initializeWatches(this);

    function initializeWatches(viewModel) {
        var registrationsWatch = j.watch(registration.course, [registrationsForCourse],
            addTo(viewModel.registrations, function (r) {
                return new RegistrationViewModel(r); 
            }),
            removeFrom(viewModel.registrations));
        registrationsWatch.watch([userForFact, namesForUser],
            setChildValue('nameFact'));
        registrationsWatch.watch([notesForRegistration], addToChild('noteFacts'), removeFromChild('noteFacts'));

        var watches = [
            j.watch(registration, [notesForRegistration], addTo(viewModel.noteFacts), removeFrom(viewModel.noteFacts)),
            j.watch(registration.course, [titlesForCourse], setValue(viewModel.titleFact)),
            registrationsWatch
        ];
        viewModel.dispose = dispose(watches);
    }

    function RegistrationViewModel(registration) {
        this.registration = registration;
        this.nameFact = ko.observable();
        this.name = ko.computed(function () {
            return this.nameFact() ? this.nameFact().value : '';
        }, this);
        this.noteFacts = ko.observableArray();
        this.notes = ko.computed(function () {
            return [].concat.apply([], this.noteFacts().map(function (note) {
                return note.value ? note.value.split('\n') : [];
            }));
        }, this);
    }

    function myRegistrations(allRegistrations) {
        return allRegistrations.filter(function (r) {
            return r.from.publicKey === registration.user.publicKey;
        });
    }
}