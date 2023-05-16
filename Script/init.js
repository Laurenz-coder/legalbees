class Question {
    option;
    custom_answer = [];
    rating = ['Very much','much','More or less','less','not at all', "can't say"];
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
        }

        str += '</div>';
        return str
    }
}

let q1 = new Question('rating','Are you interested in ESG?','q1');
let q2 = new Question('rating','Hello?','q2');

let questions = [q1,q2];

var currentpage = 0;

document.getElementById('QMain').innerHTML = questions[0].getHTML();

/**
 * selects an answer on the current page and sets the question object accordingly
 * @param {Integer} number index of the element in answer selection
 * @param {HTMLElement} elem reference to the element clicked on
 */
function selectAnswer(number, elem) {
    questions[currentpage].option = number;
    console.log(questions[currentpage]);
    for (let el of elem.parentElement.children) {
        el.classList.toggle('selected', false)
    }
    elem.classList.toggle('selected', true)
    checkNextButton();
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
    document.getElementById('QMain').children[0].classList.toggle('trans-left', true);
    await sleep(800);
    document.getElementById('QMain').innerHTML = '';
    currentpage++;
    document.getElementById('QMain').innerHTML = questions[currentpage].getHTML();
    document.getElementById('QMain').children[0].classList.toggle('trans-right', true);
    await sleep(10);
    document.getElementById('QMain').children[0].classList.toggle('trans-right', false);

}
async function clickBack(elem) {
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
