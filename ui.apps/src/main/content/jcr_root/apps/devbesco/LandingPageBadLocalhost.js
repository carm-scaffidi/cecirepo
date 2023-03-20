console.log("landingPage-Aug5a-bb");
//Aug5-added lang code below
var urlParams = new URLSearchParams(window.location.search);
var lang = urlParams.get('afAcceptLang');
setDebugMode();

get_tp_profile(); //get "Program" id and name = "FDI CanExport"
getSetFoProfileId(); //sessionStorage.setItem("foprofileid", "68995D00-B104-EB11-96A4-00505681CF84");

tblContAcct.visible = false;
eamid.value = sessionStorage.getItem("eamid");
var vEamid = sessionStorage.getItem("eamid");
var operationArguments = JSON.stringify({
    "gac_GetContactByEAMID_EAMID": vEamid
});
console.log("1-operationArguments: " + operationArguments);
var operationName = "gac_GetContactByEAMID()";
//var operationArguments = vEamContactOpArgs;
var vContactData = execCRMService(operationName, operationArguments);


{/*$.ajax({
    type: "POST",
    url: "/content/dam/formsanddocuments-fdm/fdm-ceci.executeDermisQuery.json?",
    data: {
        "operationName": "gac_GetContactByEAMID()",
        "operationArguments": ContactoperationArguments
    },
    success: function (data, textStatus, jqXHR) {
*/}
        if (vContactData == null) {
            console.log("--> Contact is null");
            emailaddress.visible = true;
            gac_GetContactByEmail_EmailAddress.visible = true;
            txPleaseEnterInvite.visible = true;
        } else {
            console.log("vContactData:"+vContactData); 
            console.log("vContactData.contactid:" + vContactData.contactid);
            console.log("***********did it get here?");
            contactid.value = vContactData.contactid;
            sessionStorage.setItem("contactid", vContactData.contactid);
    
            var ContactoperationArguments = JSON.stringify({
                "contactid": contactid.value
            });
            console.log("ContactoperationArguments " + ContactoperationArguments);
            var operationName = "GET contact /contacts";
            var operationArguments = ContactoperationArguments;
            var vContactData = execCRMService(operationName, operationArguments);

            {/*             $.ajax({
                type: "POST",
                url: "/content/dam/formsanddocuments-fdm/fdm-ceci.executeDermisQuery.json?",
                data: {
                    "operationName": "GET contact /contacts",
                    "operationArguments": ContactoperationArguments
                },
                success: function (data, textStatus, jqXHR) {
                */}
            console.log("1-vContactData:"+vContactData); console.log("vContactData[0].egcs_PrimaryAccount.accountid:" + vContactData[0].egcs_PrimaryAccount.accountid); console.log("vContactData[0].firstname:" + vContactData[0].firstname);
            Row2.firstname.value = vContactData[0].firstname;
            tblProposals.Row1.fullname.value = vContactData[0].fullname;
            sessionStorage.setItem("fullname", vContactData[0].fullname);

            sessionStorage.setItem("emailaddress1", vContactData[0].emailaddress1);
            sessionStorage.setItem("telephone1", vContactData[0].telephone1);

            sessionStorage.setItem("accountid", vContactData[0].egcs_PrimaryAccount.accountid);
            continue2application.visible = true;
            var accountOperationArguments = JSON.stringify({
                "accountid": sessionStorage.getItem("accountid")
            });
            console.log("accountOperationArguments:" + accountOperationArguments);

            var operationName = "GET account /accounts";
            var operationArguments = accountOperationArguments;
            //start servlet impl                    
            {
                var vAccountData = execCRMService(operationName, operationArguments);
                if (getDebugMode()) { console.log("1-vAccountData:" + vAccountData); }
                console.log("2-vAccountData:" + vAccountData); console.log("vAccountData[0].name:" + vAccountData[0].name);
                console.log("vAccountData[0].accountid:" + vAccountData[0].accountid);
                tblProposals.Row1.name.value = vAccountData[0].name;
                sessionStorage.setItem("organizationName:", vAccountData[0].name);
                Start.enabled = true;
                section1.visible = true;
                pnlGetContactInfo.visible = false;

                var callStatus = checkCFP4StartClose();
                console.log("callStatus: " + callStatus);

                //cBeforeCallStart, cAfterCallClose, cDuringCall                          
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
                    console.log("between start and close");
                    sessionStorage.setItem("gac-aem-appId", vRdmsTargetEnvProposalAppId);
                    console.log("gac-aem-appId: " + vRdmsTargetEnvProposalAppId);
                    var vDraftId = getDraftId(sessionStorage.getItem("accountid"), sessionStorage.getItem("foprofileid"));
                    if ((vDraftId === null || vDraftId === "")) {
                        tblProposals.Row1.Start.title = "Start";
                        var vProfileID = createStubProposal();
                        sessionStorage.setItem("fcprofileid", vProfileID);
                    }
                    else {
                        tblProposals.Row1.Start.title = "Edit";
                        sessionStorage.setItem("gac_saveddraftid", vDraftId);
                    }
                }
            }
            {// comment ajax section
                var foo = 2;
                /*                     $.ajax({
                                        type: "POST",
                                        url: "/content/dam/formsanddocuments-fdm/fdm-ceci.executeDermisQuery.json?",
                                        data: {
                                            "operationName": "GET account /accounts",
                                            "operationArguments": accountOperationArguments
                                        },
                                        success: function (data, textStatus, jqXHR) { // HAPPY PATH - 
                                            console.log(data); console.log("data[0].name" + data[0].name);
                                            console.log("data[0].accountid" + data[0].accountid);
                                            tblProposals.Row1.name.value = data[0].name;
                                            sessionStorage.setItem("organizationName", data[0].name);
                                            Start.enabled = true;
                                            section1.visible = true;
                                            pnlGetContactInfo.visible = false;
                
                                            var callStatus = checkCFP4StartClose();
                                            console.log("callStatus: " + callStatus);
                
                                            //cBeforeCallStart, cAfterCallClose, cDuringCall                          
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
                                                console.log("between start and close");
                                                sessionStorage.setItem("gac-aem-appId",vRdmsTargetEnvProposalAppId);
                                                console.log("gac-aem-appId: " + vRdmsTargetEnvProposalAppId); 
                                                var vDraftId = getDraftId(sessionStorage.getItem("accountid"), sessionStorage.getItem("foprofileid"));
                                                if ((vDraftId === null || vDraftId === "")) {
                                                    tblProposals.Row1.Start.title = "Start";
                                                    var vProfileID = createStubProposal();
                                                    sessionStorage.setItem("fcprofileid", vProfileID);
                                                }
                                                else {
                                                    tblProposals.Row1.Start.title = "Edit";
                                                    sessionStorage.setItem("gac_saveddraftid", vDraftId);
                                                }
                                            }
                                        },
                                        error: function (XMLHttpRequest, textStatus, errorThrown) { console.log("ERROR-GETaccountData  - Click");
                                        },
                                        cache: false,
                                        async: false
                                    });
                 */
            }

{/*                 error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("setContact -error");
                },
                cache: false,
                async: false
            });
        */}
        }
/*     },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log("setContact -error");
    },
    cache: false,
    async: false
}); */

