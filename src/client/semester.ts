class Company {
    public static Type = "ImprovingU.Company";
    public type: string;
    
    constructor (
        public name: string,
        public from: User
    ) {
        this.type = Company.Type;
    }
}

class Semester {
    public static Type = "ImprovingU.Semester";
    public type: string;

    constructor (
        public name: string,
        public _in: Company,
        public from: User
    ) {
        this.type = Semester.Type;
    }
}


const semesterName = "Fall 2017";
const owner = new User("-----BEGIN RSA PUBLIC KEY-----\nMIGJAoGBAIBsKomutukULWw2zoTW2ECMrM8VmD2xvfpl3R4qh1whzuXV+A4EfRKMb/UAjEfw\n5nBmWvcObGyYUgygKrlNeOhf3MnDj706rej6ln9cKGL++ZNsJgJsogaAtmkPihWVGi908fdP\nLQrWTF5be0b/ZP258Zs3CTpcRTpTvhzS5TC1AgMBAAE=\n-----END RSA PUBLIC KEY-----\n");
const company = new Company("Improving", owner);
const semester = new Semester(semesterName, company, owner);
