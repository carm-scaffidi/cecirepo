
function ceciOpenFileRdms(id, versionid, appNameStr, fileName) {
  var appName = appNameStr;
  var docName = fileName;
  var mineTypeDoc = getMineType(appName);
  var _appId = "ceciclaim"
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
function getClaimById(vClaimId) {
  var objData;
  var getClaimsArgs = JSON.stringify({
    "gac_fdiclaimid": vClaimId
  });
  console.log("getClaimsArgs: " + getClaimsArgs);
  var operationName = "GET gac_fdiclaimJunkThis";
  var data = execCRMService3Args(operationName, getClaimsArgs);
  if (Array.isArray(data)) { console.log("There is an array of data") }
  else {
    if (!! data && !! data.result && data.result.toLowerCase() === ("No response").toLowerCase()) {
      console.log("No Claims")
    }
  }
  console.log(new Date() + ", vClaimId: " + vClaimId + (!! data ? ", number of budgetitems: " +  data.gac_numberofbudgetitems + ", " + + ", number of budgetitems: " + data.gac_numberofexpenseitems : " not good response "));
  return !!data && !!data.gac_isreadyfordisplay;
}
