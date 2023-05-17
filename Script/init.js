class Question {
    option;
    custom_answer = [];
    rating = ['Very much','much','More or less','less','not at all', "can't say"];
    min;
    max;
    constructor(type, question,topic,id) {
        this.type = type;
        this.question = question;
        this.id = id;
        this.topic = topic;
    }

    getHTML() {
        var str = '<div class="qMChild"><div class="qM-TopPart"><img src="/IMG/F64AF5D5-370A-430B-B05E-BCD5B3832555_1_105_c.jpeg" alt="" srcset=""><div class="qM-Navigation"><div class="qMN-Back" onclick="clickBack(this)">Back</div><div class="qMN-Next deactivate" onclick="clickNext(this)">Next</div></div></div><p class="qMHead">' + this.question + '</p>'

        if (this.type == 'rating') {
            str += '<div class="qMDecision">'
            for (var i=0; i<this.rating.length;i++) {
                if (this.option == i) {
                    str += '<div class="qMD-Element selected" onclick="selectAnswer(' + i + ', this)">' + this.rating[i] + '</div>'
                } else {
                    str += '<div class="qMD-Element" onclick="selectAnswer(' + i + ', this)">' + this.rating[i] + '</div>'
                }
            }
            str += '</div>'
        } else if (this.type == 'custom') {
            str += '<div class="qMDecision">'
            for (var i=0; i<this.custom_answer.length;i++) {
                if (this.option == i) {
                    str += '<div class="qMD-Element selected" onclick="selectAnswer(' + i + ', this)">' + this.custom_answer[i] + '</div>'
                } else {
                    str += '<div class="qMD-Element" onclick="selectAnswer(' + i + ', this)">' + this.custom_answer[i] + '</div>'
                }
            }
            str += '</div>'
        } else if (this.type == 'slider') {
            if (this.option != undefined) {
                const progress = (Number(this.option.split(' ')[0]) / this.max) * 100;

                str += '<div class="qMInputHous"><input type="text" class="qMInput" value="' + this.option.split(' ')[0] + '"><p>in mio €</p></div><div class="qMSliderHous"><p>' + this.min + ' €</p><input type="range" min="' + this.min + '" max="' + this.max + '" value="' + this.option.split(' ')[0] + '" class="qMSlider" style="background: ' + `linear-gradient(to right, #7AA874 ${progress}%, #ccc ${progress}%)` + '"><p>' + this.max + ' mio €</p></div>'
            } else {
                str += '<div class="qMInputHous"><input type="text" class="qMInput"><p>in mio €</p></div><div class="qMSliderHous"><p>' + this.min + ' €</p><input type="range" min="' + this.min + '" max="' + this.max + '" value="0" class="qMSlider"><p>' + this.max + ' mio €</p></div>'
            }
        }

        str += '</div>';
        return str
    }
}

let q1 = new Question('rating','Are you interested in ESG?','general','q1');
let q2 = new Question('rating','Hello?','general','q2');
let q3 = new Question('rating','Hello?C','company','q3');
let q4 = new Question('custom','How many employees do you have in germany?','company','q4');
q4.custom_answer = ['10-25','25-100','100-250','250-1000','>1000'];
let q5 = new Question('slider','What is your yearly turnover?','company','q5');
q5.min = 0;
q5.max = 500;

let questions = [q1,q2,q3,q4,q5];

var currentpage = 0;
var numGeneral = 0;
var numCompany = 0;

document.getElementById('QMain').innerHTML = questions[0].getHTML();
var timeLeft = Math.round(((questions.length - currentpage) * 30) / 60);
if (timeLeft == 1) {
    document.getElementsByClassName('qS-TimeLeft')[0].innerHTML = "Approximately " + timeLeft + " minute remaining.";
} else {
    document.getElementsByClassName('qS-TimeLeft')[0].innerHTML = "Approximately " + timeLeft + " minutes remaining.";
}

/**
 * selects an answer on the current page and sets the question object accordingly
 * @param {Integer} number index of the element in answer selection
 * @param {HTMLElement} elem reference to the element clicked on
 */
async function selectAnswer(number, elem) {
    questions[currentpage].option = number;
    console.log(questions[currentpage]);
    for (let el of elem.parentElement.children) {
        el.classList.toggle('selected', false)
    }
    elem.classList.toggle('selected', true)
    checkNextButton();
    await sleep(200);
    document.getElementsByClassName('qMN-Next')[0].click();
}

/**
 * checks whether you can click on the next button
 */
function checkNextButton() {
    if (questions[currentpage].option != undefined) {
        document.getElementsByClassName('qMN-Next')[0].classList.toggle('deactivate', false);
    } else {
        document.getElementsByClassName('qMN-Next')[0].classList.toggle('deactivate', true);

    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * click on button next to get next question
 * @param {HTMLElement} elem reference to itself
 * @returns 
 */
async function clickNext(elem) {
    // returns if user has not selected an element yet
    if (elem.getAttribute('class').includes('deactivate')) {
        return
    }
    if (currentpage == questions.length-1) return
    document.getElementById('QMain').children[0].classList.toggle('trans-left', true);
    await sleep(800);
    document.getElementById('QMain').innerHTML = '';
    currentpage++;
    // increases progress bar
    if (currentpage <= numGeneral) {
        document.getElementById('QS-Bar1').style.width = (currentpage/numGeneral * 100) + '%'
        if (currentpage == numGeneral) {
            document.getElementsByClassName('qS-Text')[1].style = "font-weight: 600;";
            document.getElementsByClassName('qS-Text')[0].style = "font-weight: 400;";
        }
    } else {
        document.getElementById('QS-Bar2').style.width = ((currentpage - numGeneral)/numCompany * 100) + '%'
    }
    // predict remaining time
    var timeLeft = Math.round(((questions.length - currentpage) * 30) / 60);
    if (timeLeft == 1) {
        document.getElementsByClassName('qS-TimeLeft')[0].innerHTML = "Approximately " + timeLeft + " minute remaining.";
    } else {
        document.getElementsByClassName('qS-TimeLeft')[0].innerHTML = "Approximately " + timeLeft + " minutes remaining.";
    }

    document.getElementById('QMain').innerHTML = questions[currentpage].getHTML();
    if (questions[currentpage].type == 'slider') {
        activateSlider();
    }
    document.getElementById('QMain').children[0].classList.toggle('trans-right', true);
    await sleep(10);
    document.getElementById('QMain').children[0].classList.toggle('trans-right', false);
}
/**
 * click on back button to get previous question
 * @returns 
 */
async function clickBack() {
    if (currentpage == 0) return;
    document.getElementById('QMain').children[0].classList.toggle('trans-right', true);
    await sleep(800);
    document.getElementById('QMain').innerHTML = '';
    currentpage--;
    console.log(currentpage)
    console.log(numGeneral)
    // decreases progress bar
    if (currentpage <= numGeneral) {
        document.getElementById('QS-Bar1').style.width = (currentpage/numGeneral * 100) + '%'
        if (currentpage == numGeneral - 1) {
            document.getElementsByClassName('qS-Text')[0].style = "font-weight: 600;";
            document.getElementsByClassName('qS-Text')[1].style = "font-weight: 400;";
        }
        document.getElementById('QS-Bar2').style.width = '0%'
    } else {
        document.getElementById('QS-Bar2').style.width = ((currentpage - numGeneral)/numCompany * 100) + '%'
    }
    document.getElementById('QMain').innerHTML = questions[currentpage].getHTML();
    checkNextButton();
    document.getElementById('QMain').children[0].classList.toggle('trans-left', true);
    await sleep(10);
    document.getElementById('QMain').children[0].classList.toggle('trans-left', false);

}

/**
 * activates slider functionality, when a slider is part of a question
 */
function activateSlider() {
    document.getElementsByClassName('qMSlider')[0].oninput = function() {
        document.getElementsByClassName('qMInput')[0].value = document.getElementsByClassName('qMSlider')[0].value;
        questions[currentpage].option = document.getElementsByClassName('qMSlider')[0].value + ' mio €';
        const tempSliderValue = document.getElementsByClassName('qMSlider')[0].value; 
        const progress = (tempSliderValue / document.getElementsByClassName('qMSlider')[0].max) * 100;
        document.getElementsByClassName('qMSlider')[0].style.background = `linear-gradient(to right, #7AA874 ${progress}%, #ccc ${progress}%)`;
        checkNextButton();
    }
    document.getElementsByClassName('qMInput')[0].oninput = function() {
        document.getElementsByClassName('qMSlider')[0].value = document.getElementsByClassName('qMInput')[0].value;
        questions[currentpage].option = document.getElementsByClassName('qMInput')[0].value + ' mio €';
        const tempSliderValue = document.getElementsByClassName('qMInput')[0].value; 
        const progress = (tempSliderValue / document.getElementsByClassName('qMSlider')[0].max) * 100;
        document.getElementsByClassName('qMSlider')[0].style.background = `linear-gradient(to right, #7AA874 ${progress}%, #ccc ${progress}%)`;
        checkNextButton();
    }
}

/**
 * calculates the number of questions and their categories to properly distribute the bar length
 */
function prepareProgressBar() {
    for (var i=0; i<questions.length;i++) {
        if (questions[i].topic == 'general') {
            numGeneral++;
        } else {
            numCompany++;
        }
    }
    document.getElementsByClassName('qS-Left')[0].style.width = (numGeneral / (numGeneral + numCompany) * 100) + '%';
    document.getElementsByClassName('qS-Right')[0].style.width = (numCompany / (numGeneral + numCompany) * 100) + '%';
}

prepareProgressBar();

// activateSlider();