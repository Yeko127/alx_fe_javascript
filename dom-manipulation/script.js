document.addEventListener("DOMContentLoaded", function (){
    let quote = [
{text: "The mind is everything. What you think you become.", category: "Inspirational"},
{text: "Life is really simple, but we insist on making it complicated", category: "Life"},
{text: "Love is a friendship set to music", category: "Love"}
];

let currentFilter = "all";

//loads content from the local storage
const savedQuotes = localStorage.getItem('quotes');
if (savedQuotes) {
    quote = [...quote, ...JSON.parse(savedQuotes)];
}

currentFilter = localStorage.getItem("categoryFilter") || "all";

// loads last viewed quote index from session storage
const lastQuoteIndex = sessionStorage.getItem('lastQuoteIndex');

if (lastQuoteIndex !==null) {
    showQuoteByIndex(parseInt(lastQuoteIndex));
} else {
    showRandomQuote();
}

//populate categories dynamically 
function populateCategories() {
    const filterSelect = document.getElementById("categoryFilter");
    if (!filterSelect) return;

    const categories = [...new Set(quote.map(q => q.category))];

    filterSelect.innerHTML = '<option value = "all"> All Categories </option>';
    
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        filterSelect.appendChild(option);
    });
    filterSelect.value = currentFilter;
}

//filter and show quotes
function filterQuotes() {
    const filterSelect = document.getElementById("categoryFilter");
    if (!filterSelect) return;

    currentFilter = filterSelect.value;
    localStorage.setItem("categoryFilter", currentFilter);

    showRandomQuote();
}
//displays a random quote from array
function showRandomQuote() {
    let filteredQuotes = quote;

    if (currentFilter !== "all") {
        filteredQuotes = quote.filter(q => q.category === currentFilter);
    }
    if (filteredQuotes.length === 0) {
        document.getElementById("quoteDisplay").innerHTML = `<em>No quotes found for "${currentFilter}" </em>`;
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const realIndex = quote.indexOf(filteredQuotes[randomIndex]);

    showQuoteByIndex(realIndex);
}
// displays quote by index
function showQuoteByIndex (index) {
    const quoteDisplay = document.getElementById("quoteDisplay");
   
    if (!quoteDisplay || index >= quote.length) return;

    const randomQuote = quote [index];
    quoteDisplay.innerHTML = `"${randomQuote.text}" - <strong> ${randomQuote.category} </strong>`;
    
    sessionStorage.setItem('lastQuoteIndex', index)
}

//attach event listener to button

const newQuoteBtn = document.getElementById("newQuote");
if (newQuoteBtn) newQuoteBtn.addEventListener("click", showRandomQuote);

const filterSelect = document.getElementById("categoryFilter")
if (filterSelect) filterSelect.addEventListener("change", filterQuotes);

//save only added quotes
function savedQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quote.slice(3)));
    populateCategories();
}

//export JSON
const exportBtn = document.getElementById("exportQuotes");
if (exportBtn) {
    exportBtn.addEventListener("click", function() {
        const blob = new Blob([JSON.stringify(quote, null, 2)], {
            type:'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "quotes,json";
        a.click();
        URL.revokeObjectURL(url);
});

//import JSON with validation
const importFile = document.getElementById("importFile");
if (importFile) {
    importFile.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedQuotes = JSON.parse(e.target.result);
                if (!Array.isArray(importedQuotes)) {
                    alert (Invalid JSON FormData. Expacted an Array.);
                    return;

                    quote.push(...importedQuotes);
                    savedQuotes();
                    showRandomQuote();
                    alert('Quotes imported successfully!');
                    event.target.value = '';
                } catch (error) {
                    alert('Invalid JSON file.');
                    
                }
        };
    reader.readAsText(file);
});


//creates the add quote form dynamically
function createAddQuoteForm() {
    const container = document.getElementById("addQuoteContainer");
    if (!container) return; 

    container.innerHTML = `
    <input type="text" id="newQuoteText" placeholder="Enter a new quote" />
    <input type="text" id="newQuoteCategory" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;

    //add quote button
    const addBtn = document.createElement("addQuotebtn");
    if (addBtn) {
        addBtn.addEventListener("click", addQuote);
    }
  }
    container.appendChild(textInput);
    container.appendChild(categoryInput);
    container.appendChild(addButton);
}



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
    saveQuotes();
    textInput.value = "";
    categoryInput.value = "";

    alert ("Quote added successfully!");

    showRandomQuote();
}
populateCategories();
createAddQuoteForm();
 });