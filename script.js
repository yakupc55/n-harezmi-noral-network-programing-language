
let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
ctx.globalAlpha=1;
let fieldW=c.width;
let fieldH=c.height;

let centerX=fieldW/2;
let centerY=fieldH/2;
let startNetworkX=145;
let networkWidth=604;
let startNetworkY=centerY;
let networkSize=2;
let minNetworkSize=1;
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
let maxCircleSize=60;

let inputData=0;
let outputData=0;

let ioRectOrginalFillStyle="#ddffddaa";
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

let orginalNoronFillStyleColor="white";
let currentWorkingNoron=-1;
let previousWorkingNoron=-1;
let orginalStrokeColor= "black";
let colorCurrentNoron="red";
let colorNextNoron="yellow";

window.onload = function(e){
    getTextDataFromUrlToTextarea("example1.lang","codes");
    firstDraws();
    closeAllNetworkButton();
    codeTest2();
}

function onChangeExampleValue() {
    let selectedExample = document.getElementById("example").value;
    console.log(selectedExample);
    getTextDataFromUrlToTextarea(selectedExample+".lang","codes");
    closeAllNetworkButton();
    firstDraws();
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

async function nextStepNetworkSystem(){
    doTheProcessOfNoron(currentWorkingNoron);
}

async function stopNetworkSystem(){
    firstDraws();
    closeAllNetworkButton();
}

async function startNetworkSystem(){
    let inputValue = document.getElementById("input-value").value;
    if(inputValue.length>0){
        inputData=parseInt(inputValue);      
        currentData=inputData;
        //close start network button
        changeButtonSituation("start-network",true);
        //open buttons
        openNetworkButtonsWithStarts();

        //reset something
        resetDatasForStartNetwork()

        //start processing
        doTheProcessOfNoron(currentWorkingNoron);
        // give a test input 
    }
    else{
        alert("please enter an input number");
    }
    
}

async function resetDatasForStartNetwork(){
    currentWorkingNoron=-1
}

async function nsEditDrawPreviousStep(noronNo){
    // console.log("edit draw previous step noron no : "+noronNo);
    if(noronNo<0)
    {
        switch (noronNo) {
            case -1: drawInputInformation(ioRectOrginalFillStyle); break;
            case -2: drawOutputInformation(ioRectOrginalFillStyle); break;
        
            default:  break;
        }
    }
    else{
        drawWorkingNoron(noronNo,orginalNoronFillStyleColor);
    }
}

async function nsEditDrawPreviousPath(previousNoron,currentNoron){
    ctx.lineWidth =3 ;
    await drawWorkingPath(previousNoron,currentNoron,'white');
    ctx.lineWidth =1 ;
    drawWorkingPath(previousNoron,currentNoron,"green");
}

async function nsDrawGoToNextNoron(firstNoron,secondNoron){
    //change previous draws
    await nsEditDrawPreviousPath(previousWorkingNoron,firstNoron);
    await nsEditDrawPreviousStep(previousWorkingNoron);
    //change previous noron with new noron
    previousWorkingNoron=firstNoron;
    await drawWorkingPath(firstNoron,secondNoron,colorCurrentNoron);
    await drawWorkingNoron(firstNoron,colorCurrentNoron);
    if(secondNoron>0)
    drawWorkingNoron(secondNoron,colorNextNoron);
    else
    drawOutputInformation(colorNextNoron);
}

async function nsNetworkProcessSender(noronNo){
    // console.log("this is working perfectly");
    let getTypeOfProcess=networkSimpleList[noronNo].dataSet[1];
    if(getTypeOfProcess>-1 && getTypeOfProcess<3){
      let useDataSet=getTypeOfProcess+2;
      let pathAddress = networkSimpleList[noronNo].dataSet[useDataSet];
      currentWorkingNoron=networkSimpleList[noronNo].paths[pathAddress];
      nsDrawGoToNextNoron(noronNo,currentWorkingNoron);
    }else{
        alert("type of process is not available");
    }
}

async function nsNetworkMathProcess(noronNo){
    // console.log("math process is working");
    let TypeOfProcess=networkSimpleList[noronNo].dataSet[1];
    let mathData =networkSimpleList[noronNo].dataSet[4];
    let pathAddress = networkSimpleList[noronNo].dataSet[2];
    let processResult=0;
    switch (TypeOfProcess) {
        // +
        case 0: processResult= currentData+mathData; break;
        // -
        case 1: processResult= currentData-mathData; break;
        // /
        case 2: processResult= currentData/mathData; break;
        // *
        case 3: processResult= currentData * mathData; break;
        // %
        case 4: processResult= currentData%mathData; break;
        default: alert("type of process is not available"); break;
    }
    currentData=processResult;
    // console.log("math data : "+ mathData);
    // console.log("type of process : "+ TypeOfProcess);
    // console.log("process resull : "+processResult);
    // console.log("current data : "+currentData);
    currentWorkingNoron=networkSimpleList[noronNo].paths[pathAddress];
    nsDrawGoToNextNoron(noronNo,currentWorkingNoron);
}

async function nsNetworkLogicalProcess(noronNo){
    // console.log("logical process is working");
    let TypeOfProcess=networkSimpleList[noronNo].dataSet[1];
    let logicalData =networkSimpleList[noronNo].dataSet[4];
    let ifPath = networkSimpleList[noronNo].dataSet[2];
    let elsePath = networkSimpleList[noronNo].dataSet[3];
    let logicalValue=true;
    // console.log("type of process : "+ TypeOfProcess);
    // console.log("logical data : "+logicalData);
    switch (TypeOfProcess) {
        // equals
        case 0: logicalValue= (currentData==logicalData); break;
        // not equals
        case 1: logicalValue= (currentData!=logicalData); break;
        // < 
        case 2: logicalValue= (currentData<logicalData); break;
        // >
        case 3: logicalValue= (currentData>logicalData); break;
        // <=
        case 4: logicalValue= (currentData<=logicalData); break;
        // >=
        case 5: logicalValue= (currentData>=logicalData); break;
    
        default: alert("type of process is not available"); break;
    }
    // console.log("logical value : "+logicalValue);
    if(logicalValue){
        currentWorkingNoron=networkSimpleList[noronNo].paths[ifPath];
    }else{
        currentWorkingNoron=networkSimpleList[noronNo].paths[elsePath];
    }
    nsDrawGoToNextNoron(noronNo,currentWorkingNoron);
}

async function doTheProcessOfNoron(noronNo){
    
    if(noronNo>-1){
        //for noron process
        let getProcessCode = networkSimpleList[noronNo].dataSet[0];
        // console.log("do the prcess of noron:");
        // console.log("noron no : "+noronNo+" get process code : "+getProcessCode+" type of getprocess code : "+typeof(getProcessCode));
        switch (getProcessCode) {
            //sender
            case 0: nsNetworkProcessSender(noronNo); break;
            // math process
            case 1: nsNetworkMathProcess(noronNo); break;
            //logical process
            case 2: nsNetworkLogicalProcess(noronNo); break;
            default:
                alert("this is not a special code");
                break;
        }
    }
    // for input output process
    else{
        switch (noronNo){
            case -1: nsworkwithInputPath(); break;
            case -2: nsworkwithOutputPath(); break;
            default: alert("This is not a special noron");
        }
    }
    drawCurrentDataAreaWithProperties("Data",18,'green');
}

async function drawWorkingNoron(noronNo,circleFillStyle){
    ctx.beginPath();
    ctx.arc(networkSimpleList[noronNo].x,networkSimpleList[noronNo].y , circleSize, 0, 2 * Math.PI);
    ctx.fillStyle = circleFillStyle;
    ctx.fill();
    ctx.stroke();

    //data set in a noron
    ctx.beginPath();
    let fontSize=circleSize/4;
    let fontSpace=4;
    let startX=0-(circleSize/2);
    ctx.fillStyle = 'black';

    ctx.font = 'italic '+fontSize+'pt Calibri';
        
        for (let data = 0; data < dataSize; data++) {
            ctx.fillText(networkSimpleList[noronNo].dataSet[data], networkSimpleList[noronNo].x+startX, networkSimpleList[noronNo].y+(startX-fontSpace)+(data*(fontSize+fontSpace)));
        }
    ctx.stroke();
}

async function drawWorkingPath(noron1,noron2,strokeColor){
    ctx.beginPath();
    ctx.fillStyle=strokeColor;
    ctx.strokeStyle = strokeColor;
    if(noron1<0){
        switch(noron1){
            case -1: ctx.moveTo(inputCordinates.x+(iORectSize/2),inputCordinates.y); break;
            case -2: ctx.moveTo(outputCordinates.x-(iORectSize/2),outputCordinates.y); break;
        }
    }
    else{
        ctx.moveTo(networkSimpleList[noron1].x,networkSimpleList[noron1].y);
    }

    if(noron2<0){
        switch(noron2){
            case -1: ctx.lineTo(inputCordinates.x+(iORectSize/2),inputCordinates.y); break;
            case -2: ctx.lineTo(outputCordinates.x-(iORectSize/2),outputCordinates.y); break;
        }
    }
    else{
        ctx.lineTo(networkSimpleList[noron2].x,networkSimpleList[noron2].y);
    }
  
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = orginalStrokeColor;
}
async function nsworkwithInputPath(){
    // console.log("you working with input path");
    await drawInputInformation(colorCurrentNoron);
    await drawWorkingPath(-1,0,colorCurrentNoron);
    drawWorkingNoron(0,colorNextNoron);

    //change current working with first noron
    currentWorkingNoron=0;
    
    //change previous working noron
    previousWorkingNoron=-1;
}
async function nsworkwithOutputPath(){
    outputData=currentData;
   // console.log("you working with output path");
    //change previous draws
    let lastNoron= networkSimpleList.length-1;
    await nsEditDrawPreviousPath(lastNoron,-2);
    await nsEditDrawPreviousStep(lastNoron);
    drawOutputInformation(colorCurrentNoron);
    //close next-step button
    changeButtonSituation("next-step",true);

}

async function firstDraws(){
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, fieldW, fieldH);
    ctx.stroke(); 
}

async function createNetwork(){
    closeAllNetworkButton();
    // await codeTest();
    // await codeTest2();
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

async function codeTest2(){
//    let inputValue = document.getElementById("input-value").value;
//     console.log("input value : "+inputValue);
//     console.log("type of input value : "+ typeof(inputValue));
//     let getInt= parseInt(inputValue);
//     console.log("getInt : "+getInt);
//     console.log("type of getInt : "+ typeof(getInt));
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

async function stringListToIntegerList(stringList){
    let integerList=[];
    for (let i = 0; i < stringList.length; i++) {
      integerList.push(parseInt(stringList[i])); 
    }
    return integerList;
}

async function updateDateSetFromExample() {

    let miniParser = [];
    for (let i = 0; i < networkSimpleList.length; i++) {
        miniParser = codeRowList[codeCount].split(",");
        for (let d = 0; d < dataSize; d++) {
            networkSimpleList[i].dataSet[d] = parseInt(miniParser[d]);
        }
        codeCount++;
    }
}

async function nsMinV1NetworkProcess(){
    await calculateAndCreateNetwork();
    await updateDateSetFromExample();
    await drawNeuralNetwork();
}

function nsMinV1NetworkSize(size){
    if(size<=maxNetworkSize && size>=minNetworkSize){
        networkSize=size;
        networkListSize=(size*2)+1;
        nsMinV1NetworkProcess();
        // console.log("later changed network size : "+networkSize+ " typeof networkSize "+typeof(networkSize));
    }
    else{
        alert("size is invalid");
    }
}
//ns  next step
function nsTypeOfMinV1() {
    //console.log("everything is succesfull");
    let size=codeRowList[codeCount];
    if(Number.isInteger(parseInt(size))){
        codeCount++;
        nsMinV1NetworkSize(parseInt(size));
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
}

function calculateRectFromCenterCordinatesObject(cordinates,sizes){
   return calculateRectFromCenterCordinates(cordinates.x,cordinates.y,sizes.x,sizes.y);
}

function calculateRectFromCenterCordinates(rectCenterX,rectCenterY,rectWidth,rectHeight){
    return {x:rectCenterX-(rectWidth/2),y:rectCenterY-(rectHeight/2),w:rectWidth,h:rectHeight}
}

async function drawCurrentDataAreaWithProperties(text,currentDataFontSize,rectFillStyle){
    let r = calculateRectFromCenterCordinatesObject(currentDataAreaCordinates,currentDataAreaRectSizes);
    ctx.beginPath();
    ctx.rect(r.x,r.y,r.w,r.h); 
    ctx.fillStyle = rectFillStyle;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.font = 'italic '+currentDataFontSize+'pt Calibri';
    let textWidth=ctx.measureText(text).width;
    ctx.fillText(text,currentDataAreaCordinates.x-(textWidth/2),currentDataAreaCordinates.y-currentDataFontSize);
    ctx.fillText(currentData,currentDataAreaCordinates.x-10,currentDataAreaCordinates.y+5);
    ctx.stroke();
}
async function drawCurrentDataArea(){
    drawCurrentDataAreaWithProperties("Data",18,'#ddffddaa');
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

async function drawInputInformation(rectFillStyle){
    await drawRectSizeAndCordinates(inputCordinates,iORectSize,'white');
    await drawRectSizeAndCordinates(inputCordinates,iORectSize,rectFillStyle);
    drawTextAndDataInRect(inputCordinates,"input",inputData,"black",15);
}

async function drawOutputInformation(rectFillStyle){
    await drawRectSizeAndCordinates(outputCordinates,iORectSize,rectFillStyle);
    drawTextAndDataInRect(outputCordinates,"output",outputData,"black",15);
}

async function drawRectSizeAndCordinates(rectCordinates,rectSize,rectFillStyle){
    
    ctx.beginPath();
    ctx.rect(rectCordinates.x-(rectSize/2),rectCordinates.y-(rectSize/2), rectSize, rectSize);
    ctx.fillStyle = rectFillStyle;
    ctx.fill();
    ctx.stroke();
}

async function drawTextAndDataInRect(rectCordinates,text,data,textColor,textFontSize){
    ctx.beginPath();
    ctx.fillStyle = textColor;
    ctx.font = 'italic '+textFontSize+'pt Calibri';
    let textWidth=ctx.measureText(text).width;
    ctx.fillText(text,rectCordinates.x-(textWidth/2),rectCordinates.y-textFontSize);
    ctx.fillText(data,rectCordinates.x-10,rectCordinates.y+12);
    ctx.stroke();
}
async function drawInputOutputInformation(){
    //input area
    drawInputInformation('#ddffddaa');
    //output area
    drawOutputInformation('#ddffddaa');
}

async function calculateCordinatesValues(){
    //networkWidth=520;
    let distance=networkWidth/(networkList.length-1);//120
    distanceX = distance;
    distanceY = distance;
    let calculatedValue = distance/3;
    circleSize =(calculatedValue>maxCircleSize)?maxCircleSize : calculatedValue ;
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
    
    //check next row 
    if(isExistInIndex(i+1,0)){
        // console.log("it has a next row value");
        addPathstoNoronByRow(i,j,+1)
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
    //console.log("give paths to noron");
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
}