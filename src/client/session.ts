class CatalogDate {
    public static Type = "ImprovingU.Catalog.Date";
    public type: string;

    constructor (
        public catalog?: Catalog,
        public date?: string
    ) {
        this.type = CatalogDate.Type;
    }
}

class Session {
    public static Type = "ImprovingU.Session";
    public type: string;
    public createdAt?: Date;

    constructor (
        public from?: User,
        public course?: Course,
        public catalogDate?: CatalogDate,
        public time?: string,
        public place?: string
    ) {
        this.type = Session.Type;
        this.createdAt = new Date();
    }
}

class SessionDelete {
    public static Type = "ImprovingU.Session.Delete";
    public type: string;

    constructor (
        public from?: User,
        public session?: Session
    ) {
        this.type = SessionDelete.Type;
    }
}

function sessionsInCourse(c: Course) : Session {
    return j.where({
        type: Session.Type,
        course: c
    }, [sessionIsNotDeleted]);
}

function sessionIsNotDeleted(s: Session) : SessionDelete {
    return j.not({
        type: SessionDelete.Type,
        session: s
    });
}

function courseForSession(s: Session) : Course {
    (<any>s).has("course");
    return s.course;
}
