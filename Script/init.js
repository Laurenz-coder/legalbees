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
        var str = '<div class="qMChild"><div class="qM-TopPart"><img src="/IMG/Profile/profile3.jpg" alt="" srcset=""><div class="qM-Navigation"><div class="qMN-Back" onclick="clickBack(this)">Back</div><div class="qMN-Next deactivate" onclick="clickNext(this)">Next</div></div></div><p class="qMHead">' + this.question + '</p>'

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

let q1 = new Question('custom','Where is your company based?','general','q1');
q1.custom_answer = ['European Union','Outside of the European Union'];
let q2 = new Question('slider','What is your yearly turnover in the EU?','general','q2');
q2.min = 0; q2.max = 1000;
let q3 = new Question('custom','Do you offer financial products in the EU?','general','q2');
q3.custom_answer = ['Yes','No'];
let q4 = new Question('custom','Do you have a subsidary based in the EU with a yearly turnover of more than 40 million €?','general','q3');
q4.custom_answer = ['Yes','No'];
let q5 = new Question('custom','How many employees do you have?','company','q4');
q5.custom_answer = ['<250','251-500','501-3000','>3000'];
let q6 = new Question('slider','What is your yearly turnover?','company','q5');
q6.min = 0; q6.max = 1000;
let q7 = new Question('slider','How large is your balance sheet?','company','q6');
q7.min = 0; q7.max = 1000;

let questions = [q1,q2,q3,q4,q5,q6,q7];

var currentpage = 0;
var numGeneral = 0;
var numCompany = 0;

document.getElementById('QMain').innerHTML = questions[0].getHTML();

function predictRemTime() {
    var timeLeft = Math.round(((questions.length - currentpage) * 30) / 60);
    if (timeLeft == 1) {
        document.getElementsByClassName('qS-TimeLeft')[0].innerHTML = "Approximately " + timeLeft + " minute remaining.";
    } else {
        document.getElementsByClassName('qS-TimeLeft')[0].innerHTML = "Approximately " + timeLeft + " minutes remaining.";
    }
}
predictRemTime();

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
    loadedsites = [];
    // returns if user has not selected an element yet
    if (elem.getAttribute('class').includes('deactivate')) {
        return
    }
    console.log(questions[currentpage].option);
    if (questions[currentpage].option == 0) currentpage++;
    if (currentpage == questions.length-1) {
        //check directives that apply
        //CSRD
        var sufficiance = 0;
        if (questions[4].option > 0) sufficiance++;
        if (Number(questions[5].option) >= 40) sufficiance++;
        if (Number(questions[6].option) >= 20) sufficiance++;
        if ((questions[0].option == 0 && sufficiance > 1) || (questions[0].option == 1 && (Number(questions[1].option) >= 150 || questions[3].option == 0))) loadedsites.push(
            {
                directive: "CSRD",
                shortname: "CSRD",
                numchecked: 0, // number of checklist items solved
                numtotal: 30, //all checklist items
                site: "string",
                img: "/IMG/leaf.png" // irrelevant
            });
        //CSDD
        sufficiance = 0;
        if (questions[4].option > 0) sufficiance++;
        if (Number(questions[5].option) >= 40) sufficiance++;
        if (questions[0].option == 0 && sufficiance > 1) loadedsites.push(
            {
                directive: "Corporate Sustainability Due Diligence Directive",
                shortname: "CSDDD",
                numchecked: 0, // number of checklist items solved
                numtotal: 30, //all checklist items
                site: "string",
                img: "/IMG/csddd.png" // irrelevant
            });
        //ESRS
        sufficiance = 0;
        if (questions[4].option > 0) sufficiance++;
        if (Number(questions[5].option) >= 40) sufficiance++;
        if (Number(questions[6].option) >= 20) sufficiance++;
        if (questions[0].option == 0 && sufficiance > 1) loadedsites.push(
            {
                directive: "European Sustainability Reporting Standards",
                shortname: "ESRS",
                numchecked: 0, // number of checklist items solved
                numtotal: 30, //all checklist items
                site: "string",
                img: "/IMG/eurosign.png" // irrelevant
            });
        //Supply chain act
        sufficiance = 0;
        if (questions[4].option > 0) sufficiance++;
        if (Number(questions[5].option) >= 40) sufficiance++;
        if (Number(questions[6].option) >= 20) sufficiance++;
        if (questions[0].option == 0 && sufficiance > 1) loadedsites.push(
            {
                directive: "Supply Chain Act",
                shortname: "Supply Chain Act",
                numchecked: 0, // number of checklist items solved
                numtotal: 30, //all checklist items
                site: "string",
                img: "/IMG/shippingbox.png" // irrelevant
            });
        //EU Taxonomy
        if ((questions[0].option == 0 && questions[4].option > 1) || (questions[0].option == 1 && questions[2].option == 0)) {
            loadedsites.push(
            {
                directive: "EU Taxonomy",
                shortname: "EU Taxonomy",
                numchecked: 0, // number of checklist items solved
                numtotal: 30, //all checklist items
                site: "",
                img: "/IMG/basket.png" // irrelevant
            });
        } else {
            //EU Taxonomy Future
            sufficiance = 0;
            if (questions[4].option > 0) sufficiance++;
            if (Number(questions[5].option) >= 40) sufficiance++;
            if (Number(questions[6].option) >= 20) sufficiance++;
            if (questions[0].option == 0 && sufficiance > 1) loadedsites.push(
                {
                    directive: "EU Taxonomy Future",
                    shortname: "EU Taxonomy",
                    numchecked: 0, // number of checklist items solved
                    numtotal: 30, //all checklist items
                    site: "string",
                    img: "/IMG/basket.png" // irrelevant
                });
        }

        console.log(loadedsites)
        localStorage.setItem('loadedsites', JSON.stringify(loadedsites))
        window.open('http://esjungle.com/pillarnew.html', '_self');
        return
    }
    document.getElementById('QMain').children[0].classList.toggle('trans-left', true);
    await sleep(400);
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
    predictRemTime();

    document.getElementById('QMain').innerHTML = questions[currentpage].getHTML();
    if (questions[currentpage].type == 'slider') {
        activateSlider();
    }
    document.getElementById('QMain').children[0].classList.toggle('trans-right', true);
    await sleep(10);
    document.getElementById('QMain').children[0].classList.toggle('trans-right', false);
    checkNextButton();
}
/**
 * click on back button to get previous question
 * @returns 
 */
async function clickBack() {
    if (currentpage == 0) return;
    document.getElementById('QMain').children[0].classList.toggle('trans-right', true);
    await sleep(400);
    document.getElementById('QMain').innerHTML = '';
    currentpage--;
    if (currentpage != 0) {
        if (questions[currentpage-1].option == 0) currentpage--;
    }
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
    if (questions[currentpage].type == 'slider') {
        activateSlider();
    }
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
        questions[currentpage].option = document.getElementsByClassName('qMSlider')[0].value;
        const tempSliderValue = document.getElementsByClassName('qMSlider')[0].value; 
        const progress = (tempSliderValue / document.getElementsByClassName('qMSlider')[0].max) * 100;
        document.getElementsByClassName('qMSlider')[0].style.background = `linear-gradient(to right, #7AA874 ${progress}%, #ccc ${progress}%)`;
        checkNextButton();
    }
    document.getElementsByClassName('qMInput')[0].oninput = function() {
        document.getElementsByClassName('qMSlider')[0].value = document.getElementsByClassName('qMInput')[0].value;
        questions[currentpage].option = document.getElementsByClassName('qMInput')[0].value;
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