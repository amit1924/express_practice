import bcrypt from "bcrypt";

const users = {
  "user1@productioncoder.com": {
    pwHash: bcrypt.hashSync("user1pw", 10),
    roles: ["ADMIN"],
    id: "4de1db77-b69f-468f-a2a7-779b2310180c",
  },
  "user2@productioncoder.com": {
    pwHash: bcrypt.hashSync("user2pw", 10),
    roles: ["ADMIN_Manager"],
    id: "76822e2a-a7af-4fa3-ba7c-7f642012ed07",
  },
};

const findUserByEmail = async (email) => {
  const user = users[email];
  return user ? user[email] : Promise.reject("User not found");
};

export default findUserByEmail;
