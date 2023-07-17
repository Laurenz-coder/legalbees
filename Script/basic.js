function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * send chat request to openai
 * @param {String} question 
 * @returns 
 */
const fetchRequest = async (question) => 
	await (await fetch('/.netlify/functions/chatbot?question=' + question)).json();



var messagehist = [];
/**
 * sends message to openai, waits for answer and displays answer as well as message
 */
async function sendMessage() {
    var input = document.getElementById('ChatInpuwe');
    let text = document.getElementById('ChatInpuwe').innerText;
    var newMessage = document.createElement('div');
    newMessage.innerHTML = text;
    newMessage.className = 'chatClientMessage';
    var chatbox = document.getElementById('ChatArea')
    chatbox.insertBefore(newMessage, chatbox.children[chatbox.children.length - 1]);
    let widthEl = newMessage.getBoundingClientRect().width - 10;
    newMessage.classList.toggle('chatSent', true)
    chatbox.scrollTo(0, chatbox.scrollHeight)
    var message = document.getElementsByClassName('chatSent')[0];
    var dist = input.getBoundingClientRect().top - message.getBoundingClientRect().top;
    document.getElementById('ChatInpuwe').innerHTML = '';
    await sleep(10);
    document.getElementsByClassName('chatSent')[0].setAttribute('style', 'transform: translateY(' + dist + 'px);');
    await sleep(10);
    document.getElementsByClassName('chatSent')[0].removeAttribute('style');
    document.getElementsByClassName('chatSent')[0].setAttribute('style', 'width: ' + widthEl + 'px');
    lastElem = document.getElementsByClassName('chatClientMessage').length - 1;
    document.getElementsByClassName('chatClientMessage')[lastElem].classList.toggle('chatSent', false);
    messagehist.push({
        "role": "user",
        "content": text
    })

    await sleep(400);

    // add assistant answer with loading bubbles
    var answer = document.createElement('div');
    answer.className = 'cBC-Bot answerSent';
    var answerChild = document.createElement('div');
    answerChild.appendChild(document.createElement('img'));
    answerChild.className = 'chatBotImage';
    var answerBot = document.createElement('div');
    answerBot.className = 'chatBotMessage';
    answerBot.innerHTML = '<div class="dot-pulse"></div>';
    answer.appendChild(answerChild);
    answer.appendChild(answerBot);
    chatbox.insertBefore(answer, chatbox.children[chatbox.children.length - 1]);
    await sleep(100);
    answer.classList.toggle('answerSent', false);

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer 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");
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": messagehist,
      "frequency_penalty": 1
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
        answerBot.innerHTML = result.choices[0].message.content;
        messagehist.push(result.choices[0].message);
    })


    return;
    fetchRequest(text).then(data => {
          console.log(data) 
          var answer = document.createElement('div');
          answer.className = 'cBC-Bot answerSent';
          var answerChild = document.createElement('div');
          answerChild.appendChild(document.createElement('img'));
          answerChild.className = 'chatBotImage';
          var answerBot = document.createElement('div');
          answerBot.className = 'chatBotMessage';
          answerBot.innerHTML = data.message;
          answer.appendChild(answerChild);
          answer.appendChild(answerBot);
          chatbox.insertBefore(answer, chatbox.children[chatbox.children.length - 1]);
          // await sleep(100);
          answer.classList.toggle('answerSent', false);
          console.log(answer)
          
      });
    

}

/**
 * removes or adds placeholder of chatbox
 * @param {String} focus whether user clicks in or out of text field
 * @param {HTMLElement} elem self reference
 */
async function clearPlaceholder(focus, elem) {
    var placeholder = 'Ask us anything..'
    if (focus == 'lost') {
        if (elem.innerText == '') {
            for (var i=0; i<placeholder.length;i++) {
                elem.innerHTML += placeholder[i];
                await sleep(20);
            }
        }
    } else {
        if (elem.innerText == placeholder) {
            elem.innerHTML = '';
        }
        
    }
}

function toggleChatBox() {
    document.getElementsByClassName('chatBoxHous')[0].classList.toggle('chatClosed')
}

function setSidebar() {
    var parent = document.getElementsByClassName('mS-tabsList')[0];
    if (window.location.href.includes("dashboard")) {
        console.log("dashboard")
        parent.innerHTML = '<a class="mST-element mST-element-active" href="/dashboard.html"><img src="/IMG/dashboard.png" alt=""><p>Dashboard</p></a>';
    } else {
        parent.innerHTML = '<a class="mST-element" href="/dashboard.html"><img src="/IMG/dashboard.png" alt=""><p>Dashboard</p></a>';
    }
    if (localStorage.getItem('loadedsites') != undefined) {
        loadedsites = JSON.parse(localStorage.getItem('loadedsites'))
        console.log('hey')
    }
    for (let el of loadedsites) {
        var dir = el.directive.split(' ').join('_').toLowerCase();
        parent.innerHTML += '<a class="mST-element" href="/pillarnew.html?directive=' + dir + '"><img src="' + el.img + '" alt=""><p>' + el.shortname + '</p></a>'
    }
    parent.innerHTML += '<div class="mST-element"><img src="/IMG/bell.png" alt=""><p>Notifications</p></div>'
}

setSidebar()