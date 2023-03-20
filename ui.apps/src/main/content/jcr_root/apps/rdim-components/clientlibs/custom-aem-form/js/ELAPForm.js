var getSaveData = function (formObj)
{

    //$('<div class="foundation-ui-mask guideServiceLoading"><coral-wait size="L" class="coral3-Wait coral3-Wait--large coral3-Wait--centered" centered=""></coral-wait></div>').appendTo('#guideContainerForm');
$("#loadingPage").addClass("guideServiceLoading");
        var txtFCProfileID = ""; 
        console.log("Load profileData");
        var profileData = {
          //"egcs_fc_profileid":formObj.FCProfileID,
          "je_component": formObj.ProgramComponent,
          "_je_hostinstitution_value": formObj.HostInstitution,
          "egcs_name":formObj.EgcsName,
          "je_aem_unique_key":formObj.EAMID,
          //"_je_cndprogramcoordinator_value": formObj.CDNProgramCoordinator, // Not
          "je_pc_firstname": formObj.OtherFirstName,
          "je_pc_lastname":formObj.OtherLastName,
          "je_pc_jobtitle": formObj.OtherJobTitle,
          "je_pc_department": formObj.OtherDepartment,
          "je_pc_phone": formObj.OtherPhone,
          "je_pc_fax": formObj.OtherFax,
          "je_pc_email": formObj.OtherEmailAddress,
          "je_candidatefirstname": formObj.CandidateFirstname,
          "je_candidatelastname": formObj.CandidateLastname,
          "je_candidateemail": formObj.CandidateEmailAddress,
          "je_contacthomeinstitutionfirstname": formObj.HomeInstitute_Firstname,
          "je_contacthomeinstitutionlastname": formObj.HomeInstitute_Lastname,
          "je_contacthomeinstitutionjobtitle": formObj.HomeInstitute_JobTitle,
          "je_contacthomeinstitutionother": formObj.HomeInstitute_OtherInstitution,
          "je_contacthomeinstitutiondepartment": formObj.HomeInstitute_Department,
          "je_contacthomeinstitutionaddress": formObj.HomeInstitute_Address,
          "je_contacthomeinstitutioncity": formObj.HomeInstitute_City,
          "je_contacthomeinstitutionprovince": formObj.HomeInstitute_Province,
          "je_contacthomeinstitutionpostalcode": formObj.HomeInstitute_PostalCode,
          "je_contacthomeinstitutionemail": formObj.HomeInstitute_Email,
          "je_resesrchsummary": formObj.shp_ResearchProjectSummary,
          "je_scholarshipstartdate": (formObj.shp_scholarshipenddate) ? formObj.shp_scholarshipenddate : "",
          "je_expectedcompletiondate": (formObj.ExpectedDegreeCompletionDate) ? formObj.ExpectedDegreeCompletionDate : "",
          "je_expectedenddateofscholarship": (formObj.shp_scholarshipstartdate) ? formObj.shp_scholarshipstartdate : "",
          "je_collaborationhistory": formObj.shp_collaborationhistory,
          "je_draftstatus": formObj.ActionType
        };

        
        if(formObj.FCProfileID && formObj.FCProfileID.length === 36)
        {
         console.log("xxxxxxxxx  FC Profile ID we do have it  xxxxxxxxx");
         
          var inputs = JSON.stringify({
            "egcs_fc_profile_egcs_fc_profileid": formObj.FCProfileID,
            "egcs_fc_profile": profileData    
          });
        
          $.ajax({type: "POST",
                   url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
                   data: { "operationName": "PUT egcs_fc_profile /egcs_fc_profiles_15211063490100", "operationArguments": inputs},           
                   cache: false,
                   async: false,
                   success:function(data,textStatus,jqXHR ){
                     console.log("in success");
                    //  var FCprofileID = getCRMDataTemp(formObj,clickType);
                    //  console.log ("FCprofileID " + FCprofileID);
                    txtFCProfileID = formObj.FCProfileID;
                    getCRMData(formObj);

                   }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                       // $(".guideServiceLoading").remove();
                     console.log("in error");
                   }
                  });
          } 
          else 
          {
            console.log("xxxxxxxxx  FC Profile ID we do NOT have it xxxxxxxxx");
                var saveInputsnputs = JSON.stringify({
                  "egcs_fc_profile": profileData    
                });

            $.ajax({type: "POST",
                   url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
                   data: { "operationName": "POST egcs_fc_profile /egcs_fc_profiles_15209178220061", "operationArguments": saveInputsnputs},           
                   cache: false,
                   async: false,
                   success:function(data,textStatus,jqXHR ){
                     console.log("in success");
        
                     var getprofileiddataObject = JSON.stringify({
                      "je_aem_unique_key":formObj.EAMID,
                     });
        
                     $.ajax({type: "POST",                     
                        url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
                        data: { "operationName": "GET egcs_fc_profile /egcs_fc_profiles_15209178220060", "operationArguments": getprofileiddataObject},
                        success:function(data,textStatus,jqXHR )
                        {
                          txtFCProfileID  = data[0].egcs_fc_profileid;
                          formObj.FCProfileID =  txtFCProfileID; 
                          getCRMData(formObj);
                        }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                              //error
                        },
                      cache: false,
                      async: false
                     });
        
                   }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                       // $(".guideServiceLoading").remove();
                     console.log("in error");
                   }
            });
         }

     				var inputstxtFCProfileID = JSON.stringify({
			            "egcs_fc_profileid": txtFCProfileID    
          			});


                 $.ajax({type: "POST",                     
                        url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
                        data: { "operationName": "GET egcs_fc_profile /egcs_fc_profiles_15209178220060", "operationArguments": inputstxtFCProfileID},
                        success:function(data,textStatus,jqXHR )
                        {
							//$(".guideServiceLoading").remove();
                            $("#loadingPage").removeClass("guideServiceLoading");
                        }, 
                   		 error: function(XMLHttpRequest, textStatus, errorThrown) {
                             // $(".guideServiceLoading").remove();
                        },
                      cache: false,
                      async: false
                     });




    if(txtFCProfileID){
        console.log("not null");
		 //$(".guideServiceLoading").remove();
    }
     // Returm Value
      return txtFCProfileID;

}

var getCRMData = function (formObj) {
    
                var accountid = {"accountid": formObj.HostInstitution};
                var citizenCountryID = {"je_countrylistid": formObj.CitizenCountry};
                var degreeid = {"je_edudegreeid": formObj.Degree};
                var edufieldofStudy= {"je_edufieldofstudyid": formObj.EdufieldofStudy};
                var diciplineid={"je_edudisciplineid": formObj.ResearchDisciplin};
                var currentProfileId = formObj.FCProfileID;
                var hostinstitution={"accountid": formObj.HostInstitution};

                var candidateSalutation ={"je_salutationid": formObj.candidateSalutation};
                var candidateGender={"je_genderid": formObj.candidateGender};
                var canadianSalutation={"je_salutationid": formObj.othersalutation};
                
                
                var userid ={"je_portaluserregistrationid": getCookie("usr_id")};
                
                if(formObj.FOpportunity && formObj.TProgram){
                    setFOpportunityTProgramForm(formObj, currentProfileId);
                }
                if(getCookie("usr_id")){
                	setPortalUserApplicationForm(currentProfileId);
                }

                // if(formObj.contactId){
                //     setContact(formObj, currentProfileId);
                // }
                

                // *********************** START Canadian Information  *****************************
                    // Salution
                    if (formObj.othersalutation && formObj.othersalutation.length == 36)
                    {
                        var othersalutationDataObj = JSON.stringify({
                            "egcs_fc_profile_egcs_fc_profileid":currentProfileId,
                            "egcs_fc_profile_je_aem_ELAP_Canadian_Contact_Salutation_Salutation":canadianSalutation
                        });
                        
                        $.ajax({type: "POST",
                                url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
                                data: { "operationName": "egcs_fc_profiles/Microsoft.Dynamics.CRM.je_aem_ELAP_Canadian_Contact_Salutation()_15732892381970", "operationArguments": othersalutationDataObj},
                                success:function(data,textStatus,jqXHR ){
                                    console.log("othersalutation data updated");
                                }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                                    //error
                                },
                                cache: false,
                                async: true
                                });
                    }

                // *********************** END Canadian Information  *******************************

                // *********************** START Candidate Information  *****************************
                // Salution
                if (formObj.candidateSalutation && formObj.candidateSalutation.length == 36)
                {
                    var FCProfileCandidateDataObj = JSON.stringify({
                        "egcs_fc_profile_egcs_fc_profileid":currentProfileId,
                        "egcs_fc_profile_je_aem_ELAP_Candidate_Info_Salutation_Salutation":candidateSalutation
                    });
                    
                    $.ajax({type: "POST",
                            url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
                            data: { "operationName": "egcs_fc_profiles/Microsoft.Dynamics.CRM.je_aem_ELAP_Candidate_Info_Salutation()_15732892381986", "operationArguments": FCProfileCandidateDataObj},
                            success:function(data,textStatus,jqXHR ){
                                console.log("FCProfileCandidateDataObj data updated");
                            }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                                //error
                            },
                            cache: false,
                            async: true
                           });
                }

                // Gender
                if ((formObj.candidateGender && formObj.candidateGender.length == 36))
                {
                    var FCProfileCandidateDataObj = JSON.stringify({
                        "egcs_fc_profile_egcs_fc_profileid":currentProfileId,
                        "egcs_fc_profile_je_aem_ELAP_Candidate_Info_Gender_Gender":candidateGender
                    });
                    
                    $.ajax({type: "POST",
                            url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
                            data: { "operationName": "egcs_fc_profiles/Microsoft.Dynamics.CRM.je_aem_ELAP_Candidate_Info_Gender()_15732892381985", "operationArguments": FCProfileCandidateDataObj},
                            success:function(data,textStatus,jqXHR ){
                                console.log("FCProfileCandidateDataObj data updated");
                            }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                                //error
                            },
                            cache: false,
                            async: true
                           });
                }

                // Degree Sougth at home Institute
                if (formObj.Degree && formObj.Degree.length == 36)
                {
                    
                    var degreeDataObject = JSON.stringify({
                        "egcs_fc_profile_egcs_fc_profileid":currentProfileId,
                        "egcs_fc_profile_je_aem_ELAP_Candidate_Info_Degree_Sought_DegreeSought":degreeid,
                    });
                    
                    $.ajax({type: "POST",
                            url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
                            data: { "operationName": "egcs_fc_profiles/Microsoft.Dynamics.CRM.je_aem_ELAP_Candidate_Info_Degree_Sought()_15732892381972", "operationArguments": degreeDataObject},
                            success:function(data,textStatus,jqXHR ){
                                console.log("Degree Sought at Home Institute data updated");
                            }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                                //error
                            },
                            cache: false,
                            async: true
                           });
                }

                // Field of Study
                if (formObj.EdufieldofStudy && formObj.EdufieldofStudy.length == 36)
                {
                    var fieldOfStudyhDataObj = JSON.stringify({
                        "egcs_fc_profile_egcs_fc_profileid":currentProfileId,
                        "egcs_fc_profile_je_aem_ELAP_Candidate_Info_FieldOfStudy_FieldofStudy":edufieldofStudy
                    });
                    
                    $.ajax({type: "POST",
                            url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
                            data: { "operationName": "egcs_fc_profiles/Microsoft.Dynamics.CRM.je_aem_ELAP_Candidate_Info_FieldOfStudy()_15732892381984", "operationArguments": fieldOfStudyhDataObj},
                            success:function(data,textStatus,jqXHR ){
                                console.log("Field of study data updated");
                            }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                                //error
                            },
                            cache: false,
                            async: true
                           });
                }
                
                
                //Displine
                if (formObj.ResearchDisciplin && formObj.ResearchDisciplin.length == 36)
                {
                    
                    var disciplineDataObject = JSON.stringify({
                        "egcs_fc_profile_egcs_fc_profileid":currentProfileId,
                        "egcs_fc_profile_je_aem_ELAP_Candidate_Info_Discipline_Discipline":diciplineid,
                    });
                    
                    $.ajax({type: "POST",
                            url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
                            data: { "operationName": "egcs_fc_profiles/Microsoft.Dynamics.CRM.je_aem_ELAP_Candidate_Info_Discipline()_15732892381973", "operationArguments": disciplineDataObject},
                            success:function(data,textStatus,jqXHR ){
                                console.log("Discipline data updated");
                            }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                                //error
                            },
                            cache: false,
                            async: true
                           });
                }

                // Country of Citizenship 
                if (formObj.CitizenCountry && formObj.CitizenCountry.length == 36)
                {
                      var citizenshipCountryDataObj = JSON.stringify({
                          "egcs_fc_profile_egcs_fc_profileid":currentProfileId,
                          "egcs_fc_profile_je_aem_ELAP_Candidate_Info_Country_Country":citizenCountryID
                      });
                      
                      $.ajax({type: "POST",
                              url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
                              data: { "operationName": "egcs_fc_profiles/Microsoft.Dynamics.CRM.je_aem_ELAP_Candidate_Info_Country()_15732892381971", "operationArguments": citizenshipCountryDataObj},
                              success:function(data,textStatus,jqXHR ){
                                  console.log("citizenshipCountryDataObj data updated");
                              }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                                  //error
                              },
                              cache: false,
                              async: true
                             });
                }
                // *********************** END Candidate Information  *****************************
                
                // *********************** START Home institution contact  *****************************  
              
                // Salution 
                if (formObj.lstContactSalutation && formObj.lstContactSalutation.length == 36)
                {
                      var je_salutationid={"je_salutationid": formObj.lstContactSalutation};

                      var citizenshipCountryDataObj = JSON.stringify({
                          "egcs_fc_profile_egcs_fc_profileid":currentProfileId,
                          "egcs_fc_profile_je_aem_ELAP_Home_Institution_Salution_Salution":je_salutationid
                      });
                      
                      $.ajax({type: "POST",
                              url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
                              data: { "operationName": "egcs_fc_profiles/Microsoft.Dynamics.CRM.je_aem_ELAP_Home_Institution_Salution()_15732892381989", "operationArguments": citizenshipCountryDataObj},
                              success:function(data,textStatus,jqXHR ){
                                  console.log("lstContactSalutation data updated");
                              }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                                  //error
                              },
                              cache: false,
                              async: true
                             });
                }

                // Institute
                if (formObj.lstContactInstitution && formObj.lstContactInstitution.length == 36)
                {
                      var accountid={"accountid": formObj.lstContactInstitution};

                      var lstContactInstitutionDataObj = JSON.stringify({
                          "egcs_fc_profile_egcs_fc_profileid":currentProfileId,
                          "egcs_fc_profile_je_aem_ELAP_Home_Institution_Institution_AccountID":accountid
                      });
                      
                      $.ajax({type: "POST",
                              url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
                              data: { "operationName": "egcs_fc_profiles/Microsoft.Dynamics.CRM.je_aem_ELAP_Home_Institution_Institution()_15732892381988", "operationArguments": lstContactInstitutionDataObj},
                              success:function(data,textStatus,jqXHR ){
                                  console.log("lstContactInstitution data updated");
                              }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                                  //error
                              },
                              cache: false,
                              async: true
                             });
                }

                // Country 
                if (formObj.lstContactCountry && formObj.lstContactCountry.length == 36)
                {
                    var je_countrylistid={"je_countrylistid": formObj.lstContactCountry};

                      var jecountrylistidDataObj = JSON.stringify({
                          "egcs_fc_profile_egcs_fc_profileid":currentProfileId,
                          "egcs_fc_profile_je_aem_ELAP_Home_Institution_Country_Country":je_countrylistid
                      });
                      
                      $.ajax({type: "POST",
                              url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
                              data: { "operationName": "egcs_fc_profiles/Microsoft.Dynamics.CRM.je_aem_ELAP_Home_Institution_Country()_15732892381987", "operationArguments": jecountrylistidDataObj},
                              success:function(data,textStatus,jqXHR ){
                                  console.log("lstContactCountry data updated");
                              }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                                  //error
                              },
                              cache: false,
                              async: true
                             });
                }
                
                // *********************** END Home institution contact  ***************************** 

            if(formObj.clickType == "Submitted"){
                top.window.location.href = guideBridge._getThankYouPageFromConfig();
            }
    }

    var setFOpportunityTProgramForm = function (formObj, currentProfileId)
    {
        
        ///Update Portal User
        //var egcs_fo_profileid = {"egcs_fo_profileid": formObj.FOpportunity};
        var egcs_fo_profileid = {"egcs_fo_profileid": "a77d00c6-62fa-e911-a813-000d3af46b49"};        
        var egcs_tp_profileid = {"egcs_tp_profileid": formObj.TProgram};
        
        var portalUserDataObj = JSON.stringify({
            "egcs_fc_profile_egcs_fc_profileid":currentProfileId,
            "egcs_fc_profile_je_aem_ALL_TProgram_FOpportunity_FOpportunity":egcs_fo_profileid,
            "egcs_fc_profile_je_aem_ALL_TProgram_FOpportunity_TProgram": egcs_tp_profileid
        });
        
        $.ajax({type: "POST",
                url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
                data: { "operationName": "egcs_fc_profiles/Microsoft.Dynamics.CRM.je_aem_ALL_TProgram_FOpportunity()_15732892606401", "operationArguments": portalUserDataObj},
                success:function(data,textStatus,jqXHR ){
                    console.log("setFOpportunityTProgramForm" + data);
                }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                    //error
                },
                cache: false,
                async: true
               });
    }
    
    var setPortalUserApplicationForm = function (currentProfileId)
    {
        var guid_portalUser = getCookie("usr_id");
        console.log("guid_portalUser "+guid_portalUser);
        
        ///Update Portal User
        var portalUser = {"je_portaluserregistrationid": guid_portalUser};
    
        var portalUserDataObj = JSON.stringify({
            "egcs_fc_profile_egcs_fc_profileid":currentProfileId,
            "egcs_fc_profile_je_aem_ALL_Portal_User_PortalUser":portalUser,
        });
        
        $.ajax({type: "POST",
                url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
                data: { "operationName": "egcs_fc_profiles/Microsoft.Dynamics.CRM.je_aem_ALL_Portal_User()_15732892606400", "operationArguments": portalUserDataObj},
                success:function(data,textStatus,jqXHR ){
    
                    console.log("guid_portalUser" + data);
    
                }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                    //error
                },
                cache: false,
                async: true
               });
    }
    
    
    var setContact =  function (formObj, currentProfileId) 
    {
        console.log("setContact "+ currentProfileId);
        
        // Creating contact  Data
        var contactFormDataArray = {
            "firstname":formObj.si_firstname,
            "lastname":formObj.si_lastname,
            "jobtitle":formObj.si_jobtitle,
            "department":formObj.si_department,
            "telephone1":formObj.si_phone,
            "fax":formObj.si_fax,
            "emailaddress1": formObj.si_emailaddress1,
            "je_aemid":formObj.aem_id
        };
        
        
        var contactFormData = JSON.stringify({
            "contact":contactFormDataArray,
        });
        
        //contantID 
        contantID = formObj.contactId;
        
        $.ajax({type: "POST",
                url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
                data: { "operationName": "POST contact /contacts_15030357369301", "operationArguments": contactFormData},
                success:function(data,textStatus,jqXHR )
                {
                    contantID = data[0].contactid;
                    
                    //set Profile with Contact Info.
                    var contactClientCandidateid = {"contactid": contantID};
                    var contactClientCandidateDataObject = JSON.stringify({
                        "egcs_fc_profile_egcs_fc_profileid":currentProfileId,
                        "egcs_fc_profile_je_aem_lookup_update_contact63a0761534bae911a811000d3af46757_contactid":contactClientCandidateid,
                    });

                    $.ajax({type: "POST",
                            url: "/content/dam/formsanddocuments-fdm/ms-dynamics-fdm.executeDermisQuery.json?",
                            data: { "operationName": "egcs_fc_profiles/Microsoft.Dynamics.CRM.je_aem_lookup_update_contact63a0761534bae911a811000d3af46757()_156833572817317", "operationArguments": contactClientCandidateDataObject},
                            success:function(data,textStatus,jqXHR ){
                            }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                                //error
                            },
                            cache: false,
                            async: true
                            
                           });
                }, error: function(XMLHttpRequest, textStatus, errorThrown) 
                {
                    //error
                },
                cache: false,
                async: true
               });                 
    } 