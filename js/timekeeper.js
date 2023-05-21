/*
The MIT License (MIT)

Copyright (c) 2014-2023 Ichiro Maruta

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

$(function () {
	let nletters = 5, last_nletters = 5;
	let time_str = "00:00";
	let time_inner = 0;
	var loadedcss = '';
	$('#time0').val('0:00');
	$('#time1').val('15:00');
	$('#time2').val('20:00');
	$('#time3').val('25:00');
	$('#info').html("Click to edit this message.");

	function getHashParams() {
		var hashParams = {};
		var e,
			a = /\+/g, // Regex for replacing addition symbol with a space
			r = /([^&;=]+)=?([^&;]*)/g,
			d = function (s) {
				return decodeURIComponent(s.replace(a, " "));
			},
			q = window.location.hash.substring(1);

		while (e = r.exec(q))
			hashParams[d(e[1])] = d(e[2]);
		return hashParams;
	}

	function parseHashParams() {
		params = getHashParams();
		if (params.t0 !== undefined) $('#time0').val(params.t0);
		if (params.t1 !== undefined) $('#time1').val(params.t1);
		if (params.t2 !== undefined) $('#time2').val(params.t2);
		if (params.t3 !== undefined) $('#time3').val(params.t3);
		if (params.m !== undefined) $('#info').html(DOMPurify.sanitize(params.m));
		if (loadedcss !== '') {
			location.reload();
		}
		if (params.th !== undefined && /^[a-zA-Z0-9\-]+$/.test(params.th)) {
			loadedcss = params.th;
		} else {
			loadedcss = 'default';
		}
		$('head').append('<link rel="stylesheet" type="text/css" href="theme/' + loadedcss + '.css">');
	}

	function updateHash() {
		var hashstr = '#t0=' + $('#time0').val()
			+ '&t1=' + $('#time1').val()
			+ '&t2=' + $('#time2').val()
			+ '&t3=' + $('#time3').val()
			+ '&m=' + encodeURIComponent($('#info').html());
		if (loadedcss !== 'default') {
			hashstr = hashstr + '&th=' + encodeURIComponent(loadedcss);
		}
		$('#seturl').attr("href", hashstr);
		try {
			history.replaceState(undefined, undefined, hashstr);
		} catch (e) {
		}
	};

	$(window).on('hashchange', function () {
		parseHashParams();
		updateHash();
	});

	parseHashParams();
	updateHash();

	$('#time0,#time1,#time2,#time3,#info').change(function () {
		updateHash();
	});

	var infoline = $('#info').html();
	$('#info').blur(function () {
		if (infoline != $(this).html()) {
			infoline = $(this).html();
			updateHash();
		}
	});

	var audio_chime1, audio_chime2, audio_chime3;
	audio_chime1 = new Audio("./wav/chime1.mp3");
	audio_chime2 = new Audio("./wav/chime2.mp3");
	audio_chime3 = new Audio("./wav/chime3.mp3");

	function changeStateClass(s) {
		$('body').removeClass(function (index, className) {
			return (className.match(/\bstate-\S+/g) || []).join(' ');
		});
		$('body').addClass('state-' + s);
	};

	function changePhaseClass(s) {
		$('body').removeClass(function (index, className) {
			return (className.match(/\bphase-\S+/g) || []).join(' ');
		});
		$('body').addClass('phase-' + s);
	};

	function standby() {
		$('.nav li').removeClass('active');
		$('.nav li#standby').addClass('active');
		$('#state').html('STANDBY');
		changeStateClass('standby');
		changePhaseClass('0');
		time_inner = parse_time($('#time0').val());
		show_time();
	}

	function start() {
		if ($('.nav li#start').hasClass('active')) {
			return;
		}
		$('.nav li').removeClass('active');
		$('.nav li#start').addClass('active');
		$('#state').html('');
		changeStateClass('start');
		start_time = new Date((new Date()).getTime() - time_inner);
		last_time = null;
		audio_chime1.load();
		audio_chime2.load();
		audio_chime3.load();
	}

	$('.nav #standby').click(function (event) {
		event.preventDefault();
		standby();
	});

	standby();
	var start_time = new Date();
	var last_time;

	$('.nav #start').click(function (event) {
		event.preventDefault();
		start();
	});

	$('#time').dblclick(function (event) {
		event.preventDefault();
		let new_time = prompt('Force the time to', time_str);
		if (new_time !== null) {
			set_time(new_time);
		}
	});

	function pause() {
		if ($('.nav li#standby').hasClass('active')) {
			return;
		}

		if ($('.nav li#pause').hasClass('active')) {
			return;
		}

		$('.nav li').removeClass('active');
		$('.nav li#pause').addClass('active');
		update_time();
		$('#state').html('PAUSED');
		changeStateClass('paused');
	}

	$('.nav #pause').click(function (event) {
		event.preventDefault();
		pause();
	});

	function resize_display() {
		var height = $('body').height();
		var width = $('body').width();
		var theight = Math.min(height * 3 / 5, width * 1.95 / nletters);
		$('#time').css('top', (height - theight) / 2 * 1.1);
		$('#time').css('font-size', theight + 'px');
		$('#time').css('line-height', theight + 'px');
		var sheight = theight / 6;
		$('#state').css('top', height / 2 - theight / 2 - sheight / 2);
		$('#state').css('font-size', sheight + 'px');
		$('#state').css('line-height', sheight + 'px');
		var iheight = sheight;
		$('#info').css('top', height / 2 + theight / 2);
		$('#info').css('font-size', iheight + 'px');
		$('#info').css('line-height', iheight + 'px');
	}
	$(window).bind("resize", resize_display);
	$(window).bind("orientationchange", resize_display);

	$('#soundcheck').click(function (event) {
		event.preventDefault();
		audio_chime1.load();
		audio_chime1.currentTime = 0;
		audio_chime1.play();
	});

	function format_time(t) {
		if (t < 0) {
			return '−' + format_time(-t + 999);
		}
		var h = Math.floor(t / 3600000);
		var m = Math.floor((t - h * 3600000) / 60000);
		var s = Math.floor((t - h * 3600000 - m * 60000) / 1000);
		var ms = Math.floor((t - h * 3600000 - m * 60000 - s * 1000) / 10);
		return ((h > 0) ? (h + ':') : '') + ('00' + m).slice(-2) + ':' + ('00' + s).slice(-2);
	}
	function show_time() {
		time_str = format_time(time_inner);
		nletters = time_str.length;
		if (nletters != last_nletters) {
			resize_display();
			last_nletters = nletters;
		}
		$('#time').html(time_str);
	}

	function set_time(t_str) {
		start_time = new Date((new Date()).getTime() - parse_time(t_str));
		update_time();
	}

	window.set_time = set_time;



	function update_time() {
		var cur_time = new Date();
		var e = cur_time - start_time;
		time_inner = e;
		show_time();
	}

	function parse_time(tstr) {
		if (tstr.charAt(0) === '-' || tstr.charAt(0) === '−') {
			return (-parse_time(tstr.slice(1)));
		}
		const parts = tstr.split(/[:∶]/).reverse();
		let time = 0;

		// seconds
		if (parts[0]) time += parseInt(parts[0], 10) * 1000;
		// minutes
		if (parts[1]) time += parseInt(parts[1], 10) * 60 * 1000;
		// hours
		if (parts[2]) time += parseInt(parts[2], 10) * 60 * 60 * 1000;

		return time;
	}

	$('[data-toggle="tooltip"]').tooltip();
	$.timer(100, function (timer) {
		resize_display();
		if ($('.nav li#start').hasClass('active')) {
			update_time();

			var cur_time = new Date();
			if (last_time != null) {
				var time1 = new Date(start_time.getTime() + parse_time($('#time1').val()));
				var time2 = new Date(start_time.getTime() + parse_time($('#time2').val()));
				var time3 = new Date(start_time.getTime() + parse_time($('#time3').val()));

				if ((last_time < time1 && time1 <= cur_time) || (last_time == time1 && cur_time == time1)) {
					changePhaseClass('1');
					audio_chime1.currentTime = 0;
					audio_chime1.play();
					console.log('chime1');
				}

				if ((last_time < time2 && time2 <= cur_time) || (last_time == time2 && cur_time == time2)) {
					changePhaseClass('2');
					audio_chime2.currentTime = 0;
					audio_chime2.play();
					console.log('chime2');
				}

				if ((last_time < time3 && time3 <= cur_time) || (last_time == time3 && cur_time == time3)) {
					changePhaseClass('3');
					audio_chime3.currentTime = 0;
					audio_chime3.play();
					console.log('chime3');
				}

			}
			last_time = cur_time;
		}
	});

	function obs_scene_change(name) {
		if (name.indexOf(':standby') != -1) {
			standby();
		}
		if (name.indexOf(':start') != -1) {
			start();
		}
		if (name.indexOf(':pause') != -1) {
			pause();
		}
	}

	if (window.obsstudio) {
		window.obsstudio.getCurrentScene(function (scene) {
			obs_scene_change(scene.name);
		});
		window.addEventListener('obsSceneChanged', function (event) {
			obs_scene_change(event.detail.name);
		})
	}
	show_time();
});
