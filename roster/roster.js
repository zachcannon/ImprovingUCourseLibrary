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

        var coursesWatch = j.watch(semester, [coursesInSemester], addCourse, removeCourse);
        watches.push(coursesWatch);
    }

    this.stop = function stop() {
        watches.forEach(function (w) { w.stop(); });
        watches = [];
        courses = [];
    }

    this.get = function get(office) {
        return JSON.stringify(courses);
    }

    function addCourse(course) {
        courses.push(course);
        return course;
    }

    function removeCourse(course) {
        var index = courses.indexOf(course);
        if (index >= 0) {
            courses.splice(index, 1);
        }
    }

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

    function registrationsInCourse(c) {
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
}

module.exports = Roster;