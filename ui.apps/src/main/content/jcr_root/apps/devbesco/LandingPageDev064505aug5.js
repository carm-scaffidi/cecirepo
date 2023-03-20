



setDebugMode();
console.log("landingPage-Init-getDebugMode:" + getDebugMode());
get_tp_profile(); //get "Program" id and name = "FDI CanExport"
getSetFoProfileId(); //sessionStorage.setItem("foprofileid", "68995D00-B104-EB11-96A4-00505681CF84");

tblContAcct.visible = false;
eamid.value = sessionStorage.getItem("eamid");
var vEamid = sessionStorage.getItem("eamid");
var ContactoperationArguments = JSON.stringify({
    "gac_GetContactByEAMID_EAMID": vEamid
});
console.log("ContactoperationArguments " + ContactoperationArguments);

$.ajax({
    type: "POST",
    url: "/content/dam/formsanddocuments-fdm/fdm-ceci.executeDermisQuery.json?",
    data: {
        "operationName": "gac_GetContactByEAMID()",
        "operationArguments": ContactoperationArguments
    },
    success: function (data, textStatus, jqXHR) {
        console.log(data); console.log("data.contactid:" + data.contactid);
        contactid.value = data.contactid;
        sessionStorage.setItem("contactid", data.contactid);
        if (data === 'null') {
            console.log("--> Contact is null");
            emailaddress.visible = true;
            gac_GetContactByEmail_EmailAddress.visible = true;
            txPleaseEnterInvite.visible = true;
        } else {
            var ContactoperationArguments = JSON.stringify({
                "contactid": contactid.value
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
                    console.log(data); console.log("data[0].egcs_PrimaryAccount.accountid:" + data[0].egcs_PrimaryAccount.accountid); console.log("data[0].firstname:" + data[0].firstname);
                    Row2.firstname.value = data[0].firstname;
                    tblProposals.Row1.fullname.value = data[0].fullname;
                    sessionStorage.setItem("fullname", data[0].fullname);

                    sessionStorage.setItem("emailaddress1", data[0].emailaddress1);
                    sessionStorage.setItem("telephone1", data[0].telephone1);

                    sessionStorage.setItem("accountid", data[0].egcs_PrimaryAccount.accountid);
                    continue2application.visible = true;
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

