// Global 
var searchRequest = new XMLHttpRequest();

// Search and Data Functions
var searchJSONP = function(query){
  var scriptTag = document.createElement('script');
  var searchQuery = "https://api.twitch.tv/kraken/search/streams?q=" + query + "&callback=buildResults";
  scriptTag.setAttribute("src", searchQuery);
  document.getElementById('searchInput').value = ''
  document.getElementsByTagName("head")[0].appendChild(scriptTag);
  document.getElementsByTagName("head")[0].removeChild(scriptTag);
};

var buildResults = function(json){
  console.log('Streams', json);
  var channel = [];
  // Parse each channel and create an object with desired properties
  eachResults(json.streams, function(stream){
    var channelObj = {};
    channelObj.gameName = stream.channel.game;
    channelObj.streamName = stream.channel.status;
    channelObj.viewers = stream.viewers;
    channelObj.user = stream.channel.name;
    channelObj.previewImg = stream.preview.medium;
    channelContents = "<div id='stream-contents'><img id='stream-image' src='"
     + channelObj.previewImg + " '><span id='stream-name'>"
     + channelObj.streamName + "</span></br><span id='stream-game'>"
     + channelObj.gameName + "</span> - <span id='stream-viewers'>"
     + channelObj.viewers + " viewers</span><br/><span id='stream-desc'>"
     + channelObj.user + "</span></div>";
    channel.push(channelContents);
  });
    channelCount = "<span id='stream-count'>Total results:" + json._total + "</span>";
    // REFACTOR: add count and result in one operation to container div
    document.getElementById('countContainer').innerHTML = channelCount;
    document.getElementById('paginationContainer').innerHTML = '< 1 out of 10 >'
    document.getElementById('resultContainer').innerHTML = channel.join('');
};

var createElements = function(channel){
  var channelElement = document.createElement('div');
  channelElement.appendChild(channelContents)
}

// Helper Functions
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

