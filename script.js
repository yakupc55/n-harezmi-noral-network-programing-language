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

function createNetwork(){
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
