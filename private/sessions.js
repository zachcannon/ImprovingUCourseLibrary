function initializeSessions(viewModel, course, user) {
    viewModel.newSession = new NewSessionViewModel();
    viewModel.sessions = new jko.Collection(course, [sessionsInCourse], SessionViewModel);

    return viewModel.sessions.watch();

    function NewSessionViewModel() {
        this.date = ko.observable();
        this.time = ko.observable();
        this.place = ko.observable();

        this.add = function () {
            var date = this.date(),
                time = this.time(),
                place = this.place();

            if (date && time && place) {
                j.fact({
                    type: 'ImprovingU.Session',
                    from: user,
                    course: course,
                    catalogDate: {
                        type: 'ImprovingU.Catalog.Date',
                        catalog: course._in,
                        date: date
                    },
                    time: time,
                    place: place,
                    createdAt: new Date()
                });
                this.date(null);
                this.time(null);
                this.place(null);
            }
        };
    }

    function SessionViewModel(session) {
        this.date = session.catalogDate ? session.catalogDate.date : null;
        this.time = session.time;
        this.place = session.place;

        this.remove = function () {
            j.fact({
                type: 'ImprovingU.Session.Delete',
                from: user,
                session: session
            });
        };
    }

    function sessionsInCourse(c) {
        return j.where({
            type: 'ImprovingU.Session',
            course: c
        }, [sessionIsNotDeleted]);
    }

    function sessionIsNotDeleted(s) {
        return j.not({
            type: 'ImprovingU.Session.Delete',
            session: s
        });
    }
}

function byDate(a, b) {
    return a.date < b.date ? -1 :
           a.date > b.date ? 1 :
           0;
}