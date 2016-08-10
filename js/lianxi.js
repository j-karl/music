$(function(){
	var play_button = $(".music-button .play-button");
	var audio = $("#audio").get(0);
	var $audio = $("#audio");

	//播放暂停键
	play_button.on("click",function(){
		if(audio.paused){
			audio.play();
		}else{
			audio.pause();
		}
	});

	$audio.on("play",function(){
		play_button.addClass("play-pause");
	});
	$audio.on("pause",function(){
		play_button.removeClass("play-pause");
	});

	$(document).on("keyup",function(e){
		if(e.keyCode == 80 && e.shiftKey){
			if(audio.paused){
				$audio.trigger("play");
			}else{
				$audio.trigger("pause");
			}
		}
	});



	//音量控制
	var yinliang = $(".music-button .yinliang");
	var duan = $(".music-button .yinliangduan");
	var currentVol = $(".yinliangduan .currentVolume");
	var dian = $(".yinliangduan .dian");

	yinliang.on("click",function(){
		if(!yinliang.attr("vol")){
			yinliang.attr("vol",audio.volume);
			audio.volume = 0;
		}else{
			audio.volume = yinliang.attr("vol");
			yinliang.removeAttr("vol");
		}
	});
	duan.on("click",function(e){
		audio.volume = e.offsetX/$(this).width();
	});
	$audio.on("volumechange",function(){
		if(audio.volume === 0){
			yinliang.addClass("mute");
		}else{
			yinliang.removeClass("mute");
		}
		currentVol.width(audio.volume*duan.width());
		dian.css({left:audio.volume*duan.width()-(dian.width()/2)});
	});
	dian.on("click",function(e){
		//阻止冒泡
		e.stopPropagation();
	});

	//音量拖动
	dian.on("mousedown",function(){
		$(document).on("mousemove",function(e){
			var disX = e.pageX - duan.offset().left;
			var vol = disX/duan.width();
			vol = (vol<0)?0:vol;
			vol = (vol>1)?1:vol;
			audio.volume = vol;
		});
	});
	$(document).on("mouseup",function(){
		$(document).off("mousemove");
	});


	//进度条
	var jindutiao = $(".jindutiao");
	var currentTime = $(".currentTime");
	var timeDian = $(".timeDian");

	jindutiao.on("click",function(e){
		audio.currentTime = (e.offsetX/jindutiao.width())*audio.duration;
	});
	$audio.on("timeupdate",function(e){
		var w = audio.currentTime/audio.duration*jindutiao.width();		
		currentTime.width(w);
		timeDian.css({left:w-timeDian.width()/2});
	});

	timeDian.on("mousedown",function(e){
		e.preventDefault();
		$(document).on("mousemove",function(e){
			var dis = e.pageX - jindutiao.offset().left;
			audio.currentTime = (dis/jindutiao.width())*audio.duration;
		});
	});
	$(document).on("mouseup",function(){
		$(document).off("mousemove");
	});
	timeDian.on("click mousemove",function(e){
		e.stopPropagation();
	})

	var timeBox = $(".timeBox");
	jindutiao.on("mouseover",function(){
		$(this).on("mousemove",function(e){
			timeBox.css({display:'block',left:e.offsetX-timeBox.width()/2});
			var currentT = e.offsetX/jindutiao.width()*audio.duration;
			timeBox.find("span").html(formate(currentT));
		});
	});
	jindutiao.on("mouseout",function(){
		timeBox.css({display:'none'});
	});

})

function formate(time){
	//time 120.33333
	time = parseInt(time);
	var min = parseInt(time/60);
	min = (min<10)?'0'+min:min;
	var second = parseInt(time%60);
	second = (second<10)?'0'+second:second;
	return min +':'+ second;
}