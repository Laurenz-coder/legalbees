// remove header from sidebar if collapsed

const collapsedSide = window.matchMedia('(max-width: 1200px)');
const sidebar = document.querySelector(".mS-tabsList");

function handleMediaQueryChange(mediaQuery) {
  if (mediaQuery.matches) {
    sidebar.classList.add("close");
  } else {
    sidebar.classList.remove("close");
  }
}

collapsedSide.addListener(handleMediaQueryChange);

// Initial check
handleMediaQueryChange(collapsedSide);
