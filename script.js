function httpGetAsync(url, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

function changeLangStats(response) {
    langVolumes = JSON.parse(response);
    
    langStatsList = document.getElementsByClassName("repository-lang-stats-numbers");

    if (langStatsList.length == 1) {
        langStats = langStatsList[0];
        liNodes = langStats.getElementsByTagName('li');
        for (i=0; i<liNodes.length; i+=1) {
            aNode = liNodes[i].getElementsByTagName('a')[0];
            
            langSpan = aNode.getElementsByClassName('lang')[0];
            lang = langSpan.innerHTML;
            
            percentSpan = aNode.getElementsByClassName('percent')[0];
            percent = percentSpan.innerHTML;
            
            langVolume = langVolumes[lang];
            if (langVolume > 1000000) {
                volumeText = Math.round(langVolumes[lang]/100000) / 10 + 'MB';
            } else if (langVolume > 1000) {
                volumeText = Math.round(langVolumes[lang]/100) / 10 + 'kB';
            } else {
                volumeText = langVolumes[lang] + 'B';
            }
            
            newText = percent + ', ' + volumeText;
            percentSpan.innerHTML = newText;
        }
    }

}

urlRegExp = new RegExp('^https://github.com/([^/]*)/([^/]*)$', '');
match = urlRegExp.exec(window.location.href);
if (match) {
    author = match[1];
    repo = match[2];

    requestUrl = 'https://api.github.com/repos/' + author + '/' + repo + '/languages';
    httpGetAsync(requestUrl, changeLangStats);
}
