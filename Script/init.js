class Question {
    option;
    custom_answer = [];
    rating = ['Very much','much','More or less','less','not at all', "can't say"];
    min;
    max;
    constructor(type, question,id) {
        this.type = type;
        this.question = question;
        this.id = id;
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

let q1 = new Question('rating','Are you interested in ESG?','q1');
let q2 = new Question('rating','Hello?','q2');
let q3 = new Question('custom','How many employees do you have in germany?','q3');
q3.custom_answer = ['10-25','25-100','100-250','250-1000','>1000'];
let q4 = new Question('slider','What is your yearly turnover?','q4');
q4.min = 0;
q4.max = 500;

let questions = [q1,q2,q3,q4];

var currentpage = 0;

document.getElementById('QMain').innerHTML = questions[0].getHTML();

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
    document.getElementById('QMain').innerHTML = questions[currentpage].getHTML();
    if (questions[currentpage].type == 'slider') {
        activateSlider();
    }
    document.getElementById('QMain').children[0].classList.toggle('trans-right', true);
    await sleep(10);
    document.getElementById('QMain').children[0].classList.toggle('trans-right', false);
}
async function clickBack() {
    if (currentpage == 0) return;
    document.getElementById('QMain').children[0].classList.toggle('trans-right', true);
    await sleep(800);
    document.getElementById('QMain').innerHTML = '';
    currentpage--;
    document.getElementById('QMain').innerHTML = questions[currentpage].getHTML();
    checkNextButton();
    document.getElementById('QMain').children[0].classList.toggle('trans-left', true);
    await sleep(10);
    document.getElementById('QMain').children[0].classList.toggle('trans-left', false);

}

function activateSlider() {
    document.getElementsByClassName('qMSlider')[0].oninput = function() {
        document.getElementsByClassName('qMInput')[0].value = document.getElementsByClassName('qMSlider')[0].value;
        questions[currentpage].option = document.getElementsByClassName('qMSlider')[0].value + ' mio €';
        const tempSliderValue = document.getElementsByClassName('qMSlider')[0].value; 
        const progress = (tempSliderValue / document.getElementsByClassName('qMSlider')[0].max) * 100;
        document.getElementsByClassName('qMSlider')[0].style.background = `linear-gradient(to right, #7AA874 ${progress}%, #ccc ${progress}%)`;
    }
    document.getElementsByClassName('qMInput')[0].oninput = function() {
        document.getElementsByClassName('qMSlider')[0].value = document.getElementsByClassName('qMInput')[0].value;
        questions[currentpage].option = document.getElementsByClassName('qMInput')[0].value + ' mio €';
        const tempSliderValue = document.getElementsByClassName('qMInput')[0].value; 
        const progress = (tempSliderValue / document.getElementsByClassName('qMSlider')[0].max) * 100;
        document.getElementsByClassName('qMSlider')[0].style.background = `linear-gradient(to right, #7AA874 ${progress}%, #ccc ${progress}%)`;
    }
}

// activateSlider();