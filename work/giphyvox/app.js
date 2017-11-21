// giphy vox by lionel ringenbach @ ucodia.space

(function() {
  const baseSearchUrl = "https://api.giphy.com/v1/gifs/search?api_key=O6c8raeYgoJuSnAU9oU9Cw19G3UZp0cC&limit=1&offset=0&rating=G&lang=en&q=";
  const minCondifence = 0.5; 
  const noSupportSearch = 'not supported';
  const displayElement = document.getElementById('display');
  const searchElement = document.getElementById('search');
  
  function handleMic(e) {
    var result = e.results[e.results.length-1][0];
    console.log(result.transcript + " (" + result.confidence + ")");
    if (result.confidence < minCondifence) return;
  
    searchElement.value = result.transcript;
    search(result.transcript);
  }
  
  function search(searchString) {
    var requestUrl = baseSearchUrl + searchString;

    fetch(requestUrl)
    .then(
      function(response) {
        if (response.status === 200) {
          response.json().then(function(json) {
            if (json.data.length === 0) return;
            displayElement.src = json.data[0].images.original.url;
          });
        }
      }
    );
  }

  // detect if browser supports speech recognition
  if('webkitSpeechRecognitiondas' in window) {
    var mic = new webkitSpeechRecognition();
    mic.continuous = true;
    mic.interimResults = true;
    mic.onresult = handleMic;
    mic.start();
  }
  else {
    alert('This app uses speech recognition which is not currently supported by your browser 🙃');
    searchElement.value = noSupportSearch;
    search(noSupportSearch);
  }
})()