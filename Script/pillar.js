function getScrollProgress() {
    const winScroll = document.getElementById("ScrollContainer").scrollTop + 1;
    const winHeight = document.getElementById("ScrollContainer").scrollHeight - document.getElementById("ScrollContainer").clientHeight;
    const scrolled = (winScroll / winHeight) * 100;
    document.getElementById("ScrollIndicator").style.height = scrolled + "%";
  }

//  document.getElementById("ScrollContainer").onscroll = function() {getScrollProgress()};