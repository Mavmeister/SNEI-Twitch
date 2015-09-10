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

var buildResults = function(json){
  if (json.streams.length === 0){
    return document.getElementById('result-container').innerHTML = "No Search Results Available"
  }
  console.log('Streams', json);
  var channels = [];
  // Parse each channel and create an object with desired properties
  eachResults(json.streams, function(stream){
    channelContents = "<div id='stream-contents'><img id='stream-image' src='"
     + stream.preview.medium + " '><span id='stream-name'>"
     + stream.channel.status + "</span></br><span id='stream-game'>"
     + stream.channel.game + "</span> - <span id='stream-viewers'>"
     + stream.viewers + " viewers</span><br/><span id='stream-desc'>"
     + stream.channel.name+ "</span></div>";
    channels.push(channelContents);
  });
    channelCount = "<span id='stream-count'>Total results: " + (json._total - 1) + "</span>";
    // REFACTOR: add count and result in one operation to container div
    document.getElementById('count-container').innerHTML = channelCount;
    document.getElementById('page-container').innerHTML = '< 1 out of 10 >'
    document.getElementById('result-container').innerHTML = channels.join('');
};

var nextPage = function(channel){
  var channelElement = document.createElement('div');
  channelElement.appendChild(channelContents)
}

// HELPER FUNCTIONS
var eachResults = function(collection, iterator){
  if(Array.isArray(collection)){
    for (var i = 0; i < collection.length; i++){
      iterator(collection[i], i, collection);
    };  
  } else {
    for (var keys in collection){
      iterator(collection[i], keys, collection)
    };
  }
};

var mapResults = function(collection, iterator){
  var mapped = [];
  eachResults(collection, function(value){
    mapped.push(iterator(value));
  });
  return mapped;
};

