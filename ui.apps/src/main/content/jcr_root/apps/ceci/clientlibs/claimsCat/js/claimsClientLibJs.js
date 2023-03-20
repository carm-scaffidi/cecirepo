console.log("claimsClientLibJs.js"   + ": "  + "Jan25B" + " " + "2023");

// Bruce Besco - Mar 2022
function getXML(){
guideBridge.getDataXML({
    success: function (guideResultObject) {
      var xmlData = guideResultObject.data;
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(xmlData, "text/xml");
      var ceciRootXML = xmlDoc.getElementsByTagName('ICCIClaimData')[0]; console.log(ceciRootXML);
      var strProposal = xml2json(ceciRootXML); console.log(strProposal);//console.log("strProposal" + strProposal);
    }
})
}
function submitFinalReportData2(finalRptObj){ //Besco-Jan10 -- 

  var operationName = "PUT egcs_fc_profile /egcs_fc_profiles";
  var operationArguments = JSON.stringify(finalRptObj);   

  if(getDebugMode()){
    console.log(operationArguments);
  }

  var data = execCRMService(operationName,operationArguments);


  return data;
}

function getProposalComponents(fcprofileid){
  console.log("fcprofileid: "+ fcprofileid);
  var operationArguments = JSON.stringify({
    "_gac_proposal_value": fcprofileid
  });
  var operationName = "GET gac_fdiprojectcomponent /gac_fdiprojectcomponents";
  var vComponentArray = execCRMService(operationName, operationArguments);
  return vComponentArray;
}

