function Roster(j) {
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

    var watches = [];
    var courses = []
    
    this.start = function start() {
        this.stop();

        var coursesWatch = j.watch(semester, [coursesInSemester], addTo(courses, Course), removeFrom(courses));
        coursesWatch.watch([titlesForCourse], setChildValue('title'));
        var registrationsWatch = coursesWatch.watch([registrationsForCourse], addToChild('registrations', Registration), removeFromChild('registrations'));
        registrationsWatch.watch([userForRegistration, namesForUser], setChildValue('name'));
        registrationsWatch.watch([notesForRegistration], setChildValue('note'));
        watches.push(coursesWatch);
    }

    this.stop = function stop() {
        watches.forEach(function (w) { w.stop(); });
        watches = [];
        courses = [];
    }

    this.get = function get(office) {
        return courses.reduce(
            function(text, course) {
                return course.registrations.reduce(
                    function (text, registration) {
                        return text + '\n' +
                            JSON.stringify(course.title) + ',' +
                            JSON.stringify(registration.name) + ',' +
                            JSON.stringify(registration.note);
                    },
                    text);
            },
            'Course,Student,Note');
    };

    function coursesInSemester(s) {
        return j.where({
            type: "ImprovingU.Course",
            _in: {
                type: "ImprovingU.Catalog",
                _in: s
            }
        }, [j.not(courseIsDeleted)]);
    }

    function courseIsDeleted(c) {
        return {
            type: "ImprovingU.Course.Delete",
            course: c
        };
    }

    function titlesForCourse(c) {
        return j.where({
            type: "ImprovingU.Course.Title",
            course: c
        }, [courseTitleIsCurrent]);
    }

    function courseTitleIsCurrent(n) {
        return j.not({
            type: "ImprovingU.Course.Title",
            prior: n
        });
    }

    function registrationsForCourse(c) {
        return j.where({
            type: 'ImprovingU.Course.Registration',
            course: c
        }, [j.not(registrationIsDeleted)]);
    }

    function registrationIsDeleted(r) {
        return {
            type: 'ImprovingU.Course.Registration.Deletion',
            courseRegistration: r
        }
    }

    function notesForRegistration(r) {
        return j.where({
            type: 'ImprovingU.Course.Registration.Note',
            registration: r
        }, [noteIsCurrent]);
    }

    function noteIsCurrent(n) {
        return j.not({
            type: "ImprovingU.Course.Registration.Note",
            prior: n
        });
    }

    function userForRegistration(r) {
        r.has("from");
        r.from.type = "Jinaga.User";
        return r.from;
    }

    function namesForUser(u) {
        return j.where({
            type: "ImprovingU.UserName",
            from: u
        }, [nameIsCurrent]);
    }

    function nameIsCurrent(n) {
        return j.not({
            type: "ImprovingU.UserName",
            prior: n
        });
    }

    function Course(fact) {
        this.office = fact._in.office;
        this.registrations = [];
    }

    function Registration(fact) {
        this.name = '';
        this.note = '';
    }

    function addTo(collection, constructor) {
        return function (fact) {
            var object = new constructor(fact);
            collection.push(object);
            return object;
        };
    }

    function removeFrom(collection) {
        return function (object) {
            var index = collection.indexOf(object);
            if (index >= 0) {
                collection.splice(index, 1);
            }
        };
    }

    function setChildValue(property) {
        return function (obj, fact) {
            obj[property] = fact.value;
        };
    }

    function addToChild(property, constructor) {
        return function (parent, fact) {
            var object = new constructor(fact);
            parent[property].push(object);
            return object;
        }
    }

    function removeFromChild(property) {
        return function (parent, object) {
            var index = parent[property].indexOf(object);
            if (index >= 0) {
                parent[property].splice(index, 1);
            }
        }
    }
}

module.exports = Roster;