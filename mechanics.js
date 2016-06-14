
var guteFrageURL    = "";


// Accepts a url and a callback function to run.
function requestCrossDomain( site, callback ) {
    // If no url was passed, exit.
    if ( !site ) {
        console.log('No site was passed.');
        return false;
    }
     
    // Take the provided url, and add it to a YQL query. Make sure you encode it!
    var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url=\'' + site + '\'') + '&format=xml&callback=?';

    // Request that YSQL string, and run a callback function.
    // Pass a defined function to prevent cache-busting.
    $.getJSON( yql, cbFunc );
    
    function cbFunc(data) {
    // If we have something to work with...
    if ( data.results[0] ) {
        // Strip out all script tags, for security reasons.
        // BE VERY CAREFUL. This helps, but we should do more. 
        data = data.results[0].replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        
        // If the user passed a callback, and it
        // is a function, call it, and send through the data var.
        if ( typeof callback === 'function') {
            callback(data);
        }
    }
    // Else, Maybe we requested a site that doesn't exist, and nothing returned.
    else throw new Error('Nothing returned from getJSON.');
    }
}

function extractBibTex (results) {
    
    // $('.container').html(results);
    // console.log(results);

    var tmpdiv = document.createElement( "div" );
    $(tmpdiv).html(results);
    $(tmpdiv).hide();
    $(".container").append(tmpdiv);
    // console.log(results);
    var question = $("div.Question");
    var author   = question.find($('a[class="Question-author"]'))[0].text;
    var time     = question.find(".Question-pubDate")[0].innerText;
    var timeParts= time.split(".");
    // needs to be a regular expression in order to replace EVERY occurence
    var title    = question.find(".Question-title")[0].innerText.trim().replace(/\n/g,"");
    var tags     = [];
    var tagElems = $("ul.Tags-tagList").find($('li'));
    tagElems.each(function( index ) {
      tags.push( $( this ).first().text().trim().replace(/\n/g,"") );
    });
    
    string = "@article{" +  author + timeParts[2] + "\n"
    string += "title={" + title + "},\n";
    string += "author={" + author + "},\n";
    string += "year={" + timeParts[2] + "},\n";
    string += "howpublished={" + guteFrageURL + "},\n";
    if (tags.length > 0){
        string += "journal={Abhandlungen zu ";
        for (var i = 0; i < tags.length-1; i++) {
            string += tags[i] + ", ";
        };
        string += tags[tags.length-1] + "}\n";
    }
    // string += "pages={" + 42--4711 + "},\n";
    // leave comma here (never forget that !)
    string += "publisher={gutefrage.net}\n";
    string += "}\n";

    var publishedString = string.replace(/\n/g, "<br>");

    $("#result").append(publishedString);

}


function initialize() {

    // set listener to button or textfield that extracts site
    $("#convert").on("click", function() {
        // var guteFrageURL = 'http://www.gutefrage.net/frage/warum-sind-menschen-nur-so-naiv-und-dumm';
        guteFrageURL = $("#gutefrage-url").val();

        // check if valid site and if gutefrage.net
        // TODO

        // guteFrageURL = 'http://www.gutefrage.net/frage/halloich-fange-ab-oktober-eine-zweitausbildung-an-was-kann-man-an-finanzieller-unterstuetzung-beantragen';
        // guteFrageURL = 'http://www.gutefrage.net/frage/warum-sind-menschen-nur-so-naiv-und-dumm';
        requestCrossDomain(guteFrageURL, extractBibTex);
    });
    
    

}







