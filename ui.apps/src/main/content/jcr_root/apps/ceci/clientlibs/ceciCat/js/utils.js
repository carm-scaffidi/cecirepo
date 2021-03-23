/*!
 * UTILS 
 * 
 *
 *
 * Author: Jose Mendoza
 * Date: 2020-06-29
 */

var gCurrentPanelSOM;
var xmlData;
var jsonData;

/* 
* get form language from URL
*/
function getFormLanguage(){
    var urlParams = new URLSearchParams(window.location.search);
	var lang = urlParams.get('afAcceptLang');

    return lang;
}



/* 
* sets the current panel SOM to global variable
*/
function setCurrentPanelSOM(str){
	gCurrentPanelSOM = str;
}

/* 
* get the current panel SOM from global variable
*/
function getCurrentPanelSOM(){
	return  gCurrentPanelSOM;
}

gNextPanelSOM="";
gPrevPanelSOM="";
/* 
* sets the current panel SOM to global variable
*/
function setNextPanelSOM(str){
    //console.log("NEXT: " + str);
	gNextPanelSOM = str;
}
function setPrevPanelSOM(str){
    //console.log("PREV: " + str);
	gPrevPanelSOM = str;
}

/* 
* get the current panel SOM from global variable
*/
function getNextPanelSOM(){
	return  gNextPanelSOM;
}
function getPrevPanelSOM(){
	return  gPrevPanelSOM;
}


/* 
* get the current panel name that has focus
*/
function getFocusPanelName(){
    var currentPanel = window.guideBridge.getFocus({"focusOption": "navigablePanel"});
    var currPanelName = window.guideBridge.resolveNode(currentPanel).name;
	return currPanelName;
}



/* 
* get current XML data
*/
function getXMLData(){
    //console.log("inside getXMLData");
    guideBridge.getDataXML({
        success : function (guideResultObject) {
            xmlData = guideResultObject.data;
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(xmlData,"text/xml");
            ceciRoot = xmlDoc.getElementsByTagName('root')[0];
            console.log(ceciRoot);

            //jsonData = xml2json(ceciRoot.getElementsByTagName('proposal')[0]);
            //console.log(jsonData);
            //console.log("xml data received" + guideResultObject.data);
        }
/*
        error : function (guideResultObject) {
             console.error("API Failed");
             var msg = guideResultObject.getNextMessage();
             while (msg !== null) {
                 console.error(msg.message);
                 msg = guideResultObject.getNextMessage();
             }
        }
 */

    });
    return ceciRoot;
}

/* 
* get current XML data
*/
function getJsonData(){
    //console.log("inside getXMLData");
    guideBridge.getDataXML({
        success : function (guideResultObject) {
            xmlData = guideResultObject.data;
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(xmlData,"text/xml");
            ceciRoot = xmlDoc.getElementsByTagName('root')[0];
            jsonData = xml2json(ceciRoot.getElementsByTagName('proposal')[0]);

            strJSONData = JSON.stringify(jsonData,escape);
            //console.log(jsonData);
            //console.log("xml data received" + guideResultObject.data);
        }
/*
        error : function (guideResultObject) {
             console.error("API Failed");
             var msg = guideResultObject.getNextMessage();
             while (msg !== null) {
                 console.error(msg.message);
                 msg = guideResultObject.getNextMessage();
             }
        }
 */

    });
    return strJSONData;
}


function escape (key, val) {
    if (typeof(val)!="string") return val;
    return val
      .replace(/[\b]/g, '\\b')
      .replace(/[\f]/g, '\\f')
      .replace(/[\n]/g, '\\n')
      .replace(/[\r]/g, '\\r')
      .replace(/[\t]/g, '\\t')
    ; 
}




function getState(){
//getXMLData();
    // after some time or on click of a button or reloading the page
guideBridge.restoreGuideState({
     dataRef : guideResultObject.data,
     error : function (guideResultObject) {
         // log the errors
     }
});
}



/* 
* get node value by element name
*/
function getNodeValue(nodeName){
    var parser, xmlDoc;
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(xmlData,"text/xml");

	return xmlDoc.getElementsByTagName(nodeName)[0].childNodes[0].nodeValue;
}


function xml2json(xml) {
      try {
        var obj = {};
        if (xml.children.length > 0) {
          for (var i = 0; i < xml.children.length; i++) {
            var item = xml.children.item(i);
            var nodeName = item.nodeName;
    
            if (typeof (obj[nodeName]) == "undefined") {
              obj[nodeName] = xml2json(item);
            } else {
              if (typeof (obj[nodeName].push) == "undefined") {
                var old = obj[nodeName];
    
                obj[nodeName] = [];
                obj[nodeName].push(old);
              }
              obj[nodeName].push(xml2json(item));
            }
          }
        } else {
          obj = xml.textContent;
        }
        return obj;
      } catch (e) {
          console.log(e.message);
      }
    }


//currentPanelSOM = "";
function setCurrentPanelSOM(objSOM){
    //set panel to be focused on
    var objPanel = objSOM.somExpression;
    window.guideBridge.resolveNode(objPanel).visible = true;
    window.guideBridge.setFocus(objPanel);
    currentPanelSOM = window.guideBridge.resolveNode(objPanel).somExpression;
}

function getCurrentPanelSOM(){
    return currentPanelSOM;
}    

function getCurrentPanelName(){
    //if(typeof(currentPanelSOM) != 'undefined'){
       // if(!isStringEmpty(currentPanelSOM){
        //  result = window.guideBridge.resolveNode(currentPanelSOM).name;
        //}

    //}
    //console.log("************** " + currentPanelSOM);
	return window.guideBridge.resolveNode(currentPanelSOM).name;
} 


/*------------------------------------------------------*/
/*-- STRING FUNCTIONS ----------------------------------*/
/*------------------------------------------------------*/
/**
* Removes leading and trailing spaces from string
* @param {String} asString string to be trimmed
* @return asString - trimmed string
* @type String
*/
function trimString(asString){
	return String(asString).replace(/^\s+|\s+$/g, '');
}

/*------------------------------------------------------*/
/**
* Checks if a string is empty or has a value
* @param {String} asString string to be checked
* @return true/false
* @type Boolean
*/
function isStringEmpty(asString){
	if(asString == null) return true;
	if(asString == "null") return true;

	asString = trimString(asString);
	if(asString.length == 0) return true;

	return false;
}

/*------------------------------------------------------*/
/**
* Checks if a string is empty or has a value
* @param {String} asString string to be checked
* @return empty string or passed string
* @type String
*/
function setStringToEmpty(asString){
	if(asString == null) return "";
	
	asString = trimString(asString);
	if(asString.length == 0) return "";

	return asString;
}

/*----------------------------------------*/
/**
* Checks if the string contains numbers and letters only
* @param {String} Str string to be validated
* @return true/false
* @type Boolean
*/
function hasSpecialChars(Str){
	var patternStr =  /\(.*/;
	if (Str.match(patternStr) == null){
			return false;
	}
	return true;
}

/*----------------------------------------*/
/**
* Checks if the string contains numbers only
* @param {String} Str number to be validated
* @return true/false
* @type Boolean
*/
function numericValidation(Str){
	var patternStr = /^[0-9]+$/;
	if (Str.match(patternStr) == null){
		xfa.host.messageBox("Please enter numeric value!");
		return false;
	}
	return true;
}

/*----------------------------------------*/
/**
* Checks if the string contains numbers and letters only
* @param {String} Str string to be validated
* @return true/false
* @type Boolean
*/
function alphanumericValidation(Str){
	var patternStr =  /^[\w]+$/;
	if (Str.match(patternStr) == null){
		xfa.host.messageBox("Please enter alphanumeric value!");
		return false;
	}
	return true;
}

/*
get current system date
Arguments:
*/
function getCurrentDate(intFormat){
	var result;
	var oToday = new Date();    //create Date variable with the current date
	var currYear = oToday.getFullYear(); //extract the current year
	var currMonth = oToday.getMonth()+1; //extract the current Month
	var currDay = oToday.getDate(); //extract the current Day of the month
	
	var month_name=new Array(12);
	month_name[1]="January"
	month_name[2]="February"
	month_name[3]="March"
	month_name[4]="April"
	month_name[5]="May"
	month_name[6]="June"
	month_name[7]="July"
	month_name[8]="August"
	month_name[9]="September"
	month_name[10]="October"
	month_name[11]="November"
	month_name[12]="December"
	
	switch(intFormat){
	case 1:
 		result = currYear + "/" + currMonth + "/" + currDay ;
 		break;
 	case 2:
 		result = month_name[currMonth] + " " + currDay+ ", " + currYear ; 	
 		break;
 	case 3:
 		result = formatCurrValue(currMonth) + "/" + formatCurrValue(currDay) + "/" + currYear ; 	
 		break;
 	default:
 	}
 	return result;
}

function formatCurrValue(inString){
	var result;
	if(inString.toString().length == 1){
		result = "0" + inString;
	}
	else
	{
		result = inString;
	}
	return result;
}


function compare(str1,str2){    
    return (trimString(str1) == trimString(str2)) ? true : false;
}


function sortDDL(oArray){
    var DDL = [];
    
    oArray.sort();  
    for(var i=0; i<oArray.length ;i++){
        //console.log(oArray[i]);
        DDL.push(oArray[i]);
    }

  	return DDL;
}	



function validateStartEndDates(inStartDate, inEndDate, sameDateAllowed ){

	var endDate = inEndDate.split("-");
	var startDate = inStartDate.split("-");

    endDate = new Date(endDate[0], endDate[1]-1, endDate[2]);
	startDate = new Date(startDate[0], startDate[1]-1, startDate[2]);


	//theMessage = "The Start date must be before the end date.";
	//theTitle = "Date validation error";

    return sameDateAllowed ? endDate >= startDate : endDate > startDate;

}







