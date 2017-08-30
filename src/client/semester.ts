class Company {
    public type: string;
    public name: string;
    public from: User;
}

class Semester {
    public type: string;
    public name: string;
    public _in: Company;
    public from: User;
}


const semesterName = "Fall 2017";
const owner : User = {
    type: "Jinaga.User",
    publicKey: "-----BEGIN RSA PUBLIC KEY-----\nMIGJAoGBAIBsKomutukULWw2zoTW2ECMrM8VmD2xvfpl3R4qh1whzuXV+A4EfRKMb/UAjEfw\n5nBmWvcObGyYUgygKrlNeOhf3MnDj706rej6ln9cKGL++ZNsJgJsogaAtmkPihWVGi908fdP\nLQrWTF5be0b/ZP258Zs3CTpcRTpTvhzS5TC1AgMBAAE=\n-----END RSA PUBLIC KEY-----\n"
};
const company : Company = {
    type: "ImprovingU.Company",
    name: "Improving",
    from: owner
};
const semester : Semester = {
    type: "ImprovingU.Semester",
    name: semesterName,
    _in: company,
    from: owner
};
