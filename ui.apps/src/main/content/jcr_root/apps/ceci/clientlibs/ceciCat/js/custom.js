/*!
 * CECI - CanExport 
 * 
 *
 *
 * Author: Jose Mendoza - JM
 * Date: 2020-06-29
 */

var debugMode = false;
var selectedMarketsDDL = [];
var compArray = [];
var editMode=0;
var editOtherMode=0;
var expensesRequired=true;
var gac_saveddraftid; //id use to fetch saved draft in getSavedProposalDraftByAccount() function 
var account_accountid; //id use to fetch saved draft in getSavedProposalDraftByAccount() function 
var egcs_fo_profileid; //id use to fetch saved draft in getSavedProposalDraftByAccount() function 
var allocPercentTotalSectorStrategy=0;
var allocPercentTotalMarketStrategy=0;
var allocPercentTotalSectorToolsMaterials=0;
var allocPercentTotalMarketToolsMaterials=0;
var allocPercentTotalSectorLeadGen=0;
var allocPercentTotalMarketLeadGen=0;


//ACTIVITIES DDL
var arrTrainingActivityDDL = [];
var arrLeadGenActivityDDL = [];
var arrStratgeyActivityDDL = [];
var arrToolsMaterialsActivityDDL = [];


//MARKETS DDL
arrLeadGenMarketsDDL = [];
arrStratgeyMarketsDDL = [];
arrToolsMaterialsMarketsDDL = [];


//SECTORS DDL
arrLeadGenSectorsDDL = [];
arrStratgeySectorsDDL = [];
arrToolsMaterialsSectorsDDL = [];


//Default component IDs
/*
var componentType_leadGen = "eba10b46-9101-eb11-b82b-005056bf50dd";
var componentType_strategy = "b5a3174d-9101-eb11-b82b-005056bf50dd";
var componentType_toolsMaterials = "49cec953-9101-eb11-b82b-005056bf50dd";
var componentType_training = "0d05855c-9101-eb11-b82b-005056bf50dd";
*/

//CRM Component ID
var componentType_leadGen_id;
var componentType_strategy_id;
var componentType_toolsMaterials_id;
var componentType_training_id;

//CRM Component Names
var componentType_leadGen_name;
var componentType_strategy_name;
var componentType_toolsMaterials_name;
var componentType_training_name;

/*
var componentType_training = "810510000";
var componentType_leadGen = "810510001";
var componentType_strategy = "810510002";
var componentType_toolsMaterials = "810510003";
*/


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
* get form language from URL
*/
function getCRMFormLanguage(){
    var urlParams = new URLSearchParams(window.location.search);
    var lang = urlParams.get('afAcceptLang') === "en" ? "1033" : "1036";

    return lang;
}


/* 
* redirect the user to an specific form
*/
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


function setExpenseEditMode(int){
	editMode = int;
}
function getExpenseEditMode(){
	return editMode;
}
function setOtherExpenseEditMode(int){
	editOtherMode = int;
}
function getOtherExpenseEditMode(){
	return editOtherMode;
}


/*
function checkItemExistsinCollection(obj,item){
    var result = false;
    var instMan = obj.instanceManager;
  
    for(var i=0;i<instMan.instances.length-1;i++){
      if (instMan.instances[i]._children[2].value === item) {
        result = true;
        break;
      }
	}
	return result;
}
*/



/* the handleCollectionData function
* will check if the DDL item exist or not in the collection, 
* if it does not then it creates an instance
*/
/*
function handleCollectionData(sourceDDL,targetItemDesc,targetItemID,targetCollection, allocationCollection){
	//console.log(sourceDDL);

    if(!isStringEmpty(sourceDDL.value)){
      targetCollection.visible = true;
     //checks if item exists in the collection 
      if(!checkItemExistsinCollection(targetCollection,sourceDDL.value)){
          //creates a new instance
          targetItemDesc.value = trimString(sourceDDL.displayValue);
          targetItemID.value = trimString(sourceDDL.value);
          targetCollection.instanceManager.addInstance();
      }
      else{
        guideBridge.setFocus(sourceDDL);//sets focus back to the DDL field
      }

       //clears DDL field
      sourceDDL.value = "";


        if(!isStringEmpty(allocationCollection)){
			//populates the specific allocation table
        	populateSectosMarketsAllocationTable(targetCollection.instanceManager,allocationCollection);
        }


        //removeEmptyRepInst2(targetCollection);

      //hide the last instance as it is always empty
      targetCollection.instanceManager.instances[targetCollection.instanceManager.instanceCount-1].visible = false;

      if(getDebugMode()){
          for(var i=0;i<_selectedTrainingActRepItem.instances.length;i++){
            console.log(_selectedTrainingActRepItem.instances[i]._children[1].value);
            console.log(_selectedTrainingActRepItem.instances[i]._children[2].value);
          }
      }
  }

}
*/


/* checkItemExistsinCollection function
* will check if the DDL item exist or not in the collection, 
*/
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

/* the handleCollectionData function
* will check if the DDL item exist or not in the collection, 
* if it does not then it creates an instance
*/
function handleCollectionData(sourceDDL,targetItemDesc,targetItemID,targetCollection, allocationCollection){
    if(!isStringEmpty(sourceDDL.value)){
      targetCollection.visible = true;
      
     //checks if item exists in the collection 
      if(!checkItemExistsinCollection(targetCollection,sourceDDL.value)){
        
        //creates a new instance
        var instMan = targetCollection.instanceManager;        
        var iCount = instMan.instanceCount; 
              
        if(!isStringEmpty(instMan.instances[0]._children[1].value)){
          instMan.addInstance();
          instMan.instances[iCount].visible = true;
          instMan.instances[iCount]._children[1].value = trimString(sourceDDL.displayValue);
       	  instMan.instances[iCount]._children[2].value = trimString(sourceDDL.value);   
        }
        else{
          instMan.instances[0]._children[1].value = trimString(sourceDDL.displayValue);
       	  instMan.instances[0]._children[2].value = trimString(sourceDDL.value);               
        }
      }
      else{
        guideBridge.setFocus(sourceDDL);//sets focus back to the DDL field
      }

       //clears DDL field
      sourceDDL.value = "";

      //lets populate the allocation section based on selected items
      if(!isStringEmpty(allocationCollection)){
        //populates the specific allocation table
        populateSectosMarketsAllocationTable(targetCollection.instanceManager,allocationCollection);
      }
      
      if(getDebugMode()){
          for(var i=0;i<_selectedTrainingActRepItem.instances.length;i++){
            console.log(_selectedTrainingActRepItem.instances[i]._children[1].value);
            console.log(_selectedTrainingActRepItem.instances[i]._children[2].value);
          }
      }
  }

}


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



function getDebugMode(){
	return debugMode;
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


//**************************************************************************************************************************/
//**************************************************************************************************************************/









//**************************************************************************************************************************/
//**************************************************************************************************************************/
//INITIALIZE DDL
//**************************************************************************************************************************/
//**************************************************************************************************************************/


function initComponentData(){
    var operationName = "GET gac_fdicomponentcategory /gac_fdicomponentcategories";
    var operationArguments = JSON.stringify({    });
    execCRMCategoryService(operationName,operationArguments);
}


/* 
*	operName: operation name
*	operArguments: operation arguments
*	getDDL: function to use to parse json array
*	inOptionSetFieldName: key name use to parse nested json array
*/
function execCRMCategoryService(operName,operArguments) {

    $.ajax({
      type: "POST",
      url: "/content/dam/formsanddocuments-fdm/fdm-ceci.executeDermisQuery.json?",
      data: {
        "operationName": operName,
        "operationArguments": operArguments
      },
      success: function (data, textStatus, jqXHR) {

          if(getDebugMode()){
              console.log("*****************************");
              console.log(textStatus);
              console.log("*****************************");
          }    

        //gets all the components data from CRM
         getFDIComponentsData(data);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log("ERROR-gac_AEMGetEntityPicklistAttributesMetadata-ERROR");
      },
      cache: false,
      async: false
    });

}

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

/* 
* Get components data from CRM 
FDI Lead Generation and Meetings with Potential Investors = eba10b46-9101-eb11-b82b-005056bf50dd
FDI Strategic Planning and Analysis = b5a3174d-9101-eb11-b82b-005056bf50dd
FDI Tool and Material Development = 49cec953-9101-eb11-b82b-005056bf50dd
FDI Training = 0d05855c-9101-eb11-b82b-005056bf50dd
*/
function getFDIComponentsData(data) {
    //console.log(data);

    //COMPONENTS ID
    componentType_leadGen_id = data[0].gac_fdicomponentcategoryid;
    componentType_strategy_id = data[1].gac_fdicomponentcategoryid;
    componentType_toolsMaterials_id = data[2].gac_fdicomponentcategoryid;
    componentType_training_id = data[3].gac_fdicomponentcategoryid;


    if(getCRMFormLanguage() == "1033"){
        //COMPONENT NAME - ENGLISH
        componentType_leadGen_name = data[0].gac_name;
        componentType_strategy_name = data[1].gac_name;
        componentType_toolsMaterials_name = data[2].gac_name;
        componentType_training_name = data[3].gac_name;
    }
    else{        
         //COMPONENT NAME - FRENCH - 1036
        componentType_leadGen_name = data[0].gac_name_fr;
        componentType_strategy_name = data[1].gac_name_fr;
        componentType_toolsMaterials_name = data[2].gac_name_fr;
        componentType_training_name = data[3].gac_name_fr;
    }

    //get sectors
    arrLeadGenSectorsDDL = getTargetSectorsByFDICompID(componentType_leadGen_id);
    arrStratgeySectorsDDL = getTargetSectorsByFDICompID(componentType_strategy_id);
	arrToolsMaterialsSectorsDDL = getTargetSectorsByFDICompID(componentType_toolsMaterials_id);


	//get markets
    arrLeadGenMarketsDDL = getTargetMarketsByFDICompID(componentType_leadGen_id);
	arrStratgeyMarketsDDL = getTargetMarketsByFDICompID(componentType_strategy_id);
	arrToolsMaterialsMarketsDDL = getTargetMarketsByFDICompID(componentType_toolsMaterials_id);

	/*
	console.log(getComponentType_leadGenID());
    console.log(getComponentType_strategyID());
    console.log(getComponentType_toolsMaterialsID());
    console.log(getComponentType_trainingID());
    */

}


/* 
* returns array of activity types based on Comoponent ID 
*/
function getActivitiesByFDICompID (categoryID){
	var DDL = [];
  var operationName = "GET LINK of gac_fdicomponentcategory /gac_fdicomponentcategories";
  var operationArguments = JSON.stringify({
        "gac_fdicomponentcategory_gac_fdicomponentcategoryid": trimString(categoryID), //"eba10b46-9101-eb11-b82b-005056bf50dd", 
        "fdm_navprop_name": "gac_fdiactivitytype_FDIComponentCategory"
  });

    var data = execCRMService(operationName,operationArguments);

    for (var i = 0; i < data.length; i++) {
        if(getCRMFormLanguage() == "1033"){
        	DDL.push(data[i].gac_fdiactivitytypeid + " = " + data[i].gac_name_en); 
        }
        else{
			DDL.push(data[i].gac_fdiactivitytypeid + " = " + data[i].gac_name_fr); 
        } 
    }

 	return DDL;

}


/* 
* returns array of target sector types based on Comoponent ID 
*/
function getTargetSectorsByFDICompID (categoryID){
  var DDL = [];
  var operationName = "gac_AEMGetTargetSectorsByProgram()";
//  var operationArguments = JSON.stringify({
//      "gac_AEMGetTargetSectorsByProgram_ProgramRef": {"egcs_tp_profileid": trimString(categoryID)},
//      "gac_AEMGetTargetSectorsByProgram_LanguageCode": getCRMFormLanguage()
//  });


    var operationArguments = JSON.stringify({
        "egcs_tp_profileid": trimString(categoryID), //"eba10b46-9101-eb11-b82b-005056bf50dd", 
        "gac_AEMGetTargetSectorsByProgram_LanguageCode": getCRMFormLanguage()
  });

    var data = execCRMService(operationName,operationArguments);
    var jsonPayload = data.TargetSectorsJson;
    var jsonPayloadObj = JSON.parse(jsonPayload);

    for (var i = 0; i < jsonPayloadObj.length; i++) {
        var dropdownItemValue = jsonPayloadObj[i].Value;
        var dropdownItemKey = jsonPayloadObj[i].Key;
        //console.log(dropdownItemKey + " - " + dropdownItemValue);
        DDL.push(dropdownItemKey + " = " + dropdownItemValue);
    }

 	return DDL;

}


/* 
* returns array of target market types based on Comoponent ID 
*/
function getTargetMarketsByFDICompID (categoryID){
  var DDL = [];
  var operationName = "gac_AEMGetTargetMarketsByProgram()";
//    var operationArguments = JSON.stringify({
//      "gac_AEMGetTargetMarketsByProgram_ProgramRef": {"egcs_tp_profileid": trimString(categoryID)},
//      "gac_AEMGetTargetMarketsByProgram_LanguageCode": getCRMFormLanguage()
//  });


  var operationArguments = JSON.stringify({
        "egcs_tp_profileid": trimString(categoryID), //"eba10b46-9101-eb11-b82b-005056bf50dd", 
        "gac_AEMGetTargetMarketsByProgram_LanguageCode": getCRMFormLanguage()
  });


    var data = execCRMService(operationName,operationArguments);
    var jsonPayload = data.TargetMarketsJson;
    var jsonPayloadObj = JSON.parse(jsonPayload);

    for (var i = 0; i < jsonPayloadObj.length; i++) {
        var dropdownItemValue = jsonPayloadObj[i].Value;
        var dropdownItemKey = jsonPayloadObj[i].Key;
        //console.log(dropdownItemKey + " - " + dropdownItemValue);
        DDL.push(dropdownItemKey + " = " + dropdownItemValue);
    }

 	return DDL;

}


/* 
* returns array of target market types based on Comoponent ID 
*/
function getExpenseTypesByFDICompID (categoryID){
  var DDL = [];
  var operationName = "gac_AEMGetFDIExpenseTypeTypeForComponentCategory()";
  var operationArguments = JSON.stringify({
      "gac_AEMGetFDIExpenseTypeTypeForComponentCategory_LanguageCode": getCRMFormLanguage(),
      "gac_AEMGetFDIExpenseTypeTypeForComponentCategory_ComponentCategoryRef": {"gac_fdicomponentcategoryid": trimString(categoryID)}
  });

    var data = execCRMService(operationName,operationArguments);
    var jsonPayload = data.FilteredExpenseTypes;
    var jsonPayloadObj = JSON.parse(jsonPayload);

    for (var i = 0; i < jsonPayloadObj.length; i++) {
        var dropdownItemValue = jsonPayloadObj[i].Value;
        var dropdownItemKey = jsonPayloadObj[i].Key;
        //console.log(dropdownItemKey + " - " + dropdownItemValue);
        DDL.push(dropdownItemKey + " = " + dropdownItemValue);
    }

 	return DDL;

}

/* 
* returns array of target market types based on Comoponent ID 
*/
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

/* 
* returns array of missions from CRM 
*/
function getMissionsList (categoryID){
	var DDL = [];
  var operationName = "GET gac_mission /gac_missions";
  var operationArguments = JSON.stringify({});

    var data = execCRMService(operationName,operationArguments);

    for (var i = 0; i < data.length; i++) {
        if(getCRMFormLanguage() == "1033"){
            DDL.push(data[i].gac_missionid + " = " + data[i].gac_location_en + " - " +data[i].gac_symbol ); 
        }
        else{
            DDL.push(data[i].gac_missionid + " = " + data[i].gac_location_fr + " - " + data[i].gac_symbol ); 
        } 
    }

    return DDL;

}


/* 
* saves a DRAFT form data to CRM 
*/

function saveInitialDraftData(gacProposalName){
    var operationName = "POST gac_saveddraft /gac_saveddrafts";
    var operationArguments = JSON.stringify({"gac_saveddraft": {
        "gac_name": gacProposalName,
        "gac_FundingOpportunity": {"egcs_fo_profileid":egcs_fo_profileid},
		"gac_rawdata": getJsonData(),
        "gac_Account": { "accountid": getaccount_accountid()}
    }        
  });

    if(getDebugMode()){
    	console.log(operationArguments);
    }

    var data = execCRMService(operationName,operationArguments);

    if(getDebugMode()){
        console.log("SAVE DRAFT: " + data);
    }

    return data;

}


/* 
* gets the DRAFT form data back from CRM 
*/
/*
function getSaveDraftData(){
    var operationName = "gac_AEMGetProposalDraftJson()";
    var operationArguments = JSON.stringify({
      	"gac_AEMGetProposalDraftJson_ContactRef": {"contactid": "1BF1BDB9-BE7D-EA11-969F-00505681CF84"},
    	"gac_AEMGetProposalDraftJson_CallForProposalRef": {"egcs_fo_profileid": "68995D00-B104-EB11-96A4-00505681CF84"}
 	 });   

    var data = execCRMService(operationName,operationArguments);

    if(getDebugMode()){
    	console.log(data);
    }

    return data;
}
*/


/************************************************** 
* SAVED DRAFT FUNCTIONS 
*/

//set and get Account_accountid
function setGAC_saveddraftid(strID){
	gac_saveddraftid = strID;
}
function getGAC_saveddraftid(){
	return gac_saveddraftid;
}


//set and get egcs_fo_profileid
function setegcs_fo_profileid(strID){
	egcs_fo_profileid = strID;
}
function getegcs_fo_profileid(){
	return egcs_fo_profileid;
}

//set and get Account_accountid
function setaccount_accountid(strID){
	account_accountid = strID;
}
function getaccount_accountid(){
	return account_accountid;
}




/* 
* gets the DRAFT form data back from CRM 
*/
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

/* 
* gets the DRAFT form data back from CRM 
*/
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





//**************************************************************************************************************************/
//**************************************************************************************************************************/
//**************************************************************************************************************************/
//**************************************************************************************************************************/




//*************************************************************/
//RETURN CRM COMPONENT ID
//*************************************************************/
function getComponentType_trainingID(){
	return componentType_training_id;
}
function getComponentType_leadGenID(){
	return componentType_leadGen_id;
}
function getComponentType_strategyID(){
	return componentType_strategy_id;
}
function getComponentType_toolsMaterialsID(){
	return componentType_toolsMaterials_id;
}
//*************************************************************/


//*************************************************************/
//RETURN CRM COMPONENT NAME
//*************************************************************/
function getComponentType_trainingName(){
	return componentType_training_name;
}
function getComponentType_leadGenName(){
	return componentType_leadGen_name;
}
function getComponentType_strategyName(){
	return componentType_strategy_name;
}
function getComponentType_toolsMaterialsName(){
	return componentType_toolsMaterials_name;
}
//*************************************************************/


//*************************************************************/
//COMPONENTS CATEGORIES
//*************************************************************/
function getActivitiesByCompID (inCompID){
    var DDL = [];

    switch (trimString(inCompID)){
        case componentType_training_id:           
        	DDL = getTrainingActivityDDL();
        	break;
        case componentType_strategy_id:
        	DDL = getStrategyActivityDDL();
        	break;
        case componentType_toolsMaterials_id:
        	DDL = getToolsMaterialsActivityDDL();
        	break;
        case componentType_leadGen_id:
        	DDL = getLeadGenActivityDDL();
        	break;
    }    
	return DDL;
}
//*************************************************************/


//*************************************************************/
//********************** ACTIVITIES DDL ***********************/
//*************************************************************/
//TRAINING ACTIVITIES FOR EXPENSE DD
function addTrainingActivityItem(str){
	arrTrainingActivityDDL.push(str);
}
function removeTrainingActivityItem(item){
    const index = arrTrainingActivityDDL.indexOf(item);

    if (index > -1) {
      arrTrainingActivityDDL.splice(index, 1);
    }
}
function getTrainingActivityDDL(){
	return arrTrainingActivityDDL;
}
function trainingActivityItemExists(item){
	var result = false;
    const index = arrTrainingActivityDDL.indexOf(item);
    if (index > -1) {
      result = true;
    }
	return result;
}
//*************************************************************/

//*************************************************************/
//LEAD GEN ACTIVITIES FOR EXPENSE DD
function addLeadGenActivityItem(str){
	arrLeadGenActivityDDL.push(str);
}
function removeLeadGenActivityItem(item){
    const index = arrLeadGenActivityDDL.indexOf(item);

    if (index > -1) {
      arrLeadGenActivityDDL.splice(index, 1);
    }
}
function getLeadGenActivityDDL(){
	return arrLeadGenActivityDDL;
}
function leadGenActivityItemExists(item){
	var result = false;
    const index = arrLeadGenActivityDDL.indexOf(item);
    if (index > -1) {
      result = true;
    }
	return result;
}
//*************************************************************/

//*************************************************************/
//STRATEGY ACTIVITIES FOR EXPENSE DD
function addStrategyActivityItem(str){
	arrStratgeyActivityDDL.push(str);
}
function removeStrategyActivityItem(item){
    const index = arrStratgeyActivityDDL.indexOf(item);

    if (index > -1) {
      arrStratgeyActivityDDL.splice(index, 1);
    }
}
function getStrategyActivityDDL(){
	return arrStratgeyActivityDDL;
}
function strategyActivityItemExists(item){
	var result = false;
    const index = arrStratgeyActivityDDL.indexOf(item);
    if (index > -1) {
      result = true;
    }
	return result;
}
//*************************************************************/

//*************************************************************/
//TOOLS AND MATERIALS ACTIVITIES FOR EXPENSE DD
function addToolsMaterialsActivityItem(str){
	arrToolsMaterialsActivityDDL.push(str);
}
function removeToolsMaterialsActivityItem(item){
    const index = arrToolsMaterialsActivityDDL.indexOf(item);

    if (index > -1) {
      arrToolsMaterialsActivityDDL.splice(index, 1);
    }
}
function getToolsMaterialsActivityDDL(){
	return arrToolsMaterialsActivityDDL;
}
function toolsMaterialsActivityItemExists(item){
	var result = false;
    const index = arrToolsMaterialsActivityDDL.indexOf(item);
    if (index > -1) {
      result = true;
    }
	return result;
}
//*************************************************************/



//*************************************************************/
//********************** MARKETS DDL **************************/
//*************************************************************/
//LEAD GEN MARKETS DD
function addLeadGenMarketItem(str){
	arrLeadGenMarketsDDL.push(str);
}
function removeLeadGenMarketItem(item){
    const index = arrLeadGenMarketsDDL.indexOf(item);

    if (index > -1) {
      arrLeadGenMarketsDDL.splice(index, 1);
    }
}
function getLeadGenMarketDDL(){
	return arrLeadGenMarketsDDL;
}
//*************************************************************/

//*************************************************************/
//STRATGEY MARKETS DD
function addStrategyMarketItem(str){
	arrStratgeyMarketsDDL.push(str);
}
function removeStrategyMarketItem(item){
    const index = arrStratgeyMarketsDDL.indexOf(item);

    if (index > -1) {
      arrStratgeyMarketsDDL.splice(index, 1);
    }
}
function getStrategyMarketDDL(){
	return arrStratgeyMarketsDDL;
}
//*************************************************************/

//*************************************************************/
//TOOLS AND MATERIALS MARKETS DD
function addToolsMaterialsMarketItem(str){
	arrToolsMaterialsMarketsDDL.push(str);
}
function removeToolsMaterialsMarketItem(item){
    const index = arrToolsMaterialsMarketsDDL.indexOf(item);

    if (index > -1) {
      arrToolsMaterialsMarketsDDL.splice(index, 1);
    }
}
function getToolsMaterialsMarketDDL(){
	return arrToolsMaterialsMarketsDDL;
}
//*************************************************************/




//*************************************************************/
//********************** SECTORS DDL **************************/
//*************************************************************/
//LEAD GEN SECTORS DD
function addLeadGenSectorItem(str){
	arrLeadGenSectorsDDL.push(str);
}
function removeLeadGenSectorItem(item){
    const index = arrLeadGenSectorsDDL.indexOf(item);

    if (index > -1) {
      arrLeadGenSectorsDDL.splice(index, 1);
    }
}
function getLeadGenSectorDDL(){
	return arrLeadGenSectorsDDL;
}
//*************************************************************/

//*************************************************************/
//STRATGEY SECTORS DD
function addStrategySectorItem(str){
	arrStratgeySectorsDDL.push(str);
}
function removeStrategySectorItem(item){
    const index = arrStratgeySectorsDDL.indexOf(item);

    if (index > -1) {
      arrStratgeySectorsDDL.splice(index, 1);
    }
}
function getStrategySectorDDL(){
	return arrStratgeySectorsDDL;
}
//*************************************************************/

//*************************************************************/
//TOOLS AND MATERIALS SECTORS DD
function addToolsMaterialsSectorItem(str){
	arrToolsMaterialsSectorsDDL.push(str);
}
function removeToolsMaterialsSectorItem(item){
    const index = arrToolsMaterialsSectorsDDL.indexOf(item);

    if (index > -1) {
      arrToolsMaterialsSectorsDDL.splice(index, 1);
    }
}
function getToolsMaterialsSectorDDL(){
	return arrToolsMaterialsSectorsDDL;
}
//*************************************************************/


//**************************************************************************************************************************/
//**************************************************************************************************************************/
//**************************************************************************************************************************/
//**************************************************************************************************************************/






function getSelectedMarkets(){
    //console.log(selectedMarketsDDL);
    return selectedMarketsDDL;
}

function removeSelectedMarket(item){
    const index = selectedMarketsDDL.indexOf(item);

    if (index > -1) {
      selectedMarketsDDL.splice(index, 1);
    }
}


function setComponentArray(str){
    compArray.push(str);
}

function getComponentArray(){
    return compArray;
}

function componentExists(str){
    var index = compArray.indexOf(str);
    return index != -1 ? true : false;
}

function removeComponentArray(str){
    var index = compArray.indexOf(str);
    if (index > -1) {
        compArray.splice(index, 1);
    }
}

//will return a list of comoponents allowed for travel expenses
function getComponentTravelArray(){
    var DDL = [];
    for(var i=0; i<compArray.length ;i++){
        var tmpCompArray = compArray[i].split("=");
        if(tmpCompArray[0].trim() == getComponentType_trainingID().trim() || tmpCompArray[0].trim() == getComponentType_leadGenID().trim()){
    		DDL.push(compArray[i]);
        }
    } 
    return DDL;
}


//*************************************************************/
//*************************TRAVEL EXPENSES*********************/
//handle all the Eligible Expenses from the Travel Expense panel
var totalEligibleExpenseArray =[];
function setTotalEligibleExpenseArray(str){
    totalEligibleExpenseArray.push(str);
}
function getTotalEligibleExpenseArray(){
    return totalEligibleExpenseArray;
}
function resetTotalEligibleExpenseArray(){
    totalEligibleExpenseArray = [];
}

//handle all the Estimated Expenses from the Travel Expense panel
var totalEstimatedExpensesArray =[];
function setTotalEstimatedExpensesArray(str){
    totalEstimatedExpensesArray.push(str);
}
function getTotalEstimatedExpensesArray(){
    return totalEstimatedExpensesArray;
}
function resetTotalEstimatedExpensesArray(){
    totalEstimatedExpensesArray = [];
}

//handle all the Other Federal Government Funding Expenses from the Travel Expense panel
var totalOtherFedGvntFundingArray =[];
function setTotalOtherFedGvntFundingArray(str){
    totalOtherFedGvntFundingArray.push(str);
}
function getTotalOtherFedGvntFundingArray(){
    return totalOtherFedGvntFundingArray;
}
function resetTotalOtherFedGvntFundingArray(){
    totalOtherFedGvntFundingArray = [];
}



//*************************************************************/
//INVOKE THE GENERATES TRAVEL EXPENSES TOTALS
function handleExpensesAllocationData(sourceExpenseCollection){
  //ALLOCATION SECTORS
  //var sourceExpenseCollection = travelExpenseTable._Row1;
  populateCollectionData(sourceExpenseCollection,getComponentType_trainingID());
  populateCollectionData(sourceExpenseCollection,getComponentType_strategyID());
  populateCollectionData(sourceExpenseCollection,getComponentType_toolsMaterialsID());
  populateCollectionData(sourceExpenseCollection,getComponentType_leadGenID());
}


//*************************************************************/
//GENERATES TRAVEL EXPENSES TOTALS
function populateCollectionData(sourceExpenseCollection,compID){
  var totalEligibleExpensesAmount = 0;
  var totalOtherFedSourcesAmount = 0;
  var totalEstimatedExpensesAmount = 0;

  //get expenses based on component ID
  for(var i=0;i<sourceExpenseCollection.instanceCount;i++){      
    for(var j=0;j<sourceExpenseCollection.instances[i]._children.length;j++){
      if(trimString(sourceExpenseCollection.instances[i]._children[6]._children[7].value) === compID){       

        var itemEligibleExpense = isStringEmpty(sourceExpenseCollection.instances[i]._children[4].value) ? "0" : parseFloat(sourceExpenseCollection.instances[i]._children[4].value);
        var itemtotalOtherFedSource = isStringEmpty(sourceExpenseCollection.instances[i]._children[6]._children[6].value) ? "0" : parseFloat(sourceExpenseCollection.instances[i]._children[6]._children[6].value);
        var itemtotalEstimatedExpense = isStringEmpty(sourceExpenseCollection.instances[i]._children[6]._children[12].value) ? "0" : parseFloat(sourceExpenseCollection.instances[i]._children[6]._children[12].value);

        totalEligibleExpensesAmount = parseFloat(totalEligibleExpensesAmount) + parseFloat(itemEligibleExpense);//itemEligibleExpense
        totalOtherFedSourcesAmount = parseFloat(totalOtherFedSourcesAmount) + parseFloat(itemtotalOtherFedSource);//itemOtherFedSources
        totalEstimatedExpensesAmount = parseFloat(totalEstimatedExpensesAmount) + parseFloat(itemtotalEstimatedExpense);//itemEstimatedExpense

      }
      break;
    }

  }  

    if(getDebugMode()){
        console.log("totalEligibleExpensesAmount: " + totalEligibleExpensesAmount);
        console.log("totalOtherFedSourcesAmount: "+ totalOtherFedSourcesAmount);
        console.log("totalEstimatedExpensesAmount: " + totalEstimatedExpensesAmount);
    }

  setTotalEstimatedExpensesArray(totalEstimatedExpensesAmount);
  setTotalEligibleExpenseArray(totalEligibleExpensesAmount);
  setTotalOtherFedGvntFundingArray(totalOtherFedSourcesAmount);
}



//*************************************************************/
//*************************OTHER EXPENSES*********************/
//handle all the Eligible Expenses from the Travel Expense panel
var otherTotalEligibleExpenseArray =[];
function setOtherTotalEligibleExpenseArray(str){
    otherTotalEligibleExpenseArray.push(str);
}
function getOtherTotalEligibleExpenseArray(){
    return otherTotalEligibleExpenseArray;
}
function resetOtherTotalEligibleExpenseArray(){
    otherTotalEligibleExpenseArray = [];
}

//handle all the Estimated Expenses from the Travel Expense panel
var otherTotalEstimatedExpensesArray =[];
function setOtherTotalEstimatedExpensesArray(str){
    otherTotalEstimatedExpensesArray.push(str);
}
function getOtherTotalEstimatedExpensesArray(){
    return otherTotalEstimatedExpensesArray;
}
function resetOtherTotalEstimatedExpensesArray(){
    otherTotalEstimatedExpensesArray = [];
}

//handle all the Other Federal Government Funding Expenses from the Travel Expense panel
var otherTotalOtherFedGvntFundingArray =[];
function setOtherTotalOtherFedGvntFundingArray(str){
    otherTotalOtherFedGvntFundingArray.push(str);
}
function getOtherTotalOtherFedGvntFundingArray(){
    return otherTotalOtherFedGvntFundingArray;
}
function resetOtherTotalOtherFedGvntFundingArray(){
    otherTotalOtherFedGvntFundingArray = [];
}

//*************************************************************/
//INVOKE THE GENERATES OTHER EXPENSES TOTALS
function handleOtherExpensesAllocationData(sourceExpenseCollection){
  //ALLOCATION SECTORS
  //var sourceExpenseCollection = travelExpenseTable._Row1;
  populateOtherCollectionData(sourceExpenseCollection,getComponentType_trainingID());
  populateOtherCollectionData(sourceExpenseCollection,getComponentType_strategyID());
  populateOtherCollectionData(sourceExpenseCollection,getComponentType_toolsMaterialsID());
  populateOtherCollectionData(sourceExpenseCollection,getComponentType_leadGenID());
}


//*************************************************************/
//GENERATES OTHER EXPENSES TOTALS
function populateOtherCollectionData_TOBEDELETED(sourceExpenseCollection,compID){
  var totalEligibleExpensesAmount = 0;
  var totalOtherFedSourcesAmount = 0;
  var totalEstimatedExpensesAmount = 0;

  //get expenses based on component ID
  for(var i=0;i<sourceExpenseCollection.instanceCount;i++){      
    for(var j=0;j<sourceExpenseCollection.instances[i]._children.length;j++){
      if(trimString(sourceExpenseCollection.instances[i]._children[6]._children[7].value) === compID){       
    	
        var itemEligibleExpense = isStringEmpty(sourceExpenseCollection.instances[i]._children[4].value) ? "0" : parseFloat(sourceExpenseCollection.instances[i]._children[4].value);
        var itemtotalOtherFedSource = isStringEmpty(sourceExpenseCollection.instances[i]._children[6]._children[6].value) ? "0" : parseFloat(sourceExpenseCollection.instances[i]._children[6]._children[6].value);
        var itemtotalEstimatedExpense = isStringEmpty(sourceExpenseCollection.instances[i]._children[6]._children[12].value) ? "0" : parseFloat(sourceExpenseCollection.instances[i]._children[6]._children[12].value);
        
        totalEligibleExpensesAmount = totalEligibleExpensesAmount + parseFloat(itemEligibleExpense);//itemEligibleExpense
        totalOtherFedSourcesAmount = totalOtherFedSourcesAmount + parseFloat(itemtotalOtherFedSource);//itemOtherFedSources
        totalEstimatedExpensesAmount = totalEstimatedExpensesAmount + parseFloat(itemtotalEstimatedExpense);//itemEstimatedExpense

      }
      break;
    }

  }   
  setOtherTotalEstimatedExpensesArray(totalEstimatedExpensesAmount);
  setOtherTotalEligibleExpenseArray(totalEligibleExpensesAmount);
  setOtherTotalOtherFedGvntFundingArray(totalOtherFedSourcesAmount);
}

//*************************************************************/
//GENERATES OTHER EXPENSES TOTALS
function populateOtherCollectionData(sourceExpenseCollection,compID){
  var totalEligibleExpensesAmount = 0;
  var totalOtherFedSourcesAmount = 0;
  var totalEstimatedExpensesAmount = 0;

  //get expenses based on component ID
  for(var i=0;i<sourceExpenseCollection.instanceCount;i++){      
    for(var j=0;j<sourceExpenseCollection.instances[i]._children.length;j++){
      if(trimString(sourceExpenseCollection.instances[i]._children[5]._children[7].value) === compID){       
    	
        var itemEligibleExpense = isStringEmpty(sourceExpenseCollection.instances[i]._children[3].value) ? "0" : parseFloat(sourceExpenseCollection.instances[i]._children[3].value);
        var itemtotalOtherFedSource = isStringEmpty(sourceExpenseCollection.instances[i]._children[5]._children[6].value) ? "0" : parseFloat(sourceExpenseCollection.instances[i]._children[5]._children[6].value);
        var itemtotalEstimatedExpense = isStringEmpty(sourceExpenseCollection.instances[i]._children[5]._children[12].value) ? "0" : parseFloat(sourceExpenseCollection.instances[i]._children[5]._children[12].value);

        totalEligibleExpensesAmount = totalEligibleExpensesAmount + parseFloat(itemEligibleExpense);//itemEligibleExpense
        totalOtherFedSourcesAmount = totalOtherFedSourcesAmount + parseFloat(itemtotalOtherFedSource);//itemOtherFedSources
        totalEstimatedExpensesAmount = totalEstimatedExpensesAmount + parseFloat(itemtotalEstimatedExpense);//itemEstimatedExpense

      }
      break;
    }

  }   
  setOtherTotalEstimatedExpensesArray(totalEstimatedExpensesAmount);
  setOtherTotalEligibleExpenseArray(totalEligibleExpensesAmount);
  setOtherTotalOtherFedGvntFundingArray(totalOtherFedSourcesAmount);
}



/*
function populateSectosMarketsAllocationTableByComp(sourceCollection,targetCollection){     
  for(var j=0;j<targetCollection._Row1.instanceCount;j++){
    targetCollection._Row1.removeInstance(j);  
  }
  targetCollection.resetData();

  //populate the target collection
  for(var i=0;i<sourceCollection.instanceCount;i++){

	 if(getDebugMode()){
        console.log(sourceCollection.somExpression);  
        console.log(sourceCollection.instances[i]._children[1].name);
        console.log(sourceCollection.instances[i]._children[2].name);  
     }

    if(!isStringEmpty(sourceCollection.instances[i]._children[1].value)){
      targetCollection._Row1.addInstance(); 
      var objField =  targetCollection._Row1.instances[i]._children[0].somExpression;
      guideBridge.resolveNode(objField).value = sourceCollection.instances[i]._children[1].value;
    }
  }   
  //removes the last instances as it it visible bydefault
  var count = targetCollection._Row1.instanceCount;
  //targetCollection._Row1.removeInstance(count-1);

    return true;
}
*/



/*
this function handles the sectors and markets in the component section as well
all the allocation tables
*/
function populateSectosMarketsAllocationTable(sourceCollection,targetCollection){ 

  targetCollection.resetData();

  //populate the target collection
  for(var i=0;i<sourceCollection.instanceCount;i++){
    if(!isStringEmpty(sourceCollection.instances[i]._children[1].value)){
      targetCollection._Row1.addInstance(); 
      var objField =  targetCollection._Row1.instances[i]._children[0].somExpression;
      guideBridge.resolveNode(objField).value = sourceCollection.instances[i]._children[1].value;
    }

      if(getDebugMode()){
		  console.log("populateSectosMarketsAllocationTable()");
          //console.log(sourceCollection.somExpression); 
          console.log(sourceCollection.instances[i]._children[1].value);
          console.log(sourceCollection.instances[i]._children[2].value); 
          //console.log(targetCollection.somExpression); 
      }
  } 

    //removes empty instances
    removeEmptyRepInst(targetCollection.Row1);

}




//*************************************************************/
//
function deleteComponentFromExpenseCollection(sourceExpenseCollection,compID){
  //get expenses based on component ID

    if(getDebugMode()){
        console.log("INSTANCE COUNT BEFORE: " + sourceExpenseCollection.instanceCount);
        console.log("COMP ID: " + compID);
    }

    for (var i = sourceExpenseCollection.instanceCount - 1; i >= 0; i--) {
    //for(var i=0;i<sourceExpenseCollection.instanceCount;i++){    
      if(trimString(sourceExpenseCollection.instances[i]._children[6]._children[7].value) === compID){           
			sourceExpenseCollection.instances[i].resetData();
          sourceExpenseCollection.removeInstance(i);          
      }
    }

}


function deleteComponentFromOtherExpenseCollection(sourceExpenseCollection,compID){
  //get expenses based on component ID

    if(getDebugMode()){
        console.log("INSTANCE COUNT BEFORE: " + sourceExpenseCollection.instanceCount);
        console.log("COMP ID: " + compID);
    }

    for (var i = sourceExpenseCollection.instanceCount - 1; i >= 0; i--) {
    //for(var i=0;i<sourceExpenseCollection.instanceCount;i++){    
      if(trimString(sourceExpenseCollection.instances[i]._children[5]._children[7].value) === compID){           
			sourceExpenseCollection.instances[i].resetData();
          sourceExpenseCollection.removeInstance(i);          
      }
    }

}



/*
this function will set whether the expense section is completed
*/
function getIsExpensesRequired(){
	return expensesRequired;
}    

function setIsExpensesRequired(inValue){
	expensesRequired = inValue;
}    


/*
* Sets & Gets
* functions to handle allocation totals
*/
//STRATEGY
function setAllocPercentTotalSectorStrategy(str){
    allocPercentTotalSectorStrategy = str;
}
function getAllocPercentTotalSectorStrategy(){
    return allocPercentTotalSectorStrategy;
}
function setAllocPercentTotalMarketStrategy(str){
    allocPercentTotalMarketStrategy = str;
}
function getAllocPercentTotalMarketStrategy(){
    return allocPercentTotalMarketStrategy;
}
//TOOLS AND MATERIALS
function setAllocPercentTotalSectorToolsMaterials(str){
    allocPercentTotalSectorToolsMaterials = str;
}
function getAllocPercentTotalSectorToolsMaterials(){
    return allocPercentTotalSectorToolsMaterials;
}
function setAllocPercentTotalMarketToolsMaterials(str){
    allocPercentTotalMarketToolsMaterials = str;
}
function getAllocPercentTotalMarketToolsMaterials(){
    return allocPercentTotalMarketToolsMaterials;
}
//LEAD GEN
function setAllocPercentTotalSectorLeadGen(str){
    allocPercentTotalSectorLeadGen = str;
}
function getAllocPercentTotalSectorLeadGen(){
    return allocPercentTotalSectorLeadGen;
}
function setAllocPercentTotalMarketLeadGen(str){
    allocPercentTotalMarketLeadGen = str;
}
function getAllocPercentTotalMarketLeadGen(){
    return allocPercentTotalMarketLeadGen;
}























//*************************************************************/
//*************************************************************/
//**************************OLD***********************************/
//*************************************************************/
//*************************************************************/
//*************************************************************/





function getAllActivityTypesOptionsSet(categoryID){
  var operationName = "gac_AEMGetFDIActivityTypeForComponentCategory()";
  var operationArguments = JSON.stringify({
    	"gac_AEMGetFDIActivityTypeForComponentCategory_SelectedComponentCategory": trimString(categoryID), 
      	"gac_AEMGetFDIActivityTypeForComponentCategory_LanguageCode": getCRMFormLanguage()
  });
  return execCRMService(operationName,operationArguments,"activities","");
}

function getAllExpenseTypesOptionsSet(categoryID){
  var operationName = "gac_AEMGetFDIExpenseTypeTypeForComponentCategory()";
  var operationArguments = JSON.stringify({
      "gac_AEMGetFDIExpenseTypeTypeForComponentCategory_SelectedComponentCategory": trimString(categoryID), 
      "gac_AEMGetFDIExpenseTypeTypeForComponentCategory_LanguageCode": getCRMFormLanguage()
  });
  return execCRMService(operationName,operationArguments,"expenseTypes","");
}

function getAllUnitOfMeasurementTypesOptionsSet(categoryID){
  var operationName = "gac_AEMGetFDIUnitsOfMeasurementsForComponentCategory()";
  var operationArguments = JSON.stringify({
      "gac_AEMGetFDIUnitsOfMeasurementsForComponentCategory_SelectedComponentCategory": trimString(categoryID), 
      "gac_AEMGetFDIUnitsOfMeasurementsForComponentCategory_LanguageCode": getCRMFormLanguage()
  });
  return execCRMService(operationName,operationArguments,"units","");
}



function getAllSectorsOptionsSet(){
  var operationName = "gac_AEMGetEntityPicklistAttributesMetadata()";
    var operationArguments = JSON.stringify({
      "gac_AEMGetEntityPicklistAttributesMetadata_EntityName": "gac_fdiprojectactivity",
      "gac_AEMGetEntityPicklistAttributesMetadata_LanguageCode": getCRMFormLanguage()
    });
  return execService(operationName,operationArguments,"marketsSectors","gac_fditargetsector");
}

function getAllMarketsOptionsSet(){
  var operationName = "gac_AEMGetEntityPicklistAttributesMetadata()";
    var operationArguments = JSON.stringify({
      "gac_AEMGetEntityPicklistAttributesMetadata_EntityName": "gac_fdiprojectactivity",
      "gac_AEMGetEntityPicklistAttributesMetadata_LanguageCode": getCRMFormLanguage()
    });
  return execService(operationName,operationArguments,"marketsSectors","gac_fditargetmarket");
}




var categoryJson = {};
var activityTypeJson = {};
var expenseTypeJson = {};
var unitsOfMeasurementJson = {};

/* 
* parse json data to prepopulate the Component Types DDL 
*/
function buildJsonArray(data) {

    var componentTypes = [];
    var activityTypes = [];
    var expenseTypes = [];
    var unitOfMeasurementTypes =[];
	var category = [];


    categoryJson.category = category;
    //categoryJson.componentTypes = componentTypes;
	activityTypeJson.activityTypes = activityTypes;
	expenseTypeJson.expenseTypes = expenseTypes;
	unitsOfMeasurementJson.unitOfMeasurementTypes = unitOfMeasurementTypes;

    var jsonPayload = data.EntityOptionSetMetadata;
    var jsonPayloadObj = JSON.parse(jsonPayload);

    for (var i = 0; i < jsonPayloadObj.EntityOptionSets.length; i++) {
      var optionSet = jsonPayloadObj.EntityOptionSets[i];
      var optionSetFieldName = optionSet.Key;
      var dropdownOptions = optionSet.Value;
      //console.log("Field: " + optionSetFieldName);
      for (var j = 0; j < dropdownOptions.length; j++) { 
        var dropdownItemText = dropdownOptions[j].OptionSetLabel;
        var dropdownItemIntVal = dropdownOptions[j].OptionSetValue;     

         //get all the component category and creates an array
        componentTypes =(dropdownOptions[j]);
        categoryJson.category.push(componentTypes); 

        //gets all the activity types based on category ID and creates an array
		activityTypes = (getAllActivityTypesOptionsSet(dropdownItemIntVal));
		activityTypeJson.activityTypes.push(dropdownItemIntVal ,activityTypes);

        expenseTypes = (getAllExpenseTypesOptionsSet(dropdownItemIntVal));
		expenseTypeJson.expenseTypes.push(dropdownItemIntVal ,expenseTypes);

        unitOfMeasurementTypes = (getAllUnitOfMeasurementTypesOptionsSet(dropdownItemIntVal));
		unitsOfMeasurementJson.unitOfMeasurementTypes.push(dropdownItemIntVal ,unitOfMeasurementTypes);  

      }
    }


    //console.log(JSON.stringify(categoryJson));
	//console.log(JSON.stringify(activityTypeJson));
    //console.log(JSON.stringify(expenseTypeJson));
    //console.log(JSON.stringify(unitsOfMeasurementJson));


}




/* 
*	operName: operation name
*	operArguments: operation arguments
*	getDDL: function to use to parse json array
*	inOptionSetFieldName: key name use to parse nested json array
*/
function getDDLOptionsSet(getDDL,compID) {
    var DDL = [];

    if(getDDL === "category"){     
         DDL = getComponentOptionsSet(categoryJson);
     }
    else if(getDDL === "activities"){
        DDL = getActivityTypesByCompID(activityTypeJson,compID);
    }
    else if(getDDL === "expenseTypes"){
        DDL = getExpenseTypesByCompID(expenseTypeJson,compID);
    }
	else if(getDDL === "unitOfMeasurementTypes"){
        DDL = getUnitsOfMeasurementByCompID(unitsOfMeasurementJson,compID);
    }
    return DDL;
}



/* 
* parse json data to prepopulate the Component Types DDL 
*/
function getComponentOptionsSet(data) {
    var DDL = [];
	//console.log(data);

    for (var i = 0; i < data.category.length; i++) {
		//console.log(data.category[i]);
        var dropdownItemText = data.category[i].OptionSetLabel;
        var dropdownItemIntVal = data.category[i].OptionSetValue;
        //console.log(dropdownItemIntVal + " - " + dropdownItemText);
        DDL.push(dropdownItemIntVal + " = " + dropdownItemText);
     }
     return DDL;
}



/* 
* parse json data to prepopulate the Activity Types DDL by Component ID
*/
function getActivityTypesByCompID(data,compID) {
    var DDL = [];

    for (var i = 0; i < data.activityTypes.length; i++) {
        if(JSON.stringify(data.activityTypes[i]) == trimString(compID)){

            var jsonPayload = data.activityTypes[i+1].FilteredActivityTypes;
            var jsonPayloadObj = JSON.parse(jsonPayload);
            //console.log("Entity - " + jsonPayloadObj);

            for (var i = 0; i < jsonPayloadObj.length; i++) {
                var dropdownItemText = jsonPayloadObj[i].OptionSetLabel;
                var dropdownItemIntVal = jsonPayloadObj[i].OptionSetValue;
                //console.log(dropdownItemIntVal + " - " + dropdownItemText);
                DDL.push(dropdownItemIntVal + " = " + dropdownItemText);
            }
        }
     }

    return DDL;
}



/* 
* parse json data to prepopulate the Expense Types DDL by Component ID
*/
function getExpenseTypesByCompID(data,compID) {
    var DDL = [];

    for (var i = 0; i < data.expenseTypes.length; i++) {
        if(JSON.stringify(data.expenseTypes[i]) == trimString(compID)){

            var jsonPayload = data.expenseTypes[i+1].FilteredExpenseTypes;
            var jsonPayloadObj = JSON.parse(jsonPayload);
            //console.log("Entity - " + jsonPayloadObj);

            for (var i = 0; i < jsonPayloadObj.length; i++) {
                var dropdownItemText = jsonPayloadObj[i].OptionSetLabel;
                var dropdownItemIntVal = jsonPayloadObj[i].OptionSetValue;
                //console.log(dropdownItemIntVal + " - " + dropdownItemText);
                DDL.push(dropdownItemIntVal + " = " + dropdownItemText);
            }
        }
     }

    return DDL;
}


/* 
* parse json data to prepopulate the Expense Types DDL by Component ID
*/
function getUnitsOfMeasurementByCompID(data,compID) {
    var DDL = [];

    for (var i = 0; i < data.unitOfMeasurementTypes.length; i++) {
        if(JSON.stringify(data.unitOfMeasurementTypes[i]) === trimString(compID)){

            var jsonPayload = data.unitOfMeasurementTypes[i+1].FilteredUnitsOfMeasurements;
            var jsonPayloadObj = JSON.parse(jsonPayload);
            //console.log("Entity - " + jsonPayloadObj);

            for (var i = 0; i < jsonPayloadObj.length; i++) {
                var dropdownItemText = jsonPayloadObj[i].OptionSetLabel;
                var dropdownItemIntVal = jsonPayloadObj[i].OptionSetValue;
                //console.log(dropdownItemIntVal + " - " + dropdownItemText);
                DDL.push(dropdownItemIntVal + " = " + dropdownItemText);
            }
        }
     }

    return DDL;
}







/*
**********************************************************************************************************************************
**********************************************************************************************************************************
*/


/* 
*	operName: operation name
*	operArguments: operation arguments
*	getDDL: function to use to parse json array
*	inOptionSetFieldName: key name use to parse nested json array
*/
function execService(operName,operArguments,getDDL,inOptionSetFieldName) {
    var DDL = [];

    $.ajax({
      type: "POST",
      url: "/content/dam/formsanddocuments-fdm/fdm-ceci.executeDermisQuery.json?",
      data: {
        "operationName": operName,
        "operationArguments": operArguments
      },
      success: function (data, textStatus, jqXHR) {
        //console.log("gac_AEMGetEntityPicklistAttributesMetadata-Success" + data);    
        //parse json array
          if(getDDL === "category"){              
        	DDL = getCRMComponentDDL(data);
          }
          else if(getDDL === "activities"){
        	DDL = getCRMActivitiesByCompID(data);
          }
          else if(getDDL === "expenseTypes"){
        	DDL = getCRMExpenseTypesByCompID(data);
          }
          else if(getDDL === "marketsSectors"){
        	DDL = getCRMSectorMarketDDL(data,inOptionSetFieldName);
          }
          else if(getDDL === "units"){
        	DDL = getCRMUnitsOfMeasuresByCompID(data,inOptionSetFieldName);
          }

      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log("ERROR-gac_AEMGetEntityPicklistAttributesMetadata-ERROR");
      },
      cache: false,
      async: false
    });

    return DDL;
}



/* 
* parse json data to prepopulate the Component Types DDL 
*/
function getCRMComponentDDL(data) {
    var DDL = [];
    //console.log(data);

    var jsonPayload = data.EntityOptionSetMetadata;
    var jsonPayloadObj = JSON.parse(jsonPayload);
    console.log("Entity - " + jsonPayloadObj.EntityLogicalName);
    for (var i = 0; i < jsonPayloadObj.EntityOptionSets.length; i++) {
      var optionSet = jsonPayloadObj.EntityOptionSets[i];
      var optionSetFieldName = optionSet.Key;
      var dropdownOptions = optionSet.Value;
      //console.log("Field: " + optionSetFieldName);
      for (var j = 0; j < dropdownOptions.length; j++) {
        var dropdownItemText = dropdownOptions[j].OptionSetLabel;
        var dropdownItemIntVal = dropdownOptions[j].OptionSetValue;
          //console.log(dropdownItemIntVal);

        console.log(dropdownItemIntVal + " - " + dropdownItemText);
        DDL.push(dropdownItemIntVal + " = " + dropdownItemText);
      }
    }

     return DDL;
}

/* 
* parse json data to prepopulate the Activity Types DDL by Component ID
*/
function getCRMActivitiesByCompID(data) {
    //console.log("Exec getCRMActivitiesByCompID");
    var DDL = [];
    var jsonPayload = data.FilteredActivityTypes;
    var jsonPayloadObj = JSON.parse(jsonPayload);
    console.log("Entity - " + jsonPayloadObj);

    for (var i = 0; i < jsonPayloadObj.length; i++) {
        var dropdownItemText = jsonPayloadObj[i].OptionSetLabel;
        var dropdownItemIntVal = jsonPayloadObj[i].OptionSetValue;
        //console.log(dropdownItemIntVal + " - " + dropdownItemText);
        DDL.push(dropdownItemIntVal + " = " + dropdownItemText);
    }

    return DDL;
}


/* 
* parse json data to prepopulate the Activity Types DDL by Component ID
*/
function getCRMExpenseTypesByCompID(data) {
    //console.log("Exec getCRMExpenseTypesByCompID");

    var DDL = [];
    var jsonPayload = data.FilteredExpenseTypes;
    var jsonPayloadObj = JSON.parse(jsonPayload);
    //console.log("Entity - " + jsonPayloadObj);

    for (var i = 0; i < jsonPayloadObj.length; i++) {
        var dropdownItemText = jsonPayloadObj[i].OptionSetLabel;
        var dropdownItemIntVal = jsonPayloadObj[i].OptionSetValue;
        //console.log(dropdownItemIntVal + " - " + dropdownItemText);
        DDL.push(dropdownItemIntVal + " = " + dropdownItemText);
    }

    return DDL;

}



/* 
* parse json data to prepopulate the Sectors and Markets DDL
*/
function getCRMSectorMarketDDL(data,inOptionSetFieldName) {
    //console.log(inOptionSetFieldName);
    var DDL = [];
	var jsonPayload = data.EntityOptionSetMetadata;
    var jsonPayloadObj = JSON.parse(jsonPayload);
    //console.log("Entity - " + jsonPayloadObj.EntityLogicalName);
    for (var i = 0; i < jsonPayloadObj.EntityOptionSets.length; i++) {
      var optionSet = jsonPayloadObj.EntityOptionSets[i];
      var optionSetFieldName = optionSet.Key;
      var dropdownOptions = optionSet.Value;
      //console.log("Field: " + optionSetFieldName);
      if(optionSetFieldName === inOptionSetFieldName){
        for (var j = 0; j < dropdownOptions.length; j++) {
          var dropdownItemText = dropdownOptions[j].OptionSetLabel;
          var dropdownItemIntVal = dropdownOptions[j].OptionSetValue;
          //console.log(dropdownItemIntVal + " - " + dropdownItemText);
          DDL.push(dropdownItemIntVal + " = " + dropdownItemText);
        }
       }
    }

    return DDL;
}



/* 
* parse json data to prepopulate the Activity Types DDL by Component ID
*/
function getCRMUnitsOfMeasuresByCompID(data) {
    var DDL = [];
	var jsonPayload = data.FilteredUnitsOfMeasurements;
    var jsonPayloadObj = JSON.parse(jsonPayload);
    //console.log("Entity - " + jsonPayloadObj);

    for (var i = 0; i < jsonPayloadObj.length; i++) {
        var dropdownItemText = jsonPayloadObj[i].OptionSetLabel;
        var dropdownItemIntVal = jsonPayloadObj[i].OptionSetValue;
        //console.log(dropdownItemIntVal + " - " + dropdownItemText);
        DDL.push(dropdownItemIntVal + " = " + dropdownItemText);
    }

    return DDL;

}








/* 
* parse json data to prepopulate the Activity Types DDL 
*/
function getComponentDDL(arrJsonPayload) {
    //console.log("populateActivityDD...");
	var DDL = [];
    var myJSON = JSON.stringify(arrJsonPayload);
	var jsonPayloadObj = JSON.parse(myJSON);

   for(var i = 0; i < jsonPayloadObj.EntityOptionSets.length; i++){
     var optionSet = jsonPayloadObj.EntityOptionSets[i];
      var optionSetFieldName = optionSet.Key;
      var dropdownOptions = optionSet.Value;
      //console.log("Field: " + inOptionSetFieldName);
      if(optionSetFieldName === "gac_componentcategory"){
        for(var j = 0; j < dropdownOptions.length; j++){
          var dropdownItemText = dropdownOptions[j].OptionSetLabel;
          var dropdownItemIntVal = dropdownOptions[j].OptionSetValue;
          DDL.push(dropdownItemIntVal + " = " + dropdownItemText);
        }
      }
  }


    return DDL;
}


/* 
* parse json data to prepopulate the Activity Types DDL 
*/
function getActivityDDL(arrJsonPayload) {
    //console.log("populateActivityDD...");
	var DDL = [];

    var myJSON = JSON.stringify(arrJsonPayload);
	var jsonPayloadObj = JSON.parse(myJSON);
    for(var i = 0; i < jsonPayloadObj.FilteredActivityTypes.length; i++){
      var optionSet = jsonPayloadObj.FilteredActivityTypes[i];

      var dropdownItemText = optionSet.OptionSetLabel;
      var dropdownItemIntVal = optionSet.OptionSetValue;
      DDL.push(dropdownItemIntVal + " = " + dropdownItemText);
    }

    return DDL;
}


/* 
* parse json data to prepopulate the Sector or Market DDL 
*/
function getSectorMarketDDL(arrJsonPayload, inOptionSetFieldName) {
    //console.log("populateSectorMarketDD...");
	var DDL = [];
    var myJSON = JSON.stringify(arrJsonPayload);
	var jsonPayloadObj = JSON.parse(myJSON);

   for(var i = 0; i < jsonPayloadObj.EntityOptionSets.length; i++){
     var optionSet = jsonPayloadObj.EntityOptionSets[i];
      var optionSetFieldName = optionSet.Key;
      var dropdownOptions = optionSet.Value;
      //console.log("Field: " + inOptionSetFieldName);
      if(optionSetFieldName === inOptionSetFieldName){
        for(var j = 0; j < dropdownOptions.length; j++){
          var dropdownItemText = dropdownOptions[j].OptionSetLabel;
          var dropdownItemIntVal = dropdownOptions[j].OptionSetValue;
          DDL.push(dropdownItemIntVal + " = " + dropdownItemText);
        }
      }
  }

    return DDL;
}