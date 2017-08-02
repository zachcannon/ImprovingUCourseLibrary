import { Express } from "express";
import Jinaga = require("jinaga/jinaga");

class Course {
    constructor(private fact: any) {}

    office = this.fact._in.office;
    registrations: Array<any> = [];
}

class Registration {
    constructor(private fact: any) {}

    name = '';
    note = '';
}

class Roster {
    constructor(private j: Jinaga) {}

    private owner = {
        type: "Jinaga.User",
        publicKey: "-----BEGIN RSA PUBLIC KEY-----\nMIGJAoGBAIBsKomutukULWw2zoTW2ECMrM8VmD2xvfpl3R4qh1whzuXV+A4EfRKMb/UAjEfw\n5nBmWvcObGyYUgygKrlNeOhf3MnDj706rej6ln9cKGL++ZNsJgJsogaAtmkPihWVGi908fdP\nLQrWTF5be0b/ZP258Zs3CTpcRTpTvhzS5TC1AgMBAAE=\n-----END RSA PUBLIC KEY-----\n"
    };
    private company = {
        type: "ImprovingU.Company",
        name: "Improving",
        from: this.owner
    };
    private semester = {
        type: "ImprovingU.Semester",
        name: "Summer 2017",
        _in: this.company,
        from: this.owner
    };

    private watches: Array<any> = [];
    private courses: Array<any> = []
    
    start() {
        const j = this.j;

        this.stop();

        var coursesWatch = this.j.watch(this.semester, [coursesInSemester], addTo(this.courses, Course), removeFrom(this.courses));
        coursesWatch.watch([titlesForCourse], setChildValue('title'));
        var registrationsWatch = coursesWatch.watch([registrationsForCourse], addToChild('registrations', Registration), removeFromChild('registrations'));
        registrationsWatch.watch([userForRegistration, namesForUser], setChildValue('name'));
        registrationsWatch.watch([notesForRegistration], setChildValue('note'));
        this.watches.push(coursesWatch);

        function coursesInSemester(s: any) {
            return j.where({
                type: "ImprovingU.Course",
                _in: {
                    type: "ImprovingU.Catalog",
                    _in: s
                }
            }, [j.not(courseIsDeleted)]);
        }

        function courseIsDeleted(c: any) {
            return {
                type: "ImprovingU.Course.Delete",
                course: c
            };
        }

        function titlesForCourse(c: any) {
            return j.where({
                type: "ImprovingU.Course.Title",
                course: c
            }, [courseTitleIsCurrent]);
        }

        function courseTitleIsCurrent(n: any) {
            return j.not({
                type: "ImprovingU.Course.Title",
                prior: n
            });
        }

        function registrationsForCourse(c: any) {
            return j.where({
                type: 'ImprovingU.Course.Registration',
                course: c
            }, [j.not(registrationIsDeleted)]);
        }

        function registrationIsDeleted(r: any) {
            return {
                type: 'ImprovingU.Course.Registration.Deletion',
                courseRegistration: r
            }
        }

        function notesForRegistration(r: any) {
            return j.where({
                type: 'ImprovingU.Course.Registration.Note',
                registration: r
            }, [noteIsCurrent]);
        }

        function noteIsCurrent(n: any) {
            return j.not({
                type: "ImprovingU.Course.Registration.Note",
                prior: n
            });
        }

        function userForRegistration(r: any) {
            r.has("from");
            r.from.type = "Jinaga.User";
            return r.from;
        }

        function namesForUser(u: any) {
            return j.where({
                type: "ImprovingU.UserName",
                from: u
            }, [nameIsCurrent]);
        }

        function nameIsCurrent(n: any) {
            return j.not({
                type: "ImprovingU.UserName",
                prior: n
            });
        }

        function addTo(collection: Array<any>, constructor: any): (fact: any) => any {
            return function (fact) {
                var object = new constructor(fact);
                collection.push(object);
                return object;
            };
        }

        function removeFrom(collection: Array<any>): (object: any) => void {
            return function (object) {
                var index = collection.indexOf(object);
                if (index >= 0) {
                    collection.splice(index, 1);
                }
            };
        }

        function setChildValue(property: string): (obj: any, fact: any) => void {
            return function (obj, fact) {
                obj[property] = fact.value;
            };
        }

        function addToChild(property: string, constructor: any): (parent: any, fact: any) => any {
            return function (parent, fact) {
                var object = new constructor(fact);
                parent[property].push(object);
                return object;
            }
        }

        function removeFromChild(property: string): (parent: any, object: any) => void {
            return function (parent, object) {
                var index = parent[property].indexOf(object);
                if (index >= 0) {
                    parent[property].splice(index, 1);
                }
            }
        }
    }

    stop() {
        this.watches.forEach((w) => { w.stop(); });
        this.watches = [];
        this.courses = [];
    }

    get(office: any) {
        return this.courses.filter(coursesFor(office)).reduce(
            (text, course) => {
                return course.registrations.reduce(
                    (text: string, registration: any) => {
                        return text + '\n' +
                            JSON.stringify(course.title) + ',' +
                            JSON.stringify(registration.name) + ',' +
                            JSON.stringify(registration.note);
                    },
                    text);
            },
            'Course,Student,Note');

        function coursesFor(office: any): (object: any) => boolean {
            return (object) => {
                return object.office === office;
            };
        }
    };
}

export function configureRoster(app: Express, j: Jinaga) {
    const roster = new Roster(j);
    roster.start();

    app.get("/roster/:office.csv", (req, res, next) => {
        const office = req.params.office;
        res.setHeader('content-type', 'text/csv');
        res.send(roster.get(office));
        res.end();
    });
}
