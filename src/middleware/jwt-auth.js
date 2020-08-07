const AuthService = require('../auth/auth-service');

function requireAuth(req, res, next) {
    console.log('requireAuth ran')
    const authToken = req.get('Authorization') || '';
    let bearerToken;

    console.log('authToken', authToken)
    if (!authToken.toLowerCase().startsWith('bearer')) {
        return res.status(401).json({ error: 'Missing bearer token' });
    } else {
        bearerToken = authToken.slice(7, authToken.length);
        console.log('bearerToken', bearerToken)
    };

    try {
        const payload = AuthService.verifyJwt(bearerToken);
        console.log('payload', payload)
        AuthService.getUserWithUsername(
            req.app.get('db'),
            payload.sub
        )
            .then(user => {
                console.log('user', user)
                if (!user)
                    return res.status(401).json({
                        error: 'Unauthorized request'
                    });
                req.user = user;
                next();
            })
            .catch(err => {
                console.log('err', err)
                next(err);
            });
    } catch (error) {
        console.log('error', error)
        res.status(401).json({ error: 'Unauthorized request' });
    };
};

module.exports = {
    requireAuth,
};