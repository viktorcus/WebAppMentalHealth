type UserInfo = {
    userId: number,
    name: string,
    email: string,
    password: string,
    birthdate: Date,
    gender: Gender,
    place: string,
};

type UserIdParam = {
    userId: number,
};

export declare enum Gender {
    Male, 
    Female,
    Other
}