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
        res.send(JSON.stringify(registrations));
        res.end();
    });
}

function coursesInCatalog(c) {
    return {
        type: "ImprovingU.Course",
        _in: c
    };
}

function registrationsInCourse(c) {
    return {
        type: 'ImprovingU.Course.Registration',
        course: c
    };
}

exports.get = get;