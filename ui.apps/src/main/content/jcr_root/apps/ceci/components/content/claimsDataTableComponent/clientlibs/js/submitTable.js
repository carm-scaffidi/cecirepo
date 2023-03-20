/* 
* get form language from URL
*/
function getCRMFormLanguage(){
    var urlParams = new URLSearchParams(window.location.search);
    var lang = urlParams.get('afAcceptLang') === "en" ? "1033" : "1036";

    return lang;
}


$(function () {
   // var i = window.location.pathname.indexOf('universal-landing');
   // if (i > -1) {
		//getClaims();
    //}
});


var jsonData

function setJsonData (json) {

    var claimExpensesResult = json;
    var strClaimExpensesResult = JSON.stringify(claimExpensesResult);

    //console.log("setJsonData: " + strClaimExpensesResult);

    jsonData = '{"data":' + strClaimExpensesResult +'}';

}


function getClaims() {

    //console.log("getClaims");

    var lang = getCRMFormLanguage();
    
    if(lang == "1033"){
        initClaimTableEN(JSON.parse(jsonData));
    }
    else
    {
        initClaimTableFR(JSON.parse(jsonData));
    }

}


function getClaims2() {
	initClaimTableEN(JSON.parse(jsonData));
}


var tableClaim;

function initClaimTableEN(response) {
    console.log('initClaimTableEN() EN');

    var dataObject = JSON.stringify({
    });

    try {
        if (getCRMFormLanguage() == "1033") {
            $('#claimApplyTableFR').hide();
        }

        tableClaim = $('#claimApplyTableIdEN').DataTable({
                // oLanguage is used to set strings in the dataTable structure
                //https://legacy.datatables.net/usage/i18n
                // see  "function initClaimTableFR" below
                "columnDefs": [
                {
                    "targets": 2,
                    "visible": false
                },
                {
                    "targets": 6,
                    "visible": false
                }
            ],
            "bDestroy": true,
            search: {
                return: true
            }
        });


        $('#claimApplyTableIdEN tbody').on('click', '#edit', function () {
            var data = tableClaim.row($(this).closest('tr')).data();
            console.log(data);
            //var data = tableClaim.row( this ).data();
            editItem(data);
        });

        var rows = tableClaim
            .rows()
            .remove();

        var giCount = 1;
        $.each(response.data, function (index, value) {

            $('#claimApplyTableIdEN').dataTable().fnAddData([
                giCount,
                value.gac_name,
                value.gac_ReferenceExpectedCost.gac_shortdescription, //BB-Jun10-changed from "Comments"... already in JSON payload
                value.gac_preapprovedcontributionamount,
                value.gac_amountclaimed, //BB-PJS sub'd with 'gac_ReferenceExpectedCost.       
                //value.gac_ReferenceExpectedCost.gac_freebalance, // new May-11-2022 .. gets freebalance from fdiBudgetItem object                 
                value.gac_preapprovedcontributionamount - value.gac_amountclaimed,
                value.gac_fdiexpenseitemid,
                "<button id=edit style='font-size:13px;border-width:1px;border-color:#dddddd;font-color:#555555' type=button>Edit</button>"
            ]);

            giCount++;
        });
    }

    catch (err) {
        //console.log(err);
    }

}


function initClaimTableFR(response) {

        console.log('initClaimTableEN() FR');

    		if(getCRMFormLanguage() == "1036"){
                $('#claimApplyTableEN').hide();
            }

        var dataObject = JSON.stringify({
        });

        try {
            tableClaim = $('#claimApplyTableIdFR').DataTable({
                "columnDefs": [
                    {
                        "targets": 2,
                        "visible": false
                    },
                    {
                        "targets": 6,
                        "visible": false
                    }
                ],
                "bDestroy": true,
                search: {
                    return: true
                },
                // oLanguage is used to set strings in the dataTable structure
                //https://legacy.datatables.net/usage/i18n
                "oLanguage": {
                    "sSearch": "Recherche:",
                    "sLengthMenu": "Montrer les _MENU_ entrées",
                    "sInfo": "Montrer les entrées (_START_ to _END_) sur _TOTAL_ entrées",
                    "oPaginate": {
                        "sPrevious": "Précédent",
                        "sNext": "Suivant"
                    }

                }

            });


            $('#claimApplyTableIdFR tbody').on('click', '#edit', function () {
                var data = tableClaim.row($(this).closest('tr')).data();
                console.log(data);
                //var data = tableClaim.row( this ).data();
                editItem(data);

            } );

            var rows = tableClaim
                .rows()
                .remove();

		var giCount = 1;
		 $.each(response.data, function (index, value) {

              $('#claimApplyTableIdFR').dataTable().fnAddData([
                  giCount,
                  value.gac_name,
                  value.gac_ReferenceExpectedCost.gac_shortdescription, //BB-Jun10-changed from "Comments"... already in JSON payload
                  value.gac_preapprovedcontributionamount,
                  value.gac_amountclaimed,                 
                  value.gac_preapprovedcontributionamount-value.gac_amountclaimed,
                  value.gac_fdiexpenseitemid,
                  "<button id=edit style='font-size:13px;border-width:1px;border-color:#dddddd;font-color:#555555' type=button>Modifier</button>"
                 ]);

             	giCount++;
 			});
        }

        catch (err) {
             //console.log(err);
        }

}

function destroyDatatable() {
    claimApplyTableIdEN.destroy();

}

function resetDatatable() {
    claimApplyTableIdEN.destroy();
    getClaims();
}




function editItem(obj) {
	//console.log(obj);
	var objSOM = "guide[0].guide1[0].guideRootPanel[0].mainSection[0].expectedCostPanel[0].fdiCompPanelPanel[0].expensesSummary[0].updateExpensePanel[0].editPanel[0]";

    window.guideBridge.resolveNode(objSOM).visible = true;
    window.guideBridge.resolveNode(objSOM).expenseType.value = obj[1];
    window.guideBridge.resolveNode(objSOM).description.value = obj[2]; //crm: '
    window.guideBridge.resolveNode(objSOM).preApprovedContribution.value = parseFloat(obj[3]);
    window.guideBridge.resolveNode(objSOM).amountAlreadyClaimed.value = obj[5]; //was obj[4] BB-PJS May-11-2022 
//    window.guideBridge.resolveNode(objSOM).gac_totalbeforetaxes.value = obj[4]; //was obj[4] BB-PJS May-11-2022 
    window.guideBridge.resolveNode(objSOM).gac_fdiexpenseitemid.value = obj[6].trim();
//    window.guideBridge.resolveNode(objSOM).gac_comments.value = obj[2]; //'comments' field should not be populated from CRM --Besco-Jun9-2022
	window.guideBridge.setFocus(window.guideBridge.resolveNode(objSOM).expenseType);

}



function getURLParameter(parameter) {
    var results = new RegExp('[\?&]' + parameter + '=([^&#]*)')
        .exec(window.location.search);

    return (results !== null) ? results[1] || 0 : 'en';
}








