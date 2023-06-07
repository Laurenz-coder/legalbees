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
async function openThread(reference) {
    var el = document.getElementsByName(reference)[0];
    el.style.display = 'flex';
    await sleep(10);
    el.classList.toggle('tab-to-right', false);

}

function checkCheckBox(identifier) {
    var list = document.getElementsByName(identifier);
    var total = 0;
    var clicked = 0;
    for (let el of list) {
        if (el.checked == true) {
            clicked++;
        }
        total++;
    }
    perc = Math.round(clicked / total * 100)
    document.getElementById('Check' + identifier + 'Bar').style.width = perc + '%';
    document.getElementById('Check' + identifier + 'Number').innerHTML = perc + '%';
}