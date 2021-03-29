/* From CRX - Most recent WORKING 
Thu Dec 8, 8:18 pm "Proposal Name"
Today: Mon Dec 114, 4:02 pm
All components, Expenses, Missions working correctly, except
Todo: fix single Exepnse count
Jan19a
 */
var vEgcs_tp_profileid = "1edcab5b-80a4-ea11-969c-005056816b76"; // Program: 'CanExport Community Investments'
var vEgcs_fo_profileid = sessionStorage.getItem("foprofileid"); //Call for Proposal: 'CFP 2021'
var vEgcs_fc_profileid = ""; // Proposal... entered into form
var vContactId = sessionStorage.getItem("contactid");
var vAccountId = sessionStorage.getItem("accountid");
var vGacCountryid = "77c734ae-9001-eb11-b82b-005056bf50dd";
var vGacTimeperiodid = "62145559-b004-eb11-96a4-00505681cf84";
var vGac_fdiprojectcomponentid = "";
var componentCatIdObj = {}; // see function initcomponentCategoryArray
var vItemId = "";
var vItemDescription = "";
var haveComponentYN = "";
var strProposal = {};
//test jan28a

function getEgcsNameFromSession() {
  var vFoprofile = sessionStorage.getItem("foprofile");
  jObj = JSON.parse(vFoprofile);
  vEgcsName = jObj.egcs_name;
  return vEgcsName;
}

function partnerships(){
  var objProposal_partnership = strProposal.proposal.strategicPartnerships.financialPartnerships.partnership;
  var partnershipLength = objProposal_partnership.length
  var strPartnerships = ""
  for (var i = 0; i < objProposal_partnership.length; i++) {
      var obj = objProposal_partnership[i];
      console.log("contact: " + obj.contact);
      console.log("partner: " + obj.partner);
      console.log("contributionToInitiative: " + obj.contributionToInitiative);
      console.log("confirmed: " + obj.confirmed);
      var strPartnership = obj.partner+";"+obj.contact+";"+obj.contributionToInitiative+";"+obj.confirmed+"\n"
      console.log(obj.partner+";"+obj.contact+";"+obj.contributionToInitiative+";"+obj.confirmed+"\n");
      console.log("strPartnership-"+strPartnership);
      strPartnerships = strPartnerships + strPartnership;
      console.log("strPartnerships-"+strPartnerships);
  }
}

function getContactIdFromEamId() {
  var vEamid = sessionStorage.getItem("eamid");
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
        })
      }
    }
  });
}

function getContactFromEamId() {
  var vEamid = sessionStorage.getItem("eamid");
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
  });
}

function getSetFoProfileId() {
  var operationName = "GET egcs_fo_profile /egcs_fo_profiles";
  var operationArguments = JSON.stringify({});
  var objData = execCRMService(operationName, operationArguments);

  for (var i = 0; i < objData.length; i++) {
    var obj = objData[i];
    console.log(obj.statuscode);
    if (obj.statuscode == 1) {
      console.log("egcs_name_en: " + obj.egcs_name_en);
      console.log("egcs_fo_profileid: " + obj.egcs_fo_profileid);
      console.log(obj);
      var strFoProfile = JSON.stringify(obj);
      console.log("strFoProfile: "+strFoProfile);
      sessionStorage.setItem("foprofileid", obj.egcs_fo_profileid);
      sessionStorage.setItem("foprofile", strFoProfile);
    }
  }
}

function getAccountIdFromContactId() {
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
}

function getContactFromEAM(){
	  var vSseamID =  sessionStorage.getItem("sseamid");
	  var ContactoperationArguments = JSON.stringify({  "gac_GetContactByEAMID_EAMID": vSseamID
	  });     console.log("ContactoperationArguments " + ContactoperationArguments);

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
	}

function getDraftId(accountid, foProfileId) {
	  var draftId = null; // console.log("accountid: " + accountid + " foProfileId: " + foProfileId);
	  var draftId = sessionStorage.getItem("eamid");
	  var vAcctFoprofileData = JSON.stringify({
	    "account_accountid": accountid,
	    "account_gac_AEMGetSavedProposalDraftByAccount_CallForProposalRef": {
	      "egcs_fo_profileid": foProfileId
	    }
	  });
	  $.ajax({
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
	    });
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

    
      console.log("proposalName-JSON: " + strProposal.proposal.basicInfo.projectInfo.proposalName);
//-->CreateProposal**********************************************************************
      vEgcs_fc_profileid = createProposal();
      haveComponentYN = strProposal.proposal.projectComposition.training.haveComponentYN;
      if (haveComponentYN == "1") {
        vFdiProjectComponentId = createCompTRN(strProposal.proposal.projectComposition.training);
      }
      haveComponentYN = strProposal.proposal.projectComposition.strategy.haveComponentYN;
      if (haveComponentYN == "1") {
        vFdiProjectComponentId = createCompTRN(strProposal.proposal.projectComposition.strategy);
        vAssociationTypes = strProposal.proposal.projectComposition.strategy.sectors;
        componentNode = strProposal.proposal.projectComposition.strategy;
        createSectors(vAssociationTypes, componentNode, vFdiProjectComponentId); //"0d05855c-9101-eb11-b82b-005056bf50dd"  
        vAssociationTypes = strProposal.proposal.projectComposition.strategy.markets;
        createMarkets(vAssociationTypes, componentNode, vFdiProjectComponentId); //"0d05855c-9101-eb11-b82b-005056bf50dd"  
      }
      haveComponentYN = strProposal.proposal.projectComposition.leadGeneration.haveComponentYN;
      if (haveComponentYN == "1") {
        vFdiProjectComponentId = createCompTRN(strProposal.proposal.projectComposition.leadGeneration);
        vAssociationTypes = strProposal.proposal.projectComposition.leadGeneration.sectors
        componentNode = strProposal.proposal.projectComposition.leadGeneration;
        createSectors(vAssociationTypes, componentNode, vFdiProjectComponentId); //"0d05855c-9101-eb11-b82b-005056bf50dd"
        vAssociationTypes = strProposal.proposal.projectComposition.leadGeneration.markets;
        createMarkets(vAssociationTypes, componentNode, vFdiProjectComponentId); //"0d05855c-9101-eb11-b82b-005056bf50dd"  
        if (strProposal.proposal.projectComposition.leadGeneration.travelAbroad == "1") {
          vAssociationTypes = strProposal.proposal.projectComposition.leadGeneration.missions;
          createMissions(vAssociationTypes, componentNode, vFdiProjectComponentId); //"0d05855c-9101-eb11-b82b-005056bf50dd"  
        }
      }
      haveComponentYN = strProposal.proposal.projectComposition.toolsAndMaterials.haveComponentYN;
      if (haveComponentYN == "1") {
        vFdiProjectComponentId = createCompTRN(strProposal.proposal.projectComposition.toolsAndMaterials);
        vAssociationTypes = strProposal.proposal.projectComposition.toolsAndMaterials.sectors;
        componentNode = strProposal.proposal.projectComposition.toolsAndMaterials;
        createSectors(vAssociationTypes, componentNode, vFdiProjectComponentId); //"0d05855c-9101-eb11-b82b-005056bf50dd"
        vAssociationTypes = strProposal.proposal.projectComposition.toolsAndMaterials.markets;
        createMarkets(vAssociationTypes, componentNode, vFdiProjectComponentId); //"0d05855c-9101-eb11-b82b-005056bf50dd"  
      }
      var vExpenses = strProposal.proposal.expectedCost.otherExpenses.expense;
      doExpenses(vExpenses);
      var vExpenses = strProposal.proposal.expectedCost.travelExpenses.expense;
      doExpenses(vExpenses);
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
  var vItemLen = strMissionTypes.item.length; console.log("vItemLen:" + vItemLen);
  for (var i = 0; i < vItemLen; i++) {
    var vItem = strMissionTypes.item[i];
    if (vItem.id == "") {
      console.log("id is empty");
    } else {
      vItemDescription = vItem.description;
      vItemId = vItem.id;
      vItemId = vItemId.trim();
      console.log("vItemDescription:" + vItemDescription + ", vItemId:" + vItemId + "--");
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

      $.ajax({
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
        /*  error: function (XMLHttpRequest, textStatus, errorThrown) { console.log("ERROR-AEMCreateFDIProjectComponent-ERROR"); },*/
        cache: false,
        async: false
      });
    }
  }
}

function createMarkets(strMarketTypes, gacComponent, Gac_FdiFrojectComponentId) {
  console.log("inside function createMarkets")
  //    var strMarketTypes = strProposal.proposal.projectComposition.training.activityTypes;
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
        "gac_allocation": 70,
        "gac_Program": {"egcs_tp_profileid": "1edcab5b-80a4-ea11-969c-005056816b76" },
        "gac_TargetMarket": {"gac_countryid": vItemId},
        "gac_FDIComponentCategory": {"gac_fdicomponentcategoryid": gacComponent.gac_fdicomponentcategoryid},
        "gac_FDIProjectComponent": { "gac_fdiprojectcomponentid": Gac_FdiFrojectComponentId}
      };
      var marketFormData = JSON.stringify({
        "gac_componentmarketassociation": vFdiMarketAssocArray,
      });

      $.ajax({
        type: "POST",
        url: "/content/dam/formsanddocuments-fdm/fdm-ceci.executeDermisQuery.json?",
        data: {
          "operationName": "POST gac_componentmarketassociation /gac_componentmarketassociations",
          "operationArguments": marketFormData
        },
        success: function (data) {
          console.log(data);
          console.log("data.gac_componentmarketassociationid: " + data.gac_componentmarketassociationid);
        },
        /*  error: function (XMLHttpRequest, textStatus, errorThrown) { console.log("ERROR-AEMCreateFDIProjectComponent-ERROR"); },*/
        cache: false,
        async: false
      });
      /*--->createMarkets**********************************************************************/
    }
  }
}

function createProposal() {
  var localEgcs_fc_profileid = "";
  console.log("CreateProposal");
  // Creating contact  Data
  var egcs_fc_profileArray = {
    "egcs_name_en": strProposal.proposal.basicInfo.projectInfo.proposalName,
    "egcs_PrincipalContact": { "contactid": vContactId},
    "egcs_account": { "accountid": vAccountId},
    "egcs_objectivessummary": "egcs_objectivessummary- Dec17c",
    "gac_fdistrategyoverview": strProposal.proposal.basicInfo.fdiStratgey.overview,
    "gac_fdistrategybackground": strProposal.proposal.basicInfo.fdiStratgey.background,
    "gac_departmentalalignment": strProposal.proposal.basicInfo.fdiStratgey.alignment,
    "gac_applicantprovince": 810510006,
    "gac_OrganizationSigningAuthority": { "contactid": vContactId},
    "gac_ApplicantCountry": {vGacCountryid},
    "gac_CallYear": { "gac_timeperiodid": vGacTimeperiodid},
    "egcs_FundingOpportunity": { "egcs_fo_profileid": vEgcs_fo_profileid},
    "egcs_TP_ProfileId": { "egcs_tp_profileid": vEgcs_tp_profileid}
  };
  console.log("egcs_fc_profileArray:" + egcs_fc_profileArray);
  var proposalFormData = JSON.stringify({
    "egcs_fc_profile": egcs_fc_profileArray,
  });

  //POST Proposal Information
  $.ajax({
    type: "POST",
    url: "/content/dam/formsanddocuments-fdm/fdm-ceci.executeDermisQuery.json?",
    data: {
      "operationName": "POST egcs_fc_profile /egcs_fc_profiles",
      "operationArguments": proposalFormData
    },
    success: function (data) {
      console.log(data); console.log("postCompCode3 - Click, egcs_fc_profileid: " + data.egcs_fc_profileid);
      localEgcs_fc_profileid = data.egcs_fc_profileid;
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      console.log("Error-CreateProposal ");
    },
    cache: false,
    async: false
  });
  //           console.log(xml2json(ceciRoot.getElementsByTagName('proposal')[0]));
  //           console.log("xml data received" + guideResultObject.data);
  return localEgcs_fc_profileid;
}

function createSectors(strSectorTypes, gacComponent, Gac_FdiFrojectComponentId) {
  console.log("inside function createSectors")
  //    var strSectorTypes = strProposal.proposal.projectComposition.training.activityTypes;
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
        "gac_allocation": 50,
        "gac_Program": { "egcs_tp_profileid": "1edcab5b-80a4-ea11-969c-005056816b76" },
        "gac_TargetSector": { "gac_sectorindustryid": vItemId }

      };
      var sectorFormData = JSON.stringify({
        "gac_componentsectorassociation": vFdiSectorAssocArray,
      });

      $.ajax({
        type: "POST",
        url: "/content/dam/formsanddocuments-fdm/fdm-ceci.executeDermisQuery.json?",
        data: {
          "operationName": "POST gac_componentsectorassociation /gac_componentsectorassociations",
          "operationArguments": sectorFormData
        },
        success: function (data) {
          console.log(data);
          console.log("data.gac_componentsectorassociationid: " + data.gac_componentsectorassociationid);
        },
        /*  error: function (XMLHttpRequest, textStatus, errorThrown) { console.log("ERROR-AEMCreateFDIProjectComponent-ERROR"); },*/
        cache: false,
        async: false
      });
      /*--->createSectors**********************************************************************/
    }
  }
}

function createCompTRN(componentNode) {
  var fdiProjCompArray = {
    "gac_name": componentNode.gac_name,
    "gac_expectednumberofmeetings": componentNode.gac_expectednumberofmeetings,
    "gac_expectednumberofprospectsreached": componentNode.gac_expectednumberofprospectsreached,
    "gac_expectednumberofpeopletrained": componentNode.gac_expectednumberofpeopletrained,
    "gac_expectedcomponentcost": 11.11,
    "gac_fdicomponentamountrequested": 22.22,
    "gac_fdicomponentamountapproved": 33.33,
    "gac_pastexperience": "There is a lot of experience, but not relevant to this :)",
    "gac_objective": "gac_objective. Funding for foreign investment",
    "gac_Proposal": { "egcs_fc_profileid": vEgcs_fc_profileid },
    "gac_CallForProposal": { "egcs_fo_profileid": vEgcs_fo_profileid },
    "gac_Program": { "egcs_tp_profileid": "1edcab5b-80a4-ea11-969c-005056816b76" },
    "gac_Applicant": { "accountid": strProposal.proposal.globalids.accountid},
    "gac_FDIComponentCategory": { "gac_fdicomponentcategoryid": componentNode.gac_fdicomponentcategoryid},
    "gac_CallYear": { "gac_timeperiodid": "62145559-b004-eb11-96a4-00505681cf84" }
  };
  // only shows [object,object]...console.log("fdiProjCompArray:"+fdiProjCompArray);
  var componentFormData = JSON.stringify({
    "gac_fdiprojectcomponent": fdiProjCompArray,
  });

  $.ajax({
    type: "POST",
    url: "/content/dam/formsanddocuments-fdm/fdm-ceci.executeDermisQuery.json?",
    data: {
      "operationName": "POST gac_fdiprojectcomponent /gac_fdiprojectcomponents",
      "operationArguments": componentFormData
    },
    success: function (data) {
      console.log(data); console.log("data.gac_fdiprojectcomponentid: " + data.gac_fdiprojectcomponentid);
      vGac_fdiprojectcomponentid = data.gac_fdiprojectcomponentid;
      componentCatIdObj[componentNode.gac_fdicomponentcategoryid] = vGac_fdiprojectcomponentid;

//      var vAssociationTypes = strProposal.proposal.projectComposition.training.activityTypes;
      var vAssociationTypes = componentNode.activityTypes;
      createActivities(vAssociationTypes, componentNode, vGac_fdiprojectcomponentid); //"0d05855c-9101-eb11-b82b-005056bf50dd"
//    createActivities(vAssociationTypes, strProposal.proposal.projectComposition.training, vGac_fdiprojectcomponentid); //"0d05855c-9101-eb11-b82b-005056bf50dd"
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      console.log("Error-POST gac_fdiprojectcomponent-inline");
    },
    cache: false,
    async: false
  }); // end of ajax-createCompTRN
  return vGac_fdiprojectcomponentid; // end of ajax-createCompTRN
} // end of function createCompTRN

function doExpenses(objExpenses) {  //}, gacComponent, vGac_fdiprojectcomponentid) {
  console.log("inside function doExpenses");
  //    var objExpenses = strProposal.proposal.projectComposition.training.activityTypes;

  var vItemLen = objExpenses.length; console.log("vItemLen:" + vItemLen);
  for (var i = 0; i < vItemLen; i++) {
    var vItem = objExpenses[i];
    if (vItem.expenseType == "") {
      console.log("id is empty");
    } else { strProposal.proposal.expectedCost.otherExpenses.expense.fdi
      var vItemDescription = vItem.expenseType;
      var vFdiComponentCategoryID = vItem.fdicomponentcategoryid;      vFdiComponentCategoryID = vFdiComponentCategoryID.trim();
      var vUomID = vItem.unitOfMeasurementID;  vUomID = vUomID.trim();
      var vExpenseTypeID = vItem.expenseTypeID;  vExpenseTypeID = vExpenseTypeID.trim();
      console.log("vItemDescription:" + vItemDescription + ", vFdiComponentCategoryID:" + vFdiComponentCategoryID + "--");
      var vExpenseArray = {
        "gac_name": vItem.expenseName,
        "shortDesc": vItem.shortDesc,
        "purpose": vItem.purpose,
        "gac_costperunit": vItem.costPerUnit,
        "gac_numberofunits": vItem.numberOfUnits,
        "timeframeFrom": vItem.timeframeFrom,
        "timeframeTo": vItem.timeframeTo,
        "otherFederalContribution": vItem.otherFederalContribution,
        // "expenseName": vItem.expenseName,
        "gac_externalfundingsources": vItem.expenseName,
        "gac_Program": { "egcs_tp_profileid": vEgcs_tp_profileid },
        "gac_CallForProposal": { "egcs_fo_profileid": vEgcs_fo_profileid },
        "gac_Proposal": { "egcs_fc_profileid": vEgcs_fc_profileid },
//        "gac_FDIComponentCategory": { "gac_fdicomponentcategoryid": strProposal.proposal.projectComposition.leadGeneration.gac_fdicomponentcategoryid },
        "gac_FDIExpenseType": { "gac_fdiexpensetypeid": vExpenseTypeID},
        "gac_FDIProjectComponent": { "gac_fdiprojectcomponentid": componentCatIdObj[vFdiComponentCategoryID]},
        "gac_FDIComponentCategory": {"gac_fdicomponentcategoryid": vFdiComponentCategoryID},
        "gac_CallYear": { "gac_timeperiodid": "62145559-b004-eb11-96a4-00505681cf84" },
        "gac_UnitOfMeasurement": { "gac_unitofmeasurementid": vUomID}
      };
      var budgetItemFormData = JSON.stringify({
        "gac_fdibudgetitem": vExpenseArray,
      });
      console.log("gac_fdicomponentcategoryid[0]="+componentCatIdObj[strProposal.proposal.projectComposition.strategy.gac_fdicomponentcategoryid]);

       $.ajax({
        type: "POST",
        url: "/content/dam/formsanddocuments-fdm/fdm-ceci.executeDermisQuery.json?",
        data: {
          "operationName": "POST gac_fdibudgetitem /gac_fdibudgetitems",
          "operationArguments": budgetItemFormData
        },
        success: function (data) {
          console.log(data);
          console.log("data.gac_fdibudgetitemid: " + data.gac_fdibudgetitemid);
        },
        //*  error: function (XMLHttpRequest, textStatus, errorThrown) { console.log("ERROR-AEMCreateFDIProjectComponent-ERROR"); },
        cache: false,
        async: false
      });
      /*--->createSectors**********************************************************************/
    }
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
        "gac_ComponentCategory": { "gac_fdicomponentcategoryid": gacComponent.gac_fdicomponentcategoryid},
        "gac_FDIProjectComponent": { "gac_fdiprojectcomponentid": Gac_FdiFrojectComponentId }
      };
      var activityFormData = JSON.stringify({
        "gac_componentactivityassociation": vFdiActAssocArray,
      });

      $.ajax({
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
        /*  error: function (XMLHttpRequest, textStatus, errorThrown) { console.log("ERROR-AEMCreateFDIProjectComponent-ERROR"); },*/
        cache: false,
        async: false
      });
      /*--->CreateActivity**********************************************************************/
    }
  }
}
//start block comment w/insertion point at next line

 function initcomponentCategoryArray(strProposal){
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


//start block comment above this line
/*var strProposal = {
  "proposal": {
    "basicInfo": {
      "projectInfo": {
        "proposalName": "Proposal name",
        "startDate": "2020-01-01",
        "endDate": "2020-12-12",
        "primaryContact": "Contact name",
        "signingAuthority": "Authority name"
      },
      "fdiStratgey": {
        "overview": "Lacinia vitae duis sollicitudin consectetur mollis montes vitae interdum id sapien commodo. Convallis pellentesque leo ultricies. Eu phasellus, praesent vestibulum habitant. Proin, sociosqu ut nullam? Lorem velit quam praesent mauris nunc ante morbi semper vestibulum auctor lacus. Sociosqu felis pretium ornare facilisi lacinia torquent? Imperdiet metus eget aliquet. Platea nunc placerat vulputate in eleifend condimentum est curabitur dis velit. Tellus dui erat bibendum tristique lacinia in auctor rutrum est!.\n\nId mauris tempus ridiculus pretium velit pretium diam. Ultricies neque est pretium habitant arcu ut habitasse suspendisse. Donec semper euismod parturient congue sed? Ullamcorper dictum proin nisl massa dui orci curabitur mi ac phasellus vivamus molestie! Potenti nec aptent magna vehicula tincidunt accumsan non lacinia massa ante. In ut lacus penatibus mauris ad! Primis torquent, consectetur lectus accumsan. Non habitasse himenaeos.",
        "background": "Platea ultrices gravida torquent, dolor donec tristique! Sed ultricies elit nulla. Sit nostra leo a velit integer magna. Amet ut tortor parturient nascetur odio aliquet mus magnis. Blandit litora conubia auctor cubilia facilisis interdum convallis. Aptent penatibus tempor nascetur sit auctor. Bibendum turpis egestas eget ullamcorper erat elementum turpis. Ipsum luctus tincidunt, blandit quisque. Tellus lacus cubilia sapien habitasse quisque etiam. Senectus placerat ultricies congue semper scelerisque pellentesque proin. Metus duis sodales laoreet aenean tempor.",
        "alignment": "Ipsum; molestie netus tincidunt ullamcorper imperdiet sociosqu luctus mauris ullamcorper fringilla malesuada. Lacinia vitae duis sollicitudin consectetur mollis montes vitae interdum id sapien commodo. Convallis pellentesque leo ultricies. Eu phasellus, praesent vestibulum habitant. Proin, sociosqu ut nullam? Lorem velit quam praesent mauris nunc ante morbi semper vestibulum auctor lacus. Sociosqu felis pretium ornare facilisi lacinia torquent? Imperdiet metus eget aliquet. Platea nunc placerat vulputate in eleifend condimentum est curabitur dis velit. Tellus dui erat bibendum tristique lacinia in auctor rutrum est!.\n\nId mauris tempus ridiculus pretium velit pretium diam. Ultricies neque est pretium habitant arcu ut habitasse suspendisse. Donec semper euismod parturient congue sed? Ullamcorper dictum proin nisl massa dui orci curabitur mi ac phasellus vivamus molestie! Potenti nec aptent magna vehicula tincidunt accumsan non lacinia massa ante. In ut lacus penatibus mauris ad! Primis torquent, consectetur lectus accumsan. Non habitasse himenaeos."
      }
    },
    "projectComposition": {
      "training": {
        "haveComponentYN": "1",
        "description": "Aptent penatibus tempor nascetur sit auctor. Bibendum turpis egestas eget ullamcorper erat elementum turpis. Ipsum luctus tincidunt, blandit quisque. Tellus lacus cubilia sapien habitasse quisque etiam. Senectus placerat ultricies congue semper scelerisque pellentesque proin. Metus duis sodales laoreet aenean tempor.",
        "numberOfTrainee": "1",
        "activityTypes": {
          "item": [
            {
              "description": "*FR*FDI Training - Course",
              "id": "5645d14e-9201-eb11-b82b-005056bf50dd"
            },
            {
              "id": "",
              "description": ""
            }
          ]
        },
        "timeframeFrom": "2020-06-01",
        "timeframeTo": "2020-06-05",
        "previouslyFunded": "1",
        "gac_name": "Formation en IDE",
        "gac_fdicomponentcategoryid": "0d05855c-9101-eb11-b82b-005056bf50dd"
      },
      "strategy": {
        "haveComponentYN": "",
        "gac_name": "",
        "gac_fdicomponentcategoryid": "",
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
        "timeframeFrom": "",
        "timeframeTo": "",
        "previouslyFunded": "",
        "havePastExperience": "",
        "experienceDescription": ""
      },
      "toolsAndMaterials": {
        "haveComponentYN": "",
        "gac_name": "",
        "gac_fdicomponentcategoryid": "",
        "description": "",
        "numberOfPartners": "",
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
          "item": [
            {
              "description": "*FR*Meeting in Canada with Potential Foreign Investors",
              "id": "cb21529b-9101-eb11-b82b-005056bf50dd"
            },
            {
              "id": "",
              "description": ""
            }
          ]
        },
        "sectors": {
          "item": [
            {
              "description": "Technologies Environnementales",
              "id": "7e7fd21e-9101-eb11-b82b-005056bf50dd"
            },
            {
              "id": "",
              "description": ""
            }
          ]
        },
        "markets": {
          "item": [
            {
              "description": "Belgique",
              "id": "7dc734ae-9001-eb11-b82b-005056bf50dd"
            },
            {
              "id": "",
              "description": ""
            }
          ]
        },
        "timeframeFrom": "2020-06-01",
        "timeframeTo": "2020-06-05",
        "previouslyFunded": "1",
        "havePastExperience": "0",
        "experienceDescription": "Aptent penatibus tempor nascetur sit auctor. Bibendum turpis egestas eget ullamcorper erat elementum turpis. Ipsum luctus tincidunt, blandit quisque. Tellus lacus cubilia sapien habitasse quisque etiam. Senectus placerat ultricies congue semper scelerisque pellentesque proin. Metus duis sodales laoreet aenean tempor.",
        "travelAbroad": "1",
        "missions": {
          "item": [
            {
              "description": "Ahmedabad - AMDBD",
              "id": "0174f071-b913-eb11-b82b-005056bf50dd"
            },
            {
              "description": "Chandigarh - CHADG",
              "id": "3f74f071-b913-eb11-b82b-005056bf50dd"
            },
            {
              "description": "Chongqing - CHONQ",
              "id": "4574f071-b913-eb11-b82b-005056bf50dd"
            },
            {
              "id": "",
              "description": ""
            }
          ]
        },
        "gac_name": "Génération de pistes d’investissement et rencontres avec des investisseurs potentiels",
        "gac_fdicomponentcategoryid": "eba10b46-9101-eb11-b82b-005056bf50dd"
      }
    },
    "expectedCost": {
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
      "otherExpenses": {
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
          "totalEstimatedExpense": "",
          "totalEligibleExpense": "",
          "requestedProgramFunding": "0"
        },
        "strategy": {
          "totalEstimatedExpense": "",
          "totalEligibleExpense": "",
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
          "totalEstimatedExpense": "",
          "totalEligibleExpense": "",
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
          "totalEstimatedExpense": "",
          "totalEligibleExpense": "",
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
        }
      }
    },
    "performanceMeasures": "",
    "strategicPartnerships": {
     "description": "Strategic Partnerships Explain blah",
     "financialPartnerships": {
         "partnership": [
             {
                 "partner": "Partner1",
                 "contact": "contact1",
                 "contributionToInitiative": "1000",
                 "confirmed": "yes"
             },
             {
                 "partner": "Partner2",
                 "contact": "Contact2",
                 "contributionToInitiative": "2222",
                 "confirmed": "no"
             }
         ]
     },
     "fundingToThirdPartyRecipients": "",
     "numberOfTargets": "",
     "numberOfLeads": "",
     "numberOfProspects": "",
     "increaseAwareness": "",
     "contributeToServices": ""
 },
 "strategicPartnershipss": {
      "thirdPartyRecipients": {
        "recipient": ""
      }
    },
    "projectGovernance": "",
    "workPlan": {
      "plan": {
        "componentTitle": "",
        "timeframeFrom": "",
        "timeframeTo": ""
      }
    },
    "globalids": {
      "accountid": "CF938AA4-D81D-EB11-96A6-00505681CF84",
      "contactid": "ebe88e6b-8823-eb11-96a7-005056815722",
      "egcs_tp_profileid": "",
      "egcs_fo_profileid": ""
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
 */
 

 