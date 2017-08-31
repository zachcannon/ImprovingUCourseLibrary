class AttendanceSheetIdentifier {
    public static Type = "ImprovingU.AttendanceSheetIdentifier";
    public type: string;

    constructor (
        public identifier?: string
    ) {
        this.type = AttendanceSheetIdentifier.Type;
    }
}

class AttendanceSheet {
    public static Type = "ImprovingU.AttendanceSheet";
    public type: string;

    constructor (
        public from?: User,
        public identifier?: AttendanceSheetIdentifier,
        public session?: Session
    ) {
        this.type = AttendanceSheet.Type;
    }
}

function attendanceSheetsForIdentifier(id: AttendanceSheetIdentifier) : AttendanceSheet {
    return {
        type: AttendanceSheet.Type,
        identifier: id
    };
}

function registrationsForAttendanceSheet(s: AttendanceSheet) : CourseRegistration {
    (<any>s).has("session").has("course");
    return {
        type: CourseRegistration.Type,
        course: s.session.course
    }
}