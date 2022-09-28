const passport = require('passport');

module.exports = {

    local: (req, res, next) => {
        passport.authenticate(
            'local',
            { session: false },
            (erro, user, info) => {

                if (erro && erro.name === 'InvalidArgumentError') {
                    return res.status(401).json({ erro: erro.message });
                };

                if (erro) {
                    return res.status(500).json({ erro: erro.message });
                };

                if (!user) {
                    return res.status(401).json();
                };

                req.user = user;
                return next();
            }
        )(req, res, next);
    },

    bearer: (req, res, next) => {
        passport.authenticate(
            'bearer',
            { session: false },
            (err, user, info) => {

                if (err && err.name === 'JsonWebTokenError') {
                    return res.status(401).json({ err: err.message });
                };

                if(err && err.name === 'TokenExpiredError'){
                    return res.status(401).json({err: err.message, expiradoEm: err.expiredAt})
                }

                if (err) {
                    return res.status(500).json({ err: err.message });
                };

                if (!user) {
                    return res.status(401).json();
                };

                req.token = info.token;

                req.user = user;
                return next();

            }
        )(req, res, next);
    }
};