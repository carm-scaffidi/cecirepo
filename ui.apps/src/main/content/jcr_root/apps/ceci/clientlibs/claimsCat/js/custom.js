/*!
 * CECI - CanExport 
 * 
 *
 *
 * Author: Jose Mendoza - JM
 * Date: 2021-02-01
 */

var debugMode = false;
var proposalID;
var claimsID;
var componentID;
var claimComponents;




//lets initialize the debug mode
setDebugMode();

//**************************************************************************************************************************/
//**************************************************************************************************************************/
//**************************************************************************************************************************/
//**************************************************************************************************************************/

/* 
* setDebugMode
*/
function setDebugMode(){
    var urlParams = new URLSearchParams(window.location.search);
	var debug = urlParams.get('afDebug');

    debugMode = debug === '' ? true : false;
}

/* 
* redirect the user to an specific form
*/
/*
function redirectURL(formName){

    var urlParams = new URLSearchParams(window.location.search);
    var lang = urlParams.get('afAcceptLang');

    if(formName === "registration"){
    	window.open('/content/dam/formsanddocuments/ceci/registration_form/jcr:content?wcmmode=disabled&mode=new&afAcceptLang='+lang,'_self');
    }
    else if(formName === "proposal"){
		window.open('/content/dam/formsanddocuments/ceci/proposal_form/jcr:content?wcmmode=disabled&mode=new&afAcceptLang='+lang,'_self');
    }

}
*/

/* 
*	operName: operation name
*	operArguments: operation arguments
*	getDDL: function to use to parse json array
*	inOptionSetFieldName: key name use to parse nested json array
*/
/*
function execCRMService(operName,operArguments) {
    var DDL = [];
	var objData;

    $.ajax({
      type: "POST",
      url: "/content/dam/formsanddocuments-fdm/fdm-ceci.executeDermisQuery.json?",
      data: {
        "operationName": operName,
        "operationArguments": operArguments
      },
      success: function (data, textStatus, jqXHR) {
          objData = data;
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log("ERROR-gac_AEMGetEntityPicklistAttributesMetadata-ERROR");
      },
      cache: false,
      async: false
    });

	return objData;

}
*/

function getText(ind){
    console.log(ind);
    return "Item#: " +(ind+1)+ ".  Consultant fees (Lead Generation Americas (PO810, PO816, PO817, PO819, PO820, PO827, PO828, PO829, PO840, PO846) ) -Component Number: 20 \n -Program approved contribution: $57,500.00 -Amount paid or approved to be paid as of 2021-01-11: $0.00 -Balance remaining as of 2021-01-11: $57,500.00";
}

/* 
*	operName: operation name
*	operArguments: operation arguments
*/
function execCRMService(operName, operArguments) {

    if (getDebugMode()) {
        console.log(operName);
        console.log(operArguments);
    }

    var objData;

    $.ajax({
        type: "POST",
        url: "/bin/fdmServiceConnector",

        data: {
            "formDataModelId": "fdm-ceci-claims",
            "operationName": operName,
//          "operationArguments": operArguments //Jun9-2022
            "operationArguments": encodeURIComponent(operArguments)
//          the above fixes special chars from breaking POST or PUT of text into CRM
        },
        success: function (data) {
            //parse json array         
            objData = JSON.parse((data));


            if (getDebugMode()) {
                console.log(objData);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("ERROR-CECI execService-ERROR");
        },
        cache: false,
        async: false
    });

    return objData;
}




//**************************************************************************************************************************/
// SETTERS & GETTERS 
//**************************************************************************************************************************/
function getDebugMode(){
	return debugMode;
}


//set and get Proposal ID
function setProposalID(strID){
	proposalID = strID;
}

function getProposalID(){
	return proposalID;
}


//set and get Claims ID
function setClaimsID(strID){
	claimsID = strID;
}

function getClaimsID(){
	return claimsID;
}


//set and get Component ID
function setComponentID(strID){
	componentID = strID;
}

function getComponentID(){
	return componentID;
}




//**************************************************************************************************************************/
//**************************************************************************************************************************/
//INVOKE CRM SERVICES
//**************************************************************************************************************************/
//**************************************************************************************************************************/

/* 
*  
*/
function getDataByProposalID(){


    var operationName = "GET egcs_fc_profile /egcs_fc_profiles";
    var operationArguments = JSON.stringify({
        "egcs_fc_profileid": getProposalID(),        
	});   

    if(getDebugMode()){
    	//console.log(operationArguments);
    }

    var data = execCRMService(operationName,operationArguments);


    return data;
}

/* 
*  
*/
function getClaimsDataByClaimID(){


    var operationName = "GET gac_fdiclaim /gac_fdiclaims";
    var operationArguments = JSON.stringify({
        "gac_fdiclaimid": getClaimsID(),        
	});   

    if(getDebugMode()){
    	//console.log(operationArguments);
    }

    var data = execCRMService(operationName,operationArguments);


    return data;
}

/* 
*  
*/
function putProjectComponentOutcome(vProjCompObj){
    var operationName = "PUT gac_fdiprojectcomponent /gac_fdiprojectcomponents";
    var operationArguments = JSON.stringify(vProjCompObj);   
  
    if(getDebugMode()){
      console.log(operationArguments);
    }
  
    var data = execCRMService(operationName,operationArguments);
  
    return data;
}

function getProjectComponentsByFcProfileId(fcProfileId){


    var operationName = "GET_gac_fdiprojectcomponents_via_fcprofileid";
    var operationArguments = JSON.stringify({
		"_gac_proposal_value": fcProfileId
	});   

    if(getDebugMode()){
    	//console.log(operationArguments);
    }

    var data = execCRMService(operationName,operationArguments);


    return data;
}

/* 
*  
*/
function getClaimComponentsByClaimId(claimId){


    var operationName = "GET gac_fdiclaimcomponent /gac_fdiclaimcomponents";
    var operationArguments = JSON.stringify({
		"_gac_claim_value": claimId
	});   

    if(getDebugMode()){
    	//console.log(operationArguments);
    }

    var data = execCRMService(operationName,operationArguments);


    return data;
}

/* 
*  
*/
function getClaimComponents(){


    var operationName = "GET gac_fdiclaimcomponent /gac_fdiclaimcomponents";
    var operationArguments = JSON.stringify({
		"_gac_claim_value": getClaimsID()
	});   

    if(getDebugMode()){
    	//console.log(operationArguments);
    }

    var data = execCRMService(operationName,operationArguments);


    return data;
}

/* 
*  
*/
function getClaimComponentByCompID(compID){


    var operationName = "GET gac_fdiclaimcomponent /gac_fdiclaimcomponents";
    var operationArguments = JSON.stringify({
		"gac_fdiclaimcomponentid": compID
	});   

    if(getDebugMode()){
    	//console.log(operationArguments);
    }

    var data = execCRMService(operationName,operationArguments);


    return data;
}

/* 
*  
*/
function getClaimExpenseItemsByCompID(compID){


    var operationName = "GET gac_fdiexpenseitem /gac_fdiexpenseitems";
    var operationArguments = JSON.stringify({
		"_gac_fdiclaimcomponent_value": compID
	});   

    if(getDebugMode()){
    	//console.log(operationArguments);
    }

    var data = execCRMService(operationName,operationArguments);


    return data;
}

/* 
*  
*/
function getAllClaimExpenseItems(){

    var operationName = "GET gac_fdiexpenseitem /gac_fdiexpenseitems";
    var operationArguments = JSON.stringify({
		"_gac_claim_value": getClaimsID()
	});   

    if(getDebugMode()){
    	//console.log(operationArguments);
    }

    var data = execCRMService(operationName,operationArguments);


    return data;
}


/* 
*  
*/
function updateClaimExpenseItem(fdiexpenseitemid,amountclaimed,totalbeforetaxes,comments){

    var operationName = "PUT gac_fdiexpenseitem /gac_fdiexpenseitems";
    var operationArguments = JSON.stringify({
        "gac_fdiexpenseitem_gac_fdiexpenseitemid": fdiexpenseitemid.trim(),
        "gac_fdiexpenseitem": {
            "gac_totalbeforetaxes": totalbeforetaxes,
            "gac_comments": comments,
            "gac_amountclaimed": amountclaimed    
        }
	});   

    if(getDebugMode()){
    	console.log(operationArguments);
    }

    var data = execCRMService(operationName,operationArguments);


    return data;
}


/* 
*  
*/
function saveDraftClaimData(claimTitle, reviewedbyauthority, finalclaim) {
    //originally 'submitClaimData' but this is actually used when button "Save draft" is clicked
    var operationName = "PUT gac_fdiclaim /gac_fdiclaims";
    var operationArguments = JSON.stringify({
        "gac_fdiclaim_gac_fdiclaimid": getClaimsID(),
        "gac_fdiclaim": {
            "gac_name": claimTitle,
            "gac_finalclaim": finalclaim,
            "gac_reviewedbyauthority": reviewedbyauthority
        }
    });

    if (getDebugMode()) {
        console.log(operationArguments);
    }

    var data = execCRMService(operationName, operationArguments);
    return data;
}

function submitClaimData(claimTitle, reviewedbyauthority, finalclaim) {
    //Besco-Apr27-2022 - identical to "saveDraftClaimData" above, with...
    //added "statuscode": 810510000 
    var operationName = "PUT gac_fdiclaim /gac_fdiclaims";
    var operationArguments = JSON.stringify({
        "gac_fdiclaim_gac_fdiclaimid": getClaimsID(),
        "gac_fdiclaim": {
            "gac_name": claimTitle,
            "gac_finalclaim": finalclaim,
            "gac_reviewedbyauthority": reviewedbyauthority,
            "statuscode": 810510000
        }
    });

    if (getDebugMode()) {
        console.log(operationArguments);
    }

    var data = execCRMService(operationName, operationArguments);
    return data;
}
/* 
*  
*/
function submitFinalReportData(obj){

    var operationName = "PUT egcs_fc_profile /egcs_fc_profiles";
    var operationArguments = JSON.stringify({
        "egcs_fc_profile_egcs_fc_profileid": getProposalID(),
    	"egcs_fc_profile": {        
        "gac_actualprojectcontributiontoimprovingservi": obj[7],
        "gac_actualprojectimpactonretentionexpansionaw": obj[6],
        "gac_benefitsandlessonslearned": obj[8],
        "gac_actualnumberofleadsgenerated": obj[4],
        "gac_actualprojectimpactonenhancingfdiknowledg": obj[1],
        "gac_actualnumberofprospectsgenerated": obj[5],
        "gac_actualimpactonforeigninvestorawareness": obj[2],
        "gac_actualnumberoftargetsgenerated": obj[3],
        "gac_actualcontributiontoimprovefdiattraction": obj[0]
    } 
	});   

    if(getDebugMode()){
    	console.log(operationArguments);
    }

    var data = execCRMService(operationName,operationArguments);


    return data;
}



/* 
*  
*/
function updateProgressAndVarianceByCompID(compID,componentprogressandvariance,componentactivitiescompleted){


    var operationName = "PUT gac_fdiclaimcomponent /gac_fdiclaimcomponents";
    var operationArguments = JSON.stringify({
        "gac_fdiclaimcomponent_gac_fdiclaimcomponentid": compID,
        "gac_fdiclaimcomponent": {
            "gac_componentprogressandvariance": componentprogressandvariance,        
            "gac_componentactivitiescompleted": componentactivitiescompleted,        
        }       
	});   

    if(getDebugMode()){
    	//console.log(operationArguments);
    }

    var data = execCRMService(operationName,operationArguments);


    return data;
}




/* 
* gets the DRAFT form data back from CRM 
*/
/*
function getGAC_saveddraftByID(){
    var operationName = "GETgac_saveddraftByID";
    var operationArguments = JSON.stringify({
    	"gac_saveddraftid": getGAC_saveddraftid() //"3f317c66-c438-eb11-96a7-00505681d5ee"
	});   

    var data = execCRMService(operationName,operationArguments);

    if(getDebugMode()){
    	console.log(data);
    }

    return data;
}


function updateGAC_saveddraftByID(){
    var operationName = "PUT gac_saveddraft /gac_saveddrafts";
    var operationArguments = JSON.stringify({
    "gac_saveddraft_gac_saveddraftid": getGAC_saveddraftid(),
    "gac_saveddraft": {        
        "gac_rawdata": getJsonData(),       
        "gac_saveddraftid": getGAC_saveddraftid()
    	}
	});   

    var data = execCRMService(operationName,operationArguments);

    if(getDebugMode()){
    	console.log(data);
    }

    return data;
}




function getUnitsOfMeasurementByFDICompID (categoryID){
  var DDL = [];
  var operationName = "gac_AEMGetFDIUnitsOfMeasurementsForComponentCategory()";
  var operationArguments = JSON.stringify({
      "gac_AEMGetFDIUnitsOfMeasurementsForComponentCategory_LanguageCode": getCRMFormLanguage(),
      "gac_AEMGetFDIUnitsOfMeasurementsForComponentCategory_ComponentCategoryRef": {"gac_fdicomponentcategoryid": trimString(categoryID)}
  });

    var data = execCRMService(operationName,operationArguments);
    var jsonPayload = data.FilteredUnitsOfMeasurements;
    var jsonPayloadObj = JSON.parse(jsonPayload);

    for (var i = 0; i < jsonPayloadObj.length; i++) {
        var dropdownItemValue = jsonPayloadObj[i].Value;
        var dropdownItemKey = jsonPayloadObj[i].Key;
        //console.log(dropdownItemKey + " - " + dropdownItemValue);
        DDL.push(dropdownItemKey + " = " + dropdownItemValue);
    }

 	return DDL;

}




*/
//**************************************************************************************************************************/
//**************************************************************************************************************************/
// Instance Manager
//**************************************************************************************************************************/
//**************************************************************************************************************************/


/*
 * add an instance to the collection if the first instance is filled out
 */
function addRepInst(obj){
  if(!isStringEmpty(obj,_instances._children[0]) || !isStringEmpty(obj,_instances._children[1])){
    obj.addInstance();
  }
}

/*
 * removes the specified instance from the collection
 */
function resetRepInst(obj){
  var iCount = obj.instanceCount; 
  	for (var i = iCount - 1; i >= 0; i--) {
		obj.removeInstance(i);
	}
}


/*
 * remove empty instances from a provided instance manager object
 */
function removeEmptyRepInst(obj){
    for (var i = obj.instanceManager.instanceCount - 1; i >= 0; i--) {
          if(isStringEmpty(obj.instanceManager.instances[i]._children[0].value)){
            obj.instanceManager.removeInstance(i);
          }
    }
}

/*
 * remove empty instances from a provided instance manager object
 */
function removeEmptyRepInst2(obj){
    for (var i = obj.instanceManager.instanceCount - 1; i >= 0; i--) {
          if(isStringEmpty(obj.instanceManager.instances[i]._children[1].value)){
            obj.instanceManager.removeInstance(i);
          }
    }
}


/* checkItemExistsinCollection function
* will check if the DDL item exist or not in the collection, 
*/
/*
function checkItemExistsinCollection(obj,item){
    var result = false;
    var instMan = obj.instanceManager;

    for(var i=0;i<instMan.instanceCount;i++){
      if(!isStringEmpty(instMan.instances[i]._children[2].value)){
        if ((instMan.instances[i]._children[2].value).trim() === item.trim()) {
          result = true;
          break;
        }
      }
    }
	return result;
}
*/




