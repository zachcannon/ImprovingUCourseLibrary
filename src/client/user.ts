class User {
    public type: string;
    public publicKey: string;
}

class UserName {
    public type: string;
    public prior?: Array<UserName>;
    public from?: User;
    public value?: string;
}

function createUserName(user: User, value: string, prior: [UserName]) : UserName {
    return {
        type: "ImprovingU.UserName",
        prior: prior,
        from: user,
        value: value
    };
}

function nameIsCurrent(n: UserName) : UserName {
    return j.not({
        type: "ImprovingU.UserName",
        prior: [n]
    });
}

function namesForUser(u: User) : UserName {
    return j.where({
        type: "ImprovingU.UserName",
        from: u
    }, [nameIsCurrent]);
}
