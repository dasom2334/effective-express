import db from '../models/index.js'
import getDatabase from '../lambdas/getDatabase.js'
import { loadGetInitialProps } from 'next/dist/shared/lib/utils';

export default function UserService() {
    const User = db.User;
    const dbo = getDatabase();
    const dbConnect = dbo.getDb();
    return {
        join(req, res) {
            new User(req.body).save((err) => {
                if(err) {
                    res.status(500).json({message: err})
                    console.log('signup failed')
                    return;
                } else {
                    res.status(200).json({message: 'OK'})
                }
            })
        },
        login(req, res) {
            const data = req.body
            res.status(200).json({})
        }
    }
}