//RDMS-DEV-cecienvspecificCat-1.0(Jun28-2022)

//The following three lines must be uncommented for deployment of this package to:
//<<<---localhost, dev04, 05, PRD == CDT and the Production GCcase
var vRdmsTargetEnvAccountAppId = "ceciacc"; 
var vRdmsTargetEnvProposalAppId = "ceciprop"; 
var vRdmsTargetEnvClaimAppId = "ceciclaim"; 

//The following three lines must be uncommented for deployment of this package to:
//<<<---QC/Dev06 == CDT1
/* 
var vRdmsTargetEnvAccountAppId = "ceciqcacc"; 
var vRdmsTargetEnvProposalAppId = "ceciqcprop"; 
var vRdmsTargetEnvClaimAppId = "ceciqclaim"; 
*/

//The following three lines must be uncommented for deployment of this package to:
//<<<---AEM-pPRD == ?? pPRD GCcase
/* 
var vRdmsTargetEnvAccountAppId = "cecippacc";
var vRdmsTargetEnvProposalAppId = "cecippprop"; 
var vRdmsTargetEnvClaimAppId = "???cecipclaim ???"; <<<--- CHECK THIS VALUE
*/

//There are only TWO values for the webApiRootUrl
//var webApiRootUrl = "https://gccasewebapi-dev/rdims/"; //<<<---localhost, dev05, dev06 & pPRD
var webApiRootUrl = "https://gccasewebapi/rdims/"; //<<<---Production

console.log("RDMS--->/apps/clientlibs/cecienvspecificCat/js/cecienvspecificvars.js->vRdmsTargetEnvAccountAppId: "+vRdmsTargetEnvAccountAppId);
console.log("RDMS--->/apps/clientlibs/cecienvspecificCat/js/cecienvspecificvars.js->webApiRootUrl: "+webApiRootUrl);

//preProduction -- note "pp" in the appid
//appid=cecippacc
// https://gccasewebapi-dev/rdims/RDIMSDocument/DocumentList/?masterEntityId=000000-0000-0000&appid=cecippacc
//appid=cecippprop
// https://gccasewebapi-dev/rdims/RDIMSDocument/DocumentList/?masterEntityId=000000-0000-0000&appid=cecippprop

