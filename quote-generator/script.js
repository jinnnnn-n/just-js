const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

let countRequest= 0;

function showLoadingSpinner(){
  // show our loader and hide our quoteContainer when loading
  loader.hidden = false;
  quoteContainer.hidden = true;
}

function removeLoadingSpinner() {
  if (!loader.hidden){
    quoteContainer.hidden = false
    loader.hidden = true
  }
}

// Get Quote from API
async function getQuote() {
  countRequest+=1;
  console.log(countRequest)
  showLoadingSpinner()
  // We need to use a Proxy URL to make our API call in order to avoid CORS problem
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
  const apiUrl = "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json";
  try {
    const response = await fetch(proxyUrl + apiUrl);
    const data = await response.json();
    // Check if Author field is blank and replace it with 'Unknown'
    if (data.quoteAuthor===''){
      authorText.innerText = 'Unknown';
    }else{
      authorText.innerText = data.quoteAuthor;
    }
    // Dynamically reduce font size for long quotes
    if(data.quoteText.length>120){
      quoteText.classList.add('long-quote');
    }else{
      quoteText.classList.remove('long-quote');
    }
    quoteText.innerText = data.quoteText;
    removeLoadingSpinner()
  } catch (error) {
    countRequest+=1
    if(countRequest>5){ 
      removeLoadingSpinner()
      console.log("failed to get quotes")
      quoteText.innerText = "Failed to get quotes";
    }else{
      getQuote();
    }
  }
}

// Tweet Quote
function tweetQuote(){
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`
  window.open(twitterUrl, '_blank');
}

// Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);

// On Load
getQuote();