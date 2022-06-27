const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('./models/user')

function initialize(passport) {  
    const authenticateUser = async (email, password, done) => {
        const user = await User.findOne({ email: email }).exec()

        if (user == null) {
            return done(null, false, { message: 'Няма потребител с този имейл' })
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Грешна парола' })
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email' },
    authenticateUser))

    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (id, done) => {
        const user = await User.findOne({ _id: id }).exec()
        return done(null, user)
    })
}

module.exports = initialize