/*global
    _gaq
*/

// Global Properties _________________________________________________________

var ELEMENT_LIST    = 'h,he,li,be,b,c,n,o,f,ne,na,mg,al,si,p,s,cl,ar,k,ca,sc,ti,v,cr,mn,fe,co,ni,cu,zn,ga,ge,as,se,br,kr,rb,sr,y,zr,nb,mo,tc,ru,rh,pd,ag,cd,in,sn,sb,te,i,xe,cs,ba,la,ce,pr,nd,pm,sm,eu,gd,tb,dy,ho,er,tm,yb,lu,hf,ta,w,re,os,ir,pt,au,hg,tl,pb,bi,po,at,rn,fr,ra,ac,th,pa,u,np,pu,am,cm,bk,cf,es,fm,md,no,lr,rf,db,sg,bh,hs,mt,ds,rg,cn,nh,fl,mc,lv,ts,og',
    ONE_SECOND      = 1000,
    time_left       = 300000,
    elements        = ELEMENT_LIST.split(','),
    timer,
    intro,
    quiz,
    clock,
    input,
    remaining,
    start_button,
    solved,
    outro,
    replay,
    replay_button;

// Global Methods ____________________________________________________________

function buildQuiz() {
    var intro_html  = '<div id="intro"><h2>How To Play</h2><p>On the next screen, enter as many chemical elements as you can think of within five minutes. Log each answer by pressing SPACEBAR or RETURN. Once your time is up, any elements you missed will be listed so anyone nearby can hear you shout, "GERMANIUUUUUUM!"</p></p><button type="button" id="start_button" title="Click to start">I’m ready!</button></div>',
        quiz_html   = '<div id="quiz"><div id="clock">5:00</div><input id="input"><p><b id="remaining"></b> elements remaining</p><ul id="solved" class="element_list"></ul></div>',
        outro_html  = '<div id="outro"><h2>Finished!</h2><p>You named <strong id="named">0</strong> HTML5 elements in five minutes!</p><div id="share"><h2>Share Your Score</h2></div><p id="missed_message">You missed the following elements:</p><ul id="missed_elements" class="element_list"></ul><button type="button" id="replay">Again?</button>',
        placeholder = $('#quiz_wrapper').append(intro_html, quiz_html, outro_html);

    intro           = $('#intro');
    quiz            = $('#quiz');
    clock           = $('#clock');
    input           = $('#input');
    remaining       = $('#remaining');
    start_button    = $('#start_button');
    solved          = $('#solved');
    outro           = $('#outro');
    replay_button   = $('#replay');

    start_button.click(startQuiz);
    replay_button.click(restart);
    input.keyup(function(event) {
        if (event.which == 32 || event.which == 13) {
            var val     = $(this).val().toLowerCase() || this.value.toLowerCase(),
                els     = elements,
                index   = $.inArray($.trim(val), els);

            if (index !== -1) {
                els.splice(index, 1);
                solved.append('<li>' + val + '</li>');
                this.value = '';

                update();
            }
        }
        
    });

    update();
}

function startQuiz() {
    intro.hide();
    quiz.show();
    input.focus();

    trackEvent('Start');

    timer = setInterval(tick, ONE_SECOND);
}

function restart() {
    trackEvent('Restart');
    window.location = '';
}

function stopQuiz() {
    var solved_elements = solved.children().length,
        share_text      = 'I was able to name ' + solved_elements + ' HTML5 elements in 5 minutes!',
        missed_list     = $('#missed_elements'),
        share_box       = $('#share'),
        twitter_html    = '<a href="https://twitter.com/share" class="twitter-share-button" data-url="http://thehtml5quiz.com/" data-text="' + share_text + '" data-count="vertical">Tweet</a><script type="text/javascript" src="//platform.twitter.com/widgets.js"></script>',
        facebook_html   = '<iframe src="//www.facebook.com/plugins/like.php?href=http%3A%2F%2Fthehtml5quiz.com%2F&amp;send=false&amp;layout=box_count&amp;width=50&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font=lucida+grande&amp;height=90&amp;appId=251751164868646" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:50px; height:90px;" allowTransparency="true"></iframe>';

    clearInterval(timer);

    trackEvent('Stop');

    share_box.append(twitter_html, plus_html, facebook_html);
    share_box.children(':not(h2)').wrap('<div class="share_item">');
    quiz.hide();
    outro.show();

    $('#named').text(solved_elements);

    if (elements.length > 0) {
        $.each(elements, function() {
            missed_list.append('<li>' + this + '</li>');
        });
    }
    else {
        $('#missed_message, missed_elements').hide();
    }

    trackScore(solved_elements);
}

function formatTime(ms) {
    var x,
        seconds,
        minutes,
        formatted_time,
        number;

    x       = ms / 1000;
    seconds = x % 60;
    x       /= 60;
    minutes = Math.floor(x % 60);

    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    if (minutes < 1 && !clock.hasClass('warning')) {
        clock.addClass('warning');
    }

    formatted_time = [minutes, seconds].join(':');

    return formatted_time;
}

function tick() {
    time_left -= ONE_SECOND;
    clock.text(formatTime(time_left));

    if (time_left <= 0) {
        stopQuiz();
    }
}

function update() {
    var count = elements.length;

    remaining.text(count);

    if (count <= 0) {
        stopQuiz();
    }
}

function trackEvent(event_type) {
    if (_gaq) {
        _gaq.push(['_trackEvent', 'Quiz', event_type]);
    }
}

function trackScore(score) {
    if (_gaq) {
        _gaq.push(['_trackEvent', 'Score', 'Points', score]);
    }
}

// Initialization ____________________________________________________________

$(document).ready(function() {
    buildQuiz();
});
