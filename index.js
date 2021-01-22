const ApexPMD = require('./ApexPMD');

const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;

var router = express.Router();
app.use(bodyParser.json({limit: '50mb'}));
app.listen(port, () => console.log(`Port: ${port}`));
app.post('//apexPMD', (req, res) => {
    let data = req.body;
    let init = new ApexPMD(data.backUrl, data.sId, data.jobId, data.attList, data.attRuls, data.branchId);
    init.getAttachment().then(() => {
        init.runPMD().then(() => {
            init.saveResults().then(() => {
                init.updateObjects().then(() => {
                    init.cleanFolder();
                }).catch(e => console.log("Critical error : " + e.message));
            }).catch(e => console.log("Critical error : " + e.message));
        }).catch(e => console.log("Critical error : " + e.message));
    }).catch(e => console.log("Critical error : " + e.message));
    console.log('end');
    res.send({isSuccess:true,opStatus:'INPROGRESS'});
});

app.post('//oauth/token', (req, res) => {
    let user = "admin";
    let pass = "n2c99skEwmWvt3Q1p7d11ne4FKwPqCs85N2RvwNdlfMw4I3NL";
    let username = req.query.username;
    let password = req.query.password;
    if (username == user && password == pass) {
        if (req.headers.authorization && req.headers.authorization.search('Basic ') === 0) {
            // fetch login and password
            let userEnv = process.env.username;
            let passEnv = process.env.password;
            if (new Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString() == userEnv + ':' + passEnv) {
                let auth = {
                    access_token: 'a54c0200-5f3b-4625-b231111112131213',
                    token_type: 'bearer',
                    refresh_token: '475b9443-9cef-4468-a4be-e3f449da8d03',
                    expires_in: 1867,
                    scope: 'read write trust'
                };
                res.send(auth);
            } else {res.send('wrong username or password');}
        }else {res.send('not authorization');}
    } else {res.send('not authorization');}
});

app.get('//', function (req, res) {
    res.send('');
});

app.get('//server/log', function (req, res) {
    res.send('');
});
