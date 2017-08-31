class User {
    public static Type = "Jinaga.User";
    public type: string;

    constructor(
        public publicKey: string
    ) {
        this.type = User.Type;
    }
}

class UserName {
    public static Type = "ImprovingU.UserName";
    public type: string;

    constructor (
        public prior?: Array<UserName>,
        public from?: User,
        public value?: string
    ) {
        this.type = UserName.Type;
    }
}

function nameIsCurrent(n: UserName) : UserName {
    return j.not({
        type: UserName.Type,
        prior: [n]
    });
}

function namesForUser(u: User) : UserName {
    return j.where({
        type: UserName.Type,
        from: u
    }, [nameIsCurrent]);
}
