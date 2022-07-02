const admin = require("firebase-admin");
const serviceAccount = require("./secrets.json")

export const vertifyIdToken = async (token) =>{
    if(!admin.apps.length){
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        })
    }

    try {
        return await admin.auth().verifyIdToken(token);
    } catch (err) {
        throw err;
    }
}