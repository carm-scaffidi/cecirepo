/*
Sep-27-2021 --- TODO
-  File extensions: convert to lowerCase --> doesn't work if "PNG"
-  function addDocumentHandler(xhttp) --> resp needs to be in JSON, comes back as XML
-  servlet 'rdimsApiPostFileUpload' need to abstract / pass as param RDIMS URL
*/

function getCookie(name) {
  var re = new RegExp(name + "=([^;]+)");
  var value = re.exec(document.cookie);
  return (value != null) ? unescape(value[1]) : null;
}
/* langLabel is set via sessionStore
/* var langLabel = getCookie('lang'); //"en-US";
if (langLabel === null) {
  //Set English as default value	
  langLabel = "en-US";
}
langLabel = langLabel.substring(0, 2); */
langLabel = sessionStorage.getItem("lang");
//var userSelectedLang = sessionStorage.getItem("selectedLang");
//langLabel = userSelectedLang; //"fr";
//langLabel = langLabel === null ? 'en' : userSelectedLang;
//****** Language values **********//
var _eng = {
  "form_title": "Add new document",
  "txt_title": "Title",
  "txt_chooseFile": "Choose file",
  "save": "Send your document",
  "cancel": "Cancel",
  "delete_confirm": "Are you sure you want to delete this document!",
  "label_uploading": "uploading your file ",
  "label_uploading_done": "Done",
  "validExtensionsMessage": "Wrong type file Accepted formats : ",
  "fileSizeAllowMessage": "Please upload file less than 10MB. Thanks!",
  "lbl_scanning": "Scanning your file ",
  "lbl_delete": "Delete ",
  "lbl_browse": "Browse... ",
  "save_message": "Your document has been uploaded successfully.",
  "sect1_title": "Proof of citizenship",
  "sect2_title": "",
  "sect3_title": "Letter of intent from the candidate",
  "sect4_title": "Letter of support from candidate’s home Institution ",
  "sect5_title": "Letter of invitation from the Canadian Supervisor",
  "sect6_title": "Signed copy of Memorandum of Understanding or Agreement with the partner institution in Latin Americas or the Caribbean",
  "sect7_title": "Privacy notice statement signed by the candidate",
//Begin-besco Sep8-2021... the following 'tbl...' elements are for CECI Proposal & Registration
  "vTblFileName": "Filename", 
  "vTblDescription": "Description",
  "vTblOpen": "Open",
  "vTblDelete": "Delete",
  "vTblNoRecords": "No records available",
  "vTblLengthMenu": "Show _MENU_ entries per page",
  "vTblInfoEmpty": "No records available",
  "vTblNext":"Next",
  "vTblPrevious":"Back",
  "vInfo": "Showing _START_ to _END_ of _TOTAL_ entries"
//End-besco Sep8-2021... the above 'tbl...' elements are for CECI Proposal & Registration
};
var _fr = {
  "form_title": "Ajouter un document",
  "txt_title": "Titre",
  "txt_chooseFile": "Choisir un fichier",
  "save": "Envoyer votre document",
  "cancel": "Annuler",
  "delete_confirm": "Êtes-vous de vouloir supprimer ce document!",
  "label_uploading": "Envoi de votre document ",
  "label_uploading_done": "Terminé",
  "validExtensionsMessage": "Type de fichier incorrect Fichier accepter : ",
  "fileSizeAllowMessage": "Envoyer un fichier de moins de 10MB! Merci",
  "lbl_scanning": "Analyse votre fichier",
  "lbl_delete": "Supprimer ",
  "lbl_browse": "Parcourir... ",
  "save_message": "Votre document a été téléchargé avec succès.",
  "sect1_title": "fr-Proof of citizenship",
  "sect2_title": "",
  "sect3_title": "fr-Letter of intent from the candidate",
  "sect4_title": "fr-Letter of support from candidate’s home Institution ",
  "sect5_title": "fr-Letter of invitation from the Canadian Supervisor",
  "sect6_title": "fr-Signed copy of Memorandum of Understanding or Agreement with the partner institution in Latin Americas or the Caribbean",
  "sect7_title": "fr-Privacy notice statement signed by the candidate",
//Begin-besco Sep8-2021... the following 'tbl...' elements are for CECI Proposal & Registration
  "vTblFileName": "Nom du fichier",
  "vTblDescription": "Description",
  "vTblOpen": "Ouvrir",
  "vTblDelete": "Supprimer",
  "vTblNoRecords": "Aucun dossier disponible",
  "vTblLengthMenu": "Afficher _MENU_ entrées par page", //Afficher (X) entrées par page
  "vTblInfoEmpty": "Aucun dossier disponible",
  "vTblNext":"Procéder",
  "vTblPrevious":"Précédent",
  "vInfo": "Afficher _START_ à _END_ de _TOTAL_ entrées"
//End-besco Sep8-2021... the above 'tbl...' elements are for CECI Proposal & Registration
};
var _selectedLang = _eng; //Default English
//var _langEn = _eng;
//var _langFr = _fr
//alert('test' + _langEn.date + _langFr.date);
function loadlang(selectedLangage) {
  switch (selectedLangage) {
    case "en":
      _selectedLang = _eng;
      break;
    case "fr":
      _selectedLang = _fr;
      break;
  }
  $('#exampleModalLabel').html(_selectedLang.form_title);
  $('#lbl_chooseFile').html(_selectedLang.txt_chooseFile);
  $('#addDocumentAction').html(_selectedLang.save);
  $('#cancelAction').html(_selectedLang.cancel);
  $('#lbl_scanning').html(_selectedLang.lbl_scanning);
  //$('#scanningProgress').html(_selectedLang.scanning);
  //_selectedLang.validExtensionsMessage _selectedLang.fileSizeAllowMessage
  //alert(selectedLangage + '  /  ' + _selectedLang.form_title)
}
//****** End language values ************//
var _entityIdDyn = ''; //$("#guideContainer-rootPanel-panel-guidetextbox_747248929___widget").val();
var entityId = "CF938AA4-D81D-EB11-96A6-00505681CF84"; //"b60d63c7-561b-ea11-9696-00505681d5ee"; // $("#guideContainer-rootPanel-panel-guidetextbox_747248929___widget").val();
var appId = "ceciacc"; // $("#guideContainer-rootPanel-panel-guidetextbox___widget").val();
//alert(appId + ' ' + entityId + ' dyn:' + entityIdDyn);
function getUrlParameter(source, name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(source);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
var dataStr = getUrlParameter(location.search, "data");
dataStr = "?&" + dataStr;
var cp1 = getUrlParameter(dataStr, "cp1_masterEntityName");
var cp2 = getUrlParameter(dataStr, "cp2_relationshipName");
var cp4 = getUrlParameter(dataStr, "cp4_appID");
var cp5 = "v1.1" + getUrlParameter(dataStr, "cp5_filtre");
//var id = window.parent.Xrm.Page.data.entity.getId();
//id = id.replace("{", "").replace("}","");
var id = entityId; //"F91789CD-3318-EA11-9697-005056818AAD";
var _masterEntityName = "egcs_fc_profile";
var _masterEntityId = id;
var _lookupEntityFieldName = "egcs_fc_profileid";
var _relationshipName = "egcs_fc_profile_rdimdocumentcontent";
var _appId = appId;
//Meta data can now push from client side or via the custom XML file
var _GAC_METADATA_TRUSTEE = ''; //RDIM account
var _GAC_METADATA_RIGHTS = 255;
var _GAC_METADATA_TYPIST = '';
var _GAC_METADATA_SECURITY = '';
var _GAC_METADATA_RESPONSIBLEUSER = ''; //RDIM account
var _GAC_METADATA_FILEPT = '';
var _GAC_METADATA_DEPARTMENTID = '';
// ************* START NEW CODE FOR ADD DOC TO A SECTION ******************* //
function loadDocumentSection() {
//  console.log("loading doc");
  var jdata = GetDocumentListData();
  jdata.forEach(readDocumentListData);
}
function readDocumentListData(docElem) {
  var contentToReadOnlyFom = "";
  var docId = docElem.gac_rdim_documentid;
  var versionId = docElem.gac_rdimdocumentversionid;
  var applicationLabel = docElem.gac_applicationtypeLabel;
  var rdimdocumentContentId = docElem.gac_rdimdocumentcontentid;
  var nameFile = docElem.gac_rdimfilename;
  //var deleteLink =  "javascript:deleteDocument('" + rdimdocumentContentId + "','False')";
  var deleteLink = ""; //"javascript:deleteDocumentFromSection('" + rdimdocumentContentId + "','False')";
  var desiredLink = "javascript:openFile(" + docId + "," + versionId + ",'" + applicationLabel + "','" + nameFile + "')";
  var desiredText = nameFile; //docId + "-" + nameFile;
  var altTextOnDeleteLink = _selectedLang.lbl_delete + nameFile;
  var strPos = nameFile.indexOf("_");
  var filePrefixe = nameFile.substring(0, strPos + 1);
  //nameFile = docId + "-" + docElem.gac_rdimfilename; //IMPORTANT : NEED TO BE DONE AFTER FINDIND THE PREFIXE
  //alert(nameFile + "   /   " + strPos + "   /   " + filePrefixe);
  //alert($('#guideContainer-rootPanel-SupportingDocuments-guidetextbox___widget').val() + '  /  ' + filePrefixe );
  //alert($('#docNumberSection1').val() + " / " + $('#docNumberSection2').val());
  if ($('#guideContainer-rootPanel-SupportingDocuments-guidetextbox___widget').val() == filePrefixe) //Section1
  {
    deleteLink = "javascript:deleteDocumentFromSection('" + rdimdocumentContentId + "','section1')";
    //contentToReadOnlyFom = contentToReadOnlyFom + '<a href="'+desiredLink+'">'+desiredText+'</a>' + '<a title="' +altTextOnDeleteLink+ '" class="guide-fu-fileClose close" href="'+deleteLink+'">'+ 'x' +'</a>';
    $('#guideContainer-rootPanel-SupportingDocuments-guidetextdraw_1262044743__').html(('<a href="' + desiredLink + '">' + desiredText + '</a>' + '<a title="' + altTextOnDeleteLink + '" class="guide-fu-fileClose close" href="' + deleteLink + '">' + 'x' + '</a>'));
    $("#guideContainer-rootPanel-SupportingDocuments-guidebutton___widget").hide();
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_897312271___widget").show();
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_897312271___widget").focus();
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_897312271___widget").val('ok');
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_897312271___widget").hide();
    //alert( " Section1 / " + filePrefixe + " / " +  $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_897312271___widget").val());
    //$('#guideContainer-rootPanel-SupportingDocuments-guidetextdraw_1262044743__').html(('....'));
  }
  if ($('#guideContainer-rootPanel-SupportingDocuments-guidetextbox_619638569___widget').val() == filePrefixe) //Section2
  {
    deleteLink = "javascript:deleteDocumentFromSection('" + rdimdocumentContentId + "','section2')";
    //contentToReadOnlyFom = contentToReadOnlyFom + '<a href="'+desiredLink+'">'+desiredText+'</a>' + '<a title="' +altTextOnDeleteLink+ '" class="guide-fu-fileClose close" href="'+deleteLink+'">'+ 'x' +'</a>';
    $('#guideContainer-rootPanel-SupportingDocuments-guidetextdraw__').html(('<a href="' + desiredLink + '">' + desiredText + '</a>' + '<a title="' + altTextOnDeleteLink + '" class="guide-fu-fileClose close" href="' + deleteLink + '">' + 'x' + '</a>'));
    $("#guideContainer-rootPanel-SupportingDocuments-guidebutton_813703510___widget").hide();
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1886157951___widget").show();
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1886157951___widget").focus();
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1886157951___widget").val('ok');
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1886157951___widget").hide();
    //alert( " Section2 / " + filePrefixe + " / " +  $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1886157951___widget").val());
  }
  if ($('#guideContainer-rootPanel-SupportingDocuments-guidetextbox_357499897___widget').val() == filePrefixe) //Section3
  {
    deleteLink = "javascript:deleteDocumentFromSection('" + rdimdocumentContentId + "','section3')";
    contentToReadOnlyFom = contentToReadOnlyFom + '<a href="' + desiredLink + '">' + desiredText + '</a>' + '<a title="' + altTextOnDeleteLink + '" class="guide-fu-fileClose close" href="' + deleteLink + '">' + 'x' + '</a>';
    $('#guideContainer-rootPanel-SupportingDocuments-guidetextdraw_215587265__').html(('<a href="' + desiredLink + '">' + desiredText + '</a>' + '<a title="' + altTextOnDeleteLink + '" class="guide-fu-fileClose close" href="' + deleteLink + '">' + 'x' + '</a>'));
    $("#guideContainer-rootPanel-SupportingDocuments-guidebutton_1437155428___widget").hide();
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1228189379___widget").show();
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1228189379___widget").focus();
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1228189379___widget").val('ok');
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1228189379___widget").hide();
    //alert( " Section3 / " + filePrefixe + " / " +  $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1228189379___widget").val());
  }
  if ($('#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1298845711___widget').val() == filePrefixe) //Section4
  {
    deleteLink = "javascript:deleteDocumentFromSection('" + rdimdocumentContentId + "','section4')";
    //contentToReadOnlyFom = contentToReadOnlyFom + '<a href="'+desiredLink+'">'+desiredText+'</a>'  + '<a title="' +altTextOnDeleteLink+ '" class="guide-fu-fileClose close" href="'+deleteLink+'">'+ 'x' +'</a>';
    $('#guideContainer-rootPanel-SupportingDocuments-guidetextdraw_1376312165__').html(('<a href="' + desiredLink + '">' + desiredText + '</a>' + '<a title="' + altTextOnDeleteLink + '" class="guide-fu-fileClose close" href="' + deleteLink + '">' + 'x' + '</a>'));
    $("#guideContainer-rootPanel-SupportingDocuments-guidebutton_1514662218___widget").hide();
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_204534694___widget").show();
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_204534694___widget").focus();
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_204534694___widget").val('ok');
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_204534694___widget").hide();
    //alert( " Section4 / " + filePrefixe + " / " +  $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_204534694___widget").val());
  }
  if ($('#guideContainer-rootPanel-SupportingDocuments-guidetextbox_882301000___widget').val() == filePrefixe) //Section5
  {
    deleteLink = "javascript:deleteDocumentFromSection('" + rdimdocumentContentId + "','section5')";
    //contentToReadOnlyFom = contentToReadOnlyFom + '<a href="'+desiredLink+'">'+desiredText+'</a>'  + '<a title="' +altTextOnDeleteLink+ '" class="guide-fu-fileClose close" href="'+deleteLink+'">'+ 'x' +'</a>';
    $('#guideContainer-rootPanel-SupportingDocuments-guidetextdraw_650799452__').html(('<a href="' + desiredLink + '">' + desiredText + '</a>' + '<a title="' + altTextOnDeleteLink + '" class="guide-fu-fileClose close" href="' + deleteLink + '">' + 'x' + '</a>'));
    $("#guideContainer-rootPanel-SupportingDocuments-guidebutton_845862946___widget").hide();
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_2059366481___widget").show();
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_2059366481___widget").focus();
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_2059366481___widget").val('ok');
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_2059366481___widget").hide();
    //alert( " Section5 / " + filePrefixe + " / " +  $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_2059366481___widget").val());
  }
  if ($('#guideContainer-rootPanel-SupportingDocuments-guidetextbox_249391163___widget').val() == filePrefixe) //Section6
  {
    deleteLink = "javascript:deleteDocumentFromSection('" + rdimdocumentContentId + "','section6')";
    contentToReadOnlyFom = contentToReadOnlyFom + '<a href="' + desiredLink + '">' + desiredText + '</a>' + '<a title="' + altTextOnDeleteLink + '" class="guide-fu-fileClose close" href="' + deleteLink + '">' + 'x' + '</a>';
    $('#guideContainer-rootPanel-SupportingDocuments-guidetextdraw_107165315__').html(('<a href="' + desiredLink + '">' + desiredText + '</a>' + '<a title="' + altTextOnDeleteLink + '" class="guide-fu-fileClose close" href="' + deleteLink + '">' + 'x' + '</a>'));
    $("#guideContainer-rootPanel-SupportingDocuments-guidebutton_1619618042___widget").hide();
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1306823314___widget").show();
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1306823314___widget").focus();
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1306823314___widget").val('ok');
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1306823314___widget").hide();
    //alert( " Section6 / " + filePrefixe + " / " +  $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1306823314___widget").val());
  }
  if ($('#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1686735886___widget').val() == filePrefixe) //Section7
  {
    deleteLink = "javascript:deleteDocumentFromSection('" + rdimdocumentContentId + "','section7')";
    //contentToReadOnlyFom = contentToReadOnlyFom + '<a href="'+desiredLink+'">'+desiredText+'</a>'  + '<a title="' +altTextOnDeleteLink+ '" class="guide-fu-fileClose close" href="'+deleteLink+'">'+ 'x' +'</a>';
    $('#guideContainer-rootPanel-SupportingDocuments-guidetextdraw_1379076389__').html(('<a href="' + desiredLink + '">' + desiredText + '</a>' + '<a title="' + altTextOnDeleteLink + '" class="guide-fu-fileClose close" href="' + deleteLink + '">' + 'x' + '</a>'));
    $("#guideContainer-rootPanel-SupportingDocuments-guidebutton_1525374115___widget").hide();
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1778823185___widget").show();
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1778823185___widget").focus();
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1778823185___widget").val('ok');
    $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1778823185___widget").hide();
    //alert( " Section7 / " + filePrefixe + " / " +  $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1778823185___widget").val());
  }
  //**** Set the Read only form list document - FORM : ELAP-PFLA-RO *****//
  var sectionH = "";
  if (filePrefixe == "Upladed Document for Test_") {
    sectionH = "1. Proof of citizenship ";
    contentToReadOnlyFom = '<a href="' + desiredLink + '">' + desiredText + '</a>' + '</br></br>';
    $('#guideContainer-rootPanel-SupportingDocuments-panel_872929554-guidetextdraw_1876282406__').append(contentToReadOnlyFom);
  }
  if (filePrefixe == "proofOfEnr_") {
    sectionH = "2. Proof of full-time enrollment ";
    contentToReadOnlyFom = '<a href="' + desiredLink + '">' + desiredText + '</a>' + '</br></br>';
    $('#guideContainer-rootPanel-SupportingDocuments-panel_872929554-guidetextdraw_319088285__').append(contentToReadOnlyFom);
  }
  if (filePrefixe == "ltrIntFrCand_") {
    sectionH = "3. Letter of intent from the candidate ";
    contentToReadOnlyFom = '<a href="' + desiredLink + '">' + desiredText + '</a>' + '</br></br>';
    $('#guideContainer-rootPanel-SupportingDocuments-panel_872929554-guidetextdraw_997233098__').append(contentToReadOnlyFom);
  }
  if (filePrefixe == "ltrSuppFrCHI_") {
    sectionH = "4. Letter of support from candidate’s home Institution";
    contentToReadOnlyFom = '<a href="' + desiredLink + '">' + desiredText + '</a>' + '</br></br>';
    $('#guideContainer-rootPanel-SupportingDocuments-panel_872929554-guidetextdraw_583564748__').append(contentToReadOnlyFom);
  }
  if (filePrefixe == "ltrInvFrCSup_") {
    sectionH = "5. Letter of invitation from the Canadian Supervisor";
    contentToReadOnlyFom = '<a href="' + desiredLink + '">' + desiredText + '</a>' + '</br></br>';
    $('#guideContainer-rootPanel-SupportingDocuments-panel_872929554-guidetextdraw_1522179242__').append(contentToReadOnlyFom);
  }
  if (filePrefixe == "signCopMUA_") {
    sectionH = "6. Signed copy of Memorandum of Understanding or Agreement with the partner institution in Latin Americas or the Caribbean";
    contentToReadOnlyFom = '<a href="' + desiredLink + '">' + desiredText + '</a>' + '</br></br>';
    $('#guideContainer-rootPanel-SupportingDocuments-panel_872929554-guidetextdraw_1774029452__').append(contentToReadOnlyFom);
  }
  if (filePrefixe == "privNotStatSign_") {
    sectionH = "7. Privacy notice statement signed by the candidate";
    contentToReadOnlyFom = '<a href="' + desiredLink + '">' + desiredText + '</a>' + '</br></br>';
    $('#guideContainer-rootPanel-SupportingDocuments-panel_872929554-guidetextdraw_797876221__').append(contentToReadOnlyFom);
  }
  //contentToReadOnlyFom = '<strong>' +sectionH+ '</strong></br>' + '<a href="'+desiredLink+'">'+desiredText+'</a>'  + '</br></br>' ;
  //$('#guideContainer-rootPanel-SupportingDocuments-panel_872929554-guidetextdraw__').append(contentToReadOnlyFom);
}
function deleteDocumentFromSection(docEntityId, sectionName) {
  //Delete the document in the grid and CRM	
  var deleteConfirmed = deleteDocument(docEntityId, 'False');
  if (deleteConfirmed == true) {
    //Delete the link document inside the section
    if (sectionName == "section1") //Section1
    {
      $('#guideContainer-rootPanel-SupportingDocuments-guidetextdraw_1262044743__').html((''));
      $("#guideContainer-rootPanel-SupportingDocuments-guidebutton___widget").show();
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_897312271___widget").show();
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_897312271___widget").focus();
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_897312271___widget").val('');
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_897312271___widget").hide();
    }
    if (sectionName == "section2") //Section2
    {
      $('#guideContainer-rootPanel-SupportingDocuments-guidetextdraw__').html((''));
      $("#guideContainer-rootPanel-SupportingDocuments-guidebutton_813703510___widget").show();
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1886157951___widget").show();
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1886157951___widget").focus();
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1886157951___widget").val('');
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1886157951___widget").hide();
    }
    if (sectionName == "section3") //Section3
    {
      $('#guideContainer-rootPanel-SupportingDocuments-guidetextdraw_215587265__').html((''));
      $("#guideContainer-rootPanel-SupportingDocuments-guidebutton_1437155428___widget").show();
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1228189379___widget").show();
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1228189379___widget").focus();
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1228189379___widget").val('');
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1228189379___widget").hide();
    }
    if (sectionName == "section4") //Section4
    {
      $('#guideContainer-rootPanel-SupportingDocuments-guidetextdraw_1376312165__').html((''));
      $("#guideContainer-rootPanel-SupportingDocuments-guidebutton_1514662218___widget").show();
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_204534694___widget").show();
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_204534694___widget").focus();
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_204534694___widget").val('');
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_204534694___widget").hide();
    }
    if (sectionName == "section5") //Section5
    {
      $('#guideContainer-rootPanel-SupportingDocuments-guidetextdraw_650799452__').html((''));
      $("#guideContainer-rootPanel-SupportingDocuments-guidebutton_845862946___widget").show();
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_2059366481___widget").show();
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_2059366481___widget").focus();
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_2059366481___widget").val('');
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_2059366481___widget").hide();
    }
    if (sectionName == "section6") //Section6
    {
      $('#guideContainer-rootPanel-SupportingDocuments-guidetextdraw_107165315__').html((''));
      $("#guideContainer-rootPanel-SupportingDocuments-guidebutton_1619618042___widget").show();
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1306823314___widget").show();
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1306823314___widget").focus();
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1306823314___widget").val('');
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1306823314___widget").hide();
    }
    if (sectionName == "section7") //Section7
    {
      $('#guideContainer-rootPanel-SupportingDocuments-guidetextdraw_1379076389__').html((''));
      $("#guideContainer-rootPanel-SupportingDocuments-guidebutton_1525374115___widget").show();
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1778823185___widget").show();
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1778823185___widget").focus();
      //$("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1778823185___widget").val('');
      $("#guideContainer-rootPanel-SupportingDocuments-guidetextbox_1778823185___widget").show();
    }
  }
}
// ************* END NEW CODE FOR ADD DOC TO A SECTION ******************* //
function dynamicallyLoadScript(url) {
  var script = document.createElement("script"); // create a script DOM node
  script.src = url; // set its src to the provided URL
  document.head.appendChild(script); // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}
function dynamicallyLoadCss(url) {
  var link = document.createElement("link"); // create a script DOM node
  link.href = url; // set its src to the provided URL
  link.rel = "stylesheet";
  document.head.appendChild(link); // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}
var entityId = "";
var _appId = "";
//var webApiRootUrl = "https://gccasewebapi-dev/rdims/"; this is defined in CRX /apps/clientlibs/cecienvspecificCat/js/cecienvspecificvars.js
var dataDocumentURI = webApiRootUrl + "RDIMSDocument/documentListCRMData/?masterEntityId=" + entityId + "&appId=" + _appId;
var dataDocumentVersionURIBase = webApiRootUrl + "RDIMSDocument/documentVersionData/?appId=" + _appId;

//alert(dataDocumentURI);
//var langLabel = "en-US";
//langLabel = langLabel.substring(0, 2);
//Get the list of data from the wepApi
function GetDocumentListData() {
  //alert("entityId:" + entityId + " _appId:" + _appId );
  var wepApiUrl = dataDocumentURI;
  var jdata;
  if (entityId != null && _appId != null) { //if starts here
    $.ajax({
      type: "GET",
      cache: false,
      async: false,
      url: "/bin/rdimsApiGetListOpenDelete", // was-->wepApiUrl --- bescob Sep20
      data: {"wepApiUrl": wepApiUrl}         //contentType: "application/json; charset=utf-8"
    }).done(function(result) {
      jdata = JSON.parse(result); // was "// jdata = result;"
      return jdata;
    }).fail(function(xhr, result, status) {
      alert('GetDocumentListData ' + xhr.statusText + ' ' + xhr.responseText + ' ' + xhr.status);
    });
  } // if ends here
  return jdata;
} //function end
//Get the list of data from the wepApi
//param searchOption : yoursearchvalue
function GetSearchDocumentListData(searchOption) {
  var wepApiUrl = dataDocumentURI + "&optionFilter='" + searchOption + "'";
  var jdata;
  $.ajax({
    type: "GET",
    cache: false,
    async: false,
    url: wepApiUrl,
    //contentType: "application/json; charset=utf-8"
  }).done(function(result) {
    jdata = result;
    return jdata;
  }).fail(function(xhr, result, status) {
    alert('GetDocumentListData ' + xhr.statusText + ' ' + xhr.responseText + ' ' + xhr.status);
  });
  return jdata;
}
/*refresh the grid */
function refreshDatagridWithSearchResult(stringToSearch) {
  var dataT = GetSearchDocumentListData(stringToSearch);
  $('#documentListAjax1').DataTable().clear().draw();
  $('#documentListAjax1').DataTable().rows.add(dataT);
  $('#documentListAjax1').DataTable().columns.adjust().draw()
}
/*refresh the grid */
function refreshDatagrid() {
  //**** Test for refresh the grid from aem form ***//
  /* Changes for appid (ceciacc or ceciprop) ---> Aug19-2021-bescob
    and entityID which is either accountID or proposalID
    occur below.
    ---IGNORE var definitions in 'dynamicallyLoadCss'  
  */
  var masterIdfromForm = sessionStorage.getItem("gac-aem-masterId");
  var appIdFromForm = sessionStorage.getItem("gac-aem-appId");
  //var masterIdfromForm = "CF938AA4-D81D-EB11-96A6-00505681CF84";
  //var appIdFromForm = "ceciacc";
  _appId = appIdFromForm;
  entityId = masterIdfromForm //$("#guideContainer-rootPanel-panel-guidetextbox_747248929___widget").val();
  _masterEntityId = entityId;
  dataDocumentURI = webApiRootUrl + "RDIMSDocument/documentListCRMData/?masterEntityId=" + entityId + "&appId=" + _appId;
  dataDocumentVersionURIBase = webApiRootUrl + "RDIMSDocument/documentVersionData/?appId=" + _appId;
  //$('#infoPage').html(". " + masterIdfromForm + " / " + _appId);
  //******************/
  var dataT = GetDocumentListData();
  $('#documentListAjax1').DataTable().clear().draw();
  $('#documentListAjax1').DataTable().rows.add(dataT);
  $('#documentListAjax1').DataTable().columns.adjust().draw()
}
function initialiseModal() {
  $("#step1").show();
  $('#modal-footer').show();
  $("#step2").hide();
  $('#step3').html("");
  $("#step3").hide();
  $("#scanningProgress").hide();
  $("#title").val("");
  $("#extensionFile").val("");
  $("#fileElem").val("");
  $(".custom-file-input").siblings(".custom-file-label").addClass("selected").html("");
}
function initialiseVersionModal() {
  $("#step1Version").show();
  $('#modal-footer-version').show();
  $("#step2Version").hide();
  $('#step3Version').html("");
  $("#step3Version").hide();
  $("#scanningProgressVersion").hide();
  $("#crmDocId").val("");
  $("#titleVersion").val("");
  $("#extensionFileVersion").val("");
  $("#fileElemNewVersion").val("");
}
//** test servlet **//
function testCallServet() {
  var wepApiUrl = "https://10.21.36.104:4503/bin/customPath"; // dataDocumentURI;  //"http://localhost:63797/RDIMSDocument/documentListCRMData/?masterEntityId=D7AC9850-13D0-E911-81C0-005056BF4A68&appId=AEM";
  var jdata;
  $.ajax({
    type: "GET",
    cache: false,
    async: false,
    url: wepApiUrl,
    crossDomain: true,
    contentType: "text/html; charset=utf-8"
  }).done(function(result) {
    jdata = result;
    console.log(" ----------------| Value come from Servlet: " + jdata + " |---------------- ");
    //return jdata;
  }).fail(function(xhr, result, status) {
    alert('GetDocumentListData ' + xhr.statusText + ' ' + xhr.responseText + ' ' + xhr.status);
  });
  return jdata;
}
//** end  test servlet **// 
$(document).ready(setTimeout(function() {
  //Set the language
  loadlang(langLabel);
  //This value is create form the form
  var masterIdfromForm = sessionStorage.getItem("gac-aem-masterId");
   //var masterIdfromForm = "CF938AA4-D81D-EB11-96A6-00505681CF84";
  //alert(masterIdfromForm + " from Component" ); //set this value in the local field and remove the session value
  //sessionStorage.removeItem("gac-aem-masterId"); //TODO CHECK IF WE NEED TO RESTORE THAT LINE
  //alert(sessionStorage.getItem("masterId"));
  var appIdFromForm = sessionStorage.getItem("gac-aem-appId");
    //var appIdFromForm = "ceciacc";
  _appId = appIdFromForm;
  entityId = masterIdfromForm //$("#guideContainer-rootPanel-panel-guidetextbox_747248929___widget").val();
  _masterEntityId = entityId;
   dataDocumentURI = sessionStorage.getItem("gac_urlbasic")+ entityId + "&appId=" + _appId;
  //dataDocumentURI = webApiRootUrl + "RDIMSDocument/documentListCRMData/?masterEntityId=" + entityId + "&appId=" + _appId;
  dataDocumentVersionURIBase = webApiRootUrl + "RDIMSDocument/documentVersionData/?appId=" + _appId;
  //alert(entityId);
  //console.log("dataDocumentURI" + dataDocumentURI);
  //change the label on bootstrap button - 'browse' to use localization ressource label
  var styles = ".custom-file-label::after{content:'" + _selectedLang.lbl_browse + "' !important;}  ";
  var styleSheet = document.createElement("style")
  styleSheet.type = "text/css"
  styleSheet.innerText = styles
  document.head.appendChild(styleSheet)
  //$('#infoPage').html("Application: " + _appId + " / ReqData: " + _masterEntityName + " / " + _masterEntityId);
  //$('#gridTitle').html("Documents list. (" + cp5 + ")");
  //$('#infoPage').html("" + masterIdfromForm + " / " + _appId);
  $('#gridTitle').html("");
  //remove ... on the file placeholder
  $('#guideContainer-rootPanel-SupportingDocuments-guidetextdraw_1262044743__').html(('.'));
  $('#guideContainer-rootPanel-SupportingDocuments-guidetextdraw__').html(('.'));
  $('#guideContainer-rootPanel-SupportingDocuments-guidetextdraw_215587265__').html(('.'));
  $('#guideContainer-rootPanel-SupportingDocuments-guidetextdraw_1376312165__').html(('.'));
  $('#guideContainer-rootPanel-SupportingDocuments-guidetextdraw_650799452__').html(('.'));
  $('#guideContainer-rootPanel-SupportingDocuments-guidetextdraw_107165315__').html(('.'));
  $('#guideContainer-rootPanel-SupportingDocuments-guidetextdraw_1379076389__').html(('.'));
  //************** Set document on each section **************//
  loadDocumentSection();
  //Populate the grid dynamicaly
  var tableDoc = $('#documentListAjax1').DataTable({
     "lengthMenu": [
     [5, 10, 25, 50, -1],
     [5, 10, 25, 50, "All"]
   ],
   "bFilter": true,
    "processing": true,
    "language": {//Besco Sep8-2021...all elements with '_selectedLang...' are translated for CECI Proposal & Registration
     processing: "Processing ...",
     lengthMenu: _selectedLang.vTblLengthMenu, //"Show _MENU_ entries per page"
     info: _selectedLang.vInfo, //
     infoEmpty: _selectedLang.vTblInfoEmpty, //"Showing 0 to 0 of 0 entries" 
    infoFiltered: "(filtered from _MAX_ total records)",
     infoPostFix: "",
     loadingRecords: "loading ...",
     zeroRecords: "No matching records found",
     emptyTable: _selectedLang.vTblNoRecords,
     paginate: {
      first: "First",
      next: _selectedLang.vTblNext,
      previous: _selectedLang.vTblPrevious,
      last: "Last"
      },
      aria: {
       sortAscending: ": activate to sort column ascending",
       sortDescending: ": activate to sort column descending"
     }
  },
    "order": ([4, 'desc']),
    "aaData": GetDocumentListData(),
    "aoColumns": [{
        "className": 'details-control',
        "sWidth": "1px",
        "bVisible": false,
        "bSortable": false,
        "bSearchable": false,
        "data": null,
        "defaultContent": '',
        render: function(aaData, type, row) {
          // Combine the first and last names into a single table field
          var openVersionLink = "<a href='#'><i id='expandButton' class='fa fa-plus-circle'></i></a> "; //"Open version";
          return openVersionLink;
        }
      },
      {
        "sTitle": "Title ",
        "bVisible": false,
        "mDataProp": "gac_rdimdocumentcontentid",
        render: function(aaData, type, row) {
          // Combine the first and last names into a single table field
          var linkToCrmEntityForm =  "<a title='" + row.gac_rdimfilename + "' target='_blank' class='ms-crm-List-Link' href=\"" + "https://crm-grc2-international-cdt.cdt.gccas-gccase.gc.ca/main.aspx" + "/?pagetype=entityrecord&etn=gac_rdimdocumentcontent&id=" + row.gac_rdimdocumentcontentid + "\">" + row.gac_rdimfilename + "</a>";
          return linkToCrmEntityForm;
        }
      },
      {
        "sTitle": "Application",
        "bVisible": false,
        "mDataProp": "gac_applicationtypeLabel"
      },
      {
        "sTitle": "Modified by",
        "bVisible": false,
        "mDataProp": "gac_rdimresponsibleuserLabel"
      },
      {
        "sTitle": "Application",
        "bVisible": false,
        "mDataProp": "gac_applicationtype"
      },
      {
        "sTitle": "Modified On",
        "bVisible": false,
        "mDataProp": "createdon"
      },
      {
        "sTitle": _selectedLang.vTblFileName,
        "bVisible": true,
        "mDataProp": "gac_rdimfilename"

      },  
      {
        "sTitle": _selectedLang.vTblDescription,
        "bVisible": true,
        "mDataProp": "gac_filedescription"

      },      
      {
        "sTitle": "document number",
        "bVisible": false,
        "mDataProp": "gac_rdim_documentid",
      },
      {
        "sTitle": "Version ID",
        "bVisible": false,
        "mDataProp": "gac_rdimdocumentversionid"
      },
      {
        "sTitle": "Extension Extension",
        "bVisible": false,
        "mDataProp": "gac_extentionfile"
      },
      {
        "sTitle": "Modified On",
        "bVisible": false,
        "mDataProp": "modifiedon",
        render: function(aaData, type, row) {
          // format this date
          var dateM = new Date(row.modifiedon); //Format: Wed Nov 13 2019 11:55:31 GMT-0500 (Eastern Standard Time)
          var strD = row.modifiedon;
          var dateFormatUs = dateM.toLocaleDateString("en-US"); //Can use the localisation
          var modifiedDateStr = dateM.toLocaleString(); //?Format: 13?/?11?/?2019? ?11?:?55?:?31? ?AM
          return modifiedDateStr;
        }
      },
      {
        "sTitle": "Modified by",
        "bVisible": false,
        "mDataProp": "modifiedby"
      },
      {
        "sTitle": "Modified by",
        "bVisible": false,
        "mDataProp": "modifiedbyLabel"
      },
      {
        "sTitle": "Virus scan pending",
        "bVisible": false,
        "mDataProp": "gac_virusscanpending"
      },
      {
        "sTitle": "Application ID",
        "bVisible": false,
        "mDataProp": "gac_applicationid"
      },
      {
        "sTitle": "Version",
        "bVisible": false,
        "mDataProp": "gac_rdimversionlabel"
      },
      {
        "sTitle": _selectedLang.vTblOpen,
        "bSortable": false,
        "bVisible": true, // [Besco-Nov2-2022:reverted to 'true' for dev/testing]hide column "Open" in grid... changed to 'false'
        "mDataProp": "gac_rdimdocumentcontentid",
        render: function(aaData, type, row) {
          // Combine the row data into a link to open a document
          var openDocumentLink = "<a data-value='" + row.gac_rdimdocumentcontentid + "' href=\"javascript:openFile(" + row.gac_rdim_documentid + "," + row.gac_rdimdocumentversionid + ",'" + row.gac_applicationtypeLabel + "','" + row.gac_rdimfilename + "')\" id=\"openFile1\" class=\"btnEdit\">Open</a>";
          return openDocumentLink;
        }
      },
      {
        "sTitle": _selectedLang.vTblDelete,
        "bSortable": false,
        "bVisible": true,
        "mDataProp": "gac_rdimdocumentcontentid",
        render: function(aaData, type, row) {
          // Combine the row data into a link to delete a document
          var deleteDocumentLink = "<a data-value='" + row.gac_rdimdocumentcontentid + "' href=\"javascript:deleteDocument('" + row.gac_rdimdocumentcontentid + "','" + row.gac_virusscanpending + "')\" id='deleteFile1' class='btnEdit'>X</a>";
          return deleteDocumentLink;
        }
      },
      {
        "sTitle": "Update",
        "bSortable": false,
        "bVisible": false,
        "mDataProp": "gac_rdimdocumentcontentid",
        render: function(aaData, type, row) {
          // Combine the row data into a link to update a document
          var updateDocumentLink = "<a data-value='" + row.gac_rdimdocumentcontentid + "' href=\"javascript:AddDocumentVersion('" + row.gac_rdimdocumentcontentid + "')\" id='AddDocumentVersion' class='btnEdit'>Update...</a>";
          return updateDocumentLink;
      }
      },
    ]
  });
  //End populate the grid Dynamicaly
  //Add Element in the Grid Header;
  //$('#documentListAjax1_filter').html("");
  //var stylesSearchTextbox = ".overflowHide {overflow:hidden} ";
  //$("#documentListAjax1_filter").classList.add(stylesSearchTextbox);
  //$("#documentListAjax1_filter").css("overflow", "hidden");
  $("#documentListAjax1_filter").find("label").hide();
  $('<label id="searchCriteriaLabel"></label>').appendTo('div.dataTables_filter');
  jQuery("#searchContainer").detach().appendTo('div.dataTables_filter')
  //$('<input type="checkbox" id="searchContentChecked" />&nbsp;').appendTo('div.dataTables_filter');
  //$('<label id="searchLabel" for="site-search">&nbsp;Check if you want to search in the grid</label>').appendTo('div.dataTables_filter');
  //$('<input    type="search" id="doc-search" name="docSearch" aria-label="Search through document content">').appendTo('div.dataTables_filter');
  //$('<button type="button" class="btn btn-primary btn-sm" style="height=3em" id="searchDoc">Search</button>').appendTo('div.dataTables_filter');
  // Add event listener for opening and closing details
  $('#documentListAjax1').on('click', 'td.details-control', function() {
    var tr = $(this).closest('tr');
    var row = tableDoc.row(tr);
    if (row.child.isShown()) {
      // This row is already open - close it
      row.child.hide();
      tr.removeClass('shown');
      tr.find('#expandButton').removeClass("fa-minus-circle fa_custom");
      tr.find('#expandButton').addClass("fa-plus-circle");
    } else {
      // Open this row
      row.child(format(row.data())).show();
      tr.addClass('shown');
      tr.find('#expandButton').removeClass("fa-plus-circle");
      tr.find('#expandButton').addClass("fa-minus-circle fa_custom");
    }
  });
  function format(row) {
    var div = $('<div/>')
      .addClass('loading')
      .text('Loading version...' + row.gac_rdim_documentid);
    var wepApiUrl = dataDocumentVersionURIBase + "&rdimDocId=" + row.gac_rdim_documentid; //dataDocumentURI;
    var jdata;
    $.ajax({
      type: "GET",
      cache: false,
      async: false,
      url: wepApiUrl,
      //contentType: "application/json; charset=utf-8"
    }).done(function(result) {
      jdata = result;
      //alert(jdata);
      return jdata;
    }).fail(function(xhr, result, status) {
      alert('GetDocumentListData ' + xhr.statusText + ' ' + xhr.responseText + ' ' + xhr.status);
    });
    var table = $('#' + row.gac_rdim_documentid).DataTable({
      "aaData": jdata,
    });
    var numberVersion = jdata.length - 1;
    var htmlString = "Document #{0} have {1} version(s) : ".format(row.gac_rdim_documentid, numberVersion);
    var i;
    var sepCount = 0;
    for (i = 0; i < jdata.length; i++) {
      sepCount++;
      if (row.gac_rdimdocumentversionid != jdata[i].Id) {
        var openDocumentLink;
        openDocumentLink = "<a data-value='" + row.gac_rdimdocumentcontentid + "' href=\"javascript:openFile(" + row.gac_rdim_documentid + "," + jdata[i].Id + ",'" + row.gac_applicationtypeLabel + "','" + row.gac_rdimfilename + "')\" id=\"openFile1\" class=\"btnEdit\">Open v" + jdata[i].Label + "</a> ";
        if (i > 0) openDocumentLink = " | " + openDocumentLink;
        htmlString += openDocumentLink; // + "<br/>";
      }
    }
    div.html(htmlString);
    div.removeClass('loading');
    return div;
  }
  //Funtion to format string with parameter la "This doc {0} have {1} versions"
  String.prototype.format = function() {
    var formatted = this;
    for (var arg in arguments) {
      formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }
    return formatted;
  };
  if (_masterEntityId) {
    _masterEntityId = _masterEntityId;
    _masterEntityId = _masterEntityId.replace('%7b', '').replace('%7d', '')
  }
  //Refresh the grid with original data
  $("#refreshGrid").on('click', function() {
    //var testFieldValue = $("#guideContainer-rootPanel-panel-firstname1574697543238___widget").val();
    //alert(testFieldValue);	
    tableDoc.search("").draw(); //Delete the actual filter
    refreshDatagrid();
    $('#searchCriteriaLabel').html("All documents");
  })
  //Request to crm
  $("#searchDoc").on('click', function() {
    tableDoc.search("").draw(); //Delete the actual filter
    var stringToSearch = $('#doc-search').val();
    refreshDatagridWithSearchResult(stringToSearch);
    $('#searchCriteriaLabel').html("Document content search result for : {0} ".format(stringToSearch));
  })
  //Search localy in the data grid
  $("#searchGrid").on('click', function() {
    var stringToSearch = $('#doc-search').val();
    tableDoc.search(stringToSearch).draw();
    var query = tableDoc.search();
    $('#searchCriteriaLabel').html("Search result in the grid for : {0} ".format(query));
  })
  $("#searchContentChecked").on('click', function() {
    if ($("#searchContentChecked").is(":checked")) {
      $("#searchLabel").html("&nbsp;Search in the grid data (local search)");
    } else {
      $("#searchLabel").html("&nbsp;Check if you want to search in the grid");
    };
  })
  $("#addDocumentAction").on('click', function() {
    /************ Start Code for add doc to section ******************/
    var sectionIdValue = sessionStorage.getItem("section-id");
    var prefixFile = "";
    //alert(sectionIdValue);
    if (sectionIdValue == "section1") {
      prefixFile = "proofOfTest_";
    }
    if (sectionIdValue == "section2") {
      prefixFile = "";
    }
    if (sectionIdValue == "section3") {
      prefixFile = "ltrIntFrCand_";
    }
    if (sectionIdValue == "section4") {
      prefixFile = "ltrSuppFrCHI_";
    }
    if (sectionIdValue == "section5") {
      prefixFile = "ltrInvFrCSup_";
    }
    if (sectionIdValue == "section6") {
      prefixFile = "signCopMUA_";
    }
    if (sectionIdValue == "section7") {
      prefixFile = "privNotStatSign_";
    }
    /************ End Code for add doc to section ******************/
    var enableScanFile = false;
    var waitForVirusScan = true;
    var fileElem = document.getElementById("fileElem");
    var secNameFile = prefixFile + document.getElementById("fileElem").files[0].name;
    var selectedFileName = document.getElementById("fileElem").files[0].name;
    var realfileName = $('#title').val();

    var extensionfileName = $('#extensionFile').val();
    var appTypeLabel = GetApplicationName(extensionfileName.toLowerCase());
    var data = new FormData();
    var fileDescription = $('#File_Description').val();
    //Create metadcccccccccbbbbbbbbbbbbata str
    var metaDataStr = '{\"Title\":\"' + realfileName +
      '\",\"TrusteeRights\":[{\"Trustee\":\"' + _GAC_METADATA_TRUSTEE +
      '\",\"Rights\":' + _GAC_METADATA_RIGHTS +
      '}],\"Typist\":\"' + _GAC_METADATA_TYPIST +
      '\",\"Security\":\"' + _GAC_METADATA_SECURITY +
      '\",\"ResponsibleUser\":\"' + _GAC_METADATA_RESPONSIBLEUSER +
      '\",\"Language\":\"ENG\",\"FilePt\":\"' + _GAC_METADATA_FILEPT +
      '\",\"DepartmentId\":\"' + _GAC_METADATA_DEPARTMENTID + '\",\"Application\":\"' + appTypeLabel + '\"}'
    //End Create metadata str
    data.append("fileName", selectedFileName);
    data.append("metadata", metaDataStr);
    data.append('file', fileElem.files[0], secNameFile);
    data.append("entityType", _masterEntityName);
    data.append("lookupEntityFieldName", _lookupEntityFieldName);
    data.append("entityId", _masterEntityId);
    data.append("appid", _appId);
    data.append("fileDescription",fileDescription);
    var xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        console.log(this.responseText);
        console.log(this.responseText.documentId);
      }
    });
    //If the grid is outside network we need to scan the file before sending to rdim
    var urlRequest = webApiRootUrl + "api/RDIMS/addnewdocument/?lang=" + langLabel;
    if (enableScanFile) {
      urlRequest = webApiRootUrl + "api/RDIMS/DocumentWithScanProcess"
    } else {
      urlRequest = webApiRootUrl + "api/RDIMS/addnewdocument/?lang=" + langLabel;
    }
    // AK-BB-C 27-09
//    xhr.open("POST", urlRequest);
    xhr.open("POST", "/bin/rdimsApiPostFileUpload");
    $("#step2").show();
    $("#step1").hide();
    $('#modal-footer').hide();
    xhr.upload.onprogress = function(e) {
      if (e.lengthComputable) {
        var loadedValue = Math.round((e.loaded / 1024));
        var totalValue = Math.round((e.total / 1024));
        var percentage = Math.round((e.loaded / e.total) * 100);
        //var loadedVal =  e.loaded / 1024
        console.log(e.loaded + " / " + e.total + " / " + loadedValue + " / " + totalValue)
        $("#statusProg").html(_selectedLang.label_uploading + ":<b> " + loadedValue + "KB/" + totalValue + "KB   " + (percentage + '%</b>'));
        document.getElementsByClassName('progress-bar').item(0).setAttribute('aria-valuenow', percentage);
        document.getElementsByClassName('progress-bar').item(0).setAttribute('style', 'width:' + percentage + '%');
        if (loadedValue == totalValue) {
          //$(".progress").hide();
          $("#statusProg").html(_selectedLang.label_uploading + ":<b>" + _selectedLang.label_uploading_done + "!</b>");
          if (waitForVirusScan) {
            $("#scanningProgress").show();
          }
        }
      }
    }
    xhr.onloadstart = function(e) {
      console.log("start");
      $("#statusProg").text("Start sending your file");
    }
    xhr.onloadend = function(e) {
      console.log("end");
      $("#statusProg").text("Sending your file is done");
    }
    xhr.onload = function() {
      addDocumentHandler(this);
      console.log('DONE: ', xhr.status);
    };
    xhr.send(data);
  })
  function addDocumentHandler(xhttp) {
/*------------ BEGIN temp fix, need to find out why servlet returns XML, vs JSON via original method
    resp = JSON.parse(xhttp.response); //bescob response from RDIMS is XML, not JSON
    t = resp.documentId;
    v = resp.versionId;
    entityId = resp.entityIdCreated;
    /************ Start Code for add doc to section ******************/
/*    var sectionIdValue = sessionStorage.getItem("section-id");
    //alert(sectionIdValue);
    if (sectionIdValue == "section1") {
      //$('#guideContainer-rootPanel-SupportingDocuments-guidetextbox___widget').val(t);
    }
    if (sectionIdValue == "section2") {
      //$('#guideContainer-rootPanel-SupportingDocuments-guidetextbox_619638569___widget').val(t);
    }
    if (sectionIdValue == "section3") {
      //$('#docNumberSection3').val(t);
    }
    if (sectionIdValue == "section4") {
      //$('#docNumberSection4').val(t);
    } */ //  ------------------END OF TEMP FIX
    /************ End Code for add doc to section ******************/
    $('#modal-footer').hide();
    $("#step2").hide();
    $("#step3").show();
    $('#step3').html(_selectedLang.save_message);
    //Original// $('#step3').html(resp.resultMessage);
  }
  /* changing the modal title with section document title */
  $('#exampleModal').on('show.bs.modal', function() {
    //$("#add-section-title").val("Section 1");
    //$("#exampleModalLabel").val("Section 1");
    /************ Start Code for add doc to section ******************/
    var sectionIdValue = sessionStorage.getItem("section-id");
    var sectionTitle = "";
    if (sectionIdValue == "section1") {
      sectionTitle = _selectedLang.sect1_title;
    }
    if (sectionIdValue == "section2") {
      sectionTitle = _selectedLang.sect2_title;
    }
    if (sectionIdValue == "section3") {
      sectionTitle = _selectedLang.sect3_title;
    }
    if (sectionIdValue == "section4") {
      sectionTitle = _selectedLang.sect4_title;
    }
    if (sectionIdValue == "section5") {
      sectionTitle = _selectedLang.sect5_title;
    }
    if (sectionIdValue == "section6") {
      sectionTitle = _selectedLang.sect6_title;
    }
    if (sectionIdValue == "section7") {
      sectionTitle = _selectedLang.sect7_title;
    }
    /************ End Code for add doc to section ******************/
    document.getElementById("exampleModalLabel").innerHTML = _selectedLang.form_title + " " + sectionTitle;
  });
  $('#exampleModal').on('hidden.bs.modal', function() {
    initialiseModal();
    refreshDatagrid();
    //Code for add doc to section	
    loadDocumentSection();
  });
  // ******** NEW CODE FOR ADDING DOCUMENT TO A SECTION ************ //
  $("#fileElem").on("change", function() {
    //_selectedLang.validExtensionsMessage _selectedLang.fileSizeAllowMessage
    //Get value from Application
    var validFile = true;
    var listExtension = sessionStorage.getItem("emdsp_validExtensions");
    var validExtensionsMessage = _selectedLang.validExtensionsMessage; //sessionStorage.getItem("emdsp_validExtensionsMessage");
    var fileSizeAllow = sessionStorage.getItem("edmsp_fileSizeAllow");
    var fileSizeAllowMessage = _selectedLang.fileSizeAllowMessage; //sessionStorage.getItem("edmsp_fileSizeAllowMessage");
    //Check file type
    //var listExtension = ".pdf,.doc,.docx, .xls, .xlsx,.png,.jpg,.gif";
    var validExtensions = listExtension.split(","); //array of valid extensions
    var fileName = this.files[0].name;
    var fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
    if (validExtensions.lastIndexOf(fileNameExt) == -1) {
      alert(validExtensionsMessage + listExtension);
      $(this).val('');
    }
    //Check size
    if (this.files[0].size > fileSizeAllow) {
      alert(fileSizeAllowMessage);
      $(this).val('');
    }
  });
  //*************** ******************** ******************** **********//
  $(".custom-file-input").on("change", function() {
    var fileName = $(this).val().split("\\").pop();
    $("#title").val(fileName.split(".")[0]);
    $("#extensionFile").val(fileName.split(".").pop());
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
  });
  $('#newDocVersionModal').on('hidden.bs.modal', function() {
    initialiseVersionModal();
    refreshDatagrid();
  });
  $("#fileElemNewVersion").on("change", function() {
    var fileName = $(this).val().split("\\").pop();
    $("#titleVersion").val(fileName.split(".")[0]);
    $("#extensionFileVersion").val(fileName.split(".").pop());
    $(this).siblings(".custom-file-label version").addClass("selected").html(fileName);
  });
  var oDocumentTable = $('#documentList').DataTable({
    "lengthMenu": [
    [5, 10, 25, 50, -1],
     [5, 10, 25, 50, "All"]
    ],
  "paging": "simple", // false to disable pagination (or any other option)
    "language": {
    "lengthMenu": "Display _MENU_ documents per page",
    "zeroRecords": "No documents found - sorry",
    "info": "Showing page _PAGE_ of _PAGES_",
    "info": "page _PAGE_ of _PAGES_",
    "infoEmpty": "No documents linked",
   "infoFiltered": "(filtered from _MAX_ total records)"
    }
  });
  //*** action to add a document version ***//
  $("#addDocumentVersionAction").on('click', function() {
    var enableScanFile = false;
    var waitForVirusScan = true;
    var fileElem = document.getElementById("fileElemNewVersion");
    var crmDocId = $('#crmDocId').val();
    var realfileName = $('#titleVersion').val();
    var extensionfileName = $('#extensionFileVersion').val();
    var appTypeLabel = GetApplicationName(extensionfileName.toLowerCase());
    var data = new FormData();
    var fileDescription = $('#File_Description').val();  //"File description from client form";
    //Create metadata str
    var metaDataStr = '{\"Title\":\"' + realfileName +
      '\",\"TrusteeRights\":[{\"Trustee\":\"' + _GAC_METADATA_TRUSTEE +
      '\",\"Rights\":' + _GAC_METADATA_RIGHTS +
      '}],\"Typist\":\"' + _GAC_METADATA_TYPIST +
      '\",\"Security\":\"' + _GAC_METADATA_SECURITY +
      '\",\"ResponsibleUser\":\"' + _GAC_METADATA_RESPONSIBLEUSER +
      '\",\"Language\":\"ENG\",\"FilePt\":\"' + _GAC_METADATA_FILEPT +
      '\",\"DepartmentId\":\"' + _GAC_METADATA_DEPARTMENTID + '\",\"Application\":\"' + appTypeLabel + '\"}'
    //End Create metadata str
    data.append("metadata", metaDataStr);
    data.append('file', fileElem.files[0]);
    data.append("entityType", _masterEntityName);
    data.append("lookupEntityFieldName", _lookupEntityFieldName);
    data.append("entityId", _masterEntityId);
    data.append("appid", _appId);
    data.append("fileDescription", fileDescription);
    data.append("crmDocId", crmDocId);
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });
    xhr.open("POST", webApiRootUrl + "api/RDIMS/CreateDocumentVersion/?lang=" + langLabel);
    $("#step2Version").show();
    $("#step1Version").hide();
    $('#modal-footer-version').hide();
    xhr.upload.onprogress = function(e) {
      if (e.lengthComputable) {
        var loadedValue = Math.round((e.loaded / 1024));
        var totalValue = Math.round((e.total / 1024));
        var percentage = Math.round((e.loaded / e.total) * 100);
        console.log(e.loaded + " / " + e.total + " / " + loadedValue + " / " + totalValue)
        $("#statusProgVersion").html("uploading your file :<b> " + loadedValue + "KB/" + totalValue + "KB   " + (percentage + '%</b>'));
        document.getElementsByClassName('progress-bar version').item(0).setAttribute('aria-valuenow', percentage);
        document.getElementsByClassName('progress-bar version').item(0).setAttribute('style', 'width:' + percentage + '%');
        if (loadedValue == totalValue) {
          $("#statusProgVersion").html("uploading your file :<b> Done!</b>");
          if (waitForVirusScan) {
            $("#scanningProgressVersion").show();
          }
        }
      }
    }
    //xhr.onprogress = update_progress;
    xhr.onloadstart = function(e) {
      console.log("start");
      $("#statusProgVersion").text("Start sending your file");
    }
    xhr.onloadend = function(e) {
      console.log("end");
      $("#statusProgVersion").text("Sending your file is done");
    }
    xhr.onload = function() {
      addDocumentVersionHandler(this);
      console.log('DONE: ', xhr.status);
    };
    xhr.send(data);
  })
  //*** end of action to add a document version ***//
  function addDocumentVersionHandler(xhttp) {
    resp = JSON.parse(xhttp.response);
    t = resp.documentId;
    v = resp.versionId;
    $('#modal-footer-version').hide();
    $("#step2Version").hide();
    $("#step3Version").show();
    $('#step3Version').html(resp.resultMessage);
  }
}, 3000));
function openFile(id, versionid, appNameStr, fileName) {
  var appName = appNameStr;
  var docName = fileName;
  var mineTypeDoc = getMineType(appName);
  var xhr = new XMLHttpRequest();
  //xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function() {
    if (this.readyState === 4) {}
  });
  xhr.open("GET", webApiRootUrl + "api/RDIMS/DocumentContents/" + id + "?versionid=" + versionid + '&appid=' + _appId); //txt
  xhr.setRequestHeader("Accept", "*/*");
  xhr.setRequestHeader("accept-encoding", "gzip, deflate");
  xhr.onload = function() {
    console.log('DONE: ', xhr.status);
    // Create a new Blob object using the response data of the onload object
    var t = this.response;
    var res = t.replace("\"", "");
    var res = res.replace("\"", "");
    t3 = base64ToArrayBuffer(res);
    var blob = new Blob([t3], {
      type: mineTypeDoc
    });
    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, docName);
    } else {
      var temp_link = document.createElement('a');
      temp_link.href = URL.createObjectURL(blob);
      temp_link.download = docName;
      temp_link.type = mineTypeDoc;
      document.body.appendChild(temp_link);
      temp_link.click();
      temp_link.remove();
    }
  };
  xhr.send();
}
function deleteDocument(docEntityId, pendingFile) {
  if (pendingFile == '') pendingFile = 'false';
  var deleteConfirmed = false;
  if (confirm(_selectedLang.delete_confirm) == true) {
    var documentId = docEntityId;
    deleteConfirmed = true;
    var xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) { }
    });
    var baseUrlRequest = webApiRootUrl + "api/RDIMS/DeleteDocument/";
    if (pendingFile.toLowerCase() == 'true') {
      baseUrlRequest = webApiRootUrl + "api/RDIMS/DeleteDocumentWithScanProcess/"
    } else {
      baseUrlRequest = webApiRootUrl + "api/RDIMS/DeleteDocument/";
    }
    var webApiDeleteDocumentActionUrl = baseUrlRequest + documentId + '/?appid=' + _appId;

    /* bescob
    xhr.open("GET", webApiDeleteDocumentActionUrl);
    xhr.onload = function() {
      refreshDatagrid();
    };
    xhr.send(); */
    $.ajax({
      type: "GET",
      cache: false,
      async: false,
      url: "/bin/rdimsApiGetListOpenDelete", // was-->wepApiUrl --- bescob Sep20
      data: { "wepApiUrl": webApiDeleteDocumentActionUrl }         //contentType: "application/json; charset=utf-8"
    }).done(function (result) {
      var jdata = JSON.parse(result); // was "// jdata = result;"
      refreshDatagrid();
    }).fail(function (xhr, result, status) {
      alert('GetDocumentListData ' + xhr.statusText + ' ' + xhr.responseText + ' ' + xhr.status);
    });
  }
  return deleteConfirmed;
}
function AddDocumentVersion(docEntityId) {
  $("#crmDocId").val(docEntityId);
  $("#newDocVersionModal").modal();
}
function base64ToArrayBuffer(base64) {
  var binaryString = atob(base64);
  var binaryLen = binaryString.length;
  var bytes = new Uint8Array(binaryLen);
  for (var i = 0; i < binaryLen; i++) {
    var ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
  }
  return bytes;
}
function getMineType(appName) {
  var mineTypeValue = '';
  switch (appName) {
    case 'WINZIP':
      // zip
      mineTypeValue = "application/zip";
      break;
    case 'WORDPAD':
      // txt
      mineTypeValue = "text/plain";
      break;
    case 'ACROBAT':
      // pdf
      mineTypeValue = "application/pdf";
      break;
    case 'MS WORD':
      // DOCX
      mineTypeValue = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      break;
    case 'MS EXCEL':
      // XLSX
      mineTypeValue = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      break;
    case 'MS POWERPOINT':
      // PPTX
      mineTypeValue = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
      break;
    case 'PUB PNG':
      // PNG
      mineTypeValue = "image/x-png";
      //mineTypeValue = "image/png";
      break;
    case 'IMAGES':
      // IMAGE TIF
      //mineTypeValue = "image/tif";
      mineTypeValue = "application/tif";
      break;
    default:
      mineTypeValue = "application/octet-stream";
      // code block
  }
  return mineTypeValue;
}
function GetApplicationName(extensionName) {
  var applicationName = '';
  switch (extensionName) {
    case "log":
    case "txt":
      applicationName = "WORDPAD";
      break;
    case "pdf":
      applicationName = "ACROBAT";
      break;
    case "docx":
      applicationName = "MS WORD";
      break;
    case "zip":
      applicationName = "WINZIP";
      break;
    case "xlsx":
      applicationName = "MS EXCEL";
      break;
    case "msg":
      applicationName = "MS OUTLOOK";
      break;
    case "pptx":
      applicationName = "MS POWERPOINT";
      break;
    case "png":
      applicationName = "PUB PNG";
      break;
    case "jpg":
      applicationName = "DOCSIMAGE";
      break;
    case "vsd":
      applicationName = "VISIO";
      break;
    default:
      break;
  }
  return applicationName;
}
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
    vars[key] = value;
  });
  return vars;
}