type UserInfo = {
    userId: number,
    name: string,
    email: string,
    password: string,
    birthdate: Date,
    gender: Gender,
    place: string,
};

enum Gender {
    Male, 
    Female,
    Other
};