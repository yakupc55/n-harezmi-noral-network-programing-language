
let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
let alanW=c.width;
let alanH=c.height;

let centerX=alanW/2;
let centerY=alanH/2;
let startNetworkX=120;
let startNetworkY=centerY;
let networkSize=2;
let dataSize=5;
let networkListSize=(networkSize*2)+1;
let networkList=[];
let networkSimpleList=[];
let NoronSize=0;

let distanceX = 160;
let distanceY = 160;
let circleSize = 60;

let codeCount=0;
let codeRowList=[];
let ExampleName="";
window.onload = function(e){
    getTextDataFromUrlToTextarea("example1.lang","codes");
}

function onChangeExampleValue() {
    let selectedExample = document.getElementById("example").value;
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
    parserCodes();
}

function parserCodes(){
    splitToCodesToRow();
    codeCount=0;
    getExampleName();
    startCodeReading();
}

function startCodeReading(){
    
}

function getExampleName(){
    ExampleName=codeRowList[codeCount];
    codeCount++;
}

function splitToCodesToRow(){
   // console.log("split to codes to row");
    let codeTextarea = document.getElementById("codes");
    codeRowList = codeTextarea.value.split("\n");
}

function getTextDataFromUrlToTextarea(fileUrl,TextareaId){
    let request = new XMLHttpRequest();
    request.open('GET', fileUrl, true);
    request.responseType = 'blob';
    request.onload = function() {
        let reader = new FileReader();
        reader.readAsText(request.response);
        reader.onload =  function(e){
            let textArea = document.getElementById(TextareaId);
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
    let fontSize=circleSize/4;
    let fontSpace=4;
    let startX=0-(circleSize/2);
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
    let lineToindex=0; 
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
    let counter=0;
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
    let currentRowLength=networkList[i].length;
    let secondRowLength=networkList[i+add].length;
    
    let currentJ = (currentRowLength>secondRowLength)? j-1 : j;
    
    addPathstoByLength(i,j,currentJ,add);
}

function addPathstoANoron(i,j){
    // let counter=0;
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

let sizeCounter=networkSize;
let amountOfNewItems=1;
while(sizeCounter>0){
    amountOfNewItems++;
    let itemCounter=amountOfNewItems;
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
