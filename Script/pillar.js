var loadedsites = [];


function getScrollProgress() {
    const winScroll = document.getElementById("ScrollContainer").scrollTop + 1;
    const winHeight = document.getElementById("ScrollContainer").scrollHeight - document.getElementById("ScrollContainer").clientHeight;
    const scrolled = (winScroll / winHeight) * 100;
    document.getElementById("ScrollIndicator").style.height = scrolled + "%";
  }

//  document.getElementById("ScrollContainer").onscroll = function() {getScrollProgress()};

/**
 * opens tab of pillar html with an identifier
 * @param {String} identifier 
 * @param {HTMLElement} elem reference to itself
 */
function selectTab(identifier, elem) {
    document.getElementsByClassName('rTH-element-active')[0].classList.toggle('rTH-element-active',false);
    elem.classList.toggle('rTH-element-active',true);
    document.getElementsByClassName('tabActive')[0].classList.toggle('tabActive', false);
    document.getElementsByClassName(identifier)[0].classList.toggle('tabActive', true)
}

/**
 * used to like message or thread
 * @param {HTMLElement} elem reference to itself
 */
async function likeMessage(elem) {
    elem.children[0].classList.toggle('messageliked');
    if (elem.children[0].className.includes('messageliked')) {
        await sleep(400);
        var val = Number(elem.children[1].innerText) + 1;
        elem.children[1].innerHTML = val;
    } else {
        var val = Number(elem.children[1].innerText) - 1;
        elem.children[1].innerHTML = val;

    }
}

/**
 * leave current thread and opens thread list
 * @param {String} reference 
 */
async function leaveThread(reference) {
    var el = document.getElementsByName(reference)[0];
    el.classList.toggle('tab-to-right', true);
    // document.getElementsByName('ThreadList')[0].removeAttribute('style');
    await sleep(300);
    el.style.display = 'none';
}

/**
 * 
 * @param {String} reference to the thread that should be opened
 */
async function openThread(reference, ) {
    

}

function checkCheckBox(identifier) {
    var list = document.getElementsByName('Check' + identifier);
    var total = 0;
    var clicked = 0;
    for (let el of list) {
        if (el.checked == true) {
            clicked++;
        }
        total++;
    }
    perc = Math.round(clicked / total * 100)
    document.getElementById('CheckBar' + identifier).style.width = perc + '%';
    document.getElementById('CheckNumber' + identifier).innerHTML = perc + '%';
}

function overviewCheck(identifier) {
    console.log(document.getElementById(identifier).checked)
    console.log(numchecked)
    if (document.getElementById(identifier).checked == true) {
        numchecked--;
    } else {
        numchecked++;
    }
    console.log(numchecked)
    document.getElementById(identifier).checked = !document.getElementById(identifier).checked;
    var number = identifier.split('Itm')[0];
    console.log(number)
    checkCheckBox(number);
}

var issuer =  [
    {
        "name": "Ethan",
        "company": "Brightside Enterprises",
        "profile": "/Profile/profile2.jpg"
    },
    {
        "name": "Olivia",
        "company": "Stellar Solutions",
        "profile": "/Profile/profile1.jpg"
    },
    {
        "name": "Liam",
        "company": "Horizon Industries",
        "profile": "/Profile/profile5.jpg"
    },
    {
        "name": "Sophia",
        "company": "GlobalTech Corporation",
        "profile": "/Profile/profile4.jpg"
    },
    {
        "name": "Noah",
        "company": "InnovateX Co.",
        "profile": "/Profile/profile6.jpg"
    },
]

let month = ["Jan","Feb","Mar","Mai","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

let allelements = 9;
var loaded = 0;

function loadThreads() {

    var message = [{
        "role": "user",
        "content": 'You are asking five different forum thread questions regarding CSRD. Provide the answer in a JSON array. It should include a question and a short summary of the question. Use a maximum of six words for the summary. The question should be two sentences. The questions should address implementation and risks. Do not ask simple questions. Do not use single quotes or apostrophes'
    }]


    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer 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");
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": message,
      "frequency_penalty": 1,
      "temperature": 0.4
    });
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://api.openai.com/v1/chat/completions", requestOptions)
    .then(response => response.json())
    .then(result => {
        console.log(result)

        console.log(result.choices[0].message.content);
        var res = result.choices[0].message.content;
        res.split('\n').join('')
        // res = res.replace(/\\/g, '');
        res = res.replace(/“|”/g, '"');
        // res = res.replace("'", '"');
        res = res.split(",\n  }").join('}');
        res = res.split(",\n   }").join('}');
        res = res.split('"\n      "').join('","');
        res = res.split("```").join('');
        res = res.split(`"'`).join('"');
        res = res.split(`'"`).join('"');
        res = res.split("summary:").join('"summary":');
        res = res.split(/(?<=[a-zA-Z\.?])'(?![a-zA-Z\.])|(?<![a-zA-Z\.])'(?=[a-zA-Z\.])/g).join('"');

        console.log(res);
        var resobj = JSON.parse(res);
        var elem = document.getElementsByName('ThreadList')[0];
        var count = 0;
        for (let obj of resobj) {
            let randomMem = Math.floor(Math.random() * 30) + 2;
            let randomAns = Math.floor(Math.random() * 3) + 2;
            let randomLik = Math.floor(Math.random() * 200) + 2;
            let randomDay = Math.floor(Math.random() * 27) + 1;
            let randomStr = Math.round(Math.random());
            var liked = 'Not">';
            if (randomStr == 0) {
                liked = '"><img src="/IMG/checkmark.png" alt="">'
            }

            elem.innerHTML += '<div class="rF-Thread" onclick="loadForum(' + `'${obj.summary}', '${obj.question}' ` + ')"><div class="rFT-Left"><div class="rFTL-Answered' + liked + '<p>' + randomAns + ' answers</p></div><div class="rFTL-Stat"><img src="/IMG/person.2.fill.png" alt=""><p>' + randomMem + ' members</p></div><div class="rFTL-Stat"><img src="/IMG/heart.fill.png" alt=""><p>' + randomLik + ' likes</p></div></div><div class="rFT-right"><h2>' + obj.summary + '</h2><p>' + obj.question + '</p><div><div class="rFTR-subleft"><div>Industry</div></div><div class="rFTR-subright"><img src="/IMG' + issuer[count].profile + '" alt=""><div>' + issuer[count].name + ' <strong>from</strong> ' + issuer[count].company + '</div><p>asked Jun ' + randomDay + ', 2023</p></div></div></div></div>';
            count++;
        }
        console.log(JSON.parse(res));
        loaded++;
        updatedLoader();
        // messagehist.push(result.choices[0].message);
    })

}

// number of elements in checklist checked
var numtotal = 0;
var numchecked = 0;
function loadChecklist(secondtime) {

    var message = [{
        "role": "user",
        "content": 'Can you create a checklist for the CSRD and provide the answer in a structured JSON array? It should have the variable category and list. Every list should contain an array of 5 elements. Each element is a string which includes the measures a company must take to comply with the requirements of the CSRD. Give at least 3 categories. the JSON object must be complete'
    }]


    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer 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");
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": message,
      "frequency_penalty": 0,
      "temperature": 0.4,
      "max_tokens": 1000
    });
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://api.openai.com/v1/chat/completions", requestOptions)
    .then(response => response.json())
    .then(result => {
        try {
            
            console.log(result)
    
            console.log(result.choices[0].message.content);
            var res = result.choices[0].message.content;
            res.split('\n').join('')
            // res = res.replace(/\\/g, '');
            res = res.replace(/“|”/g, '"');
            // res = res.replace("'", '"');
            res = res.split(",\n  }").join('}');
            res = res.split(",\n   }").join('}');
            res = res.split('"\n      "').join('","');
            res = res.split('Checklist').join('checklist');
            res = res.split('Checkpoint').join('checkpoint');
            res = res.split("```").join('');
            res = res.split(/(?<=[a-zA-Z\.])'(?![a-zA-Z\.])|(?<![a-zA-Z\.])'(?=[a-zA-Z\.])/g).join('"');
            console.log(res);
            var resobj = JSON.parse(res);
            resobj = resobj.checklist;
            var elem = document.getElementsByClassName('rChecklist')[0];
            var count = 0;
            var overviewList = [];
            for (let obj of resobj) {
    
                var str = '<div class="cHeader"><p>' + obj.category + '</p><div class="cProgress"><div class="cP-track"></div><div class="cP-bar" id="CheckBar' + count + '"></div></div><div class="cProgressNumber" id="CheckNumber' + count + '">0%</div></div><div class="cList" onclick="checkCheckBox(' + count + ')">'
                var seccount = 0
                for (let ele of obj.list) {
                    var addon = '';
                    var randCheck = Math.floor(Math.random() * 3) + 1;
                    if (randCheck == 3) {
                        addon = 'checked';
                        numchecked++;
                    } else if (overviewList.length < 4) {
                        overviewList.push([ele, count + 'Itm' + seccount]);
                    }
                    str += '<div class="cL-element"><div class="cLE-checkbox"><input type="checkbox" name="Check' + count + '" id="' + count + 'Itm' + seccount + '" ' + addon + '><img src="/IMG/checkmark.png" alt="" class="cLEC-img"><div class="cLEC-cover"></div><label for="' + count + 'Itm' + seccount + '"></label></div><label class="cLE-label" for="' + count + 'Itm' + seccount + '">' + ele + '</label></div>'
                    seccount++;
                    numtotal++;
                }
                str += '</div>';
                elem.innerHTML += str;
                checkCheckBox(count);
                count++;
            }
            var seccount = 0;
            for (let el of overviewList) {
                seccount++;
                document.getElementsByName('OverviewChecklist')[0].innerHTML += '<div class="cL-element" ><div class="cLE-checkbox"><input type="checkbox" name="Check' + count + '" id="' + count + 'Itm' + seccount + '"><img src="/IMG/checkmark.png" alt="" class="cLEC-img"><div class="cLEC-cover"></div><label for="' + count + 'Itm' + seccount + '" onclick="overviewCheck(' + "'" + el[1] + "'" + ')"></label></div><label class="cLE-label" for="' + count + 'Itm' + seccount + '" onclick="overviewCheck(' + "'" + el[1] + "'" + ')">' + el[0] + '</label></div>'
            }
            console.log(JSON.parse(res));
            loaded++;
            loadOverviewChecklist(Math.round(numchecked/numtotal*100));
            updatedLoader();
        } catch (error) {
            console.log(error)
            if (secondtime != undefined) {
                loadChecklist(true);
            } else {
                console.log('second time failed with checklist')
                loaded++;
                updatedLoader();
            }
            return;
        }
        // messagehist.push(result.choices[0].message);
    })

}
function loadUpdates() {

    var message = [{
        "role": "user",
        "content": 'give a list of recent changes the directive CSRD in a JSON array. it should contain the variable date in the format DD:MM:YYYY. It should also contain the variable message. This should describe the update in 1 to 3 words. It should also contain the variable update which describes the actual updates in two sentences.'
    }]


    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer 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");
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": message,
      "frequency_penalty": 0,
      "temperature": 0.4,
      max_tokens: 1000
    });
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://api.openai.com/v1/chat/completions", requestOptions)
    .then(response => response.json())
    .then(result => {
        console.log(result)

        console.log(result.choices[0].message.content);
        var res = result.choices[0].message.content;
        res.split('\n').join('')
        // res = res.replace(/\\/g, '');
        res = res.replace(/“|”/g, '"');
        // res = res.replace("'", '"');
        res = res.split(",\n  }").join('}');
        res = res.split(",\n   }").join('}');
        res = res.split('"\n      "').join('","');
        res = res.split('message:').join('"message" :');
        res = res.split('link :').join('"link" :');
        res = res.split('link:').join('"link" :');
        res = res.split('update:').join('"update" :');
        res = res.split('-').join(':');
        res = res.split(/(?<=[a-zA-Z\.])'(?![a-zA-Z\.])|(?<![a-zA-Z\.])'(?=[a-zA-Z\.])/g).join('"');
        res = res.split("```").join('');
        console.log(res);
        var resobj = JSON.parse(res);
        if (resobj.changes != undefined) {
            resobj = resobj.changes;
        }
        var elem = document.getElementById('MainTimeLine');
        elem.innerHTML = '';
        var elemOv = document.getElementById('OverviewTimeLine');
        elemOv.innerHTML = '';
        var count = 0;
        for (let obj of resobj) {
            var date = obj.date.split(':');
            if (date[0] == '') {
                date.shift();
            }
            var dmonth = month[Number(date[1])-1];
            console.log('hey')
            elem.innerHTML += '<div class="uT-updates"><div class="uTU-element"><div class="uTUE-date"><div>' + date[0] + ' ' + dmonth + '</div><div>' + date[2] + '</div></div><div class="uTUE-line"></div><div class="uTUE-dot"></div><div class="uTUE-contentBack"><div class="uTUE-content"><p>' + obj.message + '</p><div>' + obj.update + '</div><a href="google.com">more info</a></div></div></div></div>';
            if (count < 2) {
                elemOv.innerHTML += '<div class="uT-updates"><div class="uTU-element"><div class="uTUE-date"><div>' + date[0] + ' ' + dmonth + '</div><div>' + date[2] + '</div></div><div class="uTUE-line"></div><div class="uTUE-dot"></div><div class="uTUE-contentBack"><div class="uTUE-content"><p>' + obj.message + '</p><div>' + obj.update + '</div><a href="google.com">more info</a></div></div></div></div>';
            }

            count++;
        }
        loaded++;
        updatedLoader();
        console.log(resobj);
        // messagehist.push(result.choices[0].message);
    })

}
function loadRisks(secondtime) {

    var message = [{
        "role": "user",
        "content": 'Can you create a list of potential risks for the CSRD and provide the answer in a structured JSON format? The list of potential risks should be structured in the following way: It should have as many sections as there are potential risks in total, but it should have at least 4 different risks. Every section should be structured in the following way: It should include a brief description with one sentence, a quantification of the financial sanctions/fees if a company does not comply with the CSRD, and a short title with 1 - 3 words? Please provide the information in a JSON format, where the short title with 1 - 3 words follows the variable "title:", the brief description follows the variable "brief description:" and the quantification of the financial risks that follow after the variable "financial risk:" and estimate the monetary amount for each risk.'
    }]


    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer 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");
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": message,
      "frequency_penalty": 0,
      "temperature": 0.4,
      max_tokens: 1000
    });
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://api.openai.com/v1/chat/completions", requestOptions)
    .then(response => response.json())
    .then(result => {
        try {
            console.log(result)
    
            console.log(result.choices[0].message.content);
            var res = result.choices[0].message.content;
            res.split('\n').join('')
            // res = res.replace(/\\/g, '');
            res = res.replace(/“|”/g, '"');
            // res = res.replace("'", '"');
            res = res.split(",\n  }").join('}');
            res = res.split(",\n   }").join('}');
            res = res.split('"\n      "').join('","');
            res = res.split(/(?<=[a-zA-Z\.])'(?![a-zA-Z\.])|(?<![a-zA-Z\.])'(?=[a-zA-Z\.])/g).join('"');
            res = res.split("```").join('');
            res = res.split("brief description").join('brief_description');
            res = res.split("financial risks").join('financial_risks');
            res = res.split("financial risk").join('financial_risk');
            console.log(res);
            var resobj = JSON.parse(res);
            if (resobj.risks != undefined) {
                resobj = resobj.risks;
            } else if (resobj.potential_risks != undefined) {
                resobj = resobj.potential_risks;
            }

            console.log(resobj);
            var elem = document.getElementsByClassName('rRiskAssesment')[0];
            elem.innerHTML = '';
            for (let obj of resobj) {
                elem.innerHTML += '<div class="dBlock"><div class="dB-header">' + obj.title + '</div><div class="dB-answer">' + obj.brief_description + '</div><div class="dB-question">Consequences</div><div class="dB-answer">' + obj.financial_risk + '</div></div>';
    
            }
            loaded++;
            updatedLoader();
            
        } catch (error) {
            console.log(error)
            return;
            if (secondtime != undefined) {
                loadRisks(true);
            } else {
                console.log('second time failed with risks')
                loaded++;
                updatedLoader();
            }
            return;
        }
    })

}
function loadDeepDive(secondtime) {

    var message = [{
        "role": "user",
        "content": 'give a deep dive for CSRD.'
    }]

    var functions = [
        {
            "name": "get_current_backinfo",
            "description": "gives a deep dive of a given ESG directive in a question description format",
            "parameters": {
                "type": "object",
                "properties": {
                    directive: {
                        type: "string",
                        description: "name of the directive"
                    },
                    question: {
                        type: "string",
                        description: "a question about background information of the directive"
                    },
                    answer: {
                        type: "string",
                        description: "answer to the question in 3 sentences"
                    }
                },
                "required": ["directive", "question", "answer"]
            }
        },
        {
            "name": "get_goals_and_requirements",
            "description": "gives a deep dive of a given ESG directive in a question description format",
            "parameters": {
                "type": "object",
                "properties": {
                    directive: {
                        type: "string",
                        description: "name of the directive"
                    },
                    question: {
                        type: "string",
                        description: "what is the objective of the directive"
                    },
                    answer: {
                        type: "string",
                        description: "answer to the question about the objective in three sentences"
                    },
                    question_sec: {
                        type: "string",
                        description: "what are the main reporting requirements of the directive"
                    },
                    answer_sec: {
                        type: "string",
                        description: "answer to the question about the reporting requirements in 3 complete sentences"
                    }               
                },
                "required": ["directive", "question", "answer", "question_sec","answer_sec"]
            }
        },
        {
            "name": "get_development",
            "description": "gives a deep dive of a given ESG directive in a question description format",
            "parameters": {
                "type": "object",
                "properties": {
                    directive: {
                        type: "string",
                        description: "name of the directive"
                    },
                    question: {
                        type: "string",
                        description: "what is the impact of the directive on companies"
                    },
                    answer: {
                        type: "string",
                        description: "answer to the question about the impact in three sentences"
                    },
                    question_sec: {
                        type: "string",
                        description: "How does the directive evolve"
                    },
                    answer_sec: {
                        type: "string",
                        description: "answer to the question about evolve in 3 complete sentences"
                    }
                    
                },
                "required": ["directive", "question", "answer", "question_sec","answer_sec"]
            }
        },
        {
            "name": "get_timeline",
            "description": "gives a deep dive of a given ESG directive in a question description format",
            "parameters": {
                "type": "object",
                "properties": {
                    timeline: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                date: {
                                    type: "string",
                                    description: "the date when the directive comes into force in this format DD:MM:YYYY"
                                },
                                characterristics: {
                                    type: "string",
                                    description: "the characteristics a company must have to be effected by the directive from the previous date on"
                                }
                            }
                        }
                    },
                    directive: {
                        type: "string",
                        description: "name of the directive"
                    },
                    question: {
                        type: "string",
                        description: "To which company does the directive apply"
                    },
                    answer: {
                        type: "string",
                        description: "answer to the question about the apply in bullet points"
                    }
                    
                },
                "required": ["directive", "question", "answer", "timeline","date", "characterristics"]
            }
        }
    ]
        

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer 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");
    myHeaders.append("Content-Type", "application/json");
    
    var listOfFunction = ['get_goals_and_requirements']
    for (let el of functions) {

        var raw = JSON.stringify({
          "model": "gpt-3.5-turbo-0613",
          "messages": message,
          "functions" : functions,
          "function_call": {"name": el.name},
          "frequency_penalty": 1,
          "temperature": 0.2,
          "max_tokens": 1000
        });
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
    
        fetch("https://api.openai.com/v1/chat/completions", requestOptions)
        .then(response => response.json())
        .then(result => {
            try {
                console.log(result)
                console.log(JSON.parse(result.choices[0].message.function_call.arguments));
                var answer = JSON.parse(result.choices[0].message.function_call.arguments);
                var elem = document.getElementsByClassName('rDeepDive')[0];
                if (result.choices[0].message.function_call.name != "get_timeline") {
                    var str = '<div class="dBlock">';
                    if (result.choices[0].message.function_call.name == 'get_current_backinfo') {
                        str += '<div class="dB-header">Background Info</div>'
                        str += '<div class="dB-question">' + answer.question + '</div><div class="dB-answer">' + answer.answer + '</div>'
                        document.getElementById('OverviewText').innerHTML = answer.answer;
                    } else {
                        if (result.choices[0].message.function_call.name == 'get_goals_and_requirements') { 
                            str += '<div class="dB-header">Goals and Requirements</div>'
                        } else if (result.choices[0].message.function_call.name == 'get_development') {
                            str += '<div class="dB-header">Development</div>'
                        }
                        var ansList = answer.answer_sec.split('- ');
                        console.log(ansList)
                        var extendstr = '';
                        if (ansList.length > 1) {
                            extendstr = '<ul>';
                            for (var i=1; i<ansList.length;i++) {
                                extendstr += '<li>' + ansList[i] + '</li>';
                            }
                            extendstr += '</ul>';
                        } else {
                            extendstr = answer.answer_sec
                        }
                        str += '<div class="dB-question">' + answer.question + '</div><div class="dB-answer">' + answer.answer + '</div><div class="dB-question">' + answer.question_sec + '</div><div class="dB-answer">' + extendstr + '</div>'
    
                    }
                    str += '</div>'
                    elem.innerHTML += str;
                } else {
                    elem.innerHTML += "not implemented get timeline";
                }
                loaded++;
                updatedLoader();
                
            } catch (error) {
                console.log(error)
                if (secondtime != undefined) {
                    loadDeepDive(true);
                } else {
                    console.log('second time failed with deepdive')
                    loaded++;
                    updatedLoader();
                }
                return;
            }
        })
    }


}
function loadDeadline(secondtime) {

    var message = [{
        "role": "user",
        "content": 'give details for CSRD.'
    }]

    var functions = [
        {
            "name": "get_deadline",
            "description": "gives details of a ESG directive",
            "parameters": {
                "type": "object",
                "properties": {
                    directive: {
                        type: "string",
                        description: "name of the directive"
                    },
                    deadline: {
                        type: "string",
                        description: "Date since when companies have to adhere to the directive in this format DD.MM.YYYY"
                    },
                    voluntary: {
                        type: "boolean",
                        description: "Is this directive voluntary"
                    },
                    risk: {
                        type: "string",
                        enum: ["low", "mid", "high"],
                        description: "determine the financial risk of not complying"
                    },
                },
                "required": ["directive", "deadline", "voluntary", "risk"]
            }
        }
    ]
        

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer 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");
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
      "model": "gpt-3.5-turbo-0613",
      "messages": message,
      "functions" : functions,
      "function_call": {"name": "get_deadline"},
      "frequency_penalty": 1,
      "temperature": 0.2,
      "max_tokens": 1000
    });
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://api.openai.com/v1/chat/completions", requestOptions)
    .then(response => response.json())
    .then(result => {
        try {
            console.log(result)
            console.log(JSON.parse(result.choices[0].message.function_call.arguments));
            var answer = JSON.parse(result.choices[0].message.function_call.arguments);
            document.getElementsByClassName('rQE-deadline')[0].children[1].innerHTML = answer.deadline;
            document.getElementsByClassName('rQE-deadline')[0].children[2].innerHTML = 'Deadline: ' + answer.deadline;
            if (!answer.voluntary) {
                document.getElementsByClassName('rRQE-voluntary')[0].style.display = 'none';
    
            }
            var elem = document.getElementsByClassName('rRQE-risk')[0];
            switch (answer.risk) {
                case "low":
                    elem.children[1].innerHTML = 'Low Risk';
                    elem.children[0].setAttribute('class', 'imggreen');
                    break;
                case "mid":
                    elem.children[1].innerHTML = 'Medium Risk';
                    elem.children[0].setAttribute('class', 'imgyellow');
                    break;
                case "high":
                    elem.children[1].innerHTML = 'High Risk';
                    elem.children[0].setAttribute('class', 'imgred');
                    break;
            
                default:
                    break;
            }
            loaded++;
            updatedLoader();
            
        } catch (error) {
            console.log(error)
            if (secondtime != undefined) {
                loadDeadline(true);
            } else {
                console.log('second time failed with deadline')
                loaded++;
                updatedLoader();
            }
            return;
        }
    })


}
async function loadForum(summary, question) {
    document.getElementsByClassName('mMainContent')[0].innerHTML += '<div id="LoadingView"><div class="loadingView"><p>Loading...</p></div></div>'
    document.getElementsByClassName('rFFH-Top')[0].innerHTML = '<p>' + summary + '</p><div>Thread</div>';
    var messageArea = document.getElementsByClassName('rF-MessageArea')[0];
    messageArea.innerHTML = '<div class="rFM-Message messageOwn"><img src="/IMG/Profile/profile3.jpg" alt=""><div class="rFMM-Content"><div class="rFMMC-Info"><div>Leo</div><p>11:24 Uhr</p></div><div class="rFMMC-text">' + summary + '</div><div class="rFMMC-text">' + question + '</div></div></div>';

    var message = [{
        "role": "user",
        "content": "create a fictive forum conversation given the following question '" + question + "' in a JSON array format. It should include al least 3 answers. One person can also write more than one answer directly after one another. it should contain the variable username and message"
    }]


    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer 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");
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": message,
      "frequency_penalty": 1,
      "temperature": 0
    });
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://api.openai.com/v1/chat/completions", requestOptions)
    .then(response => response.json())
    .then(result => {
        document.getElementById('LoadingView').remove();
        console.log(result)

        console.log(result.choices[0].message.content);
        var res = result.choices[0].message.content;
        res.split('\n').join('')
        // res = res.replace(/\\/g, '');
        res = res.replace(/“|”/g, '"');
        // res = res.replace("'", '"');
        res = res.split(",\n  }").join('}');
        res = res.split(",\n   }").join('}');
        res = res.split('"\n      "').join('","');
        res = res.split("```").join('');
        console.log(res);
        var resobj = JSON.parse(res);
        var elem = document.getElementsByName('ThreadList')[0];
        var count = 0;
        for (let obj of resobj) {
            let randomH = Math.floor(Math.random() * 24);
            var randomM = Math.floor(Math.random() * 60);
            if (randomM < 10) {
                randomM = '0' + randomM;
            }
            let randomHeart = Math.floor(Math.random() * 60);
            count++;
            var message = '';
            console.log(typeof obj.message)
            if (typeof obj.message === "string") {
                message = '<div class="rFMMC-text">' + obj.message + '</div>'
            } else {
                for (let ele of obj.message) {
                    message += '<div class="rFMMC-text">' + ele + '</div>';
                }
            }
            messageArea.innerHTML += '<div class="rFM-Message"><img src="/IMG' + issuer[count].profile + '" alt=""><div class="rFMM-Content"><div class="rFMMC-Info"><div>' + obj.username + '</div><p>' + randomH + ':' + randomM + ' Uhr</p></div>' + message + '<div class="rFMMC-sub"><div class="rFMMC-like" onclick="likeMessage(this)"><img src="/IMG/heart.fill.png" alt="" class="rFMMCL-heart"><p>' + randomHeart + '</p></div><div class="rFMMC-solved"><p>Mark as solved</p></div></div></div></div>'
        }
        // animate to show
        var el = document.getElementsByName('LieferkettenThread')[0];
        el.style.display = 'flex';
        // await sleep(10);
        el.classList.toggle('tab-to-right', false);
        console.log(JSON.parse(res));
        // messagehist.push(result.choices[0].message);
    })

}

function loadAll() {
    var fromstorage = JSON.parse(localStorage.getItem('loadedsites'));
    if (fromstorage != undefined) {
        loadedsites = fromstorage;
        for (let el of loadedsites) {
            if (el.directive == 'CSRD') {
                document.getElementsByClassName('mMainContent')[0].innerHTML = el.site;
                numchecked = el.numchecked;
                numtotal = el.numtotal;
            }
        }
        console.log("%cDirective has already been loaded", "color: #7D9177; font-size: 20px;");
        return;
    }
    loadThreads();
    loadUpdates();
    loadChecklist();
    loadDeadline();
    loadDeepDive();
    loadRisks();
}

function updatedLoader() {
    document.getElementById('LoadingBar').style.width = Math.round(loaded/allelements * 100) + '%';
    if (loaded/allelements == 1) {
        console.log("%cLoaded all", "color: blue; font-size: 20px;");
        document.getElementsByClassName('rLoading')[0].classList.toggle('tabActive', false);
        loadedsites.push({
            directive: "CSRD",
            numchecked: numchecked,
            numtotal: numtotal,
            site: document.getElementsByClassName('mMainContent')[0].innerHTML
        })
        localStorage.setItem('loadedsites', JSON.stringify(loadedsites))
    }
}


function loadOverviewChecklist(progress) {
    var stroke_width = 8
    var width = 120
    var heigth = 120
    var strokeColor = '#7D9177'
    var text = progress + '%'
    let angle = (progress / 100) * (2*Math.PI);
    let radius = (width - 2*stroke_width) /2;
    var x_value = Math.round(radius * Math.sin(angle) * 100) / 100 + radius + stroke_width;
    let y_value = Math.round(radius * Math.cos(angle) * 100) * -1 / 100 + radius + stroke_width;
    if (progress == 100) {
        x_value -= 0.001
    }
    var arc = 0;
    var reverse = 0;
    if (progress > 50) {
        arc = 1;
        reverse = 1;
    } else {
        arc = 0;
        reverse = 1;
    }
    
    
    
    var centerElem = '<image href="./IMG/list.bullet.clipboard.png" x="' + (width/2 - width/4) + '" y="' + (heigth/2 - heigth/4) + '" height="' + (heigth/2) + '"/>'
    var content = '<svg height="' + heigth + '" width="' + width + '"><path fill="none" stroke="' + strokeColor + '" stroke-width="' + stroke_width + '" d="M' + (width/2) + ',' + stroke_width + ' A' + radius + ',' + radius + ' 0 ' + arc + ',' + reverse + ' ' + x_value + ',' + y_value + '" /><g stroke="blue" stroke-width="0" fill="' + strokeColor + '"><circle cx="' + (width/2) + '" cy="' + stroke_width + '" r="' + (stroke_width/2) + '" /><circle cx="' + x_value + '" cy="' + y_value + '" r="' + (stroke_width/2) + '" /></g>' + centerElem + '</svg>'
    document.getElementById('CircCheck').innerHTML += '<div class="circ-elem">' + content + '<p style="color: ' + strokeColor + '">' + text + ' solved</p></div>'

}

// loadOverviewChecklist(40);
