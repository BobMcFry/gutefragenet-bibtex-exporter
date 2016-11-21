/*
The MIT License (MIT)

Copyright (c) 2016 Christian Heiden

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var guteFrageURL    = "";

// XXX: add credits
// inspired by: http://code.tutsplus.com/tutorials/quick-tip-cross-domain-ajax-request-with-yql-and-jquery--net-10225
function requestCrossDomain( site, callback ) {
    
    // if there is no URL provided -> Error
    if ( !site ) {
        displayNoQuestion();
        return false;
    }
     
    // Generate Query
    var yql = 'http://query.yahooapis.com/v1/public/yql?q=' 
                + encodeURIComponent('select * from html where url=\'' 
                                        + site + '\'') 
                                        + '&format=xml&callback=?';

    // Request that YSQL string
    $.getJSON( yql, function( data ){
    
        if ( data.results[0] ) {
            callback( data.results[0] );
        } else {
            displayBadQuestion();
        }

        // Else, Maybe we requested a site that doesn't exist, and nothing returned.
        // else throw new Error( 'Nothing returned from getJSON.' );

    });

}



// TODO:
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
    // korrigiere bobtex
    string = "@article{"       + author + timeParts[2] +   ",<br>";
    string += "    title={"        + title                 + "},<br>";
    string += "    author={"       + author                + "},<br>";
    string += "    year={"         + timeParts[2]          + "},<br>";
    string += "    howpublished={\\url{" + guteFrageURL          + "}},<br>";
    if (tags.length > 0){
        string += "    journal={Abhandlungen zu ";
        for ( var i = 0; i < tags.length-1; i++ ) {
            string +=            tags[i]               + ", ";
        };
        string +=                tags[tags.length-1]   + "},<br>";
    }
    // leave comma here (never forget that !)
    string += "    publisher={gutefrage.net}<br>";
    string += "}<br>";


    displayPhd();

    $( "#result" ).empty();
    $( "#result" ).append( string );

}



function buttonListener () {

    displayWebsite();

    // get URL form textfield
    guteFrageURL = $( "#gutefrage-url" ).val();

    // check if valid site and if gutefrage.net
    var urlCheck = document.createElement('a');
    urlCheck.href = guteFrageURL;
    if (urlCheck.hostname.toLowerCase().indexOf("gutefrage") == -1){
        displayBadQuestion();
    } else {
        // console.log(urlCheck.pathname);
        displayLogoBusy();    
        requestCrossDomain( guteFrageURL, extractBibTex );    
    }

}



function initialize() {

    displayWebsite();
    
    // set listener to button or textfield that extracts site
    $( "#convert" ).on( "click", buttonListener);

}


// TODO:
function displayBadQuestion(){

}


// TODO:
function displayNoQuestion(){

}



function displayWebsite(){
    $("#website").css("opacity", "1.0");
    $("#lamp_off").css("display", "block");
    $("#lamp_glow").css("display", "none");
    $("#lamp_on").css("display", "none");
    $("#phd").css("opacity", "1.0");
}



function displayPhd(){
    $("#website").css("opacity", "1.0");
    $("#lamp_off").css("display", "none");
    $("#lamp_glow").css("display", "none");
    $("#lamp_on").css("display", "block");
    $("#phd").css("opacity", "1.0");
}

function displayLogoBusy(){
    $("#website").css("opacity", "0.5");
    $("#lamp_off").css("display", "block");
    $("#lamp_glow").css("display", "block");
    $("#lamp_on").css("display", "none");
    $("#phd").css("opacity", "0.5");
}




