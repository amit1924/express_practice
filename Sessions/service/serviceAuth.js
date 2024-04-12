import findUserByEmail from "../data/user.js";

import bcrypt from "bcrypt";

const loginAuth = async (email, password) => {
  // lookup user by email
  try {
    const user = await findUserByEmail(email);
    console.log(user.email);
    // we cant hash plain text password before we pass bcrypt.compare
    const match = bcrypt.compare(password, user.pwHash);
    console.log(match);
    if (match) {
      return { id: user.id, roles: user.roles };
    } else {
      return Promise.reject("Invalid Username or Password");
    }
  } catch (e) {
    return Promise.reject("user not found");
  }
};

export default loginAuth;
