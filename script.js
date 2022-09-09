
let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
let fieldW=c.width;
let fieldH=c.height;

let centerX=fieldW/2;
let centerY=fieldH/2;
let startNetworkX=145;
let networkWidth=604;
let startNetworkY=centerY;
let networkSize=2;
let minNetworkSize=2;
let maxNetworkSize=6;
let dataSize=5;
let networkListSize=(networkSize*2)+1;
let networkList=[];
let networkSimpleList=[]; // one row list
let NoronSize=0;

let exampleNameAreaRectSizes={x:240,y:60};
let exampleNameAreaCordinates={x:centerX,y:(exampleNameAreaRectSizes.y/2)};

let currentData=0;
let currentDataAreaRectSizes={x:120,y:80};
let currentDataAreaCordinates={x:fieldW-(currentDataAreaRectSizes.x/2),y:(currentDataAreaRectSizes.y/2)};

let distanceX = 160;
let distanceY = 160;
let circleSize = 60;

let inputData=0;
let ouptutData=0;

let iORectSize = 60;
let inputCordinates = {x:(iORectSize/2),y:centerY};
let outputCordinates = {x:fieldW-(iORectSize/2),y:centerY};

let codeCount=0;
let codeRowList=[];
let ExampleName="";

let versionNames= ["Langv1"];
let neuralNetworkTypeNames = ["Minv1"];
let currentVersion="";
let currentNeuralNetwork="";
let tempData="";

let currentWorkingNoron=-1;
window.onload = function(e){
    getTextDataFromUrlToTextarea("example1.lang","codes");
    firstDraws();
    closeAllNetworkButton();
}

function onChangeExampleValue() {
    let selectedExample = document.getElementById("example").value;
    console.log(selectedExample);
    getTextDataFromUrlToTextarea(selectedExample+".lang","codes");
    closeAllNetworkButton();
    //alert(d);
}

function closeAllNetworkButton(){
    changeButtonSituation("start-network",true);
    changeButtonSituation("next-step",true);
    changeButtonSituation("stop-network",true);
}

function openNetworkButtonsWithStarts(){
    changeButtonSituation("next-step",false);
    changeButtonSituation("stop-network",false);
}

function changeButtonSituation(buttonName,buttonSituation){
  document.getElementById(buttonName).disabled = buttonSituation;
}

async function startNetworkSystem(){
    //open buttons
    openNetworkButtonsWithStarts();
    doTheProcessOfNoron(currentWorkingNoron);
    // give a test input 
    inputData=2;
}

async function doTheProcessOfNoron(noronNo){
    if(noronNo>-1){
        //for noron process
    }
    // for input output process
    else{
        switch (noronNo){
            case -1: nsworkwithInputPath(); break;
            case -2: nsworkwithOutputPath(); break;
            default: alert("This is not a special noron");
        }
    }
}

async function nsworkwithInputPath(){
    console.log("you working with input path");
}
async function nsworkwithOutputPath(){
    console.log("you working with output path");
}

async function firstDraws(){
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, fieldW, fieldH);  
}

 async function createNetwork(){
    await codeTest();
    await firstDraws();
    await parserCodes();
    changeButtonSituation("start-network",false);
}

async function drawNeuralNetwork(){
    await drawPathLines();
    await drawNetworkCircles();
    await drawDataSetinNoron();
    await drawInputOutputInformation();
    await drawExampleNameArea();
    await drawCurrentDataArea();
}

async function calculateAndCreateNetwork(){
    await createNetworkFirstList();
    await calculateCordinatesValues();
    await calculateCirclesCordinates();
    await giveIndexs();
    await givePathsToNorons();
    await convertToOneList();
    await createEmptyDataSet();
}

function codeTest2(){
 
}

//for testing some codes
async function codeTest(){
    console.log("code test is running");
}

function getInformation(){
    console.log('====================================');
    console.log("get information page start");
    console.log('====================================');
    console.log("lang version : "+currentVersion);
    console.log("neural network type : "+currentNeuralNetwork);
    console.log('====================================');
    console.log("get information page end");
    console.log('====================================');
}


async function parserCodes(){
    try {
        
        await splitToCodesToRow();
        codeCount=0;
        getExampleName();
        startCodeReading();

    } catch (error) {
        console.log("we have an error");
        console.log(error);
    }
}

function controlList(name,list){
    // console.log("name : "+name);
    let isExist=false;
    for (let index = 0; index < list.length; index++) {
        if(list[index].toUpperCase()==name.toUpperCase()){
            tempData=list[index];
            return true;
        } 
    }
    return isExist;
}

async function updateDateSetFromExample() {
    // console.log("update side")
    // console.log("codeCount : "+codeCount);
    // console.log("code row list : ");
    // console.log(codeRowList);
    // console.log("network simple list : ");
    // console.log(networkSimpleList);
    let miniParser = [];
    for (let i = 0; i < networkSimpleList.length; i++) {
        miniParser = codeRowList[codeCount].split(",");
        for (let d = 0; d < dataSize; d++) {
            networkSimpleList[i].dataSet[d] = miniParser[d];
        }
        codeCount++;
    }

    // console.log("update date set from example :");
    // console.log("networkSimpleList");
    // console.log(networkSimpleList);
}

async function snMinV1NetworkProcess(){
    await calculateAndCreateNetwork();
    await updateDateSetFromExample();
    await drawNeuralNetwork();
}

function snMinV1NetworkSize(size){
    // console.log("before changed network size : "+networkSize+ " typeof networkSize "+typeof(networkSize));
    // console.log("sn min v1 network size size : ");
    // console.log(size);
    if(size<=maxNetworkSize && size>=minNetworkSize){
        networkSize=size;
        networkListSize=(size*2)+1;
        snMinV1NetworkProcess();
        // console.log("later changed network size : "+networkSize+ " typeof networkSize "+typeof(networkSize));
    }
    else{
        alert("size is invalid");
    }
}
//ns  next step
function nsTypeOfMinV1() {
    console.log("everything is succesfull");
    let size=codeRowList[codeCount];
    if(Number.isInteger(parseInt(size))){
        codeCount++;
        snMinV1NetworkSize(parseInt(size));
    }else{
        alert("Network Size is not integer");
    }
}

function nsNeuralNetworkType() {
    switch (currentNeuralNetwork){

        // Minv1
        case neuralNetworkTypeNames[0]:  nsTypeOfMinV1(); break;

        default: alert("This neural network tyep can't be used with this language version");
    }
    //console.log("neural network type : "+currentNeuralNetwork);
}

function nsLangv1Version(){
    //get the name of neural network type
    let type=codeRowList[codeCount];
     console.log("type : "+type);
    if(controlList(type,neuralNetworkTypeNames)){
        codeCount++;
        currentNeuralNetwork=tempData;
        nsNeuralNetworkType();
    }else{
        let message="you use wrong neural network type";
        console.log(message);
        alert(message);
    }
}


function nsLangVersion() {
    switch (currentVersion){

        // Langv1
        case versionNames[0]:  nsLangv1Version(); break;

        default: alert("This version can't be runned");
    }
    //console.log("lang version : "+currentVersion);
}

function startCodeReading(){
    let name=codeRowList[codeCount];
    // console.log("name : "+name);
    if(controlList(name,versionNames)){
        codeCount++;
        currentVersion=tempData;
        nsLangVersion();
    }else{
        let message="you use wrong language version";
        console.log(message);
        alert(message);
    } 
}

function getExampleName(){
    ExampleName=codeRowList[codeCount];
    codeCount++;
}

async function splitToCodesToRow(){
   // console.log("split to codes to row");
    let codeTextarea = document.getElementById("codes");
    codeRowList = codeTextarea.value.split("\n");
    console.log(codeRowList);
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

async function createEmptyDataSet() {
    for (let i = 0; i < networkSimpleList.length; i++) {
        networkSimpleList[i].dataSet=[0,0,0,0,0];
    }
    // console.log("create Empty Data Set :");
    // console.log("networkSimpleList");
    // console.log(networkSimpleList);
}

async function drawDataSetinNoron(){
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

async function drawPathLines() {
    ctx.beginPath();
    let lineToindex=0; 
    for (let i = 0; i < networkSimpleList.length; i++) {
        for (let p = 0; p < networkSimpleList[i].paths.length; p++) {
            lineToindex = networkSimpleList[i].paths[p];
            //control for input or output paths
            if(lineToindex>-1){
                ctx.moveTo(networkSimpleList[i].x,networkSimpleList[i].y);
                ctx.lineTo(networkSimpleList[lineToindex].x,networkSimpleList[lineToindex].y);
            }
        }
    }

    //draw input line
    ctx.moveTo(inputCordinates.x+(iORectSize/2),inputCordinates.y);
    ctx.lineTo(networkSimpleList[0].x,networkSimpleList[0].y);

    //draw output line
    ctx.moveTo(outputCordinates.x-(iORectSize/2),outputCordinates.y);
    ctx.lineTo(networkSimpleList[networkSimpleList.length-1].x,networkSimpleList[networkSimpleList.length-1].y);

    ctx.stroke();
}

async function convertToOneList(){
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

function calculateRectFromCenterCordinatesObject(cordinates,sizes){
   return calculateRectFromCenterCordinates(cordinates.x,cordinates.y,sizes.x,sizes.y);
}

function calculateRectFromCenterCordinates(rectCenterX,rectCenterY,rectWidth,rectHeight){
    return {x:rectCenterX-(rectWidth/2),y:rectCenterY-(rectHeight/2),w:rectWidth,h:rectHeight}
}

async function drawCurrentDataArea(){
    let currentDataFontSize=18;
    let r = calculateRectFromCenterCordinatesObject(currentDataAreaCordinates,currentDataAreaRectSizes);
    ctx.beginPath();
    ctx.rect(r.x,r.y,r.w,r.h); 
    ctx.fillStyle = '#ddffddaa';
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.font = 'italic '+currentDataFontSize+'pt Calibri';
    let text="Data";
    let textWidth=ctx.measureText(text).width;
    ctx.fillText(text,currentDataAreaCordinates.x-(textWidth/2),currentDataAreaCordinates.y-currentDataFontSize);
    ctx.fillText(currentData,currentDataAreaCordinates.x-10,currentDataAreaCordinates.y+5);
    ctx.stroke();
}

async function drawExampleNameArea(){
    let exampleNameFontSize=18;
    let r = calculateRectFromCenterCordinatesObject(exampleNameAreaCordinates,exampleNameAreaRectSizes);
    ctx.beginPath();
    ctx.rect(r.x,r.y,r.w,r.h); 
    ctx.fillStyle = '#ddffddaa';
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.font = 'italic '+exampleNameFontSize+'pt Calibri';
    let text=ExampleName;
    let textWidth=ctx.measureText(text).width;
    ctx.fillText(text,exampleNameAreaCordinates.x-(textWidth/2),exampleNameAreaCordinates.y+(exampleNameFontSize/2));
    ctx.stroke();
}

async function drawInputOutputInformation(){
    //console.log("it is working draw input output information");
    // input area
    ctx.beginPath();
    ctx.rect(inputCordinates.x-(iORectSize/2),inputCordinates.y-(iORectSize/2), iORectSize, iORectSize);
     // output area
    ctx.rect(outputCordinates.x-(iORectSize/2),outputCordinates.y-(iORectSize/2), iORectSize, iORectSize); 
    ctx.fillStyle = '#ddffddaa';
    ctx.fill();
    ctx.stroke();

    let ioFontSize=15;
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.font = 'italic '+ioFontSize+'pt Calibri';
    let text="input";
    let textWidth=ctx.measureText(text).width;
    ctx.fillText(text,inputCordinates.x-(textWidth/2),inputCordinates.y-ioFontSize);
    ctx.fillText(inputData,inputCordinates.x-10,inputCordinates.y+12);
    text="output";
    textWidth=ctx.measureText(text).width;
    ctx.fillText(text,outputCordinates.x-(textWidth/2),outputCordinates.y-ioFontSize);
    ctx.fillText(inputData,outputCordinates.x-10,outputCordinates.y+12);
    ctx.stroke();
}

async function calculateCordinatesValues(){
    //networkWidth=520;
    let distance=networkWidth/(networkList.length-1);//120
    distanceX = distance;
    distanceY = distance;
    circleSize = distance/3;
}

async function calculateCirclesCordinates()
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
    // console.log("calculate network list");
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

async function giveIndexs(){
    // console.log("give indexs");
    let counter=0;
    for (let i = 0; i < networkList.length; i++) {
        for (let j = 0; j < networkList[i].length; j++) {
            networkList[i][j].index=counter;
            counter++;
        }
    }
    NoronSize=counter;
    // console.log("give index");
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

function addPathFromLastNoronToOutput(){
    let index=networkList.length-1;
    networkList[index][0].paths.push(-2);
}
async function givePathsToNorons(){
    for (let i = 0; i < networkList.length; i++) {
        for (let j = 0; j < networkList[i].length; j++) {
            networkList[i][j].paths= [];
            addPathstoANoron(i,j);
        }
    }
    //add paths from last noron to output
    addPathFromLastNoronToOutput();
    console.log("give paths to noron");
    console.log("networkList");
    console.log(networkList);
}

async function drawNetworkCircles(){
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

async function createNetworkFirstList(){
networkList=[];
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
// console.log("create network first list");
// console.log("networkList");
// console.log(networkList);
}

