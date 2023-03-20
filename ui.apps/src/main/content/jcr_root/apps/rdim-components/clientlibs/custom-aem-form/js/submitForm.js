function alert22()
{
    if( $(".canada-interest-cb input[type='checkbox']").prop("checked") == true){
                alert("Checkbox is checked.");
            }
            else if($(".canada-interest-cb input[type='checkbox']").prop("checked") == false){
                alert("Checkbox is unchecked.");
            }

  alert(getCookie("usr_id"));
}

var getPortaluserInfo = function (cname) {
        var retObj = "";

        var portalID = JSON.stringify({
            "je_portaluserregistrationid":getCookie('usr_id'),
        });

        $.ajax({type: "POST",
        url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
        data: { "operationName": "GET je_portaluserregistration /je_portaluserregistrations_15578098587470", "operationArguments": portalID},
        success:function(data,textStatus,jqXHR ){
            currentProfileId = data[0].egcs_fc_profileid;
            retObj = data[0];

        }, error: function(XMLHttpRequest, textStatus, errorThrown) {
            //     //error
        },
            cache: false,
            async: false
        });
		return retObj;
}



// Interest List
function cboCanada()
{
    var canadachecked= {"je_marketinglistprospectcanada": $(".canada-interest-cb input[type='checkbox']").prop("checked")};
    var guid = getCookie("usr_id");
    //alert(guid);
    var salutationDataObject = JSON.stringify({
        "je_portaluserregistration_je_portaluserregistrationid":guid,
        "je_portaluserregistration":canadachecked,
        });

    $.ajax({type: "POST",
        url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
        data: {"operationName": "PUT je_portaluserregistration /je_portaluserregistrations_15578098587482", "operationArguments": salutationDataObject},
        success:function(data,textStatus,jqXHR ){
            console.log("salutation updated");

        }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                //error
        }
    });
}

function cboScholarships()
{
    var canadachecked= {"je_marketinglistprospectscholarships": $(".scholarships-interest-cb input[type='checkbox']").prop("checked")};
    var guid = getCookie("usr_id");
    //alert(guid);
    var salutationDataObject = JSON.stringify({
        "je_portaluserregistration_je_portaluserregistrationid":guid,
        "je_portaluserregistration":canadachecked,
        });

    $.ajax({type: "POST",
        url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
        data: {"operationName": "PUT je_portaluserregistration /je_portaluserregistrations_15578098587482", "operationArguments": salutationDataObject},
        success:function(data,textStatus,jqXHR ){
            console.log("salutation updated");

        }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                //error
        }
    });
}

function cboNetworkingEvents()
{
    var canadachecked= {"je_marketinglistprospectnetworkingandevents": $(".networking-interest-cb input[type='checkbox']").prop("checked")};
    var guid = getCookie("usr_id");
    //alert(guid);
    var salutationDataObject = JSON.stringify({
        "je_portaluserregistration_je_portaluserregistrationid":guid,
        "je_portaluserregistration":canadachecked,
        });

    $.ajax({type: "POST",
        url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
        data: {"operationName": "PUT je_portaluserregistration /je_portaluserregistrations_15578098587482", "operationArguments": salutationDataObject},
        success:function(data,textStatus,jqXHR ){
            console.log("salutation updated");

        }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                //error
        }
    });
}

function cboSuccessStories()
{
    var canadachecked= {"je_marketinglistprospectstorytestimonial": $(".successstories-interest-cb input[type='checkbox']").prop("checked")};
    var guid = getCookie("usr_id");
    //alert(guid);
    var salutationDataObject = JSON.stringify({
        "je_portaluserregistration_je_portaluserregistrationid":guid,
        "je_portaluserregistration":canadachecked,
        });

    $.ajax({type: "POST",
        url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
        data: {"operationName": "PUT je_portaluserregistration /je_portaluserregistrations_15578098587482", "operationArguments": salutationDataObject},
        success:function(data,textStatus,jqXHR ){
            console.log("salutation updated");

        }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                //error
        }
    });
}

function cboEducationSector()
{
    var canadachecked= {"je_marketinglistinstitutioneducationsector": $(".educationSector-interest-cb input[type='checkbox']").prop("checked")};
    var guid = getCookie("usr_id");
    //alert(guid);
    var salutationDataObject = JSON.stringify({
        "je_portaluserregistration_je_portaluserregistrationid":guid,
        "je_portaluserregistration":canadachecked,
        });

    $.ajax({type: "POST",
        url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
        data: {"operationName": "PUT je_portaluserregistration /je_portaluserregistrations_15578098587482", "operationArguments": salutationDataObject},
        success:function(data,textStatus,jqXHR ){
            console.log("salutation updated");

        }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                //error
        }
    });
}

function cboFundingOpportunities()
{
    var canadachecked= {"je_marketinglistinstitutionfundingopportunit": $(".fundingOpportunities-interest-cb input[type='checkbox']").prop("checked")};
   // var canadachecked= {"je_marketinglistinstitutionsuccessstories": $(".fundingOpportunities-interest-cb input[type='checkbox']").prop("checked")};
    var guid = getCookie("usr_id");
    //alert(guid);
    var salutationDataObject = JSON.stringify({
        "je_portaluserregistration_je_portaluserregistrationid":guid,
        "je_portaluserregistration":canadachecked,
        });

    $.ajax({type: "POST",
        url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
        data: {"operationName": "PUT je_portaluserregistration /je_portaluserregistrations_15578098587482", "operationArguments": salutationDataObject},
        success:function(data,textStatus,jqXHR ){
            console.log("salutation updated");

        }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                //error
        }
    });
}

function cboInstitutionSuccessStories()
{                        
    var canadachecked= {"je_marketinglistinstitutionsuccessstories": $(".institutionSuccessStories-interest-cb input[type='checkbox']").prop("checked")};
    var guid = getCookie("usr_id");
    //alert(guid);
    var salutationDataObject = JSON.stringify({
        "je_portaluserregistration_je_portaluserregistrationid":guid,
        "je_portaluserregistration":canadachecked,
        });

    $.ajax({type: "POST",
        url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
        data: {"operationName": "PUT je_portaluserregistration /je_portaluserregistrations_15578098587482", "operationArguments": salutationDataObject},
        success:function(data,textStatus,jqXHR ){
            console.log("salutation updated");

        }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                //error
        }
    });
}

function cboInstitutionEvent()
{
    var canadachecked= {"je_marketinglistinstitutionevents": $(".institutionEvent-interest-cb input[type='checkbox']").prop("checked")};
    var guid = getCookie("usr_id");
    //alert(guid);
    var salutationDataObject = JSON.stringify({
        "je_portaluserregistration_je_portaluserregistrationid":guid,
        "je_portaluserregistration":canadachecked,
        });

    $.ajax({type: "POST",
        url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
        data: {"operationName": "PUT je_portaluserregistration /je_portaluserregistrations_15578098587482", "operationArguments": salutationDataObject},
        success:function(data,textStatus,jqXHR ){
            console.log("salutation updated");

        }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                //error
        }
    });
}

function cboMarketingProfiles()
{
    var canadachecked= {"je_marketinglistinstitutionmarketingprofiles": $(".marketingProfiles-interest-cb input[type='checkbox']").prop("checked")};
    var guid = getCookie("usr_id");
    //alert(guid);
    var salutationDataObject = JSON.stringify({
        "je_portaluserregistration_je_portaluserregistrationid":guid,
        "je_portaluserregistration":canadachecked,
        });

    $.ajax({type: "POST",
        url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
        data: {"operationName": "PUT je_portaluserregistration /je_portaluserregistrations_15578098587482", "operationArguments": salutationDataObject},
        success:function(data,textStatus,jqXHR ){
            console.log("salutation updated");

        }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                //error
        }
    });
}

//Function for getting DOR

/*function nextClick(currentPanel){
    alert("This is Test");

    var myList = [];
    if(guideBridge.validate(myList,currentPanel.navigationContext.currentItem.somExpression))
    {
        window.guideBridge.setFocus(currentPanel.somExpression,’nextItem’,true);
    }
}   
*/

/**
* Get pdf
* @return {OPTIONS} drop down options 
 */
function getPdf()
{
    console.log("in view pdf");
    window.guideBridge.getDataXML(
        {
        	success: function(result) {
             var formData = new FormData();
             formData.append("dataXml",result.data);
			console.log("got data"+result.data);
           	var settings ={
            				"async": true,
							"url": "/content/AemFormsSamples/getdor.html",
							"method": "POST",
                			data:{'data':result.data},
   						}
            $.ajax(settings).done(function(response)
            {
                console.log("got response");
                window.open(JSON.parse(response).filePath,'_blank');
            })

    	},
    	error:function(guideResultObject) {console.log("got error"); },
        guideState : null,
        boundData  : true});

}

//Function for login

	var validateUserData = function (response) {

        if(response.length>0 && typeof response[0] != "undefined"){
            var currentRecord = response[0];
            setCookie("usr_c",currentRecord.je_firstname,30);
            setCookie("usr_id",currentRecord.je_portaluserregistrationid,30);
            setCookie("usr_l",currentRecord.je_lastname,30);


            $.ajax({
	                      type: "GET",
	                      url: "/bin/services/oauth/login",
	                      cache:false,
	                      //data:{"userName": currentRecord.emailaddress, "familyName": currentRecord.je_firstname},
                		  data:{"userName": currentRecord.je_portaluserregistrationid, "familyName": currentRecord.je_firstname},
	                      success:function(data){

                              if(currentRecord.je_accounttype == 0 && currentRecord.je_ismarketing)
		                    	  window.parent.location.href = "/content/edmsp/ca/en/landing2.html?guid="+currentRecord.je_portaluserregistrationid;
					  		  else if(currentRecord.je_accounttype == 0 && currentRecord.je_isselectioncommittee)
		                    	  window.parent.location.href = "/content/edmsp/ca/en/landing3.html?guid="+currentRecord.je_portaluserregistrationid;
  							  else if(currentRecord.je_accounttype == 0 && !currentRecord.je_ismarketing)
                                  window.parent.location.href = "/content/edmsp/ca/en/landing.html?guid="+currentRecord.je_portaluserregistrationid;
					  		  else if(currentRecord.je_accounttype != 0 && !currentRecord.je_ismarketing)
		                    	  window.parent.location.href = "/content/edmsp/ca/en/landing1.html?guid="+currentRecord.je_portaluserregistrationid;

                              //  window.parent.location.href = "/content/edmsp/ca/en/landing.html";
                              console.log("success");
	                      },
	                      error: function(XMLHttpRequest, textStatus, errorThrown) {
	                    	  alert("error");
	                      }
	             	});
		     }
        };

//Function for setting cookies at login page
var setCookie = function (cname,cvalue,exdays) {
var d = new Date();
d.setTime(d.getTime() + (exdays*24*60*60*1000));
var expires = "expires=" + d.toGMTString();
document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};
  
// Function for getting cookies at login page
var getCookie = function (cname) {
var name = cname + "=";
var decodedCookie = decodeURIComponent(document.cookie);
var ca = decodedCookie.split(';');
for(var i = 0; i < ca.length; i++) {
var c = ca[i];
while (c.charAt(0) == ' ') {
c = c.substring(1);
}
if (c.indexOf(name) == 0) {
return c.substring(name.length, c.length);
}
}
return "";
};

//Function for Profile 

  var getProfileData = function (formObj) 
  {

      //Update Salutation Information 
      var salutationId= {"je_salutationid": formObj.salutation};

      var salutationDataObject = JSON.stringify({
               "je_portaluserregistration_je_portaluserregistrationid":formObj.guid,
               "je_portaluserregistration_je_aem_lookup_update_Salution_PortalUser_salutionId":salutationId,
      });

       $.ajax({type: "POST",
             url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
             data: {"operationName": "je_portaluserregistrations/Microsoft.Dynamics.CRM.je_aem_lookup_update_Salution_PortalUser()_156833572817331", "operationArguments": salutationDataObject},
             success:function(data,textStatus,jqXHR ){
                       console.log("salutation updated");
             }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                      //error
	         }
     });

  };

//Function for setting cookies at login page
 var getRegistrationData = function (formObj) 
    {
        var getregistrationiddataObject = JSON.stringify({
            "je_aemid":formObj.reguniqueid,
        });


				$.ajax({type: "POST",
                         url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
                         data: { "operationName": "GET je_portaluserregistration /je_portaluserregistrations_15578098587470", "operationArguments": getregistrationiddataObject},
                         success:function(data,textStatus,jqXHR ){

                             //Update Salutation Information 
                             var salutationId= {"je_salutationid": formObj.salutation};

                             var salutationDataObject = JSON.stringify({
                                "je_portaluserregistration_je_portaluserregistrationid":data[0].je_portaluserregistrationid,
                                "je_portaluserregistration_je_aem_lookup_update_Salution_PortalUser_salutionId":salutationId,
                                });

                             $.ajax({type: "POST",
                                 url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
                                 data: {"operationName": "je_portaluserregistrations/Microsoft.Dynamics.CRM.je_aem_lookup_update_Salution_PortalUser()_156833572817331", "operationArguments": salutationDataObject},
                                 success:function(data,textStatus,jqXHR ){
                                       top.window.location.href = guideBridge._getThankYouPageFromConfig();
                                     console.log("salutation updated");

                                 }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                                          //error
                                 }
                             });


                         }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                                  console.log("institute updated Error");
                                  //error
                         }
                });
    };


    var getRegistrationDataInstitute = function (formObj) 
    {
        var getregistrationiddataObject = JSON.stringify({
            "je_aemid":formObj.reguniqueid,
        });

				$.ajax({type: "POST",
                         url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
                         data: { "operationName": "GET je_portaluserregistration /je_portaluserregistrations_15578098587470", "operationArguments": getregistrationiddataObject},
                         success:function(data,textStatus,jqXHR ){

							var regid= {"accountid": formObj.institute};

                            //Update Institute Information 
                            var registrationDataObject = JSON.stringify({
                                "je_portaluserregistration_je_portaluserregistrationid":data[0].je_portaluserregistrationid,
                                "je_portaluserregistration_je_aem_lookup_update_account_portalUser245f5f0f34bae911a811000d3af46757_account":regid,
                                });

                             $.ajax({type: "POST",
                                 url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
                                 data: {"operationName": "je_portaluserregistrations/Microsoft.Dynamics.CRM.je_aem_lookup_update_account_portalUser245f5f0f34bae911a811000d3af46757()_156833572817330", "operationArguments": registrationDataObject},
                                 success:function(data,textStatus,jqXHR ){
                                     console.log("institute updated");
                                 }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                                          //error
                                 }
                             });


                            //Update Salutation Information 
                             var salutationId= {"je_salutationid": formObj.salutation};

                             var salutationDataObject = JSON.stringify({
                                "je_portaluserregistration_je_portaluserregistrationid":data[0].je_portaluserregistrationid,
                                "je_portaluserregistration_je_aem_lookup_update_Salution_PortalUser_salutionId":salutationId,
                                });

                             $.ajax({type: "POST",
                                 url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
                                 data: {"operationName": "je_portaluserregistrations/Microsoft.Dynamics.CRM.je_aem_lookup_update_Salution_PortalUser()_156833572817331", "operationArguments": salutationDataObject},
                                 success:function(data,textStatus,jqXHR ){
                                     console.log("salutation updated");

                                 }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                                          //error
                                 }
                             });



                         }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                                  console.log("institute updated Error");
                                  //error
                         },                       
                   cache: false,
                   async: false
                });

         top.window.location.href = guideBridge._getThankYouPageFromConfig();

    };


var getAlertData = function () {
  alert("Test");
}

