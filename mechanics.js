
var guteFrageURL    = "";


// Accepts a url and a callback function to run.
// XXX: add credits
// stolen from: http://code.tutsplus.com/tutorials/quick-tip-cross-domain-ajax-request-with-yql-and-jquery--net-10225
function requestCrossDomain( site, callback ) {
    
    // If no url was passed, exit.
    if ( !site ) {
        // XXX: log purposes
        console.log( 'No site was passed.' );
        return false;
    }
     
    // Take the provided url, and add it to a YQL query. Make sure you encode it!
    var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url=\'' + site + '\'') + '&format=xml&callback=?';

    // Request that YSQL string, and run a callback function.
    $.getJSON( yql, cbFunc );
    
    function cbFunc( data ) {
    // If we have something to work with...
    if ( data.results[0] ) {
    
        if ( typeof callback === 'function' ) {
            callback( data.results[0] );
        }
    }

    // Else, Maybe we requested a site that doesn't exist, and nothing returned.
    else throw new Error( 'Nothing returned from getJSON.' );
    }
}


function extractBibTex ( results ) {

    // store website in dummy div element in order to parse it
    var tmpdiv = $( '<div></div>' );
    $(tmpdiv).html( results );

    // extract information from the page
    var question  = $( tmpdiv ).find( "div.Question" );

    var author    = question.find( 'a[class="Question-author"]' )[0].text;

    var time      = question.find( ".Question-pubDate" )[0].innerText;
    var timeParts = time.split( "." );

    // needs to be a regular expression in order to replace EVERY occurence
    var title     = question.find( ".Question-title" )[0].innerText.trim().replace( /\n/g,"" );

    var tagElems  = $( tmpdiv ).find( "ul.Tags-tagList" ).find( 'li' );
    var tags      = [];
    tagElems.each(function( index ) {
      tags.push( $( this ).first().text().trim().replace( /\n/g,"" ) );
    });
    
    // create string representation of bibtex
    string = "@article{"       + author + timeParts[2] +   "\n";
    string += "title={"        + title                 + "},\n";
    string += "author={"       + author                + "},\n";
    string += "year={"         + timeParts[2]          + "},\n";
    string += "howpublished={" + guteFrageURL          + "},\n";
    if (tags.length > 0){
        string += "journal={Abhandlungen zu ";
        for ( var i = 0; i < tags.length-1; i++ ) {
            string +=            tags[i]               + ", ";
        };
        string +=                tags[tags.length-1]   + "}\n";
    }
    // leave comma here (never forget that !)
    string += "publisher={gutefrage.net}\n";
    string += "}\n";

    // create a html version of that string
    var publishedString = string.replace( /\n/g, "<br>" );

    $( "#result" ).append( publishedString );

}


function initialize() {

    // set listener to button or textfield that extracts site
    $( "#convert" ).on( "click", function() {

        // var guteFrageURL = 'http://www.gutefrage.net/frage/warum-sind-menschen-nur-so-naiv-und-dumm';
        guteFrageURL = $( "#gutefrage-url" ).val();

        // check if valid site and if gutefrage.net
        // TODO


        requestCrossDomain( guteFrageURL, extractBibTex );

    } );
    
    

}







