function createAccessRequest(user, catalog) {
    return {
        type: 'ImprovingU.Catalog.AccessRequest',
        from: user,
        catalog: catalog,
        createdAt: new Date()
    };
}

function createAccessRequestDeclined(user, accessRequest) {
    return {
        type: 'ImprovingU.Catalog.AccessRequest.Response',
        from: user,
        accessRequest: accessRequest,
        authorization: []
    };
}

function createAccessRequestApproved(user, accessRequest) {
    return {
        type: 'ImprovingU.Catalog.AccessRequest.Response',
        from: user,
        accessRequest: accessRequest,
        authorization: [{
            type: 'ImprovingU.Catalog.Access',
            from: user,
            to: accessRequest.from,
            write: accessRequest.catalog,
            createdAt: new Date()
        }]
    };
}

function createCatalogAccess(user, coordinator, catalog) {
    return {
        type: 'ImprovingU.Catalog.Access',
        from: user,
        to: coordinator,
        write: catalog,
        createdAt: new Date()
    };
}

function createCourse(user, catalog) {
    return {
        type: "ImprovingU.Course",
        from: user,
        _in: catalog,
        createdAt: new Date()
    };
}

function createCourseDelete(user, course) {
    return {
        type: "ImprovingU.Course.Delete",
        from: user,
        course: course,
        _in: course._in
    };
}

function createCourseTitle(user, course, value, prior) {
    return {
        type: "ImprovingU.Course.Title",
        from: user,
        course: course,
        value: value,
        prior: prior,
        _in: course._in
    };
}

function createCourseInstructor(user, course, value, prior) {
    return {
        type: "ImprovingU.Course.Instructor",
        from: user,
        course: course,
        value: value,
        prior: prior,
        _in: course._in
    };
}

function createCourseAbstract(user, course, value, prior) {
    return {
        type: "ImprovingU.Course.Abstract",
        from: user,
        course: course,
        value: value,
        prior: prior,
        _in: course._in
    };
}

function createRemoteCourse(user, course) {
    return {
        type: "ImprovingU.Course.Remote",
        from: user,
        course: course,
        created: new Date(),
        _in: course._in
    };
}

function createRemoteCourseDeletion(user, remoteCourses, semster) {
    return {
        type: "ImprovingU.Course.Remote.Deletion",
        from: user,
        remoteCourses: remoteCourses,
        _in: semester
    };
}

function createCourseRegistration(user, course, office) {
    return {
        type: 'ImprovingU.Course.Registration',
        from: user,
        course: course,
        office: office,
        createdAt: new Date()
    }
}

function createCourseRegistrationNote(user, registration, note, prior) {
    return {
        type: 'ImprovingU.Course.Registration.Note',
        from: user,
        registration: registration,
        value: note,
        prior: prior
    }
}

function createCourseRegistrationDeletion(user, courseRegistration) {
    return {
        type: 'ImprovingU.Course.Registration.Deletion',
        from: user,
        courseRegistration: courseRegistration
    }
}

////////////////////////
// Template functions

function accessRequestHasResponse(a) {
    return {
        type: 'ImprovingU.Catalog.AccessRequest.Response',
        accessRequest: a
    }
}

function accessRequestsInSemester(s) {
    return j.where({
        type: 'ImprovingU.Catalog.AccessRequest',
        catalog: {
            type: "ImprovingU.Catalog",
            _in: s
        }
    }, [j.not(accessRequestHasResponse)]);
}

function accessInSemester(s) {
    return {
        type: 'ImprovingU.Catalog.Access',
        write: {
            type: "ImprovingU.Catalog",
            _in: s
        }
    };
}

function accessInCompany(c) {
    return {
        type: 'ImprovingU.Catalog.Access',
        write: {
            type: "ImprovingU.Catalog",
            _in: {
                type: "ImprovingU.Semester",
                _in: c
            }
        }
    };
}

function userForAccess(a) {
    a.has('to');
    return a.to;
}

function courseIsDeleted(c) {
    return {
        type: "ImprovingU.Course.Delete",
        course: c
    };
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

function courseTitleIsCurrent(n) {
    return j.not({
        type: "ImprovingU.Course.Title",
        prior: n
    });
}

function titlesForCourse(c) {
    return j.where({
        type: "ImprovingU.Course.Title",
        course: c
    }, [courseTitleIsCurrent]);
}

function courseInstructorIsCurrent(n) {
    return j.not({
        type: "ImprovingU.Course.Instructor",
        prior: n
    });
}

function instructorsForCourse(c) {
    return j.where({
        type: "ImprovingU.Course.Instructor",
        course: c
    }, [courseInstructorIsCurrent]);
}

function courseAbstractIsCurrent(n) {
    return j.not({
        type: "ImprovingU.Course.Abstract",
        prior: n
    });
}

function abstractsForCourse(c) {
    return j.where({
        type: "ImprovingU.Course.Abstract",
        course: c
    }, [courseAbstractIsCurrent]);
}

function remoteCoursesForCourse(c) {
    return j.where({
        type: "ImprovingU.Course.Remote",
        course: c
    }, [j.not(remoteCourseIsDeleted)]);
}

function remoteCourseIsDeleted(r) {
    return {
        type: "ImprovingU.Course.Remote.Deletion",
        remoteCourses: r
    };
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
