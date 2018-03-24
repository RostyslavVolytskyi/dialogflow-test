// Enable actions client library debugging
process.env.DEBUG = 'actions-on-google:*';
// https://us-central1-sillynamemaker-e3a42.cloudfunctions.net/sillyNameMaker

let DialogflowApp = require('actions-on-google').DialogflowApp;
let express = require('express');
let bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');

let app = express();
app.set('port', (process.env.PORT || 8080));
app.use(bodyParser.json({type: 'application/json'}));

// const GENERATE_ANSWER_ACTION = 'generate_answer';
// const CHECK_GUESS_ACTION = 'check_guess';

app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/app/index.html'));
    console.log('to get???????????????????????????')
});


// a. the action name from the make_name Dialogflow intent
const WELCOME_INTENT = 'input.welcome';  // the action name from the Dialogflow intent
const NAME_ACTION = 'make_name';
const GAME_ACTION = 'game_action';
// b. the parameters that are parsed from the make_name intent
const COLOR_ARGUMENT = 'color';
const NUMBER_ARGUMENT = 'number';

const GAME_ARGUMENT = 'game';

app.post('/', function (request, response) {
    const dialogApp = new DialogflowApp({request, response});
    console.log('Request headers: ' + JSON.stringify(request.headers));
    console.log('Request body: ' + JSON.stringify(request.body));

    function welcomeIntentQuestion (app) {
        dialogApp.ask(`Hi Dude! Welcome to Silly Name Maker! Let's get started. What is your lucky number?`,
            ['I didn\'t hear a number', 'If you\'re still there, what\'s your lucky number?',
                'We can stop here. Let\'s play again soon. Bye!']);
    }

// c. The function that generates the silly name
    function makeName (app) {
        let number = app.getArgument(NUMBER_ARGUMENT);
        let color = app.getArgument(COLOR_ARGUMENT);
        dialogApp.ask(`Alright! Your super silly name is "${color} ${number}"! I hope you like it. Which kind of sport do you like to play?`);
    }

    function createSmthWithGame (app) {
        let context = app.getContext('namecreated');

        const game = app.getContextArgument(context.name, GAME_ARGUMENT);

        const color = context.parameters.color;
        const number = context.parameters.number;


        dialogApp.tell(`Wazuuup "${color} ${number}"!!! I like also to play your ${game.original}`);
    }

    // d. build an action map, which maps intent names to functions
    let actionMap = new Map();

    actionMap.set(WELCOME_INTENT, welcomeIntentQuestion);
    actionMap.set(NAME_ACTION, makeName);
    actionMap.set(GAME_ACTION, createSmthWithGame);

    dialogApp.handleRequst(actionMap);

    // response.sendStatus(200); // OK
});

// Start the server
var server = app.listen(app.get('port'), function () {
    console.log('App listening on port %s', server.address().port);
    console.log('Press Ctrl+C to quit.');
});