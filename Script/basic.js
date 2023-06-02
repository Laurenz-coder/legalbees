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

/**
 * sends message to openai, waits for answer and displays answer as well as message
 */
async function sendMessage() {
    var input = document.getElementsByClassName('cBB-Input')[0];
    let text = document.getElementById('ChatInput').innerText;
    var newMessage = document.createElement('div');
    newMessage.innerHTML = text;
    newMessage.className = 'chatClientMessage';
    var chatbox = document.getElementById('ChatArea')
    chatbox.insertBefore(newMessage, chatbox.children[chatbox.children.length - 1]);
    let widthEl = newMessage.getBoundingClientRect().width - 10;
    console.log(newMessage.offsetWidth)
    newMessage.classList.toggle('chatSent', true)
    chatbox.scrollTo(0, chatbox.scrollHeight)
    var message = document.getElementsByClassName('chatSent')[0];
    var dist = input.getBoundingClientRect().top - message.getBoundingClientRect().top;
    document.getElementById('ChatInput').innerHTML = '';
    console.log(dist)
    await sleep(10);
    document.getElementsByClassName('chatSent')[0].setAttribute('style', 'transform: translateY(' + dist + 'px);');
    await sleep(10);
    document.getElementsByClassName('chatSent')[0].removeAttribute('style');
    document.getElementsByClassName('chatSent')[0].setAttribute('style', 'width: ' + widthEl + 'px');
    lastElem = document.getElementsByClassName('chatClientMessage').length - 1;
    document.getElementsByClassName('chatClientMessage')[lastElem].classList.toggle('chatSent', false);


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