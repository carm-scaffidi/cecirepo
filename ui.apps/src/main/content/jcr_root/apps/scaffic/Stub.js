/*
Stub.js:    ui.apps\src\main\content\jcr_root\apps\scaffic\Stub.js

Purpose:    To insert new Code that requires formating or updating in an existing or new ClientLib file.
*/

console.log("LandingPage"	+ ": " + "Root Panel - Initialize"			 + ": " + "Aug11A" + " " + "2022");
// A ton-o-comments were deleted--- see 'backup' for details
// 
var urlParams = new URLSearchParams(window.location.search);
var lang = urlParams.get('afAcceptLang');
setDebugMode();
sessionStorage.setItem("gac_saveddraftid", ""); //besco-init 'gac_saveddraftid' since it may have a 'get' later

var vContactDataStr = sessionStorage.getItem("contactObj"); //
var vContactData = JSON.parse(vContactDataStr);

if (vContactData === null) {
    console.log("--> Contact is null");
    emailaddress.visible = true;
    gac_GetContactByEmail_EmailAddress.visible = true;
    txPleaseEnterInvite.visible = true;
    // this was done at the top -->sessionStorage.setItem("gac_saveddraftid", ""); //besco-Sep30 = create the proposalStub if this value is empty string.

} else {
    console.log("vContactData:" + vContactData);
    //name.value = vContactData.fullname;  
    txContact.value = vContactData.fullname;
    txOrganization.value = vContactData.egcs_PrimaryAccount.egcs_operatingname_en;
    var vObjData = getFcProfileObjArray(vContactData.egcs_PrimaryAccount.accountid);
    egcs_name_enCFP.value = sessionStorage.getItem("cfp"); //cfp 
    Proposal.value = sessionStorage.getItem("proposalName"); //proposalName

    continue2application.visible = true;

    if (!Array.isArray(vObjData)) {
        console.log("There is NO array of data");
    
    
    
       if (vObjData.result.toLowerCase() === ("No response").toLowerCase())
            console.log("No Proposal Yet");
    }
    else { // there is an array of Proposal(s) for this ACCOUNT
        section1.visible = true;
        pnlGetContactInfo.visible = false;
    
    
    
     // loop through Proposals
        for (var i = 0; i < vObjData.length; i++) {
            var obj = vObjData[i];
            var callStatus = checkCFP4StartClose();
            console.log(obj.gac_CallYear.gac_period);
            if (obj.gac_CallYear.gac_period == "2023") {
                console.log("between start and close");
                // callStatus = "cDuringCall";
                guideRootPanel.section1.pnlLandingPage.tblProposals.Row1.egcs_name_enCFP.value = obj.egcs_FundingOpportunity.egcs_name; //cfp
                tblProposals.Row1.Proposal.value = obj.egcs_name;
                continue2application.visible = true;
    
    
    
               section1.visible = true;
                pnlGetContactInfo.visible = false;
    
    
    
               //                    var callStatus = checkCFP4StartClose();
                console.log("callStatus: " + callStatus);
    
    
    
               if (callStatus == "cBeforeCallStart") {
                    console.log("  Today is less than start");
                    tblProposals.Row1.Start.title = "Inactive";
                    tblProposals.Row1.Start.enabled = false;
                }
                else if (callStatus == "cAfterCallClose") {
                    console.log(" is greater than close");
                    tblProposals.Row1.Start.title = "Closed";
                    tblProposals.Row1.Start.enabled = false;
                }
                else {
                    if ((sessionStorage.getItem("gac_fundingapplicationstatus")) == "810510001") {
                        tblProposals.Row1.Start.title = "Submitted";
                        tblProposals.Row1.Start.enabled = false;
                    }
                    else {
                        console.log("between start and close");
                        sessionStorage.setItem("gac-aem-appId", vRdmsTargetEnvProposalAppId);
                        console.log("gac-aem-appId: " + vRdmsTargetEnvProposalAppId);
                        var vDraftId = getDraftId(sessionStorage.getItem("accountid"), sessionStorage.getItem("foprofileid"));
                        sessionStorage.setItem("gac_saveddraftid", vDraftId);
                        if ((vDraftId === null || vDraftId === "")) {
                            //            var vProfileID = createStubProposal();tblProposals.Row1.Proposal,COMPONENT
                            //            sessionStorage.setItem("fcprofileid", vProfileID);tblProposalsPrevious.Row1.Proposal,COMPONENT
                            Start.enabled = true;
                            statuscode.value = 1;
                        }
                        else {
                            statuscode.value = 1;
                            var buttonValues = getProposalButtonLabelEnable(obj.statuscode);// the following 3 lines added to get and return button title and dis/enable
                            section1.pnlLandingPage.tblProposals.Row1.statuscode.value = buttonValues[2];
                            section1.pnlLandingPage.tblProposals.Row1.Start.title = buttonValues[0];
                            section1.pnlLandingPage.tblProposals.Row1.Start.enabled = buttonValues[1];
                        }
                    }
                }
            }
            else {
                console.log("obj.gac_CallYear.gac_period" + obj.gac_CallYear.gac_period);
              guideRootPanel.section1.pnlLandingPage.tblProposalsPrevious.Row1.oegcs_name_enCFP.value = obj.egcs_FundingOpportunity.egcs_name;
              tblProposalsPrevious.Row1.oProposal.value = obj.egcs_name;
            }
        }
    }
    }
    