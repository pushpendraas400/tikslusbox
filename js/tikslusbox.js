//author: Pushpendra Singh Chouhan @ www.tikslus.com
var phandle; //used with setTimeOut function. see autoplay function
var sthandle;
$.fn.tikslusbox=function(options){
var screen_width;
var screen_height;
screen_width=screen.width;//screen width
screen_height=$(document).height();//screen.height;

var defaults = {
   overlayBgColor:'#555555',//overlay background color
   overlayOpacity:0.5,//overlay opacity
   allowKeyNavigation:true,//allow keyboard based navigation with arrow keys
   imageTransitionDelay:500,//used in animations
   animationType:'default',//can be default,elastic,elastic2,fade
   descriptionBarOpacity:0.8,//information bar opacity
   descriptionBarBgColor:'',//information bar background color ex: #ffffff
 
   descriptionBarFontSize:12,//information bar font size
   descriptionBarTextAlign:'left', //text can be aligned left,right,center,justify
   descriptionBarFontName:'verdana', //information bar font
   showImageNumbers:false, //show image numbers ex: (showing 1/5)
   autoPlay:false,//autoplay
   autoPlayInterval:6000,//6 seconds. trigger next autoplay at this interval
   skin:'default', //tikslusbox skin. can be default,elegant,black,white,elegant2,elegant3,elegant4,tikslus
   imgMinWidth:500,
   imgMinHeight:500,
   inlineContentScrolling:'no'//have a scroll bar for inline content
 };


  // Extend our default options with those provided.
  var options = $.extend(defaults, options);
  // Our plugin implementation code goes here.
var parent_div="play_" + options.skin; //create a skin wrapper div

var bk="<div id='bk_overlay' style='width:" + screen_width + "px;height:" + screen_height + "px;z-index:1002;top:0px;left:0px;position:absolute' class='outer-overlay'></div>"; //this is our overlay html
if($("#bk_overlay").length==0)
{
$("body").append(bk); //append overlay to body tag
//set user defined values for overlay

$("#bk_overlay").css("background-color",options.overlayBgColor);
$("#bk_overlay").css("opacity",options.overlayOpacity);
$("#bk_overlay").css("-moz-opacity",options.overlayOpacity);
}
$("body").append("<div id='"+ parent_div + "'></div>");//append skin wrapper
$("body").append('<div class="image_loading"></div>'); // this will show animated loader image in the center
$(".image_loading").addClass("default_loader"); //overwrite with default loader class. see tikslusbox.css

//prepare skin
prepare_skin(); //this will create skin according to skin parameter we have passed to the function(defualt is "default")
//this will append skin related html code to skin wrapper div
$("#" + parent_div).css("display","none");

//image array
var currentIndex=-1;//current index to the image,video,iframe or inline content
//currentIndex is important when there is a group of images,videos,iframes,inline contents. that is if we have specified "rel" attribute of link
var totalCount=0; //total number of images,videos,iframes,inline contents in a group. ex: if "rel" is specified
var objarr=[];

var rel; //holds group id or group name

/**
any link having tikslusbox class can be used to open tikslusbox
*/
$(".tikslusbox").click(function(e){
e.preventDefault();
var obj=$(this);

rel=$(this).attr("rel");
//create a lighbox object
var lightbox_object= {
image:obj.attr("href"),//image,video,iframe url
title:obj.attr("title"),//title to be shown in information bar
rel:obj.attr("rel"), //group id if any
mediaType:obj.attr("mediatype"),//mediatype is an attribute. can have 
descriptionBarBgColor:options.descriptionBarBgColor,//information bar background color
//descriptionBarFontColor:options.descriptionBarFontColor,
descriptionBarFontSize:options.descriptionBarFontSize,//information bar font size
descriptionBarFontName:options.descriptionBarFontName,//information bar font name
descriptionBarOpacity:options.descriptionBarOpacity,//information bar opacity
descriptionBarTextAlign:options.descriptionBarTextAlign,//information bar text alignment
index:1//index of this image/video/iframe in the group
};


if(rel==undefined || rel=="") //if the clicked link does not have any group
{
hideNavigation("hide"); //hide previous,next navigation 
currentIndex=0;//only one item
totalCount=1;
}
else
{
//find the current element's index in the group
//though this is not a good approach, yeah i know that
$(this).attr("citem","current");
$('a[rel="' + rel + '"]').each(function(i){
if($(this).attr("citem"))
{
currentIndex=i;
$(this).removeAttr("citem");
return false;
}
});
totalCount=$('a[rel="' + rel + '"]').length; //find total count of elements in the group
hideNavigation("show"); //unhide navigation
}

$("#bk_overlay").show(); //show overlay div
skin_adjustments(); //some skins require some kind of adjustments

ShowBox(lightbox_object); //open the clicked element in tikslusbox

//if autoplay is true then call autoplay function with autoPlayInterval 
if(options.autoPlay==true)
{
phandle=setInterval("$.fn.autoplayShow()",options.autoPlayInterval);
}

});

//this function gets called when autoplay is true
$.fn.autoplayShow=function(){
var rel=$("#" + parent_div).find(".image_holder").find("img").attr("rel");
slideShow_moveTo(rel,"next");//always seeks next element in the group. if any
}

/**
this function is responsible for moving element back-forth in a group
clid: is the group id, identified by "rel" attribute
moveto: can have "next" and "previous" values
*/
function slideShow_moveTo(clid,moveto)
{
totalCount=$('a[rel="' + clid + '"]').length;

if(moveto=="next")
{
currentIndex+=1;
if(currentIndex>totalCount-1)
{

currentIndex=0;
}

}

if(moveto=="previous")
{
currentIndex-=1;
if(currentIndex<0)
{

currentIndex=totalCount-1;
}
}


var obj=$('a[rel="' + clid + '"]:eq('+ currentIndex + ')'); //reach the element identified by currentIndex in the group

//create an object

var lightbox_object= {
image:obj.attr("href"),
title:obj.attr("title"),
rel:obj.attr("rel"),
mediaType:obj.attr("mediatype"),
descriptionBarBgColor:options.descriptionBarBgColor,
descriptionBarFontSize:options.descriptionBarFontSize,
descriptionBarFontName:options.descriptionBarFontName,
descriptionBarOpacity:options.descriptionBarOpacity,
descriptionBarTextAlign:options.descriptionBarTextAlign,
index:1
};




$("#" + parent_div).hide();
ShowBox(lightbox_object); //popup the box

}


function slideShow_jumpTo(clid,jumpto)
{
totalCount=$('img[rel="' + clid + '"]').length;
currentIndex=jumpto;

var obj=$('a[rel="' + clid + '"]:eq('+ jumpto + ')');
//create an object

var lightbox_object= {
image:obj.attr("href"),
title:obj.attr("title"),
rel:obj.attr("rel"),
mediaType:obj.attr("mediatype"),
descriptionBarBgColor:options.descriptionBarBgColor,
descriptionBarFontSize:options.descriptionBarFontSize,
descriptionBarFontName:options.descriptionBarFontName,
descriptionBarOpacity:options.descriptionBarOpacity,
descriptionBarTextAlign:options.descriptionBarTextAlign,
index:jumpto
};




$("#" + parent_div).hide();
ShowBox(lightbox_object); //popup the box

}




function close_show() //close box
{
window.clearInterval(phandle);
$("#" + parent_div).fadeOut("slow");
$("#bk_overlay").fadeOut("fast");
$(".image_loading").hide();
}

//handle .navigate_right class click event
//first find out the group id and pass it in slideShow_moveTo function
$(".navigate_right").click(function(){
var rel;

if($(this).parents().find(".image_holder img").length)
{
rel=$(this).parents().find(".image_holder img").attr("rel");
}

if($(this).parents().find(".image_holder object").length)
{
rel=$(this).parents().find(".image_holder object").attr("rel");
}

if($(this).parents().find(".image_holder iframe").length)
{
rel=$(this).parents().find(".image_holder iframe").attr("rel");

}
if($(this).parents().find(".image_holder #tikslus_inline").length)
{
rel=$("#tikslus_inline").attr("rel");
}

slideShow_moveTo(rel,"next");
});

//same as above 
$(".navigate_left").click(function(){
var rel;
if($(this).parents().find(".image_holder img").length)
{
rel=$(this).parents().find(".image_holder img").attr("rel");
}

if($(this).parents().find(".image_holder object").length)
{
rel=$(this).parents().find(".image_holder object").attr("rel");
}

if($(this).parents().find(".image_holder iframe").length)
{
rel=$(this).parents().find(".image_holder iframe").attr("rel");

}
if($(this).parents().find(".image_holder #tikslus_inline").length)
{
rel=$("#tikslus_inline").attr("rel");
}

slideShow_moveTo(rel,"previous");
});

//close window
$(".close_win").click(function(){
close_show();
});

//keypress event handling
$(document).keypress(function(e){
 var code = (e.keyCode ? e.keyCode : e.which);
switch(code)
{
case 27: //escape key
close_show();
e.preventDefault();
break;
case 39: //right arrow key
slideShow_moveTo($("#" + parent_div).find(".image_holder img").attr("rel"),"next");
e.preventDefault();
break;
case 37://left arrow key
slideShow_moveTo($("#" + parent_div).find(".image_holder img").attr("rel"),"previous");
e.preventDefault();
break;
}
});

//creates a lightbox and show it
/**
lobj: is the object containing all the info needed
lobj.image: element to show (may be image,video,iframes)
lobj.title: show on information bar
lobj.descriptionBarBgColor
lobj.descriptionBarFontSize
lobj.descriptionBarOpacity
lobj.descriptionBarTextAlign
all related with information bar
*/
function ShowBox(lobj){
var towidth;
var toheight;

var close_left;
var close_top;
var left;
var img_path;
var img_title;
var rel;//lightbox id
var current_width;
var current_height;
img_path=lobj.image;
img_title=lobj.title;
image_is_loading("show");

var desc_obj={
title:img_title,
descriptionBarBgColor:lobj.descriptionBarBgColor,
//descriptionBarFontColor:lobj.descriptionBarFontColor,
descriptionBarFontSize:lobj.descriptionBarFontSize,
descriptionBarFontName:lobj.descriptionBarFontName,
descriptionBarOpacity:lobj.descriptionBarOpacity,
descriptionBarTextAlign:lobj.descriptionBarTextAlign
};

//create animation object
var anime_obj={
towidth:0,
toheight:0,
left:0,
imageTransitionDelay:options.imageTransitionDelay,//delay used with animate{} function
animationType:options.animationType
};

close_top=130; //position close image 'x' in "default" skin
//reset information bar
$(".tikslusbox_info").html("");

if(options.showImageNumbers==true)
{
$(".tikslusbox_info").html(lobj.title + "(Showing "+  (currentIndex +1)  + "/" + totalCount+ ")") ;
}
else if(img_title.length<=0 || img_title.length==null || img_title==undefined || img_title=="")
{
$(".tikslusbox_info").hide();

}
else
{
$(".tikslusbox_info").html(lobj.title) ;

}


switch(lobj.mediaType) //check mediatype attribute for vidoes,images,iframes
{

case "youtube":
case "swf":
case "flv":
case "quicktime":
case "video":
case "real":
case "vimeo":
case "megavideo":
case "myspace":
case "metacafe":
/**/

var vid_obj={
mediaWidth:getQuerystring('width',lobj.image),
mediaHeight:getQuerystring('height',lobj.image),
video:lobj.image,
title:lobj.title,
rel:lobj.rel
};
$("#" + parent_div).css("z-index",50000);

$(".navigate_right").css("z-index",52000);
$(".navigate_left").css("z-index",52000);

$(".popup_container").css("width",vid_obj.mediaWidth + "px");
$(".popup_container").css("height",vid_obj.mediaHeight+ "px");

showVid(vid_obj,lobj.mediaType);

current_width=vid_obj.mediaWidth;
current_height=vid_obj.mediaHeight;


close_left=current_width-72;
left=screen.width/2-vid_obj.mediaWidth/2;

anime_obj.towidth=vid_obj.mediaWidth;
anime_obj.toheight=vid_obj.mediaHeight;
anime_obj.left=left;
setDescription(desc_obj);

animate(anime_obj);//animate tikslus box
image_is_loading("hide");

break;

case "inline": //inline content
$("#" + parent_div).css("z-index",50000);

$(".navigate_right").css("z-index",52000);
$(".navigate_left").css("z-index",52000);

var inlineWidth=$(lobj.image).width();
var inlineHeight=$(lobj.image).height();

$(".popup_container").css("width", inlineWidth + "px");
$(".popup_container").css("height",inlineHeight + "px");
showInlineContent(lobj.image,lobj.rel);

current_width=inlineWidth;
current_height=inlineHeight;


close_left=current_width-72;
left=screen.width/2-inlineWidth/2;

anime_obj.towidth=inlineWidth;
anime_obj.toheight=inlineHeight;
anime_obj.left=left;

animate(anime_obj);
image_is_loading("hide");

break;

case "iframe": //iframe
var iframe_obj={
iframeWidth:getQuerystring('width',lobj.image),
iframeHeight:getQuerystring('height',lobj.image),
iframePage:lobj.image,
iframeScrolling:getQuerystring('scrolling',lobj.image),
video:lobj.image,
title:lobj.title,
rel:lobj.rel
};

$("#" + parent_div).css("z-index",50000);

$(".navigate_right").css("z-index",52000);
$(".navigate_left").css("z-index",52000);

$(".popup_container").css("width",iframe_obj.iframeWidth + "px");
$(".popup_container").css("height",iframe_obj.iframeHeight+ "px");

showIframe(iframe_obj);

current_width=iframe_obj.iframeWidth;
current_height=iframe_obj.iframeHeight;


close_left=current_width-72;
left=screen.width/2-iframe_obj.iframeWidth/2;

anime_obj.towidth=iframe_obj.iframeWidth;
anime_obj.toheight=iframe_obj.iframeHeight;
anime_obj.left=left;
setDescription(desc_obj);

animate(anime_obj);
image_is_loading("hide");

break;


default://for images
var img_obj=new Image();
img_obj.rel=lobj.rel;
img_obj.src=lobj.image;
if(img_obj.width>options.imgMinWidth || img_obj.height>options.imgMinHeight && ( lobj.resize==false || lobj.resize==undefined ))
{
$(".popup_container").find(".buttons12").show();
$(".popup_container").find(".buttons12 a.resize").show();
$(".buttons12").find("a.resize").attr("href",img_obj.src).attr("rel",lobj.rel);
resize_image(img_obj);

}
$("#" + parent_div + " .image_holder").html("");
img_obj.onload = function() {
image_is_loading("hide");

towidth=this.width;
toheight=this.height;

$("#" + parent_div).css("z-index",50000);
$(".navigate_right").css("z-index",52000);
$(".navigate_left").css("z-index",52000);
$("#" + parent_div + " .image_holder").html("<img width='"+towidth+"' height='"+toheight+"' src='" + img_obj.src + "'" + " rel='"+lobj.rel+"'/>");
$(".popup_container").css("width",towidth + "px");
$(".popup_container").css("height",toheight+ "px");
$(".image_holder").css("width",towidth + "px");
$(".image_holder").css("height",toheight+ "px");
//$("#" + parent_div + " .image_holder").hide();

// descriptions object for the image
desc_obj.title=img_title;
//set description
setDescription(desc_obj);




current_width=towidth;
current_height=toheight;

close_left=current_width-72;
left=screen.width/2-towidth/2;


anime_obj.towidth=towidth;
anime_obj.toheight=toheight;
anime_obj.left=left;
image_is_loading("hide");
animate(anime_obj);






//image thumbs
if($("#" + parent_div + " .popup_container").find("#thumbs").length==0)
{
//$("#" + parent_div).find(".popup_container").append("");
}
var thumb_count=0;
$("a[rel='"+lobj.rel+"']").each(function(i){
var img_thumb=new Image();
img_thumb.rel=lobj.rel;
img_thumb.src=$(this).attr("href");
img_thumb.width=50;
img_thumb.height=50;
//var thumb_id="hh";
var thumb_id="thumb_"+img_thumb.rel+"_"+i;
var thumb_left;
var thumb_ul_width;

if($("#" + parent_div + " .popup_container").find("#"+thumb_id).length==0){
$("#" + parent_div + " .popup_container").find("#thumbs ul").append("<li><img class='tikslusbox_thumb' id='"+thumb_id +"' seq='"+i+"'  src='" + img_thumb.src + "'" + " rel='"+img_thumb.rel+"'" + "width=" + img_thumb.width + " height=" + img_thumb.height +"></li>");
}
thumb_count++;
});

thumb_left=img_obj.width/thumb_count;
$("#" + parent_div + " .popup_container").find("#thumbs").css("left",thumb_left+ "px");
$("#" + parent_div + " .popup_container").find("#thumbs ul").css("min-width",4*50 + "px");
thumb_ul_width=thumb_count*50;
if(thumb_ul_width>img_obj.width){$("#thumbs").css("width",img_obj.width-2*50 + "px"); }
$("#" + parent_div + " .popup_container").find("#thumbs ul").css("width",thumb_ul_width + "px");
$("#" + parent_div + " .popup_container").find("#thumbs .thumb_forward").css("left",thumb_ul_width + thumb_left + "px");





$(".thumb_forward").click(function(){
move_thumbnails("right");
});
$(".thumb_backward").click(function(){
move_thumbnails("left");
});


$(".tikslusbox_thumb").click(function(){
//find sequence number
var seq=$(this).attr("seq");
currentIndex=seq-1;
slideShow_moveTo($(this).attr("rel"),"next");
return false;
});


}




}

}

function move_thumbnails(moveto)
{
var ul_obj=$("#" + parent_div + " .popup_container").find("#thumbs ul");
var ul_left;

if(moveto=="right")
{
ul_left=ul_obj.css("margin-left");
ul_left=ul_left.substring(0,ul_left.indexOf("px"));
$("#" + parent_div + " .popup_container").find("#thumbs ul").animate({marginLeft:ul_left-50},100);

}
if(moveto=="left")
{
ul_left=ul_obj.css("margin-left");
ul_left=ul_left.substring(0,ul_left.indexOf("px"));
if(ul_left<0)
{
$("#" + parent_div + " .popup_container").find("#thumbs ul").animate({marginLeft:ul_left-50*-1},20);
ul_left=ul_obj.css("margin-left");
}

}

}

$(".resize").click(function(e){
e.preventDefault();
var img_objr=new Image();
img_objr.src=$(this).attr("href");
image_is_loading("show");
img_objr.onload = function() {
image_is_loading("hide");

var towidth=this.width;
var toheight=this.height;

$("#" + parent_div).css("z-index",50000);
$(".navigate_right").css("z-index",52000);
$(".navigate_left").css("z-index",52000);
$("#" + parent_div + " .image_holder").html("<img width='"+towidth+"' height='"+toheight+"' src='" + img_objr.src + "' rel='"+$(this).attr("rel")+"'/>");
$(".popup_container").css("width",towidth + "px");
$(".popup_container").css("height",toheight+ "px");
$(".image_holder").css("width",towidth + "px");
$(".image_holder").css("height",toheight+ "px");
var anime_obj={
towidth:0,
toheight:0,
left:0,
imageTransitionDelay:options.imageTransitionDelay,//delay used with animate{} function
animationType:options.animationType
};
var left=screen.width/2-towidth/2;


anime_obj.towidth=towidth;
anime_obj.toheight=toheight;
anime_obj.left=left;
image_is_loading("hide");
animate(anime_obj);


}
$(this).hide();
});

function animate(aobj)
{
//handle animation
//animate tikslusbox or lightbox
switch(aobj.animationType)
{
case "default":
$("#"+parent_div).show();
$("#" + parent_div).animate({
width: aobj.towidth,
height:aobj.toheight,
left:aobj.left,
top:($(window).height() - aobj.toheight)/2 + $(window).scrollTop()

},aobj.imageTransitionDelay);
$("#"+parent_div + " .image_holder").fadeIn("slow");
break;
case "fade":
$("#" + parent_div).hide();
$("#" +parent_div + " .image_holder").fadeIn("slow");
$("#" + parent_div).css("width",aobj.towidth + "px");
$("#" + parent_div).css("height",aobj.toheight + "px");
$("#" + parent_div).css("left",aobj.left + "px");
$("#" + parent_div).css("top",(($(window).height() - $("#" + parent_div).outerHeight())/2) + $(window).scrollTop() + "px");

$("#" + parent_div).fadeIn(aobj.imageTransitionDelay);
break;

case "elastic":
$("#"+parent_div).show();
$("#"+parent_div + " .image_holder").show();
$("#" + parent_div).animate({
width:0,
height:0,
top:$(window).scrollTop() + $(window).height()/2,
left: $(window).width()/2

},aobj.imageTransitionDelay/2,function(){
$("#" + parent_div).animate({
width: aobj.towidth,
height:aobj.toheight,
left:aobj.left,
opacity:1,
top:($(window).height() - aobj.toheight)/2 + $(window).scrollTop()
},aobj.imageTransitionDelay);
});
$("#"+parent_div).show();
$("#"+parent_div + " .image_holder").fadeIn("slow");


break;
case "elastic2":
$("#" + parent_div).animate({
height:0

},aobj.imageTransitionDelay/2,function(){
$("#" + parent_div).animate({
width: aobj.towidth,
height:aobj.toheight,
left:aobj.left,
opacity:1,
top:($(window).height() - aobj.toheight)/2 + $(window).scrollTop()
},aobj.imageTransitionDelay);
});
$("#"+parent_div + " .image_holder").fadeIn("slow");
break;


}



$("#" + parent_div).find(".shadow_left").show();
$("#" + parent_div).find(".shadow_right").show();
$("#" + parent_div).find(".tikslusbox_info").fadeIn("slow");

}

//overwrite information bar properties with user provided
function setDescription(dobj)
{
$(".tikslusbox_info").css("background-color",dobj.descriptionBarBgColor);
$(".tikslusbox_info").css("font-size",dobj.descriptionBarFontSize + "px");
$(".tikslusbox_info").css("font-family",dobj.descriptionBarFontName);
$(".tikslusbox_info").css("opacity",dobj.descriptionBarOpacity);
$(".tikslusbox_info").css("text-align",dobj.descriptionBarTextAlign);

}
//thanks to these guys for writing this function
//http://www.bloggingdeveloper.com/post/JavaScript-QueryString-ParseGet-QueryString-with-Client-Side-JavaScript.aspx
//this is used to split url. useful when mediatype is any video or iframe to find out mediawidth,mediaheight,iframescrolling etc
function getQuerystring(key,url,default_)
{
  if (default_==null) default_="";
  key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
  //var qs = regex.exec(window.location.href);
  var qs = regex.exec(url);
  if(qs == null)
    return default_;
  else
    return qs[1];
}

//create embed code for videos
function showVid(vid_obj,mediatype)
{
var embed_code;
var temp;
switch(mediatype)
{
case "swf":
case "flv":
embed_code="<object" + " rel='" +  vid_obj.rel+ "' width='" + vid_obj.mediaWidth + "' height='" + vid_obj.mediaHeight + "'><param name=movie value='" + vid_obj.video + "' /><param name='wmode' value='transparent' /><embed  align='middle' src='" + vid_obj.video + "' type='application/x-shockwave-flash'  wmode='transparent'  width='" + vid_obj.mediaWidth + "' height='" + vid_obj.mediaHeight + "'  pluginspage='http://www.macromedia.com/go/getflashplayer'/></object>";
//check for error
if(!(vid_obj.video).match(/[a-zA-Z0-9]+\.(swf|flv)\?width\=[0-9]+&height\=[0-9]+/))
{
embed_code="<div id='tikslsubox_error'><h2>Error</h2><p>Invalid swf/flv file. You must specify width and height of the video.</p><p>File must have .swf or .flv extention.</p></div>";
}
break;
case "youtube":
var youtube_vid="http://youtube.com/v/" + getQuerystring("v",vid_obj.video) + "?width=" + getQuerystring("width",vid_obj.video) + "&height=" + getQuerystring("height",vid_obj.video) ;
embed_code="<object id='obj'" + " rel='" +  vid_obj.rel+ "' width='" + vid_obj.mediaWidth + "' height='" + vid_obj.mediaHeight + "'><param name=movie value='" + youtube_vid + "' /><param name='wmode' value='transparent' /><embed  align='middle' src='" + youtube_vid + "' type='application/x-shockwave-flash'  wmode='transparent'  width='" + vid_obj.mediaWidth + "' height='" + vid_obj.mediaHeight + "'  pluginspage='http://www.macromedia.com/go/getflashplayer'/></object>";
//check for error
if(!(vid_obj.video).match(/http:\/\/(www\.)?youtube\.com\/watch\?v\=[a-zA-Z0-9]+&width\=[0-9]+&height\=[0-9]+/))
{
embed_code="<div id='tikslsubox_error'><h2>Error</h2><p>Invalid youtube URL</p></div>";
}

break;

case "vimeo":
var vid_id=(vid_obj.video).split("/");
var vimeo_vid="http://player.vimeo.com/video/" + vid_id[vid_id.length-1];

embed_code="<iframe src='" + vimeo_vid + "?title=0&amp;byline=0&amp;portrait=0' width='" + vid_obj.mediaWidth + "' height='" + vid_obj.mediaHeight + "' frameborder='0' " + "rel='" + vid_obj.rel + "'></iframe>";
//check for error
if(!(vid_obj.video).match(/http:\/\/(www\.)?vimeo\.com\/[0-9]+\?width\=[0-9]+&height\=[0-9]+/))
{
embed_code="<div id='tikslsubox_error'><h2>Error</h2><p>Invalid Vimeo URL</p><p>Correct format is: <br/>http://www.youtube.com/watch?v=<b>video id</b></p></div>";
}


break;

case "megavideo":
var megavideo_vid="http://wwwstatic.megavideo.com/mv_player3.swf?image=http://img3.megavideo.com/.jpg" + "&v=" + getQuerystring("v",vid_obj.video) + "&width=" + getQuerystring("width",vid_obj.video) + "&height=" + getQuerystring("height",vid_obj.video) ; 

embed_code="<iframe src='" + megavideo_vid + "' width='" + vid_obj.mediaWidth + "' height='" + vid_obj.mediaHeight + "' frameborder='0' " + "rel='" + vid_obj.rel + "'></iframe>";
break;

case "quicktime":
//.mov files

embed_code="<object" + " rel='" +  vid_obj.rel+ "' width='" + vid_obj.mediaWidth + "' height='" + vid_obj.mediaHeight + "' classid='clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B' codebase='http://www.apple.com/qtactivex/qtplugin.cab'><param name='src' value='" + vid_obj.video + "' /><embed src='" + vid_obj.video + "'   width='" + vid_obj.mediaWidth + "' height='" + vid_obj.mediaHeight + "'  pluginspage='http://www.apple.com/quicktime/download/' /></object>";
//check for error
if(!(vid_obj.video).match(/[a-zA-Z0-9]+\.mov\?width\=[0-9]+&height\=[0-9]+/))
{
embed_code="<div id='tikslsubox_error'><h2>Error</h2><p>Invalid Quicktime file. You must specify width and height of the video.</p><p>File must have .mov extention.</p></div>";
}

break;
case "real":
//.ram
embed_code="<object" + " rel='" +  vid_obj.rel+ "' width='" + vid_obj.mediaWidth + "' height='" + vid_obj.mediaHeight + "' classid='clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA' ><param name='controls' value='ImageWindow' /><param name='autostart' value='true' /><param name='src' value='" + vid_obj.video + "' /></object>";
//check for error
if(!(vid_obj.video).match(/[a-zA-Z0-9]+\.ram\?width\=[0-9]+&height\=[0-9]+/))
{
embed_code="<div id='tikslsubox_error'><h2>Error</h2><p>Invalid real media file. You must specify width and height of the video.</p><p>File extension must be .ram</p></div>";
}


break;
case "video":
//.wmv .avi etc
embed_code="<object" + " rel='" +  vid_obj.rel+ "' width='" + vid_obj.mediaWidth + "' height='" + vid_obj.mediaHeight + "' classid='clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95' standby='Loading Windows Media Player components...' type='application/x-oleobject' codebase='http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=6,4,7,1112'><param name='FileName' value='" + vid_obj.video + "' <param name='Showcontrols' value='True'> <param name='autoStart' value='True'><embed type='application/x-mplayer2' src='" + vid_obj.video + "' name='MediaPlayer' width='" + vid_obj.mediaWidth + "' height='"+vid_obj.mediaHeight + "'></embed></object>";

//check for error
if(!(vid_obj.video).match(/[a-zA-Z0-9]+\.(wmv|avi|mpg|mpeg|mp4)\?width\=[0-9]+&height\=[0-9]+/))
{
embed_code="<div id='tikslsubox_error'><h2>Error</h2><p>Invalid Window media file. You must specify width and height of the video.</p><p>File must any of these file extentions (.wmv,.avi,.mpg,.mp4,.mpeg).</p></div>";
}
break;

case "myspace":
temp=vid_obj.video;
var vid_id=temp.split("/");

var myspace_vid=vid_id[vid_id.length-1];

myspace_vid=myspace_vid.substring(0,myspace_vid.indexOf("?"));

embed_code='<object ' + 'rel="' + vid_obj.rel + '" width="'+ vid_obj.mediaWidth + '" height="' + vid_obj.mediaHeight + '" ><param name="allowFullScreen" value="true"/><param name="wmode" value="transparent"/><param name="movie" value="http://mediaservices.myspace.com/services/media/embed.aspx/m=' + myspace_vid + ',t=1,mt=video"/><embed src="http://mediaservices.myspace.com/services/media/embed.aspx/m=' + myspace_vid + ',t=1,mt=video" width="' + vid_obj.mediaWidth +'"  height="' + vid_obj.mediaHeight +  '" allowFullScreen="true" type="application/x-shockwave-flash" wmode="transparent"></embed></object>'

//check for error
if(!(vid_obj.video).match(/http:\/\/(www\.)?myspace\.com\/video\/[a-zA-z0-9-_\s]+\/[a-zA-z0-9-_\s]+\/[0-9]+\?width\=[0-9]+&height\=[0-9]+/))
{
embed_code="<div id='tikslsubox_error'><h2>Error</h2><p>Invalid Myspace URL</p><p>Correct format is: <br/>http://www.myspace.com/video/klaas/our-own-way/107051767?width=300&height=400</p></div>";
}


break;

case "metacafe":
temp=(vid_obj.video).replace("watch","fplayer") ;
var metacafe_vid=temp.substring(0,temp.indexOf("?")-1);
metacafe_vid=metacafe_vid + ".swf";

embed_code='<embed flashVars="playerVars=showStats=yes|autoPlay=no" ' + 'rel="' + vid_obj.rel + '" src="' + metacafe_vid + '" width="' + vid_obj.mediaWidth + '" height="' +  vid_obj.mediaHeight + '" wmode="transparent" allowFullScreen="true" allowScriptAccess="always"  pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"></embed>';

//check for error
if(!(vid_obj.video).match(/http:\/\/(www\.)?metacafe\.com\/watch\/[0-9]+\/[a-zA-z0-9-_\s]+\/+\?width\=[0-9]+&height\=[0-9]+/))
{
embed_code="<div id='tikslsubox_error'><h2>Error</h2><p>Invalid Metacafe URL</p><p>Correct format is: <br/>http://www.metacafe.com/watch/6935932/rage_the_sound_and_art_dev_diary/?width=300&height=400</p></div>";
}


break;

}



$("#" + parent_div + " .image_holder").html("");
$("#" + parent_div + " .image_holder").css("width",vid_obj.mediaWidth + "px");
$("#" + parent_div + " .image_holder").css("height",vid_obj.mediaHeight + "px");
$("#" + parent_div + " .image_holder").html(embed_code + "<div class='tikslusbox_info'></div>");



}

//create iframe and show it
function showIframe(obj)
{
var iframe_code="<iframe width='" + obj.iframeWidth + "' height='" + obj.iframeHeight + "' src='" + obj.iframePage + "' frameborder='0'  scrolling='" + obj.iframeScrolling + "'" + " rel='"+obj.rel +"' ><p>Your browser does not support iframes.</p></iframe>";
$("#" + parent_div + " .image_holder").html("");
$("#" + parent_div + " .image_holder").css("width",obj.iframeWidth + "px");
$("#" + parent_div + " .image_holder").css("height",obj.iframeHeight + "px");
$("#" + parent_div + " .image_holder").html(iframe_code);
}

//show inline content
//we have used iframe to show inlinecontent
//here,iframe is used to maintain group id or "rel" attribute as we have done in showIframe function
function showInlineContent(inline_element_id,rel)
{
var inlineWidth=$(inline_element_id).width();
var inlineHeight=$(inline_element_id).height();
var inlineContent= "<link rel='stylesheet' href='tikslusbox/" + "iframe_" + options.skin + ".css" +  "'>" + $(inline_element_id).html();
var iframe_code="<iframe id='tikslus_inline' rel='" + rel + "' width='" + inlineWidth + "' height='" + inlineHeight + "' frameborder='0' scrolling='" + options.inlineContentScrolling + "'><p>Your browser does not support iframes.</p></iframe>";
$("#" + parent_div + " .image_holder").html("");
$("#" + parent_div + " .image_holder").css("width",inlineWidth + "px");
$("#" + parent_div + " .image_holder").css("height",inlineHeight + "px");
$("#" + parent_div + " .image_holder").html(iframe_code);
var ifrm=document.getElementById("tikslus_inline");

   if(ifrm.contentDocument) 
                             ifrm.doc = ifrm.contentDocument; 
                          else if(ifrm.contentWindow) 
                             ifrm.doc = ifrm.contentWindow.document; 
                          else if(ifrm.document) 
                             ifrm.doc = ifrm.document;                          
                          ifrm.doc = ifrm.contentWindow.document;
						  
				
						  
						  
                          ifrm.doc.open();
                          ifrm.doc.write(inlineContent);
					
                          ifrm.doc.close();
}

//toggle navigation 
function hideNavigation(hideshow)
{
if(hideshow=="hide")
{
$("#" + parent_div).find(".navigate_left").css("display","none");//hide .navigate_bar div
$("#" + parent_div).find(".navigate_right").css("display","none");//hide .navigate_bar div
//for "black" skin
if(options.skin=="black")
{
$(".black_navigate_bar .navigate_left").css("display","none");
$(".black_navigate_bar  .navigate_right").css("display", "none");
}
if(options.skin=="elegant2")
{
$(".elegant2_navigate_bar").css("display","none");
}
if(options.skin=="elegant")
{
$(".elegant_navigate_bar").css("display","none");
}
//for other skins
$("#" + parent_div + " .navigate_left").css("display","none");
$("#" + parent_div + " .navigate_right").css("display", "none");
}
else if(hideshow=="show")
//for "black" skin
{
$("#" + parent_div + " .navigate_left").parent().css("display","block")//show .navigate_bar
$("#" + parent_div + " .navigate_left").css("display","block");
$("#" + parent_div + " .navigate_right").css("display", "block");
if(options.skin=="black")
{
$(".black_navigate_bar .navigate_left").css("display","block");
$(".black_navigate_bar  .navigate_right").css("display", "block");
}

}
else
{
$("#" + parent_div + " .navigate_left").parent().css("display","none");//hide .navigate_bar div
$("#" + parent_div + " .navigate_left").css("display","none");
$("#" + parent_div + " .navigate_right").css("display", "none");
if(options.skin=="black")
{
$(".black_navigate_bar .navigate_left").css("display","none");
$(".black_navigate_bar  .navigate_right").css("display", "none");
}

}
}

//helper function
//show loader image while element is loading
function image_is_loading(action)
{
if(action=="show")
{
var lf=screen.width/2-16;
var tp=($(window).height()/2) + $(window).scrollTop();

$(".image_loading").css("left",lf + "px");
$(".image_loading").css("top",tp + "px");

$(".image_loading").fadeIn("slow");

}
if(action=="hide")
{
$(".image_loading").fadeOut("fast");
}

}//ends here


//construct a skin
function prepare_skin()
{

switch(options.skin)
{
case "default":
$("#" + parent_div).append("<div class='nav_bar'><div class='navigate_left'></div><div class='navigate_right'></div><div class='close_win'></div></div>");
$("#" + parent_div).append("<div class='image_holder'></div><div class='nav_bar'><div class='tikslusbox_info'></div></div>");



break;
case "white":
if($("#" + parent_div + " .image_holder").length==0)
{

$("#" + parent_div).append('<div class="popup_container"><div class="image_holder"></div><div class="footer_nav"><div class="tikslusbox_info"></div><div class="navigate_left"></div><div class="navigate_right" ></div><div class="close_win"></div></div></div>');

$("#" + parent_div ).find(".navigate_left");
$("#" + parent_div ).find(".navigate_right");

$("#" + parent_div).css("background-color","transparent");
$("#" + parent_div).css("background-image","none");
$("#" + parent_div).css("border","0");
$("#" + parent_div).find(".close_win");
}
break;

case "black":
$("#bk_overlay").append("<div class='black_navigate_bar'></div>");
$(".black_navigate_bar").append("<div class='tikslusbox_info'></div><div class='navigate_left'></div><div class='navigate_right'></div><div class='close_win'></div>");
$("#" + parent_div).append('<div class="popup_container"><div class="image_holder"></div></div>');
$(".image_loading").removeClass("default_loader").addClass("black_loader");
break;
case "elegant":

$("#" + parent_div).append('<div class="popup_container"><div class="buttons12"><a href="#" class="resize">Resize</a></div><div class="elegant_navigate_bar"><div class="navigate_left"></div><div class="navigate_right" ></div></div><div class="close_win"></div><div class="image_holder"></div><div class="tikslusbox_info"></div><div id="thumbs"><ul></ul></div><a href="#" class="thumb_backward"></a><a href="#" class="thumb_forward"></a></div>');

$(".image_loading").removeClass("default_loader").addClass("elegant_loader");

break;

case "elegant2":
$("#" + parent_div).append('<div class="popup_container"><div class="elegant2_navigate_bar"><div class="navigate_left"></div><div class="navigate_right" ></div></div><div class="close_win"></div><div class="image_holder"></div><div class="tikslusbox_info"></div></div>');

$(".image_loading").removeClass("default_loader").addClass("elegant2_loader");

break;

case "elegant3":
$("#" + parent_div).append('<div class="elegant3_navigate_bar"><div class="navigate_left"></div><div class="navigate_right" ></div><div class="close_win"></div></div><div class="popup_container"><div class="image_holder"></div><div class="tikslusbox_info"></div></div>');

$(".image_loading").removeClass("default_loader").addClass("elegant3_loader");

break;

case "elegant4":
$("#" + parent_div).append('<div class="popup_container"><div class="image_holder"></div><div class="tikslusbox_info"></div><div class="elegant4_navigate_bar"><div class="navigate_left"></div><div class="navigate_right" ></div><div class="close_win"></div></div></div>');

$(".image_loading").removeClass("default_loader").addClass("elegant4_loader");

break;

case "tikslus":
$("#" + parent_div).append('<div class="tikslus_border_left_top"></div><div class="tikslus_header"><div class="close_win"></div></div><div class="tikslus_border_right_top"></div><div class="tikslus_left"></div><div class="tikslus_right"></div><div class="popup_container"><div class="image_holder"></div><div class="navigate_left"></div><div class="navigate_right"></div><div class="footer"><div class="tikslus_border_left_bottom"></div><div class="tikslus_footer"><div class="tikslusbox_info"></div></div><div class="tikslus_border_right_bottom"></div></div></div>');

$(".image_loading").removeClass("default_loader").addClass("elegant4_loader");

break;

}
}

//some manipulations with skins go here
function skin_adjustments()
{
if(options.skin=="black")
{
var navtop=$(window).scrollTop();
$(".black_navigate_bar").css({"top":navtop + "px"});
}

}

function resize_image(img) {
var maxh=options.imgMinHeight;
var maxw=options.imgMinWidth;
  var ratio = maxh/maxw;
  if (img.height/img.width > ratio){
     // height is the problem
    if (img.height > maxh){
      img.width = Math.round(img.width*(maxh/img.height));
      img.height = maxh;
    }
  } else {
    // width is the problem
    if (img.width > maxh){
      img.height = Math.round(img.height*(maxw/img.width));
      img.width = maxw;
    }
  }

}



//if user scrolls the document ajust the lightbox position
$(document).scroll(function() {

if($("#" + parent_div).is(':visible'))
{
var toheight=$("#" + parent_div).height();
var towidth=$("#" + parent_div).width();
$("#" + parent_div).animate({
top:($(window).height() - toheight)/2 + $(window).scrollTop(),
left:($(window).width() - towidth)/2 + $(window).scrollLeft()
},300);
}
});


}

