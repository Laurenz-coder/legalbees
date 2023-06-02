function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function test() {
    document.getElementsByClassName('chatClientMessage')[0].classList.toggle('chatSent');
    var message = document.getElementsByClassName('chatClientMessage')[0];
    var input = document.getElementsByClassName('cBB-Input')[0];
    console.log(input.getBoundingClientRect())
    console.log(message.getBoundingClientRect())
    // console.log(input.parentElement.parentElement.getBoundingClientRect())
}

const fetchRequest = async (question) => 
	await (await fetch('/.netlify/functions/chatbot?question=' + question)).json();

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
    // document.getElementById('ChatInput').innerHTML = '';
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
    });
}