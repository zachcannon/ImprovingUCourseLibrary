class User {
    public type: string;
    public publicKey: string;
}

class Company {
    public type: string;
    public name: string;
    public from: User;
}

class Semester {
    public type: string;
    public name: string;
    public _in: Company;
    public from: User;
}

class Catalog {
    public type: string;
    public office?: string;
    public _in: Semester;
    public from?: User;
}

class Course {
    public type: string;
    public from?: User;
    public _in: Catalog;
    public createdAt?: Date;
}

class CourseDelete {
    public type: string;
    public from?: User;
    public course: Course;
    public _in?: Catalog;
}

class CourseTitle {
    public type: string;
    public from?: User;
    public course?: Course;
    public value?: string;
    public prior?: CourseTitle[];
    public _in?: Catalog;
}

const semesterName = "Fall 2017";
const owner : User = {
    type: "Jinaga.User",
    publicKey: "-----BEGIN RSA PUBLIC KEY-----\nMIGJAoGBAIBsKomutukULWw2zoTW2ECMrM8VmD2xvfpl3R4qh1whzuXV+A4EfRKMb/UAjEfw\n5nBmWvcObGyYUgygKrlNeOhf3MnDj706rej6ln9cKGL++ZNsJgJsogaAtmkPihWVGi908fdP\nLQrWTF5be0b/ZP258Zs3CTpcRTpTvhzS5TC1AgMBAAE=\n-----END RSA PUBLIC KEY-----\n"
};
const company : Company = {
    type: "ImprovingU.Company",
    name: "Improving",
    from: owner
};
const semester : Semester = {
    type: "ImprovingU.Semester",
    name: semesterName,
    _in: company,
    from: owner
};


// Factory functions
function getCatalog(office: string) : Catalog {
    return {
        type: "ImprovingU.Catalog",
        office: office,
        _in: semester,
        from: owner
    };
}

function createCourse(user: User, catalog: Catalog) : Course {
    return {
        type: "ImprovingU.Course",
        from: user,
        _in: catalog,
        createdAt: new Date()
    };
}

function createCourseDelete(user: User, course: Course) : CourseDelete {
    return {
        type: "ImprovingU.Course.Delete",
        from: user,
        course: course,
        _in: course._in
    };
}

function createCourseTitle(user: User, course: Course, value: string, prior: CourseTitle[]) : CourseTitle {
    return {
        type: "ImprovingU.Course.Title",
        from: user,
        course: course,
        value: value,
        prior: prior,
        _in: course._in
    };
}

// Template functions
function courseIsDeleted(c: Course) : CourseDelete {
    return {
        type: "ImprovingU.Course.Delete",
        course: c
    };
}

function coursesInSemester(s: Semester) : Course {
    return j.where({
        type: "ImprovingU.Course",
        _in: {
            type: "ImprovingU.Catalog",
            _in: s
        }
    }, [j.not(courseIsDeleted)]);
}

function courseTitleIsCurrent(n: CourseTitle) : CourseTitle {
    return j.not({
        type: "ImprovingU.Course.Title",
        prior: [n] // Need to change Jinaga to make this valid.
    });
}

function titlesForCourse(c: Course) : CourseTitle {
    return j.where({
        type: "ImprovingU.Course.Title",
        course: c
    }, [courseTitleIsCurrent]);
}