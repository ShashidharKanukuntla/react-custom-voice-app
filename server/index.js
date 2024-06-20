require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get('/api/get-speech-token', async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    const speechKey = process.env.SPEECH_KEY;
    const speechRegion = process.env.SPEECH_REGION;

    if (speechKey === 'paste-your-speech-key-here' || speechRegion === 'paste-your-speech-region-here') {
        res.status(400).send('You forgot to add your speech key or region to the .env file.');
    } else {
        const headers = { 
            headers: {
                'Ocp-Apim-Subscription-Key': speechKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        try {
            const tokenResponse = await axios.post(`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, null, headers);
            res.send({ token: tokenResponse.data, region: speechRegion });
        } catch (err) {
            res.status(401).send('There was an error authorizing your speech key.');
        }
    }
});

app.post('/api/analyzetext', express.json(), async (req, res, next) => {
    console.log('body; ', req.body);
    try {
        const resp = await axios.get(`https://mycustom-voicecommand-flaskapp.azurewebsites.net/api/${req.body.text}`);
        console.log('resp: ', resp.data);
        res.send({resp: resp.data});
        // res.send({msg: "Pass"});
    } catch (err) {
        res.status(401).send('There was an error authorizing your speech key.');
    }   
    // res.send({msg: "Pass"});
})

app.listen(3001, () =>
    console.log('Express server is running on localhost:3001')
);
