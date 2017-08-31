class CourseRegistration {
    public static Type = "ImprovingU.Course.Registration";
    public type: string;
    public createdAt?: Date;
    
    constructor (
        public from?: User,
        public course?: Course,
        public office?: string
    ) {
        this.type = CourseRegistration.Type;
        this.createdAt = new Date();
    }
}

function registrationsForCourse(c: Course) : CourseRegistration {
    return j.where({
        type: CourseRegistration.Type,
        course: c
    }, [j.not(registrationIsDeleted)]);
}

function namesForStudent(r: CourseRegistration) : UserName {
    (<any>r).has('from');
    return j.where({
        type: UserName.Type,
        from: r.from
    }, [nameIsCurrent]);
}

class CourseRegistrationNote {
    public static Type = "ImprovingU.Course.Registration.Note";
    public type: string;

    constructor (
        public from?: User,
        public registration?: CourseRegistration,
        public value?: string,
        public prior?: Array<CourseRegistrationNote>
    ) {
        this.type = CourseRegistrationNote.Type;
    }
}

function notesForRegistration(r: CourseRegistration) : CourseRegistrationNote {
    return j.where({
        type: CourseRegistrationNote.Type,
        registration: r
    }, [noteIsCurrent]);
}

function noteIsCurrent(n: CourseRegistrationNote) : CourseRegistrationNote {
    return j.not({
        type: CourseRegistrationNote.Type,
        prior: [n]
    });
}

class CourseRegistrationDeletion {
    public static Type = "ImprovingU.Course.Registration.Deletion";
    public type: string;

    constructor (
        public from?: User,
        public courseRegistration?: CourseRegistration
    ) {
        this.type = CourseRegistrationDeletion.Type;
    }
}

function registrationIsDeleted(r: CourseRegistration) : CourseRegistrationDeletion {
    return {
        type: CourseRegistrationDeletion.Type,
        courseRegistration: r
    }
}
