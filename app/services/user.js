import db from '../models/index.js'
import getDatabase from '../lambdas/getDatabase.js'

export default function UserService() {
    const User = db.User;
    const dbo = getDatabase();
    const dbConnect = dbo.getDb();
    return {
        join(req, res) {
            new User(req.body).save((err) => {
                if (err) {
                    res
                        .status(500)
                        .json({message: err})
                    return;
                } else {
                    res
                        .status(200)
                        .json({message: 'OK'})
                }
            })
        },
        login(req, res) {
            User.findOne({
                userid: req.body.userid
            }, function (err, user) {
                if (err) 
                    throw err
                if (!user) {
                    res
                        .status(401)
                        .send({success: false, message: '해당 ID가 존재하지 않습니다'});
                } else {
                    user.comparePassword(req.body.password, function (_err, isMatch) {
                        if (!isMatch) {
                            res
                                .status(401)
                                .send({message: 'FAIL'});
                        } else {
                            user.generateToken((err, user) => {
                                if (err) {
                                    res
                                        .status(400)
                                        .send(err);
                                }
                                res
                                    .status(200)
                                    .json(user);
                            })
                        }
                    })
                }
            })

            /**const matchDocument = {
                userid: req.body.userid,
                password: req.body.password,
                email: req.body.email,
                name: req.body.name,
                phone: req.body.phone,
                birth: req.body.birth,
                address: req.body.address
            };
            dbConnect
                .collection("users")
                .insertOne(matchDocument, function (err, result) {
                    if (err) {
                        res
                            .status(400)
                            .send("Error inserting matches!");
                    } else {
                        console.log(`Added a new match with id ${result.insertedId}`);
                        res
                            .status(204)
                            .send();
                    }
                }) */
        },
        logout(req, res) {
            req.logout()
            res.json({msg: 'LOGOUT'})
        },
        delUser(req, res) {
            console.log('delete')
            User.findOne({
                userid: req.body.userid
            }, function (err, user) {
                if (err) 
                    throw err
                if (!user) {
                    res
                        .status(401)
                        .send({success: false, message: '해당 ID가 존재하지 않습니다'});
                } else {
                    console.log(' ### 로그인 정보 : ' + JSON.stringify(user))
                    user.comparePassword(req.body.password, function (_err, isMatch) {
                        if (!isMatch) {
                            res
                                .status(401)
                                .send({message: 'FAIL'});
                        } else {
                            console.log(user);
                            user.deleteOne()
                            .exec((_err, user) => {
                                res.status(200)
                            });

                        }
                    })
                }
            })
        },
        editUser(req, res) {
            User.updateOne({
                userid: req.body.userid
            }, {
                password: req.body.password,
                email: req.body.email,
                name: req.body.name,
                phone: req.body.phone,
                birth: req.body.birth,
                address: req.body.address,
            })
            .exec((_err, user) => {
                res.status(200).json(user)
            });
        },
        getUserById(req, res) {
            const userid = req.body.userid
            User.findById({userid: userid})
            .exec((_err, user) => {
                res.status(200).json(user)
            })
        },
        getUsers(_req, res) {
            User.find().exec(
                (err, users) => {
                    res.status(200).json(users)
                }
            );
        }
    }
}