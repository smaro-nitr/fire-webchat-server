const jwt = require("jsonwebtoken");

authenticate = async (db, authorization) => {
  try {
    const activeUser = db.ref("/activeUser");

    let isAuthenticated = false;

    if (authorization) {
      const decoded = jwt.verify(authorization, "smaro");

      isAuthenticated = await activeUser.once("value", (snapshot) => {
        const value = snapshot.val();

        const active = Boolean(value && value[decoded.username] !== undefined);
        const validAuthorization =
          active && value[decoded.username] === authorization;

        const authenticationStatus =
          active && validAuthorization && decoded.expiry > new Date().getTime();

        if (!authenticationStatus) activeUser.child(decoded.username).set(null);

        return authenticationStatus;
      });
    }

    return isAuthenticated;
  } catch (err) {
    console.log(err);
    return res.status(400).json("Error");
  }
};

module.exports = { authenticate };
