/**
 * Created by Andrew Wang on 7/15/2017.
 */

var date = -1;
var selectedtags=[
    "tech",
    "science",
    "world",
    "politics",
    "music",
    "movies",
    "tv",
    "money",
    "sports"
];
var $grid;
var layout = {
    itemSelector: '.news-block',
    columnWidth: 300,
    percentPosition: true,
    horizontalOrder: true
};

// Initialize Firebase
var config = {
    apiKey: "AIzaSyClEcUda49RQvTGD4BtIkh-3G3_TXYO4_w",
    authDomain: "debrief-d5edb.firebaseapp.com",
    databaseURL: "https://debrief-d5edb.firebaseio.com",
    projectId: "debrief-d5edb",
    storageBucket: "debrief-d5edb.appspot.com",
    messagingSenderId: "174837048888"
};
firebase.initializeApp(config);

$(document).ready(function () {
    $grid = $('#newscontainer').masonry(layout);
    fetchDate();
    setupDate();
    setupTags();
});
function fetchDate(){
    $("#newscontainer").empty();
    $(".tag").removeClass("tag-disabled");
    $("#date").text(moment().add(date, 'days').format('MMMM D, YYYY'));
    firebase.database().ref('debriefings/' + moment().add(date,'days').format('M-D')).once('value').then(function(snapshot) {
        var temp = snapshot.val();
        for (var key in temp) {
            var key2 = key;
            if(key == "technology"){
                key2="tech";
            }
            else if(key =="entertainment"){
                key2="tv";
            }
            if (  selectedtags.indexOf(key2) >= 0 ) {
                for(var k in temp[key]){
                    var str = '<div class="news-block"><div class="news-background ';
                    str+= key2+'">';
                    str+='<h3 class="headline">';
                    str+=temp[key][k].title;
                    str+='</h3><p class="content">';
                    str+=temp[key][k].shortsum;
                    str+='</p><p class="sum">';
                    str+=temp[key][k].longsum;
                    str+='</p><p class="url">';
                    str+=temp[key][k].url;
                    str+='</p><p class="key">';
                    str+=key2;
                    str+='</p></div></div>';
                    setupNews(str);
                }
            }
        }
    });
}
function setupDate(){
    $("#right-arrow").click(function(){
        if(date<-1){
            date+=1;
            fetchDate();
        }
    });
    $("#left-arrow").click(function(){
       date-=1;
       fetchDate();
    });
}
function setupTags(){
    $(".tag").click(function(){
        if($(this).hasClass("tag-disabled")){
            $(this).removeClass("tag-disabled");
            $("#newscontainer ."+$(this).text()).parent().show();
        }
        else{
            $(this).addClass("tag-disabled");
            $("#newscontainer ."+$(this).text()).parent().hide();
        }
        setupNews();
    });
}
function setupNews(temp){
    var elem = $(temp);
    $grid.masonry()
        .append( elem )
        .masonry( 'appended', elem )
        .masonry(layout);
    $('.news-block').click(function () {
        $("#popup").show();
        var c = $($(this).children()[0]).children();
        $("#popup-content").removeClass();
        $("#popup-content").addClass($(c[4]).text());
        $("#popup-title").text($(c[0]).text());
        $("#popup-sum").text($(c[2]).text());
        $("#popup-link").unbind();
        $("#popup-link").click(function(){
            window.open($(c[3]).text());
        });
    });
    $('#popup').click(function () {
        $("#popup").hide();
    });
}