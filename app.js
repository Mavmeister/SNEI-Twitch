// -- GLOBAL --
var currentPage = 1; 

// -- HELPER FUNCTIONS --
var clearResults = function(){
    document.getElementById('count-container').innerHTML = '';
    document.getElementById('page-container').innerHTML = '';
    document.getElementById('result-container').innerHTML = '';
};

// Handles listening for ENTER keypress to search
var handleKey = function(event, value){
  if (event.keyCode === 13){
    twitch(value)
  }
  return;
};

// -- SEARCH AND DATA FUNCTIONS --

var twitchSearch = function(query){
  var results;
    if (!query){
      clearResults();
      return document.getElementById('result-container').innerHTML = "<span id='no-results'> Please Enter a Value to Search </span>";
    }
  var twitchRequest = new XMLHttpRequest();
  var fullQuery = "https://api.twitch.tv/kraken/search/streams?q=" + query;
  twitchRequest.open("GET", fullQuery);
  twitchRequest.onload = function() {
    if (twitchRequest.readyState === 4 && twitchRequest.status === 200){
      results = JSON.parse(twitchRequest.responseText);
    } else {
      console.error(twitchRequest.statusText)
    }
    buildResults(results)  
  };
  twitchRequest.send();
  };

// Navigation function for querying next/prev search links
var navigatePage = function(link, direction){
  if (link === 'null'){
    return;
  }
  direction === 'next' ? currentPage++ : currentPage--;
  var scriptTag = document.createElement('script');
  var searchQuery = link + "&callback=buildResults";
  scriptTag.setAttribute("src", searchQuery);
  document.getElementsByTagName("head")[0].appendChild(scriptTag);
  document.getElementsByTagName("head")[0].removeChild(scriptTag);
};


// Builds all results on the page after a successful search
var buildResults = function(json){
  // Clear results/page count to avoid remnants of past search when No Results appear
  clearResults()
  if (json.streams.length === 0){
    return document.getElementById('result-container').innerHTML = "<span id='no-results'> No Search Results Available </span>";
  }
  var channels = [];
  var nextPageLink =  json._links.next;
  var prevPageLink =  json._links.prev || null;
  var maxPage = Math.ceil(json._total / 10);

  // Parse each channel and create an object with desired properties
  json.streams.forEach(function(stream){
    channelContents = "<a id='contents' target='_blank' href="
     + stream.channel.url + "><div id='stream-contents'><img id='stream-image' src='"
     + stream.preview.medium + " '><span id='stream-name'>"
     + stream.channel.status + "</span></br><span id='stream-game'>"
     + stream.channel.game + "</span> - <span id='stream-viewers'>"
     + stream.viewers + " viewers</span><br/><span id='stream-desc'> Streamed By: "
     + stream.channel.name+ "</span></div>";
    channels.push(channelContents);
  });
  // Adds dynamic data to results page (results, count, pagination)
    channelCount = "<span id='stream-count'>Total results: " + json._total + "</span>";
    nextPage = "<span id='next-page' onclick=navigatePage('" + nextPageLink + "','next')> NEXT " + maxPage + ' &#8702;' + " </span>";
    prevPage = "<span id='prev-page' onclick=navigatePage('" + prevPageLink + "','prev')>" + '&#8701; ' + 1 + " PREV </span>";
    document.getElementById('count-container').innerHTML = channelCount;
    document.getElementById('page-container').innerHTML = prevPage + "<span id='current-page'>"+currentPage+"</span>" + nextPage;
    document.getElementById('result-container').innerHTML = channels.join('');
};
