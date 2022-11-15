const passport = require('passport');
const LocalStrategy = require('passport-local');
const { User } = require("../models/user");
const { validatePassword } = require("../utils/password");
const { AUTH_LOCAL } = require("../consts/authStrategies");

const configurePassport = () => {
    passport.use(AUTH_LOCAL, new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            const user = await User.findOne({ email });
            if (!user || !validatePassword(password, user.password)) {
                return done(null, false, { message: 'Podane dane logowania są niepoprawne.' });
            }

            return done(null, user);
        }
    ));

    passport.serializeUser((user, done) => {
        process.nextTick(() => done(null, user._id));
    });

    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        done(null, user);
    });
};

module.exports = { configurePassport };