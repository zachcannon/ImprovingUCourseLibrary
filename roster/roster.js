function get(j, office, res) {
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
    var catalog = {
        type: "ImprovingU.Catalog",
        office: office,
        _in: semester,
        from: owner
    };

    j.query(catalog, [coursesInCatalog, registrationsInCourse], function (registrations) {
        //j.query(catalog, [coursesInCatalog, titlesForCourse], function (titles) {
            //j.query(catalog, [coursesInCatalog, registrationsInCourse, notesForRegistration], function (notes) {
                //j.query(catalog, [coursesInCatalog, registrationsInCourse, userForRegistration, namesForUser], function (names) {
                    res.send(JSON.stringify({
                        r: registrations,
                        //t: titles,
                        //n: notes,
                        //a: names
                    }));
                    res.end();
                //});
            //});
        //});
    });

    function coursesInCatalog(c) {
        return j.where({
            type: "ImprovingU.Course",
            _in: c
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

exports.get = get;