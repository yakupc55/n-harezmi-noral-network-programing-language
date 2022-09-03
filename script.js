var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var alanW=c.width;
var alanH=c.height;

var centerX=alanW/2;
var centerY=alanH/2;
var startNetworkX=120;
var startNetworkY=centerY;
var networkSize=2;
var networkListSize=(networkSize*2)+1;
var networkList=[];
var NoronSize=0;

var distanceX = 160;
var distanceY = 160;
var circleSize = 60;

function createNetwork(){
    createNetworkFirstList();
    calculateCirclesCordinates();
    drawNetworkCircles();
    giveIndexs();
    givePathsToNorons();
}

function calculateCirclesCordinates()
{
    //console.log("calculateCircle");
    for (let i = 0; i < networkList.length; i++) {
        let firtDistance = (networkList[i].length - 1)*(distanceY/2);
        let startY= startNetworkY-firtDistance;
    
        for (let j = 0; j < networkList[i].length; j++) {
            networkList[i][j].y =startY +( distanceY * j);
            networkList[i][j].x =startNetworkX+( distanceX * i);
        }
    }
    
    // console.log("networkList");
    // console.log(networkList);
}

function isExistInIndex(i,j){
    console.log("i : "+i+" j : "+j);
    if(typeof networkList[i] === 'undefined') {
        return false;
    }
    if(typeof networkList[i][j] === 'undefined') {
        return false;
    }
    
        return true;
}

function giveIndexs(){
    // console.log("give indexs");
    var counter=0;
    for (let i = 0; i < networkList.length; i++) {
        for (let j = 0; j < networkList[i].length; j++) {
            networkList[i][j].index=counter;
            counter++;
        }
    }
    NoronSize=counter;
    // console.log("networkList");
    // console.log(networkList);
}

function addPathstoANoron(i,j){
    //before control
    if(isExistInIndex(i-1,0))
    {
        console.log("it has a previous value");
    }
    // later control
    if(isExistInIndex(i+1,0)){
        console.log("it has a next value");
    }
}

function givePathsToNorons(){
    for (let i = 0; i < networkList.length; i++) {
        for (let j = 0; j < networkList[i].length; j++) {
            networkList[i][j].paths= [];
            addPathstoANoron(i,j);
        }
    }
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
ctx.moveTo(centerX, startNetworkY);
ctx.lineTo(centerX, startNetworkY+25);
ctx.stroke();
createNetwork();
}
