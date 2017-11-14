// giphy vox by lionel ringenbach @ ucodia.space

const baseSearchUrl = "https://api.giphy.com/v1/gifs/search?api_key=O6c8raeYgoJuSnAU9oU9Cw19G3UZp0cC&limit=1&offset=0&rating=G&lang=en&q=";
var minCondifence = 0.5;

var mic = new p5.SpeechRec();
mic.continuous = true;
mic.interimResults = true;
mic.onResult = handleMic;
mic.start();

var $display = $('#display');
var $search = $('#search');
$search.change(handleSearch);

function handleMic() {
  console.log(mic.resultString + " (" + mic.resultConfidence + ")");
  if (mic.resultConfidence < minCondifence) return;

  $search.val(mic.resultString);
  handleSearch();
}

function handleSearch() {
  $.get(baseSearchUrl + mic.resultString, function (response) {

    if (response.data.length === 0) return;

    $display.attr("src", response.data[0].images.original.url);
  })
}