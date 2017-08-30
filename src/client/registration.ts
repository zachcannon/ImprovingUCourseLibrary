class CourseRegistration {
    public type: string;
    public from?: User;
    public course?: Course;
    public office?: string;
    public createdAt?: Date;
}

function createCourseRegistration(user: User, course: Course, office: string) : CourseRegistration {
    return {
        type: 'ImprovingU.Course.Registration',
        from: user,
        course: course,
        office: office,
        createdAt: new Date()
    };
}

function registrationsForCourse(c: Course) : CourseRegistration {
    return j.where({
        type: 'ImprovingU.Course.Registration',
        course: c
    }, [j.not(registrationIsDeleted)]);
}

function namesForStudent(r: CourseRegistration) : UserName {
    return j.where({
        type: 'ImprovingU.UserName',
        user: r.from
    }, [nameIsCurrent]);
}

class CourseRegistrationNote {
    public type: string;
    public from?: User;
    public registration?: CourseRegistration;
    public value?: string;
    public prior?: Array<CourseRegistrationNote>;
}

function createCourseRegistrationNote(user: User, registration: CourseRegistration, note: string, prior: Array<CourseRegistrationNote>): CourseRegistrationNote {
    return {
        type: 'ImprovingU.Course.Registration.Note',
        from: user,
        registration: registration,
        value: note,
        prior: prior
    }
}

function notesForRegistration(r: CourseRegistration) : CourseRegistrationNote {
    return j.where({
        type: 'ImprovingU.Course.Registration.Note',
        registration: r
    }, [noteIsCurrent]);
}

function noteIsCurrent(n: CourseRegistrationNote) : CourseRegistrationNote {
    return j.not({
        type: "ImprovingU.Course.Registration.Note",
        prior: [n]
    });
}

class CourseRegistrationDeletion {
    public type: string;
    public from?: User;
    public courseRegistration?: CourseRegistration;
}

function createCourseRegistrationDeletion(user: User, courseRegistration: CourseRegistration) : CourseRegistrationDeletion {
    return {
        type: 'ImprovingU.Course.Registration.Deletion',
        from: user,
        courseRegistration: courseRegistration
    }
}

function registrationIsDeleted(r: CourseRegistration) : CourseRegistrationDeletion {
    return {
        type: 'ImprovingU.Course.Registration.Deletion',
        courseRegistration: r
    }
}
