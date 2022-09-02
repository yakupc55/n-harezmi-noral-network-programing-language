var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var alanW=c.width;
var alanH=c.height;

var ortaX=alanW/2;
var ortaY=alanH/2;
var startNetworkX=ortaX;
var startNetworkY=50;
var networkSize=2;
var networkListSize=(networkSize*2)+1;
var networkList=[];


var distanceX = 150;
var distanceY = 100;
var circleSize = 50;

function createNetwork(){
    createNetworkFirstList();
    calculateCirclesCordinates();
    drawNetworkCircles();
}

function calculateCirclesCordinates()
{
    console.log("calculateCircle");
    for (let y = 0; y < networkList.length; y++) {
        let firtDistance = (networkList[y].length - 1)*(distanceX/2);
        let startX= startNetworkX-firtDistance;
    
        for (let x = 0; x < networkList[y].length; x++) {
            networkList[y][x].y =startNetworkY +( distanceY * y);
            networkList[y][x].x =startX+( distanceX * x);
        }
    }
    
    console.log("networkList");
    console.log(networkList);
}

function drawNetworkCircles(){
    for (let y = 0; y < networkList.length; y++) {
        for (let x = 0; x < networkList[y].length; x++) {
            ctx.beginPath();
            ctx.arc(networkList[y][x].x, networkList[y][x].y, circleSize, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
}

function createNetworkFirstList(){
networkList[0]=([{x:startNetworkX,y:startNetworkY}]);

var sizeCounter=networkSize;
var amountOfNewItems=1;
while(sizeCounter>0){
    amountOfNewItems++;
    var itemCounter=amountOfNewItems;
    networkList[amountOfNewItems-1]=[];
    networkList[networkListSize-amountOfNewItems]=[];
    while (itemCounter>0){
        networkList[amountOfNewItems-1].push({x:0,y:0});
        if(amountOfNewItems!=networkSize+1){
            networkList[networkListSize-amountOfNewItems].push({x:0,y:0});
        }
        itemCounter--;
    }
    sizeCounter--;
}
networkList[networkListSize-1]=([{x:startNetworkX,y:startNetworkY}]);

console.log("networkList");
console.log(networkList);
}

function ciz() {
// öncelikle tüm alanı temizliyoruz
ctx.fillStyle = "white";
ctx.fillRect(0, 0, alanW, alanH);  
ctx.moveTo(ortaX, startNetworkY);
ctx.lineTo(ortaX, startNetworkY+25);
ctx.stroke();
createNetwork();
}
