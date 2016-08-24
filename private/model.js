var j = new Jinaga();
j.sync(new JinagaDistributor(distributorUrl || "ws://localhost:8080/"));

function createUserName(user, value, prior) {
    return j.fact({
        type: "ImprovingU.UserName",
        prior: prior,
        from: user,
        value: value
    });
}

function createIdea(semester, user, title) {
    return j.fact({
        type: "ImprovingU.Idea",
        semester: semester,
        from: user,
        createdAt: new Date(),
        title: title
    });
}

function createIdeaTitle(idea, value, prior) {
    return j.fact({
        type: "ImprovingU.Idea.Title",
        idea: idea,
        value: value,
        prior: prior
    });
}

function createIdeaDeletion(idea) {
    return j.fact({
        type: "ImprovingU.Idea.Deletion",
        idea: idea
    });
}

function createRemoteIdea(idea, onlineSemester) {
    return j.fact({
        type: "ImprovingU.RemoteIdea",
        idea: idea,
        onlineSemester: onlineSemester,
        created: new Date()
    });
}

function createRemoteIdeaDeletion(remoteIdeas) {
    return j.fact({
        type: "ImprovingU.RemoteIdea.Deletion",
        remoteIdeas: remoteIdeas
    });
}

function createIdeaConsumer(idea, user) {
    return {
        type: "ImprovingU.IdeaConsumer",
        idea: idea,
        consumer: user
    };
}

function createRemoteIdeaOffice(remoteIdea, semester) {
    return {
        type: "ImprovingU.RemoteIdeaOffice",
        remoteIdea: remoteIdea,
        semester: semester
    };
}

function createRemoteIdeaOfficeConsumer(remoteIdeaOffice, user) {
    return {
        type: "ImprovingU.RemoteIdeaOfficeConsumer",
        remoteIdeaOffice: remoteIdeaOffice,
        user: user
    };
}

function createAbstract(idea, user, value, prior) {
    return j.fact({
        type: "ImprovingU.Abstract",
        idea: idea,
        prior: prior,
        from: user,
        value: value
    });
}

function createVote(type, user, ideaConsumer) {
    return j.fact({
        type: type,
        from: user,
        createdAt: new Date(),
        ideaConsumer: ideaConsumer
    });
}

function createRescindVote(user, vote) {
    return j.fact({
        type: "ImprovingU.RescindVote",
        from: user,
        vote: vote
    });
}

function createCourse(user, catalog) {
    return {
        type: "ImprovingU.Course",
        from: user,
        in: catalog,
        createdAt: new Date()
    };
}

function createCourseDelete(user, course) {
    return {
        type: "ImprovingU.Course.Delete",
        from: user,
        course: course,
        in: course.in
    };
}

function createCourseTitle(user, course, value, prior) {
    return {
        type: "ImprovingU.Course.Title",
        from: user,
        course: course,
        value: value,
        prior: prior,
        in: course.in
    };
}

function createCourseInstructor(user, course, value, prior) {
    return {
        type: "ImprovingU.Course.Instructor",
        from: user,
        course: course,
        value: value,
        prior: prior,
        in: course.in
    };
}

function createCourseAbstract(user, course, value, prior) {
    return {
        type: "ImprovingU.Course.Abstract",
        from: user,
        course: course,
        value: value,
        prior: prior,
        in: course.in
    };
}

////////////////////////
// Template functions

function nameIsCurrent(n) {
    return j.not({
        type: "ImprovingU.UserName",
        prior: n
    });
}

function namesForUser(u) {
    return j.where({
        type: "ImprovingU.UserName",
        from: u
    }, [nameIsCurrent]);
}

function ideasForSemester(s) {
    return j.where({
        type: "ImprovingU.Idea",
        semester: s
    }, [j.not(ideaIsDeleted)]);
}

function ideaTitleIsCurrent(n) {
    return j.not({
        type: "ImprovingU.Idea.Title",
        prior: n
    });
}

function titlesForIdea(i) {
    return j.where({
        type: "ImprovingU.Idea.Title",
        idea: i
    }, [ideaTitleIsCurrent]);
}

function ideaIsDeleted(i) {
    return {
        type: "ImprovingU.Idea.Deletion",
        idea: i
    };
}

function remoteIdeasForIdea(i) {
    return j.where({
        type: "ImprovingU.RemoteIdea",
        idea: i
    }, [j.not(remoteIdeaIsDeleted)]);
}

function remoteIdeasForOnlineSemester(s) {
    return j.where({
        type: "ImprovingU.RemoteIdea",
        onlineSemester: s
    }, [j.not(remoteIdeaIsDeleted)]);
}

function remoteIdeaIsDeleted(r) {
    return {
        type: "ImprovingU.RemoteIdea.Deletion",
        remoteIdeas: r
    }
}

function voteIsNotRescinded(v) {
    return j.not({
        type: "ImprovingU.RescindVote",
        vote: v
    });
}

function votesForIdea(type) {
    return function(i) {
        return j.where({
            type: type,
            ideaConsumer: {
                type: "ImprovingU.IdeaConsumer",
                idea: i
            }
        }, [voteIsNotRescinded]);
    };
}

function votesForRemoteIdea(type) {
    return function (r) {
        return j.where({
            type: type,
            ideaConsumer: {
                type: "ImprovingU.RemoteIdeaOfficeConsumer",
                remoteIdeaOffice: {
                    type: "ImprovingU.RemoteIdeaOffice",
                    remoteIdea: r
                }
            }
        }, [voteIsNotRescinded]);
    }
}

function votesForRemoteIdeaOffice(type) {
    return function (r) {
        return j.where({
            type: type,
            ideaConsumer: {
                type: "ImprovingU.RemoteIdeaOfficeConsumer",
                remoteIdeaOffice: r
            }
        }, [voteIsNotRescinded]);
    }
}

function votesForIdeaConsumer(type) {
    return function(ic) {
        return j.where({
            type: type,
            ideaConsumer: ic
        }, [voteIsNotRescinded]);
    };
}

function abstractsInIdea(i) {
    return j.where({
        type: "ImprovingU.Abstract",
        idea: i
    }, [abstractIsCurrent]);
}

function abstractIsCurrent(a) {
    return j.not({
        type: "ImprovingU.Abstract",
        prior: a
    });
}

function userForVote(v) {
    v.has("from");
    v.from.type = "Jinaga.User";
    return v.from;
}

function userForIdea(i) {
    i.has("from");
    i.from.type = "Jinaga.User";
    return i.from;
}

function ideaForRemoteIdea(r) {
    r.has("idea");
    r.idea.type = "ImprovingU.Idea";
    return r.idea;
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
        in: {
            type: "ImprovingU.Catalog",
            in: s
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