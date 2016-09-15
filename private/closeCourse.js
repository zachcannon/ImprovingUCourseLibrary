function createCourseClose(user, course) {
    return {
        type: 'ImprovingU.Course.Close',
        from: user,
        course: course,
        createdAt: new Date()
    };
}

function createCourseReopen(user, close) {
    return {
        type: 'ImprovingU.Course.Close.Reopen',
        from: user,
        close: close
    };
}

function courseIsClosed(c) {
    return j.where({
        type: 'ImprovingU.Course.Close',
        course: c
    }, [closeIsNotReopened]);
}

function closeIsNotReopened(c) {
    return j.not({
        type: 'ImprovingU.Course.Close.Reopen',
        close: c
    });
}