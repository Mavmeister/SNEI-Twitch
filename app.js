// GLOBAL 
var searchRequest = new XMLHttpRequest();

// SEARCH AND DATA FUNCTIONS
var searchJSONP = function(query){
  var scriptTag = document.createElement('script');
  // Creating a JSONP callback for CORS workaround
  var searchQuery = "https://api.twitch.tv/kraken/search/streams?q=" + query + "&callback=buildResults";
  scriptTag.setAttribute("src", searchQuery);
  document.getElementById('search-input').value = ''
  // Adding a <script> with URL to retrieve JSON data and then removing it from DOM
  document.getElementsByTagName("head")[0].appendChild(scriptTag);
  document.getElementsByTagName("head")[0].removeChild(scriptTag);
};

var navigatePage = function(link){
  if (!link){
    return;
  }
  var scriptTag = document.createElement('script');
  var searchQuery = link + "&callback=buildResults";
  scriptTag.setAttribute("src", searchQuery);
  document.getElementsByTagName("head")[0].appendChild(scriptTag);
  document.getElementsByTagName("head")[0].removeChild(scriptTag);
}

var buildResults = function(json){
  if (json.streams.length === 0){
    return document.getElementById('result-container').innerHTML = "No Search Results Available";
  }
  console.log('Streams', json);
  // Parse each channel and create an object with desired properties
  var channels = [];
  var nextPageLink =  json._links.next;
  var prevPageLink =  json._links.prev  || null;
  var currentPage = 1; 
  var maxPage = Math.ceil(json._total / 10);

  json.streams.forEach(function(stream){
    channelContents = "<a id='tag' href="
     + stream.channel.url + "><div id='stream-contents'><img id='stream-image' src='"
     + stream.preview.medium + " '><span id='stream-name'>"
     + stream.channel.status + "</span></br><span id='stream-game'>"
     + stream.channel.game + "</span> - <span id='stream-viewers'>"
     + stream.viewers + " viewers</span><br/><span id='stream-desc'>"
     + stream.channel.name+ "</span></div>";
    channels.push(channelContents);
  });
    channelCount = "<span id='stream-count'>Total results: " + json._total + "</span>";
    nextPage = "<span id='next-page' onclick=navigatePage('" + nextPageLink + "')> NEXT " + maxPage + " </span>";
    prevPage = "<span id='prev-page' onclick=navigatePage('" + prevPageLink + "')>" + currentPage + " PREV </span>";

    // REFACTOR: add count and result in one operation to container div
    document.getElementById('count-container').innerHTML = channelCount;
    document.getElementById('page-container').innerHTML = prevPage + nextPage;
    document.getElementById('result-container').innerHTML = channels.join('');
};
