function CalendarViewModel() {
    UserViewModel.call(this, null);

    var calendarInitBlock = {
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        events: [],
        editable: false
    };
    
    $('#calgary-calendar').fullCalendar(calendarInitBlock);
    $('#college-station-calendar').fullCalendar(calendarInitBlock);
    $('#columbus-calendar').fullCalendar(calendarInitBlock);
    $('#dallas-calendar').fullCalendar(calendarInitBlock);
    $('#houston-calendar').fullCalendar(calendarInitBlock);
    $('#minneapolis-calendar').fullCalendar(calendarInitBlock);

    // Popluate Calendars with Jinaga

    var owner = {
        type: "Jinaga.User",
        publicKey: "-----BEGIN RSA PUBLIC KEY-----\nMIGJAoGBAIBsKomutukULWw2zoTW2ECMrM8VmD2xvfpl3R4qh1whzuXV+A4EfRKMb/UAjEfw\n5nBmWvcObGyYUgygKrlNeOhf3MnDj706rej6ln9cKGL++ZNsJgJsogaAtmkPihWVGi908fdP\nLQrWTF5be0b/ZP258Zs3CTpcRTpTvhzS5TC1AgMBAAE=\n-----END RSA PUBLIC KEY-----\n"
    };
    var company = {
        type: "ImprovingU.Company",
        name: "Improving",
        from: owner
    };
    var semester = {
        type: "ImprovingU.Semester",
        name: "Spring 2017",
        _in: company,
        from: owner
    };

    var eventIdCounter = 0;
    
    initializeCatalog(this);
    initializeSemester(this);

    function initializeCatalog(viewModel) {
        viewModel.catalog = ko.computed(function () {
            return getCatalog(viewModel.office());
        });

        function getCatalog(office) {
            var catalog = {
                type: "ImprovingU.Catalog",
                office: office,
                _in: semester,
                from: owner
            };
            return catalog;
        }
    }

    function initializeSemester(viewModel) {
        var coursesWatch = j.watch(semester, [coursesInSemester, sessionsInCourse], addSession, removeSession);
        coursesWatch.watch([courseForSession, titlesForCourse], setTitle);
    }

    // Jinaga Callbacks

    function addSession(session) {
        var eventId = eventIdCounter;
        eventIdCounter += 1;

        var dateObject = $.fullCalendar.moment(session.catalogDate.date);

        var office = session.catalogDate.catalog.office;
        office = office.toLowerCase();
        office = office.replace(" ", "-");
        var officeCalendar = "#" + office + "-calendar";

        var event = {
            id: eventId,
            title: "title-placeholder",
            start: dateObject,
            officeCalendar: officeCalendar
        };

        $(event.officeCalendar).fullCalendar('renderEvent', event, true);

        return event;
    }

    function removeSession(event) {
        $(event.officeCalendar).fullCalendar('removeEvents', event.id);
    }

    function setTitle(event, title) {
        $(event.officeCalendar).fullCalendar('removeEvents', event.id);
        event.title = title.value;
        $(event.officeCalendar).fullCalendar('renderEvent', event, true);
    }

    // Jinaga Facts

    function courseForSession(session) {
        session.has("course");
        return session.course;
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
