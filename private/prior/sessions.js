function initializeSessions(viewModel, course, user) {
    viewModel.sessions = new jko.Collection(course, [sessionsInCourse], SessionViewModel);

    return viewModel.sessions.watch();

    function SessionViewModel(session) {
        this.date = session.catalogDate ? session.catalogDate.date : null;
        this.time = session.time;
        this.place = session.place;
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