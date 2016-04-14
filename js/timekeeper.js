/*
The MIT License (MIT)

Copyright (c) 2014-2016 Ichiro Maruta

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

$(function(){
	var loadedcss = '';
	$('#time1').val('15:00');
	$('#time2').val('20:00');
	$('#time3').val('25:00');
	$('#info').html("Click to edit this message.");
	function getHashParams() {
    var hashParams = {};
    var e,
      a = /\+/g, // Regex for replacing addition symbol with a space
      r = /([^&;=]+)=?([^&;]*)/g,
      d = function(s) {
        return decodeURIComponent(s.replace(a, " "));
      },
      q = window.location.hash.substring(1);

    while (e = r.exec(q))
      hashParams[d(e[1])] = d(e[2]);
    return hashParams;
  }

  function parseHashParams(){
    params = getHashParams();
    if(params.t1 !== undefined) $('#time1').val(params.t1);
		if(params.t2 !== undefined) $('#time2').val(params.t2);
		if(params.t3 !== undefined) $('#time3').val(params.t3);
		if(params.m !== undefined) $('#info').html(params.m);
		if(loadedcss !== ''){
			location.reload();
		}
		if(params.th !== undefined && /^[a-zA-Z0-9\-]+$/.test(params.th)){
			loadedcss=params.th;
		}else{
			loadedcss='default';
		}
		$('head').append('<link rel="stylesheet" type="text/css" href="theme/'+loadedcss+'.css">');
  }

	function updateHash() {
    var hashstr = '#t1=' + $('#time1').val()
		+ '&t2=' + $('#time2').val()
		+ '&t3=' + $('#time3').val()
		+ '&m=' + encodeURIComponent($('#info').html());
		if(loadedcss !== 'default'){
			hashstr = hashstr + '&th=' + encodeURIComponent(loadedcss);
		}
		$('#seturl').attr("href",hashstr);
		try{
	    history.replaceState(undefined, undefined, hashstr);
		}catch(e){
		}
  };

	$(window).on('hashchange', function() {
    parseHashParams();
		updateHash();
  });

	parseHashParams();
	updateHash();

	$('#time1,#time2,#time3,#info').change(function(){
		updateHash();
	});

	var infoline = $('#info').html();
	$('#info').blur(function() {
	    if (infoline!=$(this).html()){
	        infoline = $(this).html();
					updateHash();
	    }
	});

	var audio_chime1,audio_chime2,audio_chime3;
	audio_chime1 = new Audio("./wav/chime1.wav");
	audio_chime2 = new Audio("./wav/chime2.wav");
	audio_chime3 = new Audio("./wav/chime3.wav");

	function changeStateClass(s) {
		$('body').removeClass(function(index, className) {
			return (className.match(/\bstate-\S+/g) || []).join(' ');
		});
		$('body').addClass('state-'+s);
	};

	function changePhaseClass(s) {
		$('body').removeClass(function(index, className) {
			return (className.match(/\bphase-\S+/g) || []).join(' ');
		});
		$('body').addClass('phase-'+s);
	};

	$('.nav #standby').click(function (event){
		event.preventDefault();
		$('.nav li').removeClass('active');
		$('.nav li#standby').addClass('active');
		$('#state').html('STANDBY');
		changeStateClass('standby');
		changePhaseClass('0');
		time_inner=(new Date('2011/1/1 00:00:00'));
		show_time();
	});
	changeStateClass('standby');
	changePhaseClass('0');
	var start_time=new Date();
	var last_time;
	$('.nav #start').click(function (event){
		event.preventDefault();
		if($('.nav li#start').hasClass('active')){
			return;
		}
		$('.nav li').removeClass('active');
		$('.nav li#start').addClass('active');
		$('#state').html('');
		changeStateClass('start');
		start_time = new Date((new Date()).getTime() - (time_inner-(new Date('2011/1/1 00:00:00'))));
		last_time = null;
		audio_chime1.load();
		audio_chime2.load();
		audio_chime3.load();
	});

	$('.nav #pause').click(function (event){
		event.preventDefault();
		if($('.nav li#standby').hasClass('active')){
			return;
		}

		$('.nav li').removeClass('active');
		$('.nav li#pause').addClass('active');
		update_time();
		$('#state').html('PAUSED');
		changeStateClass('paused');
	});

	function resize_display() {
		var height=$('body').height();
		var width=$('body').width();
		var theight=Math.min(height*3/5,width*1.95/5);
		$('#time').css('top',(height-theight)/2*1.1);
		$('#time').css('font-size',theight+'px');
		$('#time').css('line-height',theight+'px');
		var sheight=theight/6;
		$('#state').css('top',height/2-theight/2-sheight/2);
		$('#state').css('font-size',sheight+'px');
		$('#state').css('line-height',sheight+'px');
		var iheight=sheight;
		$('#info').css('top',height/2+theight/2);
		$('#info').css('font-size',iheight+'px');
		$('#info').css('line-height',iheight+'px');
	}
	$(window).bind("resize", resize_display);

	$('#soundcheck').click(function (event){
		event.preventDefault();
		audio_chime1.load();
		audio_chime1.currentTime = 0;
		audio_chime1.play();
	});

	function show_time(){
		var time_str= ('00' +  time_inner.getMinutes()   ).slice(-2) + ':'
					+ ('00' +  time_inner.getSeconds() ).slice(-2);
		$('#time').html(time_str);
	}

	var time_inner = new Date('2011/1/1 00:00:00');
	function update_time(){
		var cur_time= new Date();
		var e=new Date((new Date('2011/1/1 00:00:00')).getTime()+(cur_time-start_time));
		time_inner=e;
		show_time();
	}
  $('[data-toggle="tooltip"]').tooltip();
	$.timer(100,function(timer){
			resize_display();
			if($('.nav li#start').hasClass('active')){
				update_time();

				var cur_time= new Date();
				if(last_time != null){
					var time1 = new Date(start_time.getTime()+((new Date('2011/1/1 00:'+$('#time1').val()))-(new Date('2011/1/1 00:00:00'))));
					var time2 = new Date(start_time.getTime()+((new Date('2011/1/1 00:'+$('#time2').val()))-(new Date('2011/1/1 00:00:00'))));
					var time3 = new Date(start_time.getTime()+((new Date('2011/1/1 00:'+$('#time3').val()))-(new Date('2011/1/1 00:00:00'))));

					if((last_time < time1 && time1 <= cur_time) || (last_time==time1 && cur_time==time1)){
						changePhaseClass('1');
						audio_chime1.currentTime = 0;
						audio_chime1.play();
					}

					if((last_time < time2 && time2 <= cur_time) || (last_time==time2 && cur_time==time2)){
						changePhaseClass('2');
						audio_chime2.currentTime = 0;
						audio_chime2.play();
					}

					if((last_time < time3 && time3 <= cur_time) || (last_time==time3 && cur_time==time3)){
						changePhaseClass('3');
						audio_chime3.currentTime = 0;
						audio_chime3.play();
					}

				}
				last_time=cur_time;
			}
	})
});
