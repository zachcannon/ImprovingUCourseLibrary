class CatalogDate {
    public type: string;
    public catalog?: Catalog;
    public date?: string;
}

class Session {
    public type: string;
    public from?: User;
    public course?: Course;
    public catalogDate?: CatalogDate;
    public time?: string;
    public place?: string;
    public createdAt?: Date;
}

class SessionDelete {
    public type: string;
    public from?: User;
    public session?: Session;
}

function CreateSession(from: User, course: Course, date: string, time: string, place: string) : Session {
    return {
        type: 'ImprovingU.Session',
        from: from,
        course: course,
        catalogDate: {
            type: 'ImprovingU.Catalog.Date',
            catalog: course._in,
            date: date
        },
        time: time,
        place: place,
        createdAt: new Date()
    };
}

function CreateSessionDelete(from: User, session: Session) : SessionDelete {
    return {
        type: 'ImprovingU.Session.Delete',
        from: from,
        session: session
    };
}

function sessionsInCourse(c: Course) : Session {
    return j.where({
        type: 'ImprovingU.Session',
        course: c
    }, [sessionIsNotDeleted]);
}

function sessionIsNotDeleted(s: Session) : SessionDelete {
    return j.not({
        type: 'ImprovingU.Session.Delete',
        session: s
    });
}
