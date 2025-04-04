

import admin from 'firebase-admin';


export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(authHeader && authHeader.startsWith('Bearer ')) {
        //extract id token from the header 
        const idToken = authHeader.split('Bearer ')[1];

        try {
            // verify id token 
            const decodedToken = await admin.auth().verifyIdToken(idToken);

            req.user = { uid: decodedToken.uid };

            next();
        } catch (error) {
            console.error('TOken verification error:', error);

            res.status(401).send('unauthorized');
        }
    } else {
        res.status(401).send('unauthorized');
    }
}

