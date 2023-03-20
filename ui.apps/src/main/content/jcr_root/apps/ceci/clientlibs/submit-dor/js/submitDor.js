console.log("submitdor.js"   + ": "  + "Dec08" + " " + "2022");
/**AsimK--Besco-Dec07B
* Get pdf version of the current form.
* @param formPath  a string representing the path to the form in the content repository
*/
function generateAndUploadDor(formPath) {
    console.log("submitDor.js"   + ": "  + "Dec07A" + " " + "2022");
    console.log("formPath:- " + formPath);

    window.guideBridge.getDataXML({

        success: function (result) {
            var formData = new FormData();
            formData.append("dataXml", result.data);
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
                    var _appId = sessionStorage.getItem("gac-aem-appId");
                    // from asimK  var _appId = "ceciclaim";
                    var entityId = sessionStorage.getItem("gac-aem-masterId");
                    // from asimK  var entityId ="98D69E13-6476-ED11-96CF-005056815722"; //"b60d63c7-561b-ea11-9696-00505681d5ee";
                    var id = entityId; //"F91789CD-3318-EA11-9697-005056818AAD";
                    var _masterEntityName = "gac_fdiclaim";
                    var _masterEntityId = id;
                    var _lookupEntityFieldName = "gac_fdiclaim";
                    var _relationshipName = "gac_fdiclaim _rdimdocumentcontent";

                    var dataDocumentURI = webApiRootUrl + "api/RDIMS/addnewdocument/?lang=en";
                    var _postFileURL = dataDocumentURI;
                    if (_postFileURL == null) {
                        _postFileURL = "https://gccasewebapi/rdims/api/RDIMS/addnewdocument/?lang=en"; // missing "_" prefix.. was postFileURL
                    }
                    // from asimK  var _postFileURL = "https://gccasewebapi-dev/rdims/api/RDIMS/addnewdocument/?lang=en";

                    var data = new FormData();
                    data.append("metadata", metaDataStr);
                    data.append("entityType", _masterEntityName);
                    data.append("lookupEntityFieldName", _lookupEntityFieldName);
                    data.append("entityId", _masterEntityId);
                    data.append("appid", _appId);
                    data.append("postFileURL", _postFileURL);

                    var fileURL = JSON.parse(response).filePath;
                    //var fileName = fileURL.substring(fileURL.lastIndexOf("/")+1);
                    var vClaimNum = sessionStorage.getItem("ssClaimNumber");
                    var vShortName = sessionStorage.getItem("ssGac_organizationshortname");
                    var fileName = "Claim_" + vShortName + "_" + vClaimNum + ".pdf";
                    data.append("fileName", fileName);
                    data.append("fileDescription", fileName);
                    data.append("fileURL", fileURL);

                    var settings = {
                        "async": true,
                        "url": "/bin/dorfileupload",
                        "processData": false,
                        "contentType": false,
                        "type": "POST",
                        "method": "POST",
                        "data": data,
                    };
                    $.ajax(settings).done(function (response) {
                        console.log("got response");
                        parser = new DOMParser();
                        xmlDoc = parser.parseFromString(response, "text/xml");
                        rdmsRootXML = xmlDoc.getElementsByTagName('RDIMSController.DocumentJsonResult')[0]; console.log(rdmsRootXML);
                        jRdmsDocInfo = xml2json(rdmsRootXML); console.log(jRdmsDocInfo);
                        console.log("JSON.parse(response).DocumentId: " + jRdmsDocInfo.DocumentId);
                    });

                })
        },
        error: function (guideResultObject) {
            console.log("got error");
        },
        guideState: null,
        boundData: true
    });

}

