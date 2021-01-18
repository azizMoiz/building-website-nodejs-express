const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');

const FeedbackService = require('./services/FeedbackService');
const SpeakersService = require('./services/SpeakerService');

const feedbackService = new FeedbackService('./data/feedback.json');
const speakersService = new SpeakersService('./data/speakers.json');

const routes = require('./routes');
const {
    request,
    response
} = require('express');
const app = express();
const port = 3000;

app.set('trust proxy', 1);
app.use(cookieSession({
    name: 'session',
    keys: ['dgkjsdhfkdhf', 'dkjlkdjfdljf'],
}))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.locals.siteName = "ROUX mEETUPS";

app.use(express.static(path.join(__dirname, './static')));
app.use(async (request, response, next) => {
    try {
        const names = await speakersService.getNames();
        response.locals.speakerNames = names;
        return next();
    } catch (err) {

    }
});
app.use('/', routes({
    feedbackService,
    speakersService,
}));

app.listen(port, () => {
    console.log(`Express server listening on port ${port}!`)
})