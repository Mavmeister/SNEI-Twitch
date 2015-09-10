// Global 
var searchRequest = new XMLHttpRequest();

// Search and Data Functions
var searchJSONP = function(){
  var scriptTag = document.createElement('script');
  scriptTag.setAttribute("src", "https://api.twitch.tv/kraken/search/streams?q=Rust&callback=buildResults");
  document.getElementsByTagName("head")[0].appendChild(scriptTag);
  document.getElementsByTagName("head")[0].removeChild(scriptTag);
};

var buildResults = function(json){
  console.log('Streams', json);
  console.log('Results Count', json._total);
  console.log('Links', json._links);
  var channel = [];
  eachResults(json.streams, function(stream){
    console.log('Stream', stream)
    var singleStream = {};
    singleStream.gameName = stream.channel.game;
    singleStream.streamName = stream.channel.status;
    singleStream.viewers = stream.viewers;
    singleStream.user = stream.channel.name;
    singleStream.previewImg = stream.preview.small;
    channel.push(singleStream);
  });
    document.getElementById('resultBox').appendChild(channel)
};

var createElements = function(channel){
  var channelElement = document.createElement('div');
  channelElement.appendChild(
    <span id='stream-name'>channel.streamName</span><br/>
    <span id='game-name'>'channel.gameName' + 'channel.viewers' + viewers</span>
    <span id='game-desc'>'channel.user' playing! </span>
    )
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

