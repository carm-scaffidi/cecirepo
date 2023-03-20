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
		//getSummaryClaims();
    //}
});


var jsonSummaryData

function setJsonSummaryData (json) {

    var claimExpensesResult = json;
    var strClaimExpensesResult = JSON.stringify(claimExpensesResult);

    //console.log("setJsonSummaryData: " + strClaimExpensesResult);

    jsonSummaryData = '{"data":' + strClaimExpensesResult +'}';

}


function getSummaryClaims() {

    console.log("getSummaryClaims");

    var lang = getCRMFormLanguage();
    if(lang == "1033"){
        initClaimSummaryTableEN(JSON.parse(jsonSummaryData));
    }
    else
    {
        initClaimSummaryTableFR(JSON.parse(jsonSummaryData));
    }

}



var tableSummaryClaim;

function initClaimSummaryTableEN(response) {

        console.log('initClaimSummaryTableEN() EN');  

        var dataObject = JSON.stringify({
        });

        try {

            if(getCRMFormLanguage() == "1033"){
                $('#claimSummaryApplyTableIdFR').hide();
            }


              tableSummaryClaim = $('#claimSummaryApplyTableIdEN').DataTable({
                "bDestroy": true,
                search: {
                    return: true
                },
                // oLanguage is used to set strings in the dataTable structure
                //https://legacy.datatables.net/usage/i18n
                "oLanguage": { 
                    "sInfo": "Showing (_START_ to _END_) of _TOTAL_ entries"
                  }
            });


            $('#claimSummaryApplyTableIdEN tbody').on('click', '#edit', function () {
                var data = tableSummaryClaim.row($(this).closest('tr')).data();
                console.log(data);
                //var data = tableSummaryClaim.row( this ).data();
                //editItem(data);


            } );


            var rows = tableSummaryClaim
                .rows()
                .remove();


		var giCount = 1;
		 $.each(response.data, function (index, value) {

              $('#claimSummaryApplyTableIdEN').dataTable().fnAddData([
                  giCount,
                  value.gac_FDIClaimComponent.gac_Claim.gac_name,
                  value.gac_name,
                  value.gac_preapprovedcontributionamount,
                  value.gac_amountclaimed, //BB-PJS sub'd with 'gac_ReferenceExpectedCost.       
//                  value.gac_ReferenceExpectedCost.gac_freebalance, // new May-11-2022 .. gets freebalance from fdiBudgetItem object                 
                  value.gac_preapprovedcontributionamount-value.gac_amountclaimed
                  //gac_ReferenceExpectedCost
                  ]);

             	giCount++;
 			});
        }

        catch (err) {
             //console.log(err);
        }

}


function initClaimSummaryTableFR(response) {

        console.log('initClaimSummaryTableEN() FR');

    		if(getCRMFormLanguage() == "1036"){
                $('#claimSummaryApplyTableIdEN').hide();
            }

        var dataObject = JSON.stringify({
        });

        try {
              tableSummaryClaim = $('#claimSummaryApplyTableIdFR').DataTable({
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


            $('#claimSummaryApplyTableIdFR tbody').on('click', '#edit', function () {
                var data = tableSummaryClaim.row($(this).closest('tr')).data();
                console.log(data);
                //var data = tableSummaryClaim.row( this ).data();
                //editItem(data);

            } );

            var rows = tableSummaryClaim
                .rows()
                .remove();

		var giCount = 1;
		 $.each(response.data, function (index, value) {

              $('#claimSummaryApplyTableIdFR').dataTable().fnAddData([
                  giCount,
                  value.gac_FDIClaimComponent.gac_Claim.gac_name,
                  value.gac_name,
                  value.gac_preapprovedcontributionamount,
                  value.gac_amountclaimed,                 
                  value.gac_preapprovedcontributionamount-value.gac_amountclaimed
                 ]);

             	giCount++;
 			});
        }

        catch (err) {
             //console.log(err);
        }

}

function destroyDatatable() {
    claimSummaryApplyTableIdFR.destroy();

}

function resetDatatable() {
    claimSummaryApplyTableIdFR.destroy();
    getSummaryClaims();
}







function getURLParameter(parameter) {
    var results = new RegExp('[\?&]' + parameter + '=([^&#]*)')
        .exec(window.location.search);

    return (results !== null) ? results[1] || 0 : 'en';
}








