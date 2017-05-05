var fs = require('fs');
var inquirer = require('inquirer');
var BasicCard = require('./BasicCard.js');
var ClozeCard = require('./ClozeCard.js');

inquirer.prompt([{
    name: 'directions',
    message: 'What would you like to do?',
    type: 'list',
    choices: [{
        name: 'Add Flashcard'
    }, {
        name: 'Show All Cards'
    }]

}]).then(function(answer) {
    if (answer.directions === 'Add Flashcard') {
        addFlashcard();
    } else if (answer.directions === 'Show All Cards') {
        showCard();
    }
});

var addFlashcard = function() {
    inquirer.prompt([{
        name: 'flashcardType',
        message: 'Please tell me what type of Flashcard would you like to create?',
        type: 'list',
        choices: [{
            name: 'Basic Flashcard'
        }, {
            name: 'Cloze Flashcard'

        }]
    }]).then(function(answer) {
        if (answer.flashcardType === 'Basic Flashcard') {
            inquirer.prompt([{
                name: 'front',
                message: 'Please input the Question',
                validate: function(input) {
                    if (input === '') {
                        console.log('Please input your Question!');
                        return false;
                    } else {
                        return true;
                    }
                }
            }, {
                name: 'back',
                message: 'Please input the Answer',
                validate: function(input) {
                    if (input === '') {
                        console.log('Please input your Answer!');
                        return false;
                    } else {
                        return true;
                    }
                }
            }]).then(function(answer) {
                var newBasicCard = new BasicCard(answer.front, answer.back);
                newBasicCard.create();
                whatComesNext();
            });
        } else if (answer.flashcardType === 'Cloze Flashcard') {
            inquirer.prompt([{
                name: 'text',
                message: 'What is the full question?',
                validate: function(input) {
                    if (input === '') {
                        console.log('Please input your full Question!');
                        return false;
                    } else {
                        return true;
                    }
                }
            }, {
                name: 'cloze',
                message: 'What is the cloze portion of the question?',
                validate: function(input) {
                    if (input === '') {
                        console.log('Please tell me which is the cloze portion!');
                        return false;
                    } else {
                        return true;
                    }
                }
            }]).then(function(answer) {
                var text = answer.text;
                var cloze = answer.cloze;
                if (text.includes(cloze)) {
                    var newCloze = new ClozeCard(text, cloze);
                    newCloze.create();
                    whatComesNext();
                } else {
                    console.log('That portion is not found in the original text!  Please try again!');
                    addFlashcard();
                }
            });

        }
    });
};

var whatComesNext = function() {
    inquirer.prompt([{
        name: 'nextStep',
        message: 'What would you like to do next?',
        type: 'list',
        choices: [{
            name: 'Create a new Card'
        },{
            name: 'Show all cards'
        },{
            name: 'Nothing'
        
        }]
    }]).then(function(answer) {
        if (answer.nextStep === 'Create a new Card') {
            addFlashcard();
        } else if (answer.nextStep === 'Show all cards') {
            showCard();
        } else if (answer.nextStep === 'Nothing') {
            return;
        }
    });
};

var showCard = function() {
    fs.readFile('log.txt', 'utf8', function(error, data) {
        if (error) {
            console.log("This is the error: " + error);
        }
        var questions = data.split(';');
        var count = 0;
        showQuestions(questions, count);
    });
};
var showQuestions = function(questionArray, indexNumber) {
    question = questionArray[indexNumber];
    var objQuestion = JSON.parse(questionArray);
    var questionTxt;
    var correctReply;
    if (objQuestion.type === 'basic') {
        questionTxt = objQuestion.front;
        correctReply = objQuestion.back;
    } else if (objQuestion.type === 'cloze') {
        questionTxt = objQuestion.partial;
        correctReply = objQuestion.cloze;
    }
    inquirer.prompt([{
        name: 'response',
        message: questionTxt
    }]).then(function(answer) {
        if (answer.response === correctReply) {
            console.log('YOU ARE CORRECT!!! WOOT! WOOT!');
            if (indexNumber < questionArray.length - 1) {
                showQuestions(questionArray, indexNumber + 1);
            }
        } else {
            console.log('YOU ARE WRONG!!!  TRY HARDER!!');
            if (indexNumber < questionArray.length -1) {
                showQuestions(questionArray, indexNumber + 1);
            }
        }
    });
};