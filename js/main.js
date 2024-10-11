const scrollButtons = document.querySelectorAll(".scroll-btn");

let poemArray = [];
let currentPoemIndex = 0;
let currentPoem;

document.getElementById("get-poem-btn").addEventListener('click', getPoems)

document.getElementById("scroll-left-btn").addEventListener("click", function() {poemScroll(-1)})
document.getElementById("scroll-right-btn").addEventListener("click", function() {poemScroll(1)})



function getPoems(){
  // Don't do anything if input is empty
  if (!document.querySelector("input").value) {
    return
  }

  // Reset the poetry container
  clearDOM()

  // Get url from db + input title
  const url = 'https://poetrydb.org/title/' + document.querySelector("input").value

  // Begin fetch
  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {

        poemArray = data; // Store all matching poems in poemArray
        currentPoemIndex = 0; // Start at the first poem

        updatePoemInDOM() // Add poem 1 to DOM

        if (poemArray.length == 1) {
          // If there's only one poem in the array, we don't need scroll buttons at all
          hideScrollButtons()
        } else {
          // Otherwise, add the scroll right button
          hideScrollButton("left");
          showScrollButton("right");
        }
      })
      .catch(err => {
          console.log(`error ${err}`)
          alert("No poems were found matching that title.")
      });
}

function poemScroll(direction) {

  try {
    // Increment/decrement currentPoemIndex
    currentPoemIndex += direction

    // Refresh the DOM using the current poem data
    updatePoemInDOM()


    // If we're at the first poem, hide the left scroll button
    if (currentPoemIndex == 0) {
      hideScrollButton("left");

      // If there's multiple poems, add the right button
      if (poemArray.length > 1) showScrollButton("right");
    } 
    else if (currentPoemIndex == poemArray.length - 1) {
      // If we're at the last poem, hide the right button and add the left button
      showScrollButton("left");
      hideScrollButton("right");
    } 
    else {
      // Otherwise, show both buttons
      showScrollButtons()
    }

  } catch (error) {
    console.log(error)
  }


  return
}

function clearDOM() {
  // Hide both scroll buttons
  hideScrollButtons()

  // Clear title, author, and lines
  document.getElementById("poem-title").innerText = "";
  document.getElementById("poem-author").innerText = "";
  document.getElementById("poem-lines").innerHTML = "";
}


function updatePoemInDOM() {
  // Refresh the poetry container
  clearDOM()

  // Get the current poem data based on the index
  currentPoem = poemArray[currentPoemIndex]

  // Set title and author in the DOM
  document.getElementById("poem-title").innerText = currentPoem.title;
  document.getElementById("poem-author").innerText = "by " + currentPoem.author;

  // Add each line to the DOM, with a break for empty lines
  for (let line of currentPoem.lines) {
    if (line.length) {
      document.getElementById("poem-lines").innerHTML += `<p class="poem-line">${line}</p>`
    } else {
      document.getElementById("poem-lines").innerHTML += `<p class="line-break">${line}</p>`
    }
  }
}

// Hide the scroll-btn given the side
function hideScrollButton(side) {
  scrollButtons.forEach((el) => {
    if (el.id == `scroll-${side}-btn`) {
      el.classList.add("hidden")
    }
  })
}

// Hide both scroll buttons at once
function hideScrollButtons() {
  hideScrollButton("left")
  hideScrollButton("right")
}

// Show the scroll-btn given the side
function showScrollButton(side) {
  scrollButtons.forEach((el) => {
    if (el.id == `scroll-${side}-btn`) {
      el.classList.remove("hidden")
    }
  })
}

// Show both scroll buttons at once
function showScrollButtons() {
  showScrollButton("left")
  showScrollButton("right")
}




hideScrollButtons()