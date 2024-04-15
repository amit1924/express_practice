export const ROLES = {
  USER: "user",
  ADMIN: "admin",
  MODERATOR: "moderator",
};

// user database configuration
export const users = [
  {
    id: 1,
    username: "amit",
    password: "test1234",
    role: ROLES.USER,
  },
  {
    id: 2,
    username: "admin",
    password: "test1234",
    role: ROLES.ADMIN,
  },
];
