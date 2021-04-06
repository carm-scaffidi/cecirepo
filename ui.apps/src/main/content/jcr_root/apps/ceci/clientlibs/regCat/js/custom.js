/*!
 * CECI - CanExport 
 * 
 *
 *
 * Author: Jose Mendoza - JM
 * Date: 2021-02-01
 */

var debugMode = false;
var accountid;  
var contactid;  



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





//**************************************************************************************************************************/
// SETTERS & GETTERS 
//**************************************************************************************************************************/
function getDebugMode(){
	return debugMode;
}


//set and get Account_accountid
function setAccountid(strID){
	accountid = strID;
}

function getAccountid(){
	return accountid;
}

//set and get Contact id
function setContactid(strID){
	contactid = strID;
}

function getContactid(){
	return contactid;
}



//**************************************************************************************************************************/
//**************************************************************************************************************************/
//INVOKE CRM SERVICES
//**************************************************************************************************************************/
//**************************************************************************************************************************/


/* 
* creates an account in CRM 
*/
function createAccount(accountFormDataArray){
    var operationName = "POST account /accounts";
    //var operationArguments = JSON.stringify({
    //    "account": {"egcs_operatingname_en": "Account Test1 20210204"}
	//});   

    var operationArguments = JSON.stringify({
        "account": accountFormDataArray
	});

    if(getDebugMode()){
    	console.log(operationArguments);
    }

    var data = execCRMService(operationName,operationArguments);

    if(getDebugMode()){
    	console.log(data);
    }

    //lets store the account id
    setAccountid(data.accountid);//07510a67-f466-eb11-96ab-005056818aad
    return data;

}

/* 
* updates an account in CRM 
*/
function updateAccount(inArray){
    var operationName = "PUT account /accounts";
    var operationArguments = JSON.stringify({
        "account_accountid": getAccountid(),
        "account": inArray
	});   

    if(getDebugMode()){
    	console.log(operationArguments);
    }

    var data = execCRMService(operationName,operationArguments);

    if(getDebugMode()){
    	console.log(data);//result: "No response"
    }
    return data;
}


/* 
* creates an primary contact in CRM 
*/
function createPrimaryContact(contactFormDataArray){
    var operationName = "POST contact /contacts";
    var operationArguments = JSON.stringify({
        "contact": contactFormDataArray
	});   

    if(getDebugMode()){
    	console.log(operationArguments);
    }

    var data = execCRMService(operationName,operationArguments);

    if(getDebugMode()){
    	console.log(data);
    }

    //lets store the account id
    setContactid(data.contactid);//806e56b4-f366-eb11-96a8-005056816bc8
    return data;
}




/* 
* creates an account in CRM 
*/
function createPrimaryAddress(inArray){
    var operationName = "POST gac_address /gac_addresses";
    var operationArguments = JSON.stringify({
        "gac_address": inArray
	});   

    if(getDebugMode()){
    	console.log(operationArguments);
    }

    var data = execCRMService(operationName,operationArguments);

    if(getDebugMode()){
    	console.log(data);
    }

    return data;
    //lets store the account id
    //setContactid(data.contactid);//806e56b4-f366-eb11-96a8-005056816bc8
}

/* 
* sets the account id an account in CRM 
*/
function setPrimaryAccountToContact(inArray){
    var operationName = "PUT contact /contacts";
    var operationArguments = JSON.stringify({
        "contact_contactid": getContactid(),
        "contact": inArray
	});   

    if(getDebugMode()){
    	console.log(operationArguments);
    }

    var data = execCRMService(operationName,operationArguments);

    if(getDebugMode()){
    	console.log(data);
    }

    return data;
    //lets store the account id
    //setContactid(data.contactid);//806e56b4-f366-eb11-96a8-005056816bc8
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




