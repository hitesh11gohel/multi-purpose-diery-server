const LocalStartegy = require("passport-local").Strategy;
const { UserModel } = require("../models/index");
const bcrypt = require("bcrypt");

const Init = (passport) => {
  passport.use(
    new LocalStartegy(
      { usernameField: "email" },
      async (email, password, done) => {
        const user = await UserModel.findOne({ email: email });
        if (!user) {
          return done(null, false, { message: "No user with this email" });
        }

        bcrypt
          .compare(password, user.password)
          .then((match) => {
            if (match) {
              return done(null, user._id, { message: "Logged in succesfully" });
            }
            return done(null, false, { message: "Wrong username or password" });
          })
          .catch((err) =>
            done(null, false, { message: "Something went wrong" })
          );
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err, user) => done(err, user));
  });
};

module.exports = Init;
