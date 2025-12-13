document.addEventListener("DOMContentLoaded", function ()
    let quote = [
{text: "The mind is everything. What you think you become.", category: "Inspirational"},
{text: "Life is really simple, but we insist on making it complicated", category: "Life"},
{text: "Love is a friendship set to music", category: "Love"}
];

let selectedCategory = "all";
let syncInterval = null;
let serverQuotes = [];

//loads content from the local storage
const savedQuotes = localStorage.getItem('quotes');
if (savedQuotes) {
    quote = [...quote, ...JSON.parse(savedQuotes)];
}

selectedCategory = localStorage.getItem("categoryFilter") || "all";

//Initialize
populateCategories();
createAddQuoteForm();
startAutoSync();
showRandomQuote();

const API_BAse = 'https://jsonplaceholder.typicode.com/posts';

async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_Base {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        });
        const posts = await response.json();        

        serverQuotes = posts.slice(0, 10).map(post, index => ({
            id: post.id,
            text: post.title.substring(0, 100) + '...',
            category:['Inspirational', 'Motivation', 'Wisdom']
            [index % 3]
        }));

        showSyncStatus('Server quotes fetched', 'sucess');
        return serverQuotes;
    } catch (error) {
        showSyncStatus('Failed to fetch server quotes', 'warning');
        return[];
    }    
}
async function postQuotesToServer(quotes) {
    try {
        const response = await fetch (API_BAse, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quotes)
        });
        if (response.ok) {
            showSyncStatus("Quotes posted to server", "Success");
        } else {
            showSyncStatus("POST failed", "warning");
        }
    } catch (error) {
        showSyncStatus("POST error", "warning")
    }
}

async function syncQuotes() {
    const localAddedQuotes = quote.slice[3];

    await postQuotesToServer(localAddedQuotes);

    await fetchQuotesFromServer();

     const hasConflict =serverQuotes.length !== localAddedQuotes.length;

     if (hasConflict) {
        showConflictNotification();
        showSyncStatus(`Conflict: Server (${serverQuotes.length}) vs local(${localAddedQuotes.length})`, "warning");
        return false;
     }
     const newServerQuotes = serverQuotes.filter(sq =>
        !localAddedQuotes.some(1q => 1q.id === sq.id)
     );
if (newServerQuotes.length > 0) {
    quote.push (... newServerQuotes);
    savedQuotes();
    showRandomQuote();
    showSyncStatus(`Synced ${newServerQuotes.length} new quotes`, 'success')
    return true;
}
showSyncStatus ('Quote synced with server!', "success")
return true;

function startAutoSync () {
    syncInterval = setInterval (async () =>{
        await fetchServerQuotes();
        await syncQuotes();
    }, 30000); //sync every 30 seconds

    syncWithServer();
}

function stopAutoSync () {
    if (syncInterval) {
        clearInterval(syncInterval);
        syncInterval = null;
    }
}
//manual sync button
document.getElementById("syncNow").addEventListener("click", stopAutoSync, async () => {
    await syncQuotes();
    startAutoSync();
});

//force local data conflict resolution
document.getElementById("forceLocal").addEventListener("click", () => {
    localStorage.setItem('quotes', JSON.stringify(quote.slice(3)));
    hideConflictNotification();
});

function showSyncStatus (message, type = "info") {
    const statusDiv = document.getElementById("syncStatus");
    statusDiv.textContent = message;
    statusDiv.style.color = type === 'success'? '#28a745':type === 'warning' ? '#ffc107' : '#666';
}

function showConflictNotification() {
    const quoteDisplay = document.getElementById ("quoteDisplay");
    quoteDisplay.innerHTML += `
    <div style="margin -top:15px:padding10px;background:#fff3cd;border-radius:5px;font-size:14px;">
    <strong> Server Conflict Detected!</strong><br>
    server has ${serverQuotes.length} quotes, local has ${quote.slice(3).length}.
    <br><button id = "resolveServer" style ="margin-top:5px;padding5px
    10px;background:#007bff;color;white;border:none;border-radius:3px;cursor:pointer;">
    Accept Server Data </button>
    </div>
   `;
   document.getElementById("resolveServer").addEventListener("click", async () => {
    quote = [...quote.slice(0, 3), ...serverQuotes];
    savedQuotes();
    showRandomQuote();
    hideConflictNotification();
    showSyncStatus("Server data accepted", "success");
   });
}
function hideConflictNotification (){
    const conflictDiv = document.querySelector("#quoteDisplay div[style*'background:#fff3cd']");

    if (conflictDiv) conflictDiv.remove();
}
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
    filterSelect.value = selectedCategory;
}

//filter and show quotes
function filterQuotes() {
    const filterSelect = document.getElementById("categoryFilter");
    if (!filterSelect) return;

    currentFilter = filterSelect.value;
    localStorage.setItem("categoryFilter", selectedCategory);

    showRandomQuote();
}
//displays a random quote from array
function showRandomQuote() {
    let filteredQuotes = quote;

    if (currentFilter !== "all") {
        filteredQuotes = quote.filter(q => q.category === selectedCategory);
    }
    if (filteredQuotes.length === 0) {
        document.getElementById("quoteDisplay").innerHTML = `<em>No quotes found for "${selectedCategory}" </em>`;
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
    importFile.addEventListener("change", function (event) 
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

 });