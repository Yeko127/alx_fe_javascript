document.addEventListener("DOMContentLoaded", function (){
    const quote = [
{text: "The mind is everything. What you think you become.", category: "Inspirational"},
{text: "Life is really simple, but we insist on making it comlicated", category: "Life"},
{text: "Love is a friendship set to music", category: "Love"}
];

//displays a random quote from array
function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    if (!quoteDisplay) return console.error("No element with id 'quoteDisplay' found");

    const randomIndex = Math.floor(Math.random() * quote.length);
    const randomQuote = quote[randomIndex];

    quoteDisplay.innerHTML = `"${randomQuote.text}" - <strong>${randomQuote.category}</strong>`;
}
//attach event listener to button

const newQuoteBtn = document.getElementById("new quote");
if (newQuoteBtn) {
    newQuoteBtn.addEventListener("click", showRandomQuote);
} else {
    console.error("No elemnt with id'newQuote' found");
}


showRandomQuote();

//creates the add quote form dynamically
function createAddQuoteForm() {
    const container = document.getElementById("addQuoteContainer");
    if (!container) return console.error("No elemnt with id 'addQuoteContainer' found.")
  
    container.innerHTML = `
    <input type="text" id="newQuoteText" placeholder="Enter a new quote" />
    <input type="text" id="newQuoteCategory" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;

    //add quote button
    const addButton = document.createElement("button");
    addButton.textContent = "Add Quote";

    addButton.addEventListener("click", function (){
        addQuote();
    });
    container.appendChild(textInput);
    container.appendChild(categoryInput);
    container.appendChild(addButton);
}

 createAddQuoteForm();

 //add a new quote dynamically
 function addQuote() {
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");

    if (!textInput || !categoryInput) return console.error("Add-quote inputs not found.");
    
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (text ==="" || category ===""){
        alert("Both fields are required");
        return;
    }

    quote.push({text: text, category: category });
//clear inputs
    textInput.value = "";
    categoryInput.value = "";

    alert ("Quote added successfully!");

    showRandomQuote();
}
 });