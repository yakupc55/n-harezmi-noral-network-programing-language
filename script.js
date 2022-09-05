
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var alanW=c.width;
var alanH=c.height;

var centerX=alanW/2;
var centerY=alanH/2;
var startNetworkX=120;
var startNetworkY=centerY;
var networkSize=2;
var dataSize=5;
var networkListSize=(networkSize*2)+1;
var networkList=[];
var networkSimpleList=[];
var NoronSize=0;

var distanceX = 160;
var distanceY = 160;
var circleSize = 60;

window.onload = function(e){
    getTextDataFromUrlToTextarea("example1.lang","codes");
}

function onChangeExampleValue() {
    var selectedExample = document.getElementById("example").value;
    console.log(selectedExample);
    getTextDataFromUrlToTextarea(selectedExample+".lang","codes");
    //alert(d);
}

function createNetwork(){
    codeTest();
    createNetworkFirstList();
    calculateCirclesCordinates();
    giveIndexs();
    givePathsToNorons();
    convertToOneList();
    drawPathLines();
    drawNetworkCircles();
    createEmptyDataSet();
    drawDataSetinNoron();
}

//for testing some codes
function codeTest(){
    console.log("code test is running");
}

function getTextDataFromUrlToTextarea(fileUrl,TextareaId){
    var request = new XMLHttpRequest();
    request.open('GET', fileUrl, true);
    request.responseType = 'blob';
    request.onload = function() {
        var reader = new FileReader();
        reader.readAsText(request.response);
        reader.onload =  function(e){
            var textArea = document.getElementById(TextareaId);
            textArea.value = e.target.result;
        };
    };
    request.send();
}

function createEmptyDataSet() {
    for (let i = 0; i < networkSimpleList.length; i++) {
        networkSimpleList[i].dataSet=[0,0,0,0,0];
    }
    // console.log("create Empty Data Set :");
    // console.log("networkSimpleList");
    // console.log(networkSimpleList);
}

function drawDataSetinNoron(){
    var fontSize=circleSize/4;
    var fontSpace=4;
    var startX=0-(circleSize/2);
    ctx.fillStyle = 'black';

    ctx.font = 'italic '+fontSize+'pt Calibri';
    for (let i = 0; i < networkSimpleList.length; i++) {
        
        for (let data = 0; data < dataSize; data++) {
            ctx.fillText(networkSimpleList[i].dataSet[data], networkSimpleList[i].x+startX, networkSimpleList[i].y+(startX-fontSpace)+(data*(fontSize+fontSpace)));
        }
    }
}

function drawPathLines() {
    ctx.beginPath();
    var lineToindex=0; 
    for (let i = 0; i < networkSimpleList.length; i++) {
        for (let p = 0; p < networkSimpleList[i].paths.length; p++) {
            ctx.moveTo(networkSimpleList[i].x,networkSimpleList[i].y);
            lineToindex = networkSimpleList[i].paths[p];
            ctx.lineTo(networkSimpleList[lineToindex].x,networkSimpleList[lineToindex].y);
        }
    }
    ctx.stroke();
}

function convertToOneList(){
    networkSimpleList=[];
    for (let i = 0; i < networkList.length; i++) {
        for (let j = 0; j < networkList[i].length; j++) {
            networkSimpleList.push(networkList[i][j]);
        }
    }
    // console.log("convert to one list");
    // console.log("networkSimpleList");
    // console.log(networkSimpleList);
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
    // console.log("i : "+i+" j : "+j);
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

function addPathstoByLength(i,j,currentJ,add){
    if(isExistInIndex(i+add,currentJ)){
        networkList[i][j].paths.push(networkList[i+add][currentJ].index);
    }
    if(isExistInIndex(i+add,currentJ+1)){
        networkList[i][j].paths.push(networkList[i+add][currentJ+1].index);
    }
}

function addPathstoNoronByRow(i,j,add){
    var currentRowLength=networkList[i].length;
    var secondRowLength=networkList[i+add].length;
    
    var currentJ = (currentRowLength>secondRowLength)? j-1 : j;
    
    addPathstoByLength(i,j,currentJ,add);
}

function addPathstoANoron(i,j){
    // var counter=0;
    //check previous row
    if(isExistInIndex(i-1,0))
    {
        // console.log("it has a previous row value");
        addPathstoNoronByRow(i,j,-1)
    }
    //check next row 
    if(isExistInIndex(i+1,0)){
        // console.log("it has a next row value");
        addPathstoNoronByRow(i,j,+1)
    }

    //check previous index
    if(isExistInIndex(i,j-1))
    {
        networkList[i][j].paths.push(networkList[i][j-1].index);
        //  console.log("it has a previous value");
    }
    //check next index
    if(isExistInIndex(i,j+1)){
        networkList[i][j].paths.push(networkList[i][j+1].index);
        // console.log("it has a next value");
    }
}

function givePathsToNorons(){
    for (let i = 0; i < networkList.length; i++) {
        for (let j = 0; j < networkList[i].length; j++) {
            networkList[i][j].paths= [];
            addPathstoANoron(i,j);
        }
    }
    // console.log("give paths to noron");
    // console.log("networkList");
    // console.log(networkList);
}

function drawNetworkCircles(){
    for (let y = 0; y < networkList.length; y++) {
        for (let x = 0; x < networkList[y].length; x++) {
            ctx.beginPath();
            ctx.arc(networkList[y][x].x, networkList[y][x].y, circleSize, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
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

// console.log("networkList");
// console.log(networkList);
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
