
var wcm = new WebCamera({
    //If "videoTag" is omitted, it is generated automatically
    constraints: {
        video: {
            width: 320,
            height: 240
        }
    }
});


var container = document.getElementById("container");
var videoTag = wcm.getVideoTag();
container.appendChild(videoTag);

wcm.startCamera();


var btnStart = document.getElementById("start");
btnStart.addEventListener("click", function () {
    wcm.startCamera();
});

