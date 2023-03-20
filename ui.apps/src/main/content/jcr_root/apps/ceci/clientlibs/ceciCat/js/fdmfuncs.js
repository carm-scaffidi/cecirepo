console.log("fdmfuncs.js"   + ": "  + "Mar20a" + " " + "2023");
/* 
Jan10a 
added function getClaimButtonLabelEnable(statuscode)

From CRX - Most recent WORKING 
Wed Sep8-Besco-doExpenses - added, shortDescription, timTo and timeFrom
- doExpenses "-->"gac_externalfundingsources": vItem.otherFederalContribution,"
-Updated RDMS global vars: gac_urlbasic

Thu Dec 8, 8:18 pm "Proposal Name"
Today: Mon Dec 114, 4:02 pm
All components, Expenses, Missions working correctly, except
Todo: fix single Exepnse count
 */
//console.log ("document.domain = 'international.gc.ca': "+ document.domain);
//above from AsimK

/*
GLOBAL VARIABLE DECLARATION
These can be used EVEN in the JS in the Adaptive form
*/
var vUrlParams = new URLSearchParams(window.location.search);
var vLang = vUrlParams.get('afAcceptLang'); //This is currently used in func "getClaimButtonLabelEnable" below
sessionStorage.setItem("lang", vLang); // used in transition from one form to another

var vEgcs_tp_profileid = ""; // Program: 'CanExport Community Investments'
var vEgcs_fo_profileid = sessionStorage.getItem("foprofileid"); //Call for Proposal: 'CFP 2021'
var vEgcs_fc_profileid = ""; // Proposal... entered into form
var vContactId = sessionStorage.getItem("contactid");
var vContactObj = "";
var vAccountId = sessionStorage.getItem("accountid");
var vGacCountryid = "A5C734AE-9001-EB11-B82B-005056BF50DD";
var vGacTimeperiodid = "";
var vGac_fdiprojectcomponentid = "";
var componentCatIdObj = {}; // see function initcomponentCategoryArray
var vItemId = "";
var vItemDescription = "";
var haveComponentYN = "";
var vAllocationBySector = "";
var vAllocationPercentage = "";
var vPreviousFcProfileId = ""; //Besco-Oct21-2022: to be used for "View claims" button click in fragment 'pnlclaims'
var vGac_timeperiodid = ""; //Besco-Dec01-2022: to be used for "View claims" button click in fragment 'pnlclaims'
var vIsFinalClaim = 0;

// 'vRdmsTargetEnv' is either 'ceciprop' (for local and dev05) or 
// 'ceciqcprop' for dev06-TST-QC
var vRdmsTargetEnv = "ceciqcprop";

// The code on next 4 lines to be moved to /apps/ceciEnvSpecific
//sessionStorage.setItem("appid","ceciprop");

// Besco-Dec-2022: the following is commented
sessionStorage.setItem("gac-aem-masterId", sessionStorage.getItem("fcprofileid"));

//bb-Jul2-This should be set in LandingPage, just before jumping to Reg or Proposala
//sessionStorage.setItem("gac-aem-appId", vRdmsTargetEnv);
sessionStorage.setItem("edmsp_fileSizeAllow", "10000000");
sessionStorage.setItem("emdsp_validExtensions", "pdf,doc,docx,xls,xlsx,png,jpg,gif,txt");
sessionStorage.setItem("gac_urlbasic", webApiRootUrl + "RDIMSDocument/documentListCRMData/?masterEntityId=");
//sessionStorage.setItem("gac_urlbasic",webApiRootUrl);
//sessionStorage.setItem("gac_urlbasic","https://gccasewebapi-dev/rdims/RDIMSDocument/documentListCRMData/?masterEntityId=");

//var webApiRootUrl = "https://gccasewebapi-dev/rdims/"; (from 'rdimgrid.js') 
//this is defined in CRX /apps/clientlibs/cecienvspecificCat/js/cecienvspecificvars.js
if (getDebugMode()) { console.log("FDMFuncs-webApiRootUrl: " + webApiRootUrl); }
/*

*/

function getfcProfileViaAcctAndIsClaimable(accountID){ //Besco Jan 2023 - 1339, 1340
var getProposalArgs = JSON.stringify({
  "_egcs_account_value": accountID,
  "gac_isclaimable": true
});
console.log("getfcProfileViaAcctAndIsClaimable--getProposalArgs: " + getProposalArgs);
var operationName = "GET egcs_fc_profile_by_isClaimable";
var data = execCRMService3Args(operationName, getProposalArgs);
if (Array.isArray(data)) { console.log("There is an array of data") }
else {
  if (data.result.toLowerCase() === ("No response").toLowerCase()) {
    console.log("No Claims")
  }
}
return data;
}

function generateAndUploadClaimDor(formPath) {
  
//  debugger; from asimKhan
 console.log("formPath :-"+formPath);
 window.guideBridge.getDataXML({
     success: function(result) {
         var formData = new FormData();
         formData.append("dataXml",result.data);
         $.ajax({
             async: true,
             url: "/content/gac/getdor.html",
             method: "POST",
             data: {
                 xmlData: result.data,
                 formPath: formPath
             },
         })
         .done(function (response) {
             //window.open(JSON.parse(response).filePath, '_blank');

             console.log("button clicked");
             sessionStorage.setItem("dorPath",JSON.parse(response).filePath);

             var pageURL = JSON.parse(response).filePath;
 var metaDataStr = '{\"Title\":\"' + 'realfileName' +
     '\",\"TrusteeRights\":[{\"Trustee\":\"' + '_GAC_METADATA_TRUSTEE' +
         '\",\"Rights\":' + '255' +
             '}],\"Typist\":\"' + '_GAC_METADATA_TYPIST' +
                 '\",\"Security\":\"' + '_GAC_METADATA_SECURITY' +
                     '\",\"ResponsibleUser\":\"' + '_GAC_METADATA_RESPONSIBLEUSER' +
                         '\",\"Language\":\"ENG\",\"FilePt\":\"' + '_GAC_METADATA_FILEPT' +
                             '\",\"DepartmentId\":\"' + '' + '\",\"Application\":\"' + 'ACROBAT' + '\"}';
 console.log("metadataStr created");

 var _appId =  sessionStorage.getItem("gac-aem-appId");
             if(_appId == null)
             { writeToconsole (); }

 var entityId =sessionStorage.getItem("gac-aem-masterId"); 
   console.log("entityId claim/proposal upload" + entityId); 
if(entityId == null)  { writeToconsole (); }

var _masterEntityId =sessionStorage.getItem("gac-aem-masterId");
if(_masterEntityId == null) { writeToconsole (); }

 var id= _masterEntityId;

//var dataDocumentURI = webApiRootUrl + "/rdims/api/RDIMS/addnewdocument/?lang=en/?masterEntityId=" + entityId + "&appId=" + _appId;
var dataDocumentURI = webApiRootUrl + "api/RDIMS/addnewdocument/?lang=en";                

var _postFileURL = dataDocumentURI;

             if ( _postFileURL == null){
                 _postFileURL = "https://gccasewebapi-dev/rdims/api/RDIMS/addnewdocument/?lang=en"; // missing "_" prefix.. was postFileURL
}

 var _masterEntityName = "egcs_fc_profile";
// var _masterEntityId = id = entityId="E477359F-1D9F-EC11-96BD-005056818AAD";

 var _lookupEntityFieldName = "egcs_fc_profileid";
 var _relationshipName = "egcs_fc_profile_rdimdocumentcontent";

//    var _masterEntityName = "gac_fdiclaim";
// var _masterEntityId = id = entityId="E477359F-1D9F-EC11-96BD-005056818AAD";

//    var _lookupEntityFieldName = "gac_fdiclaim";
//    var _relationshipName = "gac_fdiclaim_rdimdocumentcontent";
var _relationshipName = "egcs_fc_profile_rdimdocumentcontent";

             var data = new FormData();
            
             data.append("metadata", metaDataStr);
             data.append("entityType", _masterEntityName);
             data.append("lookupEntityFieldName", _lookupEntityFieldName);
             data.append("entityId", _masterEntityId);
             data.append("appid", _appId);
             data.append("postFileURL", _postFileURL);

             var fileURL = JSON.parse(response).filePath;
             var fileName = fileURL.substring(fileURL.lastIndexOf("/")+1);
             data.append("fileName", fileName);
             data.append("fileDescription",fileName);
             data.append("fileURL",fileURL);

             var settings ={
                 "async": true,
                 "url": "/bin/dorfileupload",
                 "processData": false,
                 "contentType": false,
                 "type": "POST",
                 "method": "POST",
                 "data":data,
             };
             $.ajax(settings).done(function(response)
                 {
                   console.log("got response: " + response);                                          
                 });

         })
     },
     error: function (guideResultObject) {
         console.log("got error: " + guideResultObject);
     },
     guideState : null,
     boundData: true
 });

}

function createDateStrForStub(strRefText){
  const today = new Date();
  var strDateToday = today.toISOString();
  const dateArray = strDateToday.split("T");
  var strDateOnly = dateArray[0];
  var strDraftDate = strRefText + ". --- " + strDateOnly;
return strDraftDate;
}

function createClaimStub(vFcProfileid,vGac_timeperiodid) {

  const today = new Date();
  var strDateToday = today.toISOString();
  const dateArray = strDateToday.split("T");
  var strDateOnly = dateArray[0];
  var strDraftDate = "DRAFT --- " + strDateOnly;

  var claimData4Post = {
    "gac_name": strDraftDate,
    "gac_FDIProject": { "egcs_fc_profileid": vFcProfileid },
    "gac_Account": { "accountid": sessionStorage.getItem("accountid") },
    "gac_PreparedBy": { "contactid": sessionStorage.getItem("contactid") },
    "gac_CallYear": {
      //"gac_period": sessionStorage.getItem("gac_period"), // As per PJS Request on May11-2022
      "gac_timeperiodid": vGac_timeperiodid
    }
  };
  console.log("createClaimStub->claimData4Post:" + claimData4Post);

  var claimFormData = JSON.stringify({
    "gac_fdiclaim": claimData4Post,
  });

  var operationName = "POST gac_fdiclaim /gac_fdiclaims";
  var objData = execCRMService3Args(operationName, claimFormData);
  var vClaimId = objData.gac_fdiclaimid;
  sessionStorage.setItem("gac_fdiclaimid", vClaimId);

  return vClaimId;
}

function getClaimButtonLabelEnable(statuscode) { // bbesco    
  switch (statuscode) {
    case 1: {
      console.log("getClaimButtonLabelEnable: 1 - Draft");
      var buttonTitle =  vLang === "en" ? "Draft" : "Ébauche";
      var buttonEnabled = true;
    }
      break;
    case 810510007: { //Besco, changed from "2", Apr26
      console.log("getClaimButtonLabelEnable: 2 - Not Approved");
      var buttonTitle =  vLang === "en" ? "Not Approved" : "Non approuvé";
      var buttonEnabled = false;
    }
      break;
    case 810510000: {
      console.log("getClaimButtonLabelEnable: 810510000 - Submitted");
      var buttonTitle =  vLang === "en" ? "Submitted" : "Soumis";
      var buttonEnabled = false;
    }
      break;
    case 810510001: {
      console.log("getClaimButtonLabelEnable: 810510001 - Returned");
      var buttonTitle =  vLang === "en" ? "Returned" : "retourné";
      var buttonEnabled = true;
    }
      break;
    case 810510002: {
      console.log("getClaimButtonLabelEnable: 810510002 - Approved");
      var buttonTitle =  vLang === "en" ? "Approved" : "approuvé";
      var buttonEnabled = false;
    }
      break;
    case 810510005: {
      console.log("getClaimButtonLabelEnable: 810510005 - Processed");
      var buttonTitle =  vLang === "en" ? "Processed" : "traité";
      var buttonEnabled = false;
    }
      break;
    case 810510008: {
      console.log("getClaimButtonLabelEnable: 810510008 - Approved For Payment"); //Discrepancy: was "statuscode value discrepancy"
      var buttonTitle =  vLang === "en" ? "To Be Processed" : "à traiter";
      var buttonEnabled = false;
    }
      break;
    default: { console.log("getClaimButtonLabelEnable: GCCase Claim 'statuscode': " + statuscode + ", not found"); }
  }
  return [buttonTitle, buttonEnabled];
}


//AsimK takes input string from text field, substitute word for symbol
//Bug 405, 448
function cleanData(p_str) {
// depricated--> accomplished with new param "encodeURIComponent" in function 'execCRMService' //besco-Oct13-2022
/* //  console.log("CECI.UTILITY.cleanData");

  if (p_str !== null && p_str !== '') {
    var langsp = sessionStorage.getItem("lang");
    if (langsp !== null && langsp !== '') {
      langsp = langsp.toLowerCase();

      if (langsp == 'en') {
        p_str = p_str.replaceAll("%", "percent").replaceAll("&", "and");
      } else { // french
        p_str = p_str.replaceAll("%", "pour cent").replaceAll("&", "et");
      }
    }
    else  //langsp is empty default EN
    {
      p_str = p_str.replaceAll("%", "percent").replaceAll("&", "and");
    }
    p_str = p_str.replaceAll("\\t", "").replaceAll("\\n", "");
    p_str = p_str.replaceAll("^", "").replaceAll("*", "").replaceAll("#", "").replaceAll("!", "");
    p_str = p_str.replaceAll("<", "").replaceAll(" >", "").replaceAll("#", "").replaceAll("!", "").replaceAll('"', "").replaceAll("'", "");
    p_str = p_str.replaceAll("%", "percent").replaceAll("&", "and");
  } */
  return p_str
}

function getCookie(name) {
  var re = new RegExp(name + "=([^;]+)");
  var value = re.exec(document.cookie);
  return (value != null) ? unescape(value[1]) : null;
}

function getGAC_saveddraftByID_SStore() {
  var operationName = "GETgac_saveddraftByID";
  var operationArguments = JSON.stringify({
    "gac_saveddraftid": sessionStorage.getItem("gac_saveddraftid")
  });
  var data = execCRMService(operationName, operationArguments);

  if (getDebugMode()) { console.log(data); }
  return data;
}

function getDraftProposalStatusReturn2() { //bb-returns array of [buttonTitle,buttonVisible]
  var jsonPayload = getGAC_saveddraftByID_SStore(); // this is similar to "getGAC_saveddraftByID" except it uses sessionstore
  //let's parse the return json data and extract the object "gac_rawdata"
  var jsonPayloadArray = jsonPayload[0];
  var jsonParsed = JSON.parse(jsonPayloadArray.gac_rawdata);

  if (getDebugMode()) { console.log(jsonParsed); }

  sessionStorage.setItem("fcprofileid", jsonParsed.globalids.fcprofileid);

  var vFcprofileid = jsonParsed.globalids.fcprofileid;
  if (getDebugMode()) { console.log("getDraftProposalStatus->jsonParsed.globalids.fcprofileid: " + jsonParsed.globalids.fcprofileid); }

  var operationArguments = JSON.stringify({
    "egcs_fc_profileid": vFcprofileid
  });
  var operationName = "GET egcs_fc_profile /egcs_fc_profiles";
  var data = execCRMService(operationName, operationArguments);
  var vStatuscode = data[0].statuscode;

  if (vStatuscode == "1") {
    if (sessionStorage.getItem("lang") == "fr") var buttonTitle = "Soumis";
    else var buttonTitle = "Submitted";
    var buttonVisible = false;

  }
  else {
    if (sessionStorage.getItem("lang") == "fr") var buttonTitle = "Modifier";
    else var buttonTitle = "Edit";
    var buttonVisible = true;
  }
  if (getDebugMode()) { console.log("getDraftProposalStatus: " + data); }
  return [buttonTitle, buttonVisible];
}

var vTempPutAccountStructure =
{
  "account_accountid": "nulla cillum lab",
  "account": {
    "emailaddress1": "quis sunt laborum ut i",
    "egcs_operatingname_en": "inexercitation se",
    "gac_legalname_en": "laboris"
  }
}

function updateAccountPrimaryContactID(vAccountId, vContactid) {
  var operationName = "PUT account /accounts";
  var operationArguments = JSON.stringify({
    "account_accountid": vAccountId,
    "account": {
      "primarycontactid": {"contactid": vContactid }
    }
  });
  var data = execCRMService(operationName, operationArguments);

  if (getDebugMode()) { console.log(data); }
  //check if "No response", which means PUT was successful
  if (data.result.toLowerCase() === ("No response").toLowerCase()) {
    console.log("Proposal update successful")
  }
  return data;
}

function updateAccountInfo(vAccountId, accountInfoArray) {
  var operationName = "PUT account /accounts";
  var operationArguments = JSON.stringify({
    "account_accountid": vAccountId,
    "account": accountInfoArray
});
  var data = execCRMService3Args(operationName, operationArguments);

  if (getDebugMode()) { console.log(data); }
  //check if "No response", which means PUT was successful
  if (data.result.toLowerCase() === ("No response").toLowerCase()) {
    console.log("Proposal update successful")
  }
  return data;
}

function updateAccountAddress(vAddressId, addressArray) {
  var operationName = "PUT gac_address /gac_addresses";
  var operationArguments = JSON.stringify({
    "gac_address_gac_addressid": vAddressId,
    "gac_address": addressArray
});
  var data = execCRMService3Args(operationName, operationArguments);

  if (getDebugMode()) { console.log(data); }
  //check if "No response", which means PUT was successful
  if (data.result.toLowerCase() === ("No response").toLowerCase()) {
    console.log("Proposal update successful")
  }
  return data;
}

function updateProposal() {
  var vFcprofileid = sessionStorage.getItem("fcprofileid");
  var operationName = "PUT egcs_fc_profile /egcs_fc_profiles";
  var operationArguments = JSON.stringify({
    "egcs_fc_profile_egcs_fc_profileid": vFcprofileid,
    "egcs_fc_profile": {
      "egcs_fc_profileid": vFcprofileid,
      "egcs_FundingOpportunity": { "egcs_fo_profileid": vEgcs_fo_profileid },
      "gac_signingauthority": strProposal.proposal.basicInfo.projectInfo.signingAuthority,
      "egcs_TP_ProfileId": { "egcs_tp_profileid": sessionStorage.getItem("tpprofileid") },
      "gac_CallYear": { "gac_timeperiodid": sessionStorage.getItem("gac_timeperiodid") },
      "egcs_name_en": strProposal.proposal.basicInfo.projectInfo.proposalName,
      "egcs_PrincipalContact": { "contactid": vContactId },
      "egcs_account": { "accountid": vAccountId },
      "egcs_objectivessummary": "egcs_objectivessummary- Dec17c",
      "gac_fdistrategyoverview": strProposal.proposal.basicInfo.fdiStratgey.overview,
      "gac_fdistrategybackground": strProposal.proposal.basicInfo.fdiStratgey.background,
      "gac_departmentalalignment": strProposal.proposal.basicInfo.fdiStratgey.alignment,
      "gac_thirdpartyrecipientdeclaration": getThirdParty(),
      "gac_financialpartnershipsdeclaration": getPartnerships(),
//      "gac_applicantprovince": "810510006",
      "gac_OrganizationSigningAuthority": { "contactid": vContactId },
      "gac_actionsforstrategicpartnerships": strProposal.proposal.strategicPartnerships.description,
      "gac_proposedenddate": strProposal.proposal.basicInfo.projectInfo.endDate,
      "gac_proposedstartdate": strProposal.proposal.basicInfo.projectInfo.startDate,
      "gac_consenttoofferservicesorinformofevents": strProposal.proposal.consentStatements.consentStatement1,
      "gac_consenttobecontactedbycommsdept": strProposal.proposal.consentStatements.consentStatement2,
      "gac_consenttoshareleadgenactivityinfo": strProposal.proposal.consentStatements.consentStatement3,
      "statuscode": 1,
      "gac_projectgovernance": strProposal.proposal.projectGovernance,

      "gac_contributetocommunity": strProposal.proposal.performanceMeasures.immediateOutcomes.contributeToCommunity,
      "gac_increasefdiincanada": strProposal.proposal.performanceMeasures.immediateOutcomes.increaseFDIInCanada,
      "gac_increasefdiawareness": strProposal.proposal.performanceMeasures.immediateOutcomes.increaseFDIAwareness,  
      "gac_numberoftargets": strProposal.proposal.performanceMeasures.intermediateOutcomes.numberOfTargets,
      "gac_numberofleads": strProposal.proposal.performanceMeasures.intermediateOutcomes.numberOfLeads,
      "gac_numberofprospects": strProposal.proposal.performanceMeasures.intermediateOutcomes.numberOfProspects,
      "gac_increaseawareness": strProposal.proposal.performanceMeasures.intermediateOutcomes.increaseAwareness,
      "gac_contributetoservices": strProposal.proposal.performanceMeasures.intermediateOutcomes.contributeToServices
    }
  });
  //      "statuscode": 1, this was commented so Bruce could 'update' the proposal, multiple times... without new GCKey, etc.
  //      "gac_ApplicantCountry": { "gac_countryid": vGacCountryid }, removed... 'Canada' was deleted from CRM

  var data = execCRMService(operationName, operationArguments);

  if (getDebugMode()) { console.log(data); }
  //check if "No response", which means PUT was successful
  if (data.result.toLowerCase() === ("No response").toLowerCase()) {
    console.log("Proposal update/submit successful")
  }
  sessionStorage.setItem("gac_fundingapplicationstatus", "810510001");
  updateGAC_saveddraftByID();
  sessionStorage.setItem("proposalName", strProposal.proposal.basicInfo.projectInfo.proposalName);
  return vFcprofileid; //data; Besco Oct06 - done with PJS
}

function createStubProposal() {
  var vLocalEgcs_fc_profileid = "";

  var vProposalName = "Draft / Ébauche -- " + sessionStorage.getItem("egcs_operatingname_en");
  // Creating Proposal Data
  var egcs_fc_profileArray = {
    "egcs_name_en": vProposalName,
    "egcs_PrincipalContact": { "contactid": sessionStorage.getItem("contactid") },
    "egcs_account": { "accountid": sessionStorage.getItem("accountid") },
    "egcs_TP_ProfileId": { "egcs_tp_profileid": sessionStorage.getItem("tpprofileid") },
    "egcs_FundingOpportunity": { "egcs_fo_profileid": sessionStorage.getItem("foprofileid") },
    "gac_CallYear": { "gac_timeperiodid": sessionStorage.getItem("gac_timeperiodid") }
  };
  console.log("createStubProposal->egcs_fc_profileArray:" + egcs_fc_profileArray);
  var proposalFormData = JSON.stringify({
    "egcs_fc_profile": egcs_fc_profileArray,
  });
  var operationName = "POST egcs_fc_profile /egcs_fc_profiles";
  var objData = execCRMService(operationName, proposalFormData);

  //POST Proposal Information
  // NOTE, the following line has a value for "gac-aem-appId" ---
  // this must be changed for either Dev05 vs Dev06, ceciprop vs ceciqcprop
  //        sessionStorage.setItem("gac-aem-appId", "ceciqcprop");
  /*   $.ajax({
      type: "POST",
      url: "/content/dam/formsanddocuments-fdm/fdm-ceci.executeDermisQuery.json?",
      data: {
        "operationName": "POST egcs_fc_profile /egcs_fc_profiles",
        "operationArguments": proposalFormData
      },
      success: function (data) { */
  var vGac_proposalreferencenumber = objData.gac_proposalreferencenumber;
  console.log("objData.gac_proposalreferencenumber: " + vGac_proposalreferencenumber);
  vLocalEgcs_fc_profileid = objData.egcs_fc_profileid;
  sessionStorage.setItem("proposalreferencenumber", vGac_proposalreferencenumber);
  sessionStorage.setItem("fcprofileid", vLocalEgcs_fc_profileid);
  sessionStorage.setItem("masterEntityId", vLocalEgcs_fc_profileid);
  sessionStorage.setItem("gac-aem-masterId", vLocalEgcs_fc_profileid);
  /*     },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log("Error-CreateProposal ");
      },
      cache: false,
      async: false
    }); */
  return vLocalEgcs_fc_profileid;
}

function getClaims(vFcProfileId) {
  var objData;
  var getClaimsArgs = JSON.stringify({
    "_gac_fdiproject_value": vFcProfileId
  });
  console.log("getClaimsArgs: " + getClaimsArgs);
  var operationName = "GET gac_fdiclaim /gac_fdiclaims";
  var data = execCRMService3Args(operationName, getClaimsArgs);
  if (Array.isArray(data)) { console.log("There is an array of data") }
  else {
    if (data.result.toLowerCase() === ("No response").toLowerCase()) {
      console.log("No Claims")
    }
  }
/*  $.ajax({
    type: "POST",
    url: "/content/dam/formsanddocuments-fdm/ceciclaim.executeDermisQuery.json?",
    data: {
      "operationName": "GET gac_fdiclaim /gac_fdiclaims",
      "operationArguments": getClaimsArgs
    },
    success: function (data, textStatus, jqXHR) {
      console.log(data);
      objData = data;
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      console.log("ERROR-GETaccountData  - Click");
    },
    cache: false,
    async: false
  });
  */
  /*  var objData = execCRMService(operationName, accountOperationArguments);
    console.log(objData);
    console.log("objData[0].egcs_operatingname_en" + objData[0].egcs_operatingname_en);
    console.log("objData[0].accountid" + objData[0].accountid);
  */
  return data;
}

function getFcProfileObjArray(vAccountId) {
  console.log("getFcProfileObjArray");
  //  var vObjData = {}; declared upon assignment below
  //  var vContactId = sessionStorage.getItem("contactid");
  var accountOperationArguments = JSON.stringify({
    "_egcs_account_value": vAccountId
  });
  console.log("accountOperationArguments " + accountOperationArguments);

  var operationName = "GET_egcs_fc_profile_via_AccountID";
  var vObjData = execCRMService3Args(operationName, accountOperationArguments);
  if (Array.isArray(vObjData)) { console.log("There is an array of data");
  for (var i = 0; i < vObjData.length; i++) {
    var obj = vObjData[i];
    console.log(obj.egcs_name);
    //    if (obj.statuscode == "810510003") { //"Draft"
/* Besco-Oct21 - This was required for Oct2021 CFP, when only one 'current' proposal existed, and NO previous Proposals existed.
     sessionStorage.setItem("fcprofileid", obj.egcs_fc_profileid);
    sessionStorage.setItem("fcstatuscode", obj.statuscode);
    sessionStorage.setItem("proposalName", obj.egcs_name);
    sessionStorage.setItem("gac_proposalreferencenumber", obj.gac_proposalreferencenumber);
    sessionStorage.setItem("foprofileid", obj.egcs_FundingOpportunity.egcs_fo_profileid);
    sessionStorage.setItem("cfp", obj.egcs_FundingOpportunity.egcs_name_en);
    sessionStorage.setItem("tpprofileid", obj._egcs_tp_profileid_value); */
  }
}
else  if (vObjData.result.toLowerCase() === ("No response").toLowerCase()) {
    console.log("No Proposal yet");
  }
  return vObjData;
}
/* 1                                                              Submitted
810510003                                           Draft
810510000                                           Returned
810510001                                           Accepted
 */

function getProposalButtonLabelEnable(statuscode) { // bbesco    
  switch (statuscode) {
    case 1: {
      console.log("getProposalButtonLabelEnable: 1 - Submitted");
      var buttonTitle =  vLang === "en" ? "Submitted" : "Soumis";
      var buttonEnabled = false;
      var statusText = vLang === "en" ? "Submitted" : "Soumis";
    }
      break;
      case 810510000: {
        console.log("getProposalButtonLabelEnable: 810510000 - Returned");
        var buttonTitle = vLang === "en" ? "Edit" : "Modifier";
        var buttonEnabled = true;
        var statusText = vLang === "en" ? "Returned" : "retourné";
      }
        break;
      case 810510001: {
      console.log("getProposalButtonLabelEnable: 810510001 - Accepted");
      var buttonTitle = vLang === "en" ? "Accepted" : "Accepté";
      var buttonEnabled = false;
      var statusText = vLang === "en" ? "Accepted" : "Accepté";
    }
      break;
    case 810510003: { //Besco, changed from "2", Apr26
      console.log("getProposalButtonLabelEnable: 3 - Draft");
      var buttonTitle = vLang === "en" ? "Edit" : "Modifier";
      var buttonEnabled = true;
      var statusText = vLang === "en" ? "Draft" : "Ébauche";
    }
      break;
    default: { console.log("getProposalButtonLabelEnable: GCCase Proposal 'statuscode': " + statuscode + ", not found"); }
  }
  return [buttonTitle, buttonEnabled, statusText];
}

function getContactObj() {
  console.log("getContactObjArray");
  //  var vObjData = {}; declared upon assignment below
  var vContactId = sessionStorage.getItem("contactid");
  var ContactoperationArguments = JSON.stringify({
    "contactid": vContactId
  });
  console.log("ContactoperationArguments " + ContactoperationArguments);

  var operationName = "GET contact /contacts";
  var vObjData = execCRMService3Args(operationName, ContactoperationArguments);

  sessionStorage.setItem("fullname", vObjData.fullname);
  sessionStorage.setItem("accountid", vObjData.egcs_PrimaryAccount.accountid);
  sessionStorage.setItem("egcs_operatingname_en", vObjData.egcs_PrimaryAccount.egcs_operatingname_en);
  var strContactObj = JSON.stringify(vObjData);
  console.log("strContactObj: " + strContactObj);
  sessionStorage.setItem("contactObj", strContactObj);

  /*
  if (Array.isArray(vObjData)) {
    console.log("There is an array of data")
    sessionStorage.setItem("fullname", vObjData[0].fullname);
    sessionStorage.setItem("accountid", vObjData[0].egcs_PrimaryAccount.accountid);
    sessionStorage.setItem("egcs_operatingname_en", vObjData[0].egcs_PrimaryAccount.egcs_operatingname_en);
    var strContactObj = JSON.stringify(vObjData);
    console.log("strContactObj: " + strContactObj);
    sessionStorage.setItem("contactObj", strContactObj);
  }
  else {
    if (vObjData.result.toLowerCase() === ("No response").toLowerCase()) {
      console.log("No Claims")
      return null;
    }
  }
*/
  return vObjData;
}

function getContactObjArray() {
  console.log("getContactObjArray");
  //  var vObjData = {}; declared upon assignment below
  var vContactId = sessionStorage.getItem("contactid");
  var ContactoperationArguments = JSON.stringify({
    "contactid": vContactId
  });
  console.log("ContactoperationArguments " + ContactoperationArguments);

  var operationName = "GET contact /contacts";
  var vObjData = execCRMService3Args(operationName, ContactoperationArguments);

  if (Array.isArray(vObjData)) {
    console.log("There is an array of data")
    sessionStorage.setItem("fullname", vObjData[0].fullname);
    sessionStorage.setItem("accountid", vObjData[0].egcs_PrimaryAccount.accountid);
    var strContactObj = JSON.stringify(vObjData);
    console.log("strContactObj: " + strContactObj);
    sessionStorage.setItem("contactObj", strContactObj);
  }
  else {
    if (vObjData.result.toLowerCase() === ("No response").toLowerCase()) {
      console.log("No Claims")
    }
  }
  return vObjData;
}

function getAccountObj(vAccountId) {
  console.log("getAccountObj");
  //  var vObjData = {}; declared upon assignment below
// passing in value, instead.  var vAccountId = sessionStorage.getItem("accountid");
  var ContactoperationArguments = JSON.stringify({
    "accountid": vAccountId
  });
  console.log("ContactoperationArguments " + ContactoperationArguments);

  var operationName = "GET account /accounts";
  var vObjData = execCRMService3Args(operationName, ContactoperationArguments);

  return vObjData;
}

function createAccountStub(egcs_operatingname_en) {
  var accountArray = {
    "egcs_operatingname_en": egcs_operatingname_en
  };
  if (getDebugMode()) console.log("accountArray:" + accountArray);
  var formData = JSON.stringify({
    "account": accountArray,
  });

  var operationName = "POST account /accounts";
  var objData = execCRMService(operationName, formData);
  sessionStorage.setItem("accountid", objData.accountid);

  return objData.accountid;
}

function createAccountExec(egcs_operatingname_en) {
  var accountArray = {
    "egcs_operatingname_en": egcs_operatingname_en
  };
  if (getDebugMode()) console.log("accountArray:" + accountArray);
  var formData = JSON.stringify({
    "account": accountArray,
  });

  var operationName = "POST account /accounts";
  var objData = execCRMService(operationName, formData);
  sessionStorage.setItem("accountid", objData.accountid);

  return objData.accountid;
}

function createContactOnlyExec(firstname, emailaddress) {
  var vContactId = "";
  console.log("createContactOnlyExec");
  var contactArray = {
    "firstname": firstname,
    "emailaddress1": emailaddress,
  };
  var formData = JSON.stringify({
    "contact": contactArray,
  });

  var operationName = "POST contact /contacts";
  var objData = execCRMService(operationName, formData);
  vContactId = objData.contactid;
  return vContactId;
}

function createContactExec(firstname, emailaddress, accountid) {
  var vContactId = "";
  //  console.log("test5");
  var contactArray = {
    "firstname": firstname,
    "emailaddress1": emailaddress,
    "egcs_PrimaryAccount": { "accountid": accountid },
  };
  //  console.log("contactArray:" + contactArray);
  var formData = JSON.stringify({
    "contact": contactArray,
  });

  var operationName = "POST contact /contacts";
  var objData = execCRMService(operationName, formData);
  vContactId = objData.contactid;
  sessionStorage.setItem("contactid", vContactId);
  return vContactId;
}

function createContact() {
  var vContactId = "";
  console.log("test4");
  var contactArray = {
    "firstname": "firstnameMay12a",
    "emailaddress1": "emailaddress1May12a"
  };
  console.log("contactArray:" + contactArray);
  var formData = JSON.stringify({
    "contact": contactArray,
  });
  var operationName = "POST contact /contacts";
  var objData = execCRMService(operationName, formData);
  console.log(objData); vContactId = objData.contactid;

  /*   $.ajax({
      type: "POST",
      url: "/content/dam/formsanddocuments-fdm/fdm-ceci.executeDermisQuery.json?",
      data: {
        "operationName": "POST contact /contacts",
        "operationArguments": formData
      },
      success: function (data) {
        console.log(data); vContactId = data.contactid; 
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log("Error-CreateProposal ");
      },
      cache: false,
      async: false
    }); */
  return vContactId;
}

/* the following will be set in the Landing Page, either Start or 
sessionStorage.setItem("gac-aem-masterId",sessionStorage.getItem("accountid"));
sessionStorage.setItem("gac-aem-appId",appId.value);
 */

/*function createPerformanceMeasures() { // see 'updateProposal' function. Besco-Oct31-2022

  var formData = JSON.stringify({
    "egcs_fc_profile_egcs_fc_profileid": vEgcs_fc_profileid,
    "egcs_fc_profile_gac_AEMSetExpectedOutcomes_contributeToCommunity": strProposal.proposal.performanceMeasures.immediateOutcomes.contributeToCommunity,
    "egcs_fc_profile_gac_AEMSetExpectedOutcomes_increaseFDIInCanada": strProposal.proposal.performanceMeasures.immediateOutcomes.increaseFDIInCanada,
    "egcs_fc_profile_gac_AEMSetExpectedOutcomes_increaseFDIAwareness": strProposal.proposal.performanceMeasures.immediateOutcomes.increaseFDIAwareness,

    "egcs_fc_profile_gac_AEMSetExpectedOutcomes_numberOfTargets": strProposal.proposal.performanceMeasures.intermediateOutcomes.numberOfTargets,
    "egcs_fc_profile_gac_AEMSetExpectedOutcomes_numberOfLeads": strProposal.proposal.performanceMeasures.intermediateOutcomes.numberOfLeads,
    "egcs_fc_profile_gac_AEMSetExpectedOutcomes_numberOfProspects": strProposal.proposal.performanceMeasures.intermediateOutcomes.numberOfProspects,
    "egcs_fc_profile_gac_AEMSetExpectedOutcomes_increaseAwareness": strProposal.proposal.performanceMeasures.intermediateOutcomes.increaseAwareness,
    "egcs_fc_profile_gac_AEMSetExpectedOutcomes_contributeToServices": strProposal.proposal.performanceMeasures.intermediateOutcomes.contributeToServices
  });

  var operationName = "egcs_fc_profiles/Microsoft.Dynamics.CRM.gac_AEMSetExpectedOutcomes()";
  var objData = execCRMService(operationName, formData);
}
*/
var strProposal = {
  "proposal": {
    "basicInfo": {
      "projectInfo": {
        "proposalName": "Proposal May22 d DEV",
        "startDate": "2021-01-01",
        "endDate": "2021-12-24",
        "primaryContact": "James Bond0007",
        "signingAuthority": "James Bond0007"
      },
      "fdiStratgey": {
        "overview": "Bruce-Overview-Lacinia vitae duis sollicitudin consectetur mollis montes vitae interdum id sapien commodBriuce-o. Convallis pellentesque leo ultricies. Eu phasellus, praesent vestibulum habitant. Proin, sociosqu ut nullam? Lorem velit quam praesent mauris nunc ante morbi semper vestibulum auctor lacus. Sociosqu felis pretium ornare facilisi lacinia torquent? Imperdiet metus eget aliquet. Platea nunc placerat vulputate in eleifend condimentum est curabitur dis velit. Tellus dui erat bibendum tristique lacinia in auctor rutrum est!.\\n\\nId mauris tempus ridiculus pretium velit pretium diam. Ultricies neque est pretium habitant arcu ut habitasse suspendisse. Donec semper euismod parturient congue sed? Ullamcorper dictum proin nisl massa dui orci curabitur mi ac phasellus vivamus molestie! Potenti nec aptent magna vehicula tincidunt accumsan non lacinia massa ante. In ut lacus penatibus mauris ad! Primis torquent, consectetur lectus accumsan. Non habitasse himenaeos.",
        "background": "Carm-Background-Platea ultrices gravida torquent, dolor donec tristique! Sed ultricies elit nulla. Sit nostra leo a velit integer magna. Amet ut tortor parturient nascetur odio aliquet mus magnis. Blandit litora conubia auctor cubilia facilisis interdum convallis. Aptent penatibus tempor nascetur sit auctor. Bibendum turpis egestas eget ullamcorper erat elementum turpis. Ipsum luctus tincidunt, blandit quisque. Tellus lacus cubilia sapien habitasse quisque etiam. Senectus placerat ultricies congue semper scelerisque pellentesque proin. Metus duis sodales laoreet aenean tempor.",
        "alignment": "Someone-Alignment-Ipsum; molestie netus tincidunt ullamcorper imperdiet sociosqu luctus mauris ullamcorper fringilla malesuada. Lacinia vitae duis sollicitudin consectetur mollis montes vitae interdum id sapien commodo. Convallis pellentesque leo ultricies. Eu phasellus, praesent vestibulum habitant. Proin, sociosqu ut nullam? Lorem velit quam praesent mauris nunc ante morbi semper vestibulum auctor lacus. Sociosqu felis pretium ornare facilisi lacinia torquent? Imperdiet metus eget aliquet. Platea nunc placerat vulputate in eleifend condimentum est curabitur dis velit. Tellus dui erat bibendum tristique lacinia in auctor rutrum est!.\\n\\nId mauris tempus ridiculus pretium velit pretium diam. Ultricies neque est pretium habitant arcu ut habitasse suspendisse. Donec semper euismod parturient congue sed? Ullamcorper dictum proin nisl massa dui orci curabitur mi ac phasellus vivamus molestie! Potenti nec aptent magna vehicula tincidunt accumsan non lacinia massa ante. In ut lacus penatibus mauris ad! Primis torquent, consectetur lectus accumsan. Non habitasse himenaeos."
      }
    },
    "projectComposition": {
      "training": {
        "haveComponentYN": "1",
        "description": "Aptent penatibus tempor nascetur sit auctor. Bibendum turpis egestas eget ullamcorper erat elementum turpis. Ipsum luctus tincidunt, blandit quisque. Tellus lacus cubilia sapien habitasse quisque etiam. Senectus placerat ultricies congue semper scelerisque pellentesque proin. Metus duis sodales laoreet aenean tempor.",
        "numberOfTrainee": "1",
        "activityTypes": {
          "item": {
            "description": "FDI Training - Course",
            "id": "5645d14e-9201-eb11-b82b-005056bf50dd"
          }
        },
        "timeframeFrom": "2021-06-01",
        "timeframeTo": "2021-06-05",
        "previouslyFunded": "1",
        "gac_name": "FDI Training",
        "gac_fdicomponentcategoryid": "0d05855c-9101-eb11-b82b-005056bf50dd"
      },
      "strategy": {
        "haveComponentYN": "0",
        "description": "",
        "activityTypes": {
          "item": {
            "id": "",
            "description": ""
          }
        },
        "sectors": {
          "item": {
            "id": "",
            "description": ""
          }
        },
        "markets": {
          "item": {
            "id": "",
            "description": ""
          }
        },
        "gac_name": "FDI Strategic Planning and Analysis",
        "gac_fdicomponentcategoryid": "b5a3174d-9101-eb11-b82b-005056bf50dd",
        "timeframeFrom": "",
        "timeframeTo": "",
        "previouslyFunded": "",
        "havePastExperience": "",
        "experienceDescription": ""
      },
      "toolsAndMaterials": {
        "haveComponentYN": "0",
        "description": "",
        "numberOfPartnersInvestors": "",
        "activityTypes": {
          "item": {
            "id": "",
            "description": ""
          }
        },
        "sectors": {
          "item": {
            "id": "",
            "description": ""
          }
        },
        "markets": {
          "item": {
            "id": "",
            "description": ""
          }
        },
        "gac_name": "FDI Tool and Material Development",
        "gac_fdicomponentcategoryid": "49cec953-9101-eb11-b82b-005056bf50dd",
        "timeframeFrom": "",
        "timeframeTo": "",
        "previouslyFunded": "",
        "havePastExperience": "",
        "experienceDescription": ""
      },
      "leadGeneration": {
        "haveComponentYN": "1",
        "description": "Donec semper euismod parturient congue sed? Ullamcorper dictum proin nisl massa dui orci curabitur mi ac phasellus vivamus molestie! Potenti nec aptent magna vehicula tincidunt accumsan non lacinia massa ante. In ut lacus penatibus mauris ad! Primis torquent, consectetur lectus accumsan. Non habitasse himenaeos.",
        "numberOfAttendees": "1",
        "activityTypes": {
          "item": {
            "description": "List of Prospective Investors / Targeted Company Research",
            "id": "58a9a391-9101-eb11-b82b-005056bf50dd"
          }
        },
        "sectors": {
          "item": {
            "description": "Food Processing",
            "id": "827fd21e-9101-eb11-b82b-005056bf50dd"
          }
        },
        "markets": {
          "item": {
            "description": "Netherlands",
            "id": "97c734ae-9001-eb11-b82b-005056bf50dd"
          }
        },
        "timeframeFrom": "2021-06-01",
        "timeframeTo": "2021-06-05",
        "previouslyFunded": "0",
        "havePastExperience": "0",
        "experienceDescription": "Aptent penatibus tempor nascetur sit auctor. Bibendum turpis egestas eget ullamcorper erat elementum turpis. Ipsum luctus tincidunt, blandit quisque. Tellus lacus cubilia sapien habitasse quisque etiam. Senectus placerat ultricies congue semper scelerisque pellentesque proin. Metus duis sodales laoreet aenean tempor.",
        "travelAbroad": "0",
        "missions": {
          "item": {
            "id": "",
            "description": ""
          }
        },
        "gac_name": "FDI Lead Generation and Meetings with Potential Investors",
        "gac_fdicomponentcategoryid": "eba10b46-9101-eb11-b82b-005056bf50dd"
      }
    },
    "expectedCost": {
      "otherExpenses": {
        "expense": {
          "expenseType": "Accommodation",
          "purpose": "FDI Training",
          "totalEligibleExpense": "100",
          "shortDesc": "lkjlkjlkjlkjlkj",
          "costPerUnit": "100",
          "numberOfUnits": "1",
          "unitOfMeasurement": "Hour(s)",
          "timeframeFrom": "2021-05-03",
          "timeframeTo": "2021-05-27",
          "otherFederalContribution": "null",
          "fdicomponentcategoryid": "0d05855c-9101-eb11-b82b-005056bf50dd ",
          "expenseTypeID": "ded9635a-9301-eb11-b82b-005056bf50dd ",
          "unitOfMeasurementID": "4cd25aa4-db07-eb11-b82b-005056bf50dd ",
          "expenseName": "Expense One Besco May8",
          "totalEstimatedExpense": "100"
        }
      },
      "travelExpenses": {
        "expense": {
          "expenseName": "",
          "shortDesc": "",
          "purpose": "",
          "expenseType": "",
          "costPerUnit": "",
          "numberOfUnits": "",
          "unitOfMeasurement": "",
          "timeframeFrom": "",
          "timeframeTo": "",
          "fdicomponentcategoryid": "",
          "expenseTypeID": "",
          "unitOfMeasurementID": ""
        }
      },
      "expenseAllocation": {
        "training": {
          "totalEstimatedExpense": "100",
          "contributionOtherFedGovt": "0",
          "totalEligibleExpense": "100",
          "requestedProgramFunding": "50"
        },
        "strategy": {
          "totalEstimatedExpense": "0",
          "contributionOtherFedGovt": "0",
          "totalEligibleExpense": "0",
          "requestedProgramFunding": "0",
          "allocationBySector": {
            "allocation": {
              "sector": "",
              "percentage": ""
            }
          },
          "allocationByMarket": {
            "allocation": {
              "market": "",
              "percentage": ""
            }
          }
        },
        "toolsAndMaterials": {
          "totalEstimatedExpense": "0",
          "contributionOtherFedGovt": "0",
          "totalEligibleExpense": "0",
          "requestedProgramFunding": "0",
          "allocationBySector": {
            "allocation": {
              "sector": "",
              "percentage": ""
            }
          },
          "allocationByMarket": {
            "allocation": {
              "market": "",
              "percentage": ""
            }
          }
        },
        "leadGeneration": {
          "totalEstimatedExpense": "0",
          "contributionOtherFedGovt": "0",
          "totalEligibleExpense": "0",
          "requestedProgramFunding": "0",
          "allocationBySector": {
            "allocation": {
              "sector": "Food Processing",
              "percentage": "100"
            }
          },
          "allocationByMarket": {
            "allocation": {
              "market": "Netherlands",
              "percentage": "100"
            }
          }
        }
      }
    },
    "performanceMeasures": {
      "immediateOutcomes": {
        "contributeToCommunity": "May 22 d How will this project contribute May22 b to improving your capacity to attract, retain and expand FDI for the benefit of your community/region? ",
        "increaseFDIInCanada": "May 22 d How will this project increase potential foreign investors' awareness of FDI opportunities in Canada? (100 characters minimum and 2,000 characters maximum) (Mandatory)\\n",
        "increaseFDIAwareness": "May 22 d How will this project enhance your community/region's knowledge of FDI opportunities? (100 characters minimum and 2,000 characters maximum) (Mandatory)\\n"
      },
      "intermediateOutcomes": {
        "numberOfTargets": "7",
        "numberOfLeads": "8",
        "numberOfProspects": "9",
        "increaseAwareness": "May 22 d Explain how this project will increase awareness of opportunities for retention and expansion of foreign companies in your community/region.  If not applicable, please explain why. (100 characters minimum and 2,000 characters maximum) (Mandatory)\\n",
        "contributeToServices": "May 22 d Explain how this project will contribute to improving services (e.g. aftercare, follow-uo, etc.) to foreign investors in your community/region? If not applicable, please explain why. (100 characters minimum and 2,000 characters maximum) (Mandatory)\\n"
      }
    },
    "strategicPartnerships": {
      "description": "BESCO- Donec semper euismod parturient congue sed? Ullamcorper dictum proin nisl massa dui orci curabitur mi ac phasellus vivamus molestie! Potenti nec aptent magna vehicula tincidunt accumsan non lacinia massa ante. In ut lacus penatibus mauris ad! Primis torquent, consectetur lectus accumsan. Non habitasse himenaeos.",
      "financialPartnerships": {
        "partnership": {
          "partner": "",
          "contact": "",
          "contributionToInitiative": "",
          "confirmed": ""
        }
      },
      "fundingToThirdPartyRecipients": "yes",
      "thirdPartyRecipients": {
        "recipient": {
          "thirdPartyRecipient": "2-Third Party Recipient (Mandatory)",
          "natureOfRelantionship": "2-Nature of Relationship (Mandatory)",
          "contactPerson": "2-Contact Person (Mandatory)",
          "contactAddress": "2-Contact Address (Mandatory)",
          "city": "2-City (Mandatory)",
          "province": "BC",
          "postalCode": "j2j2j2",
          "emailAddress": "ww@ww.ww"
        }
      },
      "numberOfTargets": "3",
      "numberOfLeads": "6",
      "numberOfProspects": "7",
      "increaseAwareness": "Explain how this project will increase awareness of opportunities for retention and expansion of foreign companies in your community/region.  If not applicable, please explain why. (100 characters minimum and 2,000 characters maximum). (Mandatory)",
      "contributeToServices": "Explain how this project will contribute to improving services (e.g. aftercare, follow-uo, etc.) to foreign investors in your community/region? If not applicable, please explain why. (100 characters minimum and 2,000 characters maximum). (Mandatory)"
    },
    "strategicPartnershipss": {
      "thirdPartyRecipients": {
        "recipient": [
          "",
          ""
        ]
      }
    },
    "projectGovernance": "May24-Identify how the project will be governed (e.g. by a single agency, in partnership, or by committee). (100 characters minimum and 2,000 characters maximum) (Mandatory)\\n",
    "workPlan": {
      "plan": [
        {
          "componentTitle": "FDI Training",
          "timeframeFrom": "2021-06-01",
          "timeframeTo": "2021-06-05"
        },
        {
          "componentTitle": "FDI Lead Generation and Meetings with Potential Investors",
          "timeframeFrom": "2021-06-01",
          "timeframeTo": "2021-06-05"
        }
      ]
    },
    "globalids": {
      "accountid": "cf938aa4-d81d-eb11-96a6-00505681cf84",
      "contactid": "ebe88e6b-8823-eb11-96a7-005056815722",
      "gac_saveddraftid": "d4976a67-eaa1-eb11-96a8-005056816b76",
      "egcs_tp_profileid": "",
      "egcs_fo_profileid": "68995d00-b104-eb11-96a4-00505681cf84"
    }
  },
  "account": {
    "gac_iscanadianorganization": "",
    "egcs_yesnoforprofit": "",
    "egcs_crabusinessnumber": "",
    "gac_organizationshortname": "",
    "gac_legalname_en": "",
    "gac_legalname_fr": "",
    "gac_operatingnamesameaslegalname": "",
    "egcs_operatingname_en": "",
    "egcs_operatingname_fr": "",
    "description": "",
    "egcs_mandate": "",
    "egcs_telephone1": "",
    "egcs_telephone1extension": "",
    "egcs_generallanguagepreference": "",
    "gac_aemid": "",
    "address1_line1": "",
    "address1_line2": "",
    "address1_city": "",
    "address1_country": "",
    "address1_stateorprovince": "",
    "address1_postalcode": "",
    "gac_mailingaddresssameascivicaddress": "",
    "address2_line1": "",
    "address2_line2": "",
    "address2_city": "",
    "address2_country": "",
    "address2_stateorprovince": "",
    "address2_postalcode": "",
    "gac_proposedstartdate": "",
    "gac_proposedenddate": "",
    "gac_applicantcountry": "",
    "gac_applicantprovince": "",
    "gac_fdistrategybackground": "",
    "gac_departmentalalignment": ""
  },
  "contact": {
    "salutation": "",
    "firstname": "",
    "lastname": "",
    "egcs_jobtitle_en": "",
    "emailaddress1": "",
    "telephone1": "",
    "egcs_telephone1extension": "",
    "egcs_generallanguagepreference": "",
    "gac_organizationsigningauthority": "",
    "gac_organizationsigningauthorityname": ""
  }
}
//test jan28a
function execCRMServiceAjax_ceciclaim(operName, operArguments) {
  console.log("execCRMServiceAjax_ceciclaim is NOT commented out - not used")
  var objData;
  $.ajax({
    type: "POST",
    url: "/content/dam/formsanddocuments-fdm/ceciclaim.executeDermisQuery.json?",
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

//test jan24a - how will this handle errors from FDM, ie, if AEM cannot communicate with Dynamics
function execCRMServiceAjax_testError(operName, operArguments) {
  console.log("execCRMServiceAjax_ceciclaim is NOT commented out - not used")
  var objData;
  $.ajax({
    type: "POST",
    url: "/content/dam/formsanddocuments-fdm/ceci_fdm2.executeDermisQuery.json?",
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

function getEgcsNameFromSession() {
  var vFoprofile = sessionStorage.getItem("foprofile");
  jObj = JSON.parse(vFoprofile);
  vEgcsName = jObj.egcs_name;
  return vEgcsName;
}

function get_tp_profile() {
  console.log("get_tp_profile");
  var operationName = "GET egcs_tp_profile /egcs_tp_profiles";
  var operationArguments = JSON.stringify({});
  var objData = execCRMService(operationName, operationArguments);

  for (var i = 0; i < objData.length; i++) {
    var obj = objData[i];
    console.log(obj.egcs_name_en);
    if (obj.egcs_name_en == "CanExport Community Investments") {
      console.log("get_tp_profile-----egcs_name_en: " + obj.egcs_name_en);
      console.log("get_tp_profile-----egcs_tp_profileid: " + obj.egcs_tp_profileid);
      console.log(obj);
      var strTpProfile = JSON.stringify(obj);
      console.log("strTpProfile: " + strTpProfile);
      sessionStorage.setItem("tpprofileid", obj.egcs_tp_profileid);
      sessionStorage.setItem("tpprofilename", obj.egcs_name_en);
    }
  }
}
//GET_egcs_tp_profile_via_name
function GET_egcs_tp_profile_via_name() {
  console.log("GET_egcs_tp_profile_via_name");
  var operationName = "GET_egcs_tp_profile_via_name";
  var operationArguments = JSON.stringify({
    "egcs_name": "CanExport Community Investments"});
  var objData = execCRMService3Args(operationName, operationArguments);

  console.log("get_tp_profile-----egcs_name_en: " + obj.egcs_name_en);
  console.log("get_tp_profile-----egcs_tp_profileid: " + obj.egcs_tp_profileid);
  console.log(obj);
  var strTpProfile = JSON.stringify(obj);
  console.log("strTpProfile: " + strTpProfile);
  sessionStorage.setItem("tpprofileid", obj.egcs_tp_profileid);
  sessionStorage.setItem("tpprofilename", obj.egcs_name_en);
}

function checkCFP4StartClose() {
  console.log("checkCFP4StartClose-Oct18--Get calls that are open for intake (statuscode=1");
  callStatus = "";
  // Get calls that are open for intake (statuscode=1)
  var operationName = "GET egcs_fo_profile_via_StatusCode";
  //  var operationArguments = JSON.stringify({});
  var operationArguments = JSON.stringify({
    "statuscode": 1
  });

  var objData = execCRMService3Args(operationName, operationArguments);
  var obj = "";
  if (Array.isArray(objData)) {
    for (var i = 0; i < objData.length; i++) {
      var obj = objData[i];
      console.log(obj.statuscode);
      if (obj.statuscode == 1) {
        console.log("checkCFP4StartClose-----(fo)egcs_name_en: " + obj.egcs_name_en);
        console.log("checkCFP4StartClose-----egcs_fo_profileid: " + obj.egcs_fo_profileid);
        console.log(obj);
        sessionStorage.setItem("tpprofileid", obj._egcs_tp_profileid_value);
        sessionStorage.setItem("foprofileid", obj.egcs_fo_profileid);
        sessionStorage.setItem("cfp", obj.egcs_name);
        sessionStorage.setItem("gacperiod", obj.gac_CallYear.gac_period);
        sessionStorage.setItem("gac_timeperiodid", obj.gac_CallYear.gac_timeperiodid);
        console.log("checkCFP4StartClose-----gac_callwindowstartdate: " + obj.gac_callwindowstartdate);
        const currentDate = new Date();
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);

        if (today.toISOString() < obj.gac_callwindowstartdate) {
          console.log("  Today is less than start");
          callStatus = "cBeforeCallStart";
        }
        else if (today.toISOString() > obj.gac_callwindowclosedate) {
          console.log(" is greater than close");
          callStatus = "cAfterCallClose";
        }
        else {
          console.log("between start and close");
          callStatus = "cDuringCall";
        }
      }
    }
  }
  else {
    console.log("bThere are no ACTIVE CFPs");
    callStatus = "cBeforeCallStart";

  }
  return callStatus;
}

function testjs() { // bbesco 
  console.log("testjs");
}

function getPartnerships() {
  var objProposal_partnership = strProposal.proposal.strategicPartnerships.financialPartnerships.partnership;
  var partnershipLength = objProposal_partnership.length;
  var strPartnerships = "";
  if (Array.isArray(objProposal_partnership)) { //bescob-Sep24-weird AEM-FDM-Json behaviour: if returned
    // json length is >1, it is an arrary
    // json only one item, not an array
    console.log("objProposal_partnership is an array");
    for (var i = 0; i < objProposal_partnership.length; i++) {
      var obj = objProposal_partnership[i];
      var strPartnership = obj.partner + ";" + obj.contact + ";" + obj.contributionToInitiative + ";" + obj.confirmed + "\n"
      console.log("Partner: " + obj.partner + "; Contact: " + obj.contact + "; Contribution to Initiative: " + obj.contributionToInitiative + "; Confirmed: " + obj.confirmed + "\n");
      console.log("strPartnership-" + strPartnership);
      strPartnerships = strPartnerships + strPartnership;
      console.log("strPartnerships-" + strPartnerships);
    }
  }
  else {
    console.log("objProposal_partnership is NOT an array");
    var obj = objProposal_partnership;
    var strPartnership = obj.partner + ";" + obj.contact + ";" + obj.contributionToInitiative + ";" + obj.confirmed + "\n"
    strPartnerships = strPartnership;
  }
  return strPartnerships;
}

function processSetEamId(){
  console.log("getContactoperationArguments {contactid : b593f84d-a633-ed11-96c3-005056816b76 }\
  getAccountOperationArguments {accounttid : c8969139-59d7-eb11-96ac-00505681b05b}\
  " + '\n' + "ba documentation dynamics adobe gccase edrms gckey form data model\
  ba dayo elugbaju\
  business trisha skoryk charly ondako jamie forester\
  documentation brad poulis\
  dynamics ms certified solution architect pat j smith (spicyp)\
  adobe aem architect gckey dynamics opentext integration bruce besco\
  aem devs carm scaffidi jose mendoza\
  dynamics developers asim khan asim hussain\
  project mgmt rustum tharani (rusty) ryan burke\
  dynamics environment david tsen\
  aem environment pat vallieres\
  testers venkata vemuri nagesh koganti\
  mgmt pat roy dimirtios samis");
}

function getThirdParty() {
  if (strProposal.proposal.strategicPartnerships.fundingToThirdPartyRecipients == "no") {
    //radio button indicating there are 1+ 'optional' 3rdParty partners in the form data
    return "none";
  }
  else {
    var objProposal_thirdParty = strProposal.proposal.strategicPartnerships.thirdPartyRecipients.recipient;
    var strThirdParties = ""
    if (Array.isArray(objProposal_thirdParty)) {
      console.log("objProposal_thirdParty is an array");
      for (var i = 0; i < objProposal_thirdParty.length; i++) {
        var obj = objProposal_thirdParty[i];
        var strThirdParty = obj.thirdPartyRecipient + ", " + obj.natureOfRelantionship + ", " + obj.contactPerson + ", " + obj.contactAddress + ", " +
          obj.city + ", " + obj.province + ", " + obj.postalCode + ", " + obj.emailAddress + "\n";
        strThirdParties = strThirdParties + strThirdParty;
      }
      console.log(strThirdParties);
    }
    else {
      console.log("objProposal_thirdParty is NOT an array");
      var obj = objProposal_thirdParty;
      var strThirdParty = obj.thirdPartyRecipient + ", " + obj.natureOfRelantionship + ", " + obj.contactPerson + ", " + obj.contactAddress + ", " +
        obj.city + ", " + obj.province + ", " + obj.postalCode + ", " + obj.emailAddress + "\n";
      strThirdParties = strThirdParty;
    }
    return strThirdParties;
  }
}

function getContactAcctFromEamId(vEamid) {
  //  var vEamid = sessionStorage.getItem("eamid");
  var ContactoperationArguments = JSON.stringify({
    "gac_GetContactByEAMID_EAMID": vEamid
  }); console.log("ContactoperationArguments " + ContactoperationArguments);
  var operationName = "gac_GetContactByEAMID()";
  //  var objData = execCRMServiceAjax_testError(operationName, ContactoperationArguments);
  var objData = execCRMService3Args(operationName, ContactoperationArguments);

  if (objData === null) {
    sessionStorage.setItem("contactid", null);
    console.log("--> getContactAcctFromEamId: ContactId is null");
  } else {
    if ('errorMessage' in objData) {
      console.log("getContactAcctFromEamId: 'errorMessage' in objData: " + objData);
      objData = "errorMessage";
    }
    else {
      sessionStorage.setItem("contactid", objData.contactid);
      objData = getContactObj(objData.contactid);
    }
  }
  return objData;
}

function getContactIdFromEamId() {
  var vEamid = sessionStorage.getItem("eamid");
  var ContactoperationArguments = JSON.stringify({
    "gac_GetContactByEAMID_EAMID": vEamid
  }); console.log("ContactoperationArguments " + ContactoperationArguments);
  var operationName = "gac_GetContactByEAMID()";
  var objData = execCRMService3Args(operationName, ContactoperationArguments);
  if (objData === null) {
    sessionStorage.setItem("contactid", objData);
    console.log("--> getContactIdFromEamId: Contact is null");
  } else {
    sessionStorage.setItem("contactid", objData.contactid);
  }

  /*   $.ajax({
      type: "POST",
      url: "/content/dam/formsanddocuments-fdm/fdm-ceci.executeDermisQuery.json?",
      data: {
        "operationName": "gac_GetContactByEAMID()",
        "operationArguments": ContactoperationArguments
      },
      success: function (data, textStatus, jqXHR) {
        if (data === 'null') {
          console.log("--> Contact is null");
  
        } else {
          vContactId = data.contactid;
          sessionStorage.setItem("contactid", data.contactid);
          var ContactoperationArguments = JSON.stringify({
            "contactid(getContactIdFromEamId)": vContactId
          })
        }
      }
    }); */
}

function getContactFromEamId() {
  console.log("fdmfuncs.js-commented out for Sacurity VA - bb - Aug4");
  /*   var vEamid = sessionStorage.getItem("eamid");
    var ContactoperationArguments = JSON.stringify({
      "gac_GetContactByEAMID_EAMID": vEamid
    }); console.log("ContactoperationArguments " + ContactoperationArguments);
  
    $.ajax({
      type: "POST",
      url: "/content/dam/formsanddocuments-fdm/fdm-ceci.executeDermisQuery.json?",
      data: {
        "operationName": "gac_GetContactByEAMID()",
        "operationArguments": ContactoperationArguments
      },
      success: function (data, textStatus, jqXHR) {
        if (data === 'null') {
          console.log("--> Contact is null");
  
        } else {
          vContactId = data.contactid;
          sessionStorage.setItem("contactid", data.contactid);
          var ContactoperationArguments = JSON.stringify({
            "contactid": vContactId
          });
          console.log("ContactoperationArguments " + ContactoperationArguments);
          $.ajax({
            type: "POST",
            url: "/content/dam/formsanddocuments-fdm/fdm-ceci.executeDermisQuery.json?",
            data: {
              "operationName": "GET contact /contacts",
              "operationArguments": ContactoperationArguments
            },
            success: function (data, textStatus, jqXHR) {
              console.log(data);
              var strContactInfo = JSON.stringify(data);
              sessionStorage.setItem("contactinfo", strContactInfo);
              var vFullName = data[0].fullname;
              sessionStorage.setItem("accountid", data[0].egcs_PrimaryAccount.accountid);
              var accountOperationArguments = JSON.stringify({
                "accountid": sessionStorage.getItem("accountid")
              });
              console.log("accountOperationArguments: " + accountOperationArguments);
              $.ajax({
                type: "POST",
                url: "/content/dam/formsanddocuments-fdm/fdm-ceci.executeDermisQuery.json?",
                data: {
                  "operationName": "GET account /accounts",
                  "operationArguments": accountOperationArguments
                },
                success: function (data, textStatus, jqXHR) {
                  console.log("AccountInfo: " + data);
                  console.log("data[0].accountid" + data[0].accountid);
                  var strAccountInfo = JSON.stringify(data);
                  sessionStorage.setItem("accountinfo", strAccountInfo);
                  var vOperatingNameEn = data[0].egcs_operatingname_en;
                  //                Start.enabled = true;
                  //                section1.visible = true;
                  //                pnlGetContactInfo.visible = false;
                  var vDraftId = getDraftId(sessionStorage.getItem("accountid"), sessionStorage.getItem("foprofileid"));
                  if ((vDraftId === null || vDraftId === "")) { console.log("Start button label"); }
                  else {
                    console.log("Edit button label");
                    sessionStorage.setItem("gac_saveddraftid", vDraftId);
                  }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                  console.log("ERROR-GETaccountData  - Click");
                },
                cache: false,
                async: false
              });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
              console.log("setContact -error");
            },
            cache: false,
            async: false
          });
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log("setContact -error");
      },
      cache: false,
      async: false
    }); */
}

function get_fo_profile_via_StatusCode() {
  var operationName = "GET egcs_fo_profile_via_StatusCode";
  var operationArguments = JSON.stringify({"statuscode": 1});
  var objData = execCRMService3Args(operationName, operationArguments);

  console.log("getSetFoProfileId-----egcs_name_en: " + objData.egcs_name_en);
  console.log("getSetFoProfileId-----egcs_fo_profileid: " + objData.egcs_fo_profileid);
  console.log(objData);
  var strFoProfile = JSON.stringify(objData);
  console.log("strFoProfile: " + strFoProfile);
  sessionStorage.setItem("foprofileid", objData.egcs_fo_profileid);
  sessionStorage.setItem("foprofile", strFoProfile);
  sessionStorage.setItem("cfp", objData.egcs_name_en);
  sessionStorage.setItem("foprofilename", objData.egcs_name_en);
  sessionStorage.setItem("tpprofileid", objData._egcs_tp_profileid_value);
  sessionStorage.setItem("gacperiod", obj.gac_CallYear.gac_period);
  sessionStorage.setItem("gacstartdate", objData.gac_callwindowstartdate   );
  sessionStorage.setItem("gacenddate", objData.gac_callwindowclosedate);
  vGacTimeperiodid = objData.gac_CallYear.gac_timeperiodid;
  sessionStorage.setItem("gac_timeperiodid", vGacTimeperiodid);
}
sessionStorage.getItem("gac_timeperiodid") 

function getAll_egcs_fo_profiles() {
  var operationName = "GET egcs_fo_profile /egcs_fo_profiles";
  var operationArguments = JSON.stringify({});
  var objData = execCRMService3Args(operationName, operationArguments);

  for (var i = 0; i < objData.length; i++) {
    var obj = objData[i];
    console.log(obj.statuscode);
    if (obj.statuscode == 1) {
      console.log("getSetFoProfileId-----egcs_name_en: " + obj.egcs_name_en);
      console.log("getSetFoProfileId-----egcs_fo_profileid: " + obj.egcs_fo_profileid);
      console.log(obj);
      var strFoProfile = JSON.stringify(obj);
      console.log("strFoProfile: " + strFoProfile);
      sessionStorage.setItem("foprofileid", obj.egcs_fo_profileid);
      sessionStorage.setItem("foprofile", strFoProfile);
      sessionStorage.setItem("foprofilename", obj.egcs_name_en);
      sessionStorage.setItem("gacperiod", obj.gac_CallYear.gac_period);
      sessionStorage.setItem("gacstartdate", obj.gac_callwindowstartdate);
      sessionStorage.setItem("gacenddate", obj.gac_callwindowclosedate);
//      sessionStorage.setItem("gacstartdate", obj.gac_CallYear.gac_startdate);
//      sessionStorage.setItem("gacenddate", obj.gac_CallYear.gac_enddate);
      vGacTimeperiodid = obj.gac_CallYear.gac_timeperiodid;
      sessionStorage.setItem("gac_timeperiodid", vGacTimeperiodid);
    }
  }
}

function getAccountIdFromContactId() {
  var vFoundAccount = false;
  var vContactId = sessionStorage.getItem("contactid");

  if (vContactId === 'null') { console.log("func getAccountIdFromcontactId --> contactId is null"); }
  else {
    var ContactoperationArguments = JSON.stringify({
      "contactid": vContactId
    });
    console.log("ContactoperationArguments " + ContactoperationArguments);
    var operationName = "GET contact /contacts";
    var data = execCRMService(operationName, ContactoperationArguments);

    if (data === null) { console.log("getAccountIdFromContactId-->no contact info found"); }
    else {
      console.log(data);
      console.log("data[0].fullname:" + data[0].fullname);
      sessionStorage.setItem("fullname", data[0].fullname);
      console.log("data[0].egcs_PrimaryAccount.accountid:" + data[0].egcs_PrimaryAccount.accountid);
      vFoundAccount = true;
      sessionStorage.setItem("accountid", data[0].egcs_PrimaryAccount.accountid);
    }
    var accountOperationArguments = JSON.stringify({
      "accountid": data[0].egcs_PrimaryAccount.accountid
    });
    console.log("accountOperationArguments: " + accountOperationArguments);
    var operationName = "GET account /accounts";
    var data = execCRMService(operationName, accountOperationArguments);

    if (data === null) { console.log("getAccountIdFromContactId-->no contact info found"); }
    else {
      console.log(data); console.log("data[0].egcs_operatingname_en" + data[0].egcs_operatingname_en);
      console.log("data[0].accountid" + data[0].accountid);
      sessionStorage.setItem("egcs_operatingname_en", data[0].egcs_operatingname_en);
      vFoundAccount = true;
    }
  }
  return vFoundAccount;
}

{/* function getAccountIdFromContactIdAjax() {
  var vFoundAccount = false;
  var vContactId = sessionStorage.getItem("contactid");
  if (vContactId === 'null') {     console.log("func getAccountIdFromcontactId --> contactId is null");}
  else {

    var ContactoperationArguments = JSON.stringify({
      "contactid": vContactId
    });
    console.log("ContactoperationArguments " + ContactoperationArguments);
    $.ajax({
      type: "POST",
      url: "/content/dam/formsanddocuments-fdm/fdm-ceci.executeDermisQuery.json?",
      data: {
        "operationName": "GET contact /contacts",
        "operationArguments": ContactoperationArguments
      },
      success: function (data, textStatus, jqXHR) {
        console.log(data);
        console.log("data[0].fullname:" + data[0].fullname);
        sessionStorage.setItem("fullname", data[0].fullname);
        console.log("data[0].egcs_PrimaryAccount.accountid:" + data[0].egcs_PrimaryAccount.accountid);
        vFoundAccount = true;
        sessionStorage.setItem("accountid", data[0].egcs_PrimaryAccount.accountid);

        {
          var accountOperationArguments = JSON.stringify({
            "accountid": data[0].egcs_PrimaryAccount.accountid
          });
          console.log("accountOperationArguments: " + accountOperationArguments);
          $.ajax({
            type: "POST",
            url: "/content/dam/formsanddocuments-fdm/fdm-ceci.executeDermisQuery.json?",
            data: {
              "operationName": "GET account /accounts",
              "operationArguments": accountOperationArguments
            },
            success: function(data, textStatus, jqXHR) {
              console.log(data);  console.log("data[0].egcs_operatingname_en" + data[0].egcs_operatingname_en);
              console.log("data[0].accountid" + data[0].accountid);
              sessionStorage.setItem("egcs_operatingname_en", data[0].egcs_operatingname_en);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {console.log("ERROR-GETaccountData  - Click"); },
            cache: false,
            async: false
          });
        }

      },
      error: function (XMLHttpRequest, textStatus, errorThrown) { console.log("setContact -error"); },
      cache: false,
      async: false
    });
  }
  return vFoundAccount;
} */}

{/*   function getContactFromEAM(){ //Besco - verify this is not needed
	  var vSseamID =  sessionStorage.getItem("sseamid");
	  var ContactoperationArguments = JSON.stringify({  "gac_GetContactByEAMID_EAMID": vSseamID
	  });     console.log("****** use 'getContactIdFromEamId' instead---ContactoperationArguments " + ContactoperationArguments);

	  $.ajax({
	    type: "POST",
	    url: "/content/dam/formsanddocuments-fdm/fdm-ceci.executeDermisQuery.json?",
	    data: {
	      "operationName": "gac_GetContactByEAMID()",
	      "operationArguments": ContactoperationArguments
	    },
	    success: function(data, textStatus, jqXHR) {    console.log(data);    console.log("data.contactid:" + data.contactid);
	      if (data === 'null') {      console.log("--> Contact is null");
	        sessionStorage.setItem("contactid", 'null');
	      } else {
	          sessionStorage.setItem("contactid", data.contactid);
	    	  var ContactoperationArguments = JSON.stringify({
	          "contactid": data.contactid
	        });
	        console.log("ContactoperationArguments " + ContactoperationArguments);
	        $.ajax({
	          type: "POST",
	          url: "/content/dam/formsanddocuments-fdm/fdm-ceci.executeDermisQuery.json?",
	          data: {
	            "operationName": "GET contact /contacts",
	            "operationArguments": ContactoperationArguments
	          },
	          success: function(data, textStatus, jqXHR) {
	            sessionStorage.setItem("accountid", data[0].egcs_PrimaryAccount.accountid);
	            var accountOperationArguments = JSON.stringify({
	              "accountid": data[0].egcs_PrimaryAccount.accountid
	            });
	            console.log("accountOperationArguments: " + accountOperationArguments);
	            $.ajax({
	              type: "POST",
	              url: "/content/dam/formsanddocuments-fdm/fdm-ceci.executeDermisQuery.json?",
	              data: {
	                "operationName": "GET account /accounts",
	                "operationArguments": accountOperationArguments
	              },
	              success: function(data, textStatus, jqXHR) {
	                console.log(data);  console.log("data[0].egcs_operatingname_en" + data[0].egcs_operatingname_en);
	                console.log("data[0].accountid" + data[0].accountid);
	              },
	              error: function(XMLHttpRequest, textStatus, errorThrown) {console.log("ERROR-GETaccountData  - Click"); },
	              cache: false,
	              async: false
	            });
	          },
	          error: function(XMLHttpRequest, textStatus, errorThrown) {
	            console.log("setContact -error");
	          },
	          cache: false,
	          async: false
	        });
	      }
	    },
	    error: function(XMLHttpRequest, textStatus, errorThrown) {
	      console.log("setContact -error");
	    },
	    cache: false,
	    async: false
	  });
	} */}

function getDraftId(accountid, foProfileId) {
  var draftId = null; console.log("getDraftId-->accountid: " + accountid + " foProfileId: " + foProfileId);
  var draftId = sessionStorage.getItem("eamid");
  var vAcctFoprofileData = JSON.stringify({
    "account_accountid": accountid,
    "account_gac_AEMGetSavedProposalDraftByAccount_CallForProposalRef": {
      "egcs_fo_profileid": foProfileId
    }
  });
  var operationName = "accounts/Microsoft.Dynamics.CRM.gac_AEMGetSavedProposalDraftByAccount()";
  var data = execCRMService(operationName, vAcctFoprofileData);
  if (data == null) { // console.log("data is null");
    draftId = null;
  } else { // console.log("data.gac_saveddraftid: " +
    // data.gac_saveddraftid);
    draftId = data.gac_saveddraftid;
  }

  /* 	  $.ajax({
          type: "POST",
          url: "/content/dam/formsanddocuments-fdm/fdm-ceci.executeDermisQuery.json?",
          data: {
            "operationName": "accounts/Microsoft.Dynamics.CRM.gac_AEMGetSavedProposalDraftByAccount()",
            "operationArguments": vAcctFoprofileData
          },
          success: function(data) {
            console.log(data);
            if (data == 'null') { // console.log("data is null");
              draftId = null;
            } else { // console.log("data.gac_saveddraftid: " +
              // data.gac_saveddraftid);
              draftId = data.gac_saveddraftid;
            }
          },
          error: function(data, textStatus, jqXHR) {
            console.log("textStatus: " + textStatus);
          },
          cache: false,
          async: false
        }); */
  sessionStorage.setItem("gac_saveddraftid", draftId);
  return draftId;
}

function getXMLDataBB() { // BB-'formObj not used... JSON
  // instead...console.log("inside getXMLData2,
  // formObj.proposalName:" + formObj.proposalName);
  guideBridge.getDataXML({
    success: function (guideResultObject) {
      xmlData = guideResultObject.data;
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(xmlData, "text/xml");
      ceciRootXML = xmlDoc.getElementsByTagName('root')[0]; console.log(ceciRootXML);
      strProposal = xml2json(ceciRootXML); console.log(strProposal);//console.log("strProposal" + strProposal);
      initcomponentCategoryArray(strProposal);

      //-->Update the Stub Proposal  **********************************************************************
      console.log("proposalName-JSON: " + strProposal.proposal.basicInfo.projectInfo.proposalName);
      vEgcs_fc_profileid = updateProposal();

// Training Component      
haveComponentYN = strProposal.proposal.projectComposition.training.haveComponentYN;
      if (haveComponentYN == "1") {
        vFdiProjectComponentId = createComponent(strProposal.proposal.projectComposition.training);
      }

// STRATEGY      
      haveComponentYN = strProposal.proposal.projectComposition.strategy.haveComponentYN;
      if (haveComponentYN == "1") {
        vFdiProjectComponentId = createComponent(strProposal.proposal.projectComposition.strategy);
        vAssociationTypes = strProposal.proposal.projectComposition.strategy.sectors;
        componentNode = strProposal.proposal.projectComposition.strategy;
        vAllocationBySector = strProposal.proposal.expectedCost.expenseAllocation.strategy.allocationBySector;

        createSectors(vAssociationTypes, componentNode, vFdiProjectComponentId, vAllocationBySector);

        vAssociationTypes = strProposal.proposal.projectComposition.strategy.markets;
        vAllocationByMarket = strProposal.proposal.expectedCost.expenseAllocation.strategy.allocationByMarket;
        createMarkets(vAssociationTypes, componentNode, vFdiProjectComponentId, vAllocationByMarket); 
      }

// Lead Generation      
      haveComponentYN = strProposal.proposal.projectComposition.leadGeneration.haveComponentYN;
      if (haveComponentYN == "1") {
        vFdiProjectComponentId = createComponent(strProposal.proposal.projectComposition.leadGeneration);
        vAssociationTypes = strProposal.proposal.projectComposition.leadGeneration.sectors
        componentNode = strProposal.proposal.projectComposition.leadGeneration;
        vAllocationBySector = strProposal.proposal.expectedCost.expenseAllocation.leadGeneration.allocationBySector;
        createSectors(vAssociationTypes, componentNode, vFdiProjectComponentId, vAllocationBySector);

        vAssociationTypes = strProposal.proposal.projectComposition.leadGeneration.markets;
        vAllocationByMarket = strProposal.proposal.expectedCost.expenseAllocation.leadGeneration.allocationByMarket;
        createMarkets(vAssociationTypes, componentNode, vFdiProjectComponentId, vAllocationByMarket); 

        if (strProposal.proposal.projectComposition.leadGeneration.travelAbroad == "1") {
          vAssociationTypes = strProposal.proposal.projectComposition.leadGeneration.missions;
          createMissions(vAssociationTypes, componentNode, vFdiProjectComponentId); //"0d05855c-9101-eb11-b82b-005056bf50dd"  
        }
      }

      // Tools And Materials      
haveComponentYN = strProposal.proposal.projectComposition.toolsAndMaterials.haveComponentYN;
      if (haveComponentYN == "1") {
        vFdiProjectComponentId = createComponent(strProposal.proposal.projectComposition.toolsAndMaterials);
        vAssociationTypes = strProposal.proposal.projectComposition.toolsAndMaterials.sectors;
        componentNode = strProposal.proposal.projectComposition.toolsAndMaterials;
        vAllocationBySector = strProposal.proposal.expectedCost.expenseAllocation.toolsAndMaterials.allocationBySector;
        createSectors(vAssociationTypes, componentNode, vFdiProjectComponentId, vAllocationBySector);

        vAssociationTypes = strProposal.proposal.projectComposition.toolsAndMaterials.markets;
        vAllocationByMarket = strProposal.proposal.expectedCost.expenseAllocation.toolsAndMaterials.allocationByMarket;
        createMarkets(vAssociationTypes, componentNode, vFdiProjectComponentId, vAllocationByMarket); 
      }
      var vExpenses = strProposal.proposal.expectedCost.otherExpenses.expense;
      doExpenses(vExpenses, 'other');
      var vExpenses = strProposal.proposal.expectedCost.travelExpenses.expense;
      doExpenses(vExpenses, 'travel');
//      createPerformanceMeasures(); Besco-Oct31-Replaced with inline JSON assignments in 'updateProposal'
      // #2
    },
    error: function (guideResultObject) {
      console.error("API Failed");
      var msg = guideResultObject.getNextMessage();
      while (msg !== null) {
        console.error(msg.message);
        msg = guideResultObject.getNextMessage();
      }
    }
  });
}

function createMissions(strMissionTypes, gacComponent, Gac_FdiFrojectComponentId) {
  console.log("inside function createMissions")
  //    var strMissionTypes = strProposal.proposal.projectComposition.training.activityTypes;
  var vItemLen = strMissionTypes.item.length; console.log("createMissions-vItemLen:" + vItemLen);
  for (var i = 0; i < vItemLen; i++) {
    var vItem = strMissionTypes.item[i];
    if (vItem.id == "") {
      console.log("createMissions-->id is empty");
    } else {
      vItemDescription = vItem.description;
      vItemId = vItem.id;
      vItemId = vItemId.trim();
      console.log("createMissions-vItemDescription:" + vItemDescription + ", vItemId:" + vItemId + "--");
      var vMissionArray = {
        "gac_fdiprojectcomponent_gac_fdiprojectcomponentid": Gac_FdiFrojectComponentId,
        "gac_fdiprojectcomponent_gac_AEMAddMissionToComponent_MissionRef": {
          "gac_missionid": vItemId
        }
      };
      var missionFormData = JSON.stringify({
        "gac_fdiprojectcomponent_gac_fdiprojectcomponentid": Gac_FdiFrojectComponentId,
        "gac_fdiprojectcomponent_gac_AEMAddMissionToComponent_MissionRef": {
          "gac_missionid": vItemId
        }
        // "gac_componentsectorassociation": vMissionArray,
      });
      var operationName = "gac_fdiprojectcomponents/Microsoft.Dynamics.CRM.gac_AEMAddMissionToComponent()";
      var data = execCRMService(operationName, missionFormData);
      console.log("createMissions-->" + data);

      {/*       $.ajax({
        type: "POST",
        url: "/content/dam/formsanddocuments-fdm/fdm-ceci.executeDermisQuery.json?",
        data: {
          "operationName": "gac_fdiprojectcomponents/Microsoft.Dynamics.CRM.gac_AEMAddMissionToComponent()",
          "operationArguments": missionFormData
        },
        success: function (data) {
          console.log(data);
//          console.log("data.gac_componentsectorassociationid: " + data.gac_componentsectorassociationid);
        },
        //  error: function (XMLHttpRequest, textStatus, errorThrown) { console.log("ERROR-AEMCreateFDIProjectComponent-ERROR"); },
        cache: false,
        async: false
      }); */}
    }
  }
}

function getMarketAllocation(vItemDescription, vAllocationByMarket) {
  console.log("inside function getMarketAllocation")
  var junkThis = strProposal.proposal.expectedCost.expenseAllocation.strategy.allocationByMarket.allocation.market

  var vPercentage = "";
  if (Array.isArray(vAllocationByMarket.allocation)) { // 2+ Market allocations
    console.log("vAllocationByMarket.allocation IS an array")

    var vAllocationLen = vAllocationByMarket.allocation.length; console.log("vAllocationLen:" + vAllocationLen);
    for (var i = 0; i < vAllocationLen; i++) {
      var vItem = vAllocationByMarket.allocation[i];
      var vMarket = vItem.market;
      vMarket = vMarket.trim();
      if (vItemDescription == vMarket) {
        vPercentage = vItem.percentage;
        vPercentage = vPercentage.trim();
        console.log("vMarket:" + vMarket + ", vPercentage:" + vPercentage + "--");
      }
    }
  }
  else {// 1 Market allocation
    var vMarket = vAllocationByMarket.allocation.market;
    vMarket = vMarket.trim();
    if (vItemDescription == vMarket) {
      vPercentage = vAllocationByMarket.allocation.percentage;
      vPercentage = vPercentage.trim();
      console.log("vMarket:" + vMarket + ", vPercentage:" + vPercentage + "--");
    }
  }
  return vPercentage;
}

function createMarkets(strMarketTypes, gacComponent, Gac_FdiFrojectComponentId) {
  console.log("inside function createMarkets")
  //    var strMarketTypes = strProposal.proposal.projectComposition.training.activityTypes;
  if (Array.isArray(strMarketTypes.item)) { //There are 2+ Markets
    console.log("strSectorTypes IS an array")
    var vItemLen = strMarketTypes.item.length; console.log("vItemLen:" + vItemLen);
    for (var i = 0; i < vItemLen; i++) {
      var vItem = strMarketTypes.item[i];
      if (vItem.id == "") {
        console.log("id is empty");
      } else {
        vItemDescription = vItem.description;
        vItemId = vItem.id;
        vItemId = vItemId.trim();
        console.log("vItemDescription:" + vItemDescription + ", vItemId:" + vItemId + "--");
        /*--->CreateActivity**********************************************************************/
        var vFdiMarketAssocArray = {
          "gac_name": gacComponent.gac_name,
          "gac_allocation": getMarketAllocation(vItemDescription, vAllocationByMarket),
          "gac_Program": { "egcs_tp_profileid": sessionStorage.getItem("tpprofileid") },
          "gac_TargetMarket": { "gac_countryid": vItemId },
          "gac_FDIComponentCategory": { "gac_fdicomponentcategoryid": gacComponent.gac_fdicomponentcategoryid },
          "gac_FDIProjectComponent": { "gac_fdiprojectcomponentid": Gac_FdiFrojectComponentId }
        };
        var marketFormData = JSON.stringify({
          "gac_componentmarketassociation": vFdiMarketAssocArray,
        });
        var operationName = "POST gac_componentmarketassociation /gac_componentmarketassociations";
        var data = execCRMService(operationName, marketFormData);
        console.log("createMarkets-->" + data);
        console.log("data.gac_componentmarketassociationid: " + data.gac_componentmarketassociationid);
      }
    }
  }
  else { // there is only one Market
    vItemDescription = strMarketTypes.item.description;
    vItemDescription = vItemDescription.trim();
    vItemId = strMarketTypes.item.id;
    vItemId = vItemId.trim();
    console.log("vItemDescription:" + vItemDescription + ", vItemId:" + vItemId + "--");
    /*--->CreateMarket**********************************************************************/
    var vFdiMarketAssocArray = {
      "gac_name": gacComponent.gac_name,
      "gac_allocation": getMarketAllocation(vItemDescription, vAllocationByMarket),
      "gac_Program": { "egcs_tp_profileid": sessionStorage.getItem("tpprofileid") },
      "gac_TargetMarket": { "gac_countryid": vItemId },
      "gac_FDIComponentCategory": { "gac_fdicomponentcategoryid": gacComponent.gac_fdicomponentcategoryid },
      "gac_FDIProjectComponent": { "gac_fdiprojectcomponentid": Gac_FdiFrojectComponentId }
    };
    var marketFormData = JSON.stringify({
      "gac_componentmarketassociation": vFdiMarketAssocArray,
    });
    var operationName = "POST gac_componentmarketassociation /gac_componentmarketassociations";
    var data = execCRMService(operationName, marketFormData);
    console.log("createMarkets-->" + data);
    console.log("data.gac_componentmarketassociationid: " + data.gac_componentmarketassociationid);
  }
}

function createProposalNOTUSED() {
  console.log("----------->->->->->>>DELETE THIS FUNCTION<<<<<<--->>>createProposalNOTUSED")
}

function getSectorAllocation(vItemDescription, vAllocationBySector) {
  console.log("inside function getSectorAllocation")
  var junkThis = strProposal.proposal.expectedCost.expenseAllocation.strategy.allocationBySector.allocation

  var vPercentage = "";
  if (Array.isArray(vAllocationBySector.allocation)) {
    console.log("vAllocationBySector.allocation IS an array")
    var vAllocationLen = vAllocationBySector.allocation.length; console.log("vAllocationLen:" + vAllocationLen);
    for (var i = 0; i < vAllocationLen; i++) {
      var vItem = vAllocationBySector.allocation[i];
      var vSector = vItem.sector;
      vSector = vSector.trim();
      if (vItemDescription == vSector) {
        vPercentage = vItem.percentage;
        vPercentage = vPercentage.trim();
        console.log("vSector:" + vSector + ", vPercentage:" + vPercentage + "--");
      }
    }
  }
  else {
    console.log("vAllocationBySector.allocation NOT an array")
    var vSector = vAllocationBySector.allocation.sector;
    vSector = vSector.trim();
    if (vItemDescription == vSector) {
      vPercentage = vAllocationBySector.allocation.percentage;
      vPercentage = vPercentage.trim();
      console.log("vSector:" + vSector + ", vPercentage:" + vPercentage + "--");

    }
  }
  return vPercentage;
}

function createSectors(strSectorTypes, gacComponent, Gac_FdiFrojectComponentId, vAllocationBySector) {
  console.log("inside function createSectors")
  //    var strSectorTypes = strProposal.proposal.projectComposition.training.activityTypes;
  if (Array.isArray(strSectorTypes.item)) {// 2+ Sector allocations
    console.log("strSectorTypes IS an array")
    var vItemLen = strSectorTypes.item.length; console.log("vItemLen:" + vItemLen);
    for (var i = 0; i < vItemLen; i++) {
      var vItem = strSectorTypes.item[i];
      if (vItem.id == "") {
        console.log("id is empty");
      } else {
        vItemDescription = vItem.description;
        vItemId = vItem.id;
        vItemId = vItemId.trim();
        console.log("vItemDescription:" + vItemDescription + ", vItemId:" + vItemId + "--");
        /*--->CreateActivity**********************************************************************/
        var vFdiSectorAssocArray = {
          "gac_name": gacComponent.gac_name,
          "gac_ComponentCategory": { "gac_fdicomponentcategoryid": gacComponent.gac_fdicomponentcategoryid },
          "gac_FDIProjectComponent": { "gac_fdiprojectcomponentid": Gac_FdiFrojectComponentId },
          "gac_allocation": getSectorAllocation(vItemDescription, vAllocationBySector),
          "gac_Program": { "egcs_tp_profileid": sessionStorage.getItem("tpprofileid") },
          "gac_TargetSector": { "gac_sectorindustryid": vItemId }
        };
        var sectorFormData = JSON.stringify({
          "gac_componentsectorassociation": vFdiSectorAssocArray,
        });
        var operationName = "POST gac_componentsectorassociation /gac_componentsectorassociations";
        var data = execCRMService(operationName, sectorFormData);
        console.log("createSectors-->" + data);
        console.log("data.gac_componentsectorassociationid: " + data.gac_componentsectorassociationid);
      }
    }
  }
  else {// 1 Sector allocation
    console.log("strSectorTypes NOT an array---> single sector")
    vItemDescription = strSectorTypes.item.description;
    vItemDescription = vItemDescription.trim();
    vItemId = strSectorTypes.item.id;
    vItemId = vItemId.trim();
    console.log("vItemDescription:" + vItemDescription + ", vItemId:" + vItemId + "--");
    var vFdiSectorAssocArray = {
      "gac_name": gacComponent.gac_name,
      "gac_ComponentCategory": { "gac_fdicomponentcategoryid": gacComponent.gac_fdicomponentcategoryid },
      "gac_FDIProjectComponent": { "gac_fdiprojectcomponentid": Gac_FdiFrojectComponentId },
      "gac_allocation": getSectorAllocation(vItemDescription, vAllocationBySector),
      "gac_Program": { "egcs_tp_profileid": sessionStorage.getItem("tpprofileid") },
      "gac_TargetSector": { "gac_sectorindustryid": vItemId }
    };
    var sectorFormData = JSON.stringify({
      "gac_componentsectorassociation": vFdiSectorAssocArray,
    });
    var operationName = "POST gac_componentsectorassociation /gac_componentsectorassociations";
    var data = execCRMService(operationName, sectorFormData);
    console.log("createSectors-->" + data);
    console.log("data.gac_componentsectorassociationid: " + data.gac_componentsectorassociationid);
  }

}
var junk = strProposal.proposal.projectComposition.training.timeframeTo

function createComponent(componentNode) {
  var fdiProjCompArray = {
    "gac_name": componentNode.gac_name,
    "gac_expectednumberofmeetings": componentNode.gac_expectednumberofmeetings,
    "gac_expectedstarttime": componentNode.timeframeFrom,
    "gac_expectedendtime": componentNode.timeframeTo,
    "gac_expectednumberofprospectsreached": componentNode.gac_expectednumberofprospectsreached,
    "gac_expectednumberofpeopletrained": componentNode.numberOfTrainee,
    "gac_expectedcomponentcost": componentNode.gac_expectedcomponentcost,
    "gac_fdicomponentamountrequested": componentNode.gac_fdicomponentamountrequested,
    "gac_fdicomponentamountapproved": componentNode.gac_fdicomponentamountapproved,
    "gac_pastexperience": componentNode.experienceDescription,
    "gac_objective": componentNode.description,
    "gac_previouslyFundedbyprogram": componentNode.previouslyFunded,
    "gac_Proposal": { "egcs_fc_profileid": sessionStorage.getItem("fcprofileid") },
    "gac_CallForProposal": { "egcs_fo_profileid": vEgcs_fo_profileid },
    "gac_Program": { "egcs_tp_profileid": sessionStorage.getItem("tpprofileid") },
    "gac_Applicant": { "accountid": strProposal.proposal.globalids.accountid },
    "gac_FDIComponentCategory": { "gac_fdicomponentcategoryid": componentNode.gac_fdicomponentcategoryid },
    "gac_CallYear": { "gac_timeperiodid": sessionStorage.getItem("gac_timeperiodid") }
  };
  // only shows [object,object]...console.log("fdiProjCompArray:"+fdiProjCompArray);
  var componentFormData = JSON.stringify({
    "gac_fdiprojectcomponent": fdiProjCompArray,
  });
  var operationName = "POST gac_fdiprojectcomponent /gac_fdiprojectcomponents";
  var data = execCRMService(operationName, componentFormData);
  console.log("createComponent: " + data); console.log("data.gac_fdiprojectcomponentid: " + data.gac_fdiprojectcomponentid);
  vGac_fdiprojectcomponentid = data.gac_fdiprojectcomponentid;
  componentCatIdObj[componentNode.gac_fdicomponentcategoryid] = vGac_fdiprojectcomponentid;

  var vAssociationTypes = componentNode.activityTypes;
  createActivities(vAssociationTypes, componentNode, vGac_fdiprojectcomponentid); //"0d05855c-9101-eb11-b82b-005056bf50dd"

  return vGac_fdiprojectcomponentid; // end of ajax-createComponent
} // end of function createComponent

function doExpenses(objExpenses, strExpenseType) {  //}, gacComponent, vGac_fdiprojectcomponentid) {
  console.log("inside function doExpenses - " + strExpenseType);
  if (Array.isArray(objExpenses)) {
    console.log("objExpenses is an array");
    // >>> to save time, the following 'array' handling is also duplicated for the 'single' expense occurrance
    // >>> this should be combined in an abstract structure after CFP2022 is closed
    // besco-Oct1-2021 
    var vItemLen = objExpenses.length; console.log("vItemLen:" + vItemLen);
    for (var i = 0; i < vItemLen; i++) {
      var vItem = objExpenses[i];
      if (vItem.expenseType == "") {
        console.log("id is empty");
      } else {
        var vItemDescription = vItem.expenseType;
        var vFdiComponentCategoryID = vItem.fdicomponentcategoryid; vFdiComponentCategoryID = vFdiComponentCategoryID.trim();
        var vUomID = vItem.unitOfMeasurementID; vUomID = vUomID.trim();
        var vExpenseTypeID = vItem.expenseTypeID; vExpenseTypeID = vExpenseTypeID.trim();
        console.log("vItemDescription:" + vItemDescription + ", vFdiComponentCategoryID:" + vFdiComponentCategoryID + "--");
        var vExpenseArray = {
          "gac_name": vItem.expenseName,
          "gac_shortdescription": vItem.shortDesc, //Sep8-2021-Besco - missing in FDM also... fixed that too
          "purpose": vItem.purpose,
          "gac_costperunit": vItem.costPerUnit,
          "gac_numberofunits": vItem.numberOfUnits,
          "gac_expectedtimeframefrom": vItem.timeframeFrom, //Sep8-2021-Besco - missing in FDM also... fixed that too
          "gac_expectedtimeframeto": vItem.timeframeTo, //Sep8-2021-Besco - missing in FDM also... fixed that too
          "otherFederalContribution": vItem.otherFederalContribution,
          // "expenseName": vItem.expenseName,
          //        "gac_externalfundingsources": vItem.otherFederalContribution, // in CRM, this field can be modified (text field)
          "gac_fundingfromexternalsources": vItem.otherFederalContribution, //bb added from PatSmith chat-Aug25-2021
          "gac_Program": { "egcs_tp_profileid": sessionStorage.getItem("tpprofileid") },
          "gac_CallForProposal": { "egcs_fo_profileid": vEgcs_fo_profileid },
          "gac_Proposal": { "egcs_fc_profileid": sessionStorage.getItem("fcprofileid") },
          //        "gac_FDIComponentCategory": { "gac_fdicomponentcategoryid": strProposal.proposal.projectComposition.leadGeneration.gac_fdicomponentcategoryid },
          "gac_FDIExpenseType": { "gac_fdiexpensetypeid": vExpenseTypeID },
          "gac_FDIProjectComponent": { "gac_fdiprojectcomponentid": componentCatIdObj[vFdiComponentCategoryID] },
          "gac_FDIComponentCategory": { "gac_fdicomponentcategoryid": vFdiComponentCategoryID },
          "gac_CallYear": { "gac_timeperiodid": sessionStorage.getItem("gac_timeperiodid") },
          "gac_UnitOfMeasurement": { "gac_unitofmeasurementid": vUomID }
        };
        var budgetItemFormData = JSON.stringify({
          "gac_fdibudgetitem": vExpenseArray,
        });
        console.log("gac_fdicomponentcategoryid[0]=" + componentCatIdObj[strProposal.proposal.projectComposition.strategy.gac_fdicomponentcategoryid]);
        var operationName = "POST gac_fdibudgetitem /gac_fdibudgetitems";
        var data = execCRMService(operationName, budgetItemFormData);
        console.log("doExpenses--> " + data);
        console.log("data.gac_fdibudgetitemid: " + data.gac_fdibudgetitemid);
      }
    }
  }
  else {
    console.log("objExpenses is NOT an array");
    var vItemDescription = objExpenses.expenseType;
    var vFdiComponentCategoryID = objExpenses.fdicomponentcategoryid; vFdiComponentCategoryID = vFdiComponentCategoryID.trim();
    var vUomID = objExpenses.unitOfMeasurementID; vUomID = vUomID.trim();
    var vExpenseTypeID = objExpenses.expenseTypeID; vExpenseTypeID = vExpenseTypeID.trim();
    console.log("vItemDescription:" + vItemDescription + ", vFdiComponentCategoryID:" + vFdiComponentCategoryID + "--");
    var vExpenseArray = {
      "gac_name": objExpenses.expenseName,
      "gac_shortdescription": objExpenses.shortDesc, //Sep8-2021-Besco - missing in FDM also... fixed that too
      "purpose": objExpenses.purpose,
      "gac_costperunit": objExpenses.costPerUnit,
      "gac_numberofunits": objExpenses.numberOfUnits,
      "gac_expectedtimeframefrom": objExpenses.timeframeFrom, //Sep8-2021-Besco - missing in FDM also... fixed that too
      "gac_expectedtimeframeto": objExpenses.timeframeTo, //Sep8-2021-Besco - missing in FDM also... fixed that too
      "otherFederalContribution": objExpenses.otherFederalContribution,
      // "expenseName": objExpenses.expenseName,
      //        "gac_externalfundingsources": objExpenses.otherFederalContribution, // in CRM, this field can be modified (text field)
      "gac_fundingfromexternalsources": objExpenses.otherFederalContribution, //bb added from PatSmith chat-Aug25-2021
      "gac_Program": { "egcs_tp_profileid": sessionStorage.getItem("tpprofileid") },
      "gac_CallForProposal": { "egcs_fo_profileid": vEgcs_fo_profileid },
      "gac_Proposal": { "egcs_fc_profileid": sessionStorage.getItem("fcprofileid") },
      //        "gac_FDIComponentCategory": { "gac_fdicomponentcategoryid": strProposal.proposal.projectComposition.leadGeneration.gac_fdicomponentcategoryid },
      "gac_FDIExpenseType": { "gac_fdiexpensetypeid": vExpenseTypeID },
      "gac_FDIProjectComponent": { "gac_fdiprojectcomponentid": componentCatIdObj[vFdiComponentCategoryID] },
      "gac_FDIComponentCategory": { "gac_fdicomponentcategoryid": vFdiComponentCategoryID },
      "gac_CallYear": { "gac_timeperiodid": sessionStorage.getItem("gac_timeperiodid") },
      "gac_UnitOfMeasurement": { "gac_unitofmeasurementid": vUomID }
    };
    var budgetItemFormData = JSON.stringify({
      "gac_fdibudgetitem": vExpenseArray,
    });
    console.log("gac_fdicomponentcategoryid[0]=" + componentCatIdObj[strProposal.proposal.projectComposition.strategy.gac_fdicomponentcategoryid]);
    var operationName = "POST gac_fdibudgetitem /gac_fdibudgetitems";
    var data = execCRMService(operationName, budgetItemFormData);
  }
}

function createActivities(vAssociationTypes, gacComponent, Gac_FdiFrojectComponentId) {
  console.log("inside function createActivities")
  //    var vAssociationTypes = strProposal.proposal.projectComposition.training.activityTypes;
  var vItemLen = vAssociationTypes.item.length; console.log("vItemLen:" + vItemLen);
  for (var i = 0; i < vItemLen; i++) {
    var vItem = vAssociationTypes.item[i];
    if (vItem.id == "") {
      console.log("id is empty");
    } else {
      vItemDescription = vItem.description;
      vItemId = vItem.id;
      vItemId = vItemId.trim();
      console.log("vItemDescription:" + vItemDescription + ", vItemId:" + vItemId + "--");
      /*--->CreateActivity**********************************************************************/
      var vFdiActAssocArray = {
        "gac_name": gacComponent.gac_name,
        "gac_FDIActivityType": { "gac_fdiactivitytypeid": vItemId }, //"5645d14e-9201-eb11-b82b-005056bf50dd"
        "gac_ComponentCategory": { "gac_fdicomponentcategoryid": gacComponent.gac_fdicomponentcategoryid },
        "gac_FDIProjectComponent": { "gac_fdiprojectcomponentid": Gac_FdiFrojectComponentId }
      };
      var activityFormData = JSON.stringify({
        "gac_componentactivityassociation": vFdiActAssocArray,
      });
      var operationName = "POST gac_componentactivityassociation /gac_componentactivityassociations";
      var data = execCRMService(operationName, activityFormData);
      console.log(data);
      console.log("data.gac_componentactivityassociationid: " + data.gac_componentactivityassociationid);

      /*       $.ajax({
              type: "POST",
              url: "/content/dam/formsanddocuments-fdm/fdm-ceci.executeDermisQuery.json?",
              data: {
                "operationName": "POST gac_componentactivityassociation /gac_componentactivityassociations",
                "operationArguments": activityFormData
              },
              success: function (data) {
                console.log(data);
                console.log("data.gac_componentactivityassociationid: " + data.gac_componentactivityassociationid);
              },
              /*  error: function (XMLHttpRequest, textStatus, errorThrown) { console.log("ERROR-AEMCreateFDIProjectComponent-ERROR"); },
              cache: false,
              async: false
            }); */
      /*--->CreateActivity**********************************************************************/
    }
  }
}
//start block comment w/insertion point at next line

function initcomponentCategoryArray(strProposal) {
  componentCatIdObj[strProposal.proposal.projectComposition.toolsAndMaterials.gac_fdicomponentcategoryid] = "x";
  componentCatIdObj[strProposal.proposal.projectComposition.leadGeneration.gac_fdicomponentcategoryid] = "x";
  componentCatIdObj[strProposal.proposal.projectComposition.strategy.gac_fdicomponentcategoryid] = "x";
  componentCatIdObj[strProposal.proposal.projectComposition.training.gac_fdicomponentcategoryid] = "x";
  /* create JSON object to hold key:value pairs--->
  gac_fdicomponentcategoryid : gac_fdiprojectcomponentid
  the four pairs are initialized with the categoryID, then,
  upon submit, when a component is created in Dynajmics,
  a componentID is returned and the respective pair 
  is updated.
  When each expense is created in Dynamics, using the categoryID,
  the componentID is fetched and set in the array to be used in the 
  FDM "POST gac_fdiprojectcomponent /gac_fdiprojectcomponents"
   //console.log("gac_fdicomponentcategoryid[0]="+componentCatIdObj[strProposal.proposal.projectComposition.strategy.gac_fdicomponentcategoryid]);
   */
}
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
      "formDataModelId": "fdm-ceci",
      "operationName": operName,
//    "operationArguments": operArguments //Jun9-2022 (from 'claims' clientlib -->custom.js)
      "operationArguments": encodeURIComponent(operArguments)
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

function getClaimsList(fcProfileId) { // bbesco 
  console.log("getClaimsList");
  var projectOperationArguments = JSON.stringify({
    "_gac_fdiproject_value": vFcProfileId
  });
  console.log("projectOperationArguments " + projectOperationArguments);
  var operationName = "GET gac_fdiclaim /gac_fdiclaims";
  var data = execCRMService3Args(operationName, projectOperationArguments);
  console.log("data: "+data);
}

function testjs2(fcProfileId) { // bbesco 
  console.log("testjs2--getClaimsList: "+fcProfileId);
  var projectOperationArguments = JSON.stringify({
    "_gac_fdiproject_value": fcProfileId
  });
  console.log("projectOperationArguments " + projectOperationArguments);
  var operationName = "GET gac_fdiclaim /gac_fdiclaims";
  var data = execCRMService3Args(operationName, projectOperationArguments);
  console.log("data: "+data);
}

function execCRMService3Args(operName, operArguments) {

  if (getDebugMode()) {
    console.log(operName);    console.log(operArguments);
  }
  var objData;

  $.ajax({
    type: "POST",
    url: "/bin/fdmServiceConnector",
    data: {
      "formDataModelId": "ceci_fdm2",
      "operationName": operName,
      "operationArguments": operArguments
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



