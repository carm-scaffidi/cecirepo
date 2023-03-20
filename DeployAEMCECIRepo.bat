@echo off
: DeployAEMCECIRepo.bat (Working Directory C:\AppsWorkSpaces\...\cecirepo\DeployAEMCECIRepo.bat)
: 2022-09-23

: Create Maven Variables that will be used as arguments to Maven
: to Deploy the CECI AEM Application to an AEM Instance.

set AEMDeployType=%1
set AEMProjectName=%2

: Script Workflow-Usage
: ---------------------
: For Default Build/Deploy:
: 3rd and 4th Args should be empty i.e. not provided.
set AEMIncludeDeveloperForms=
set AEMIncludeBundle=

: For Dev Adaptive Forms to be Included in Build/Deploy:
: 3rd Arg (AEMIncludeDeveloperForms) needs to be "dev"
set AEMIncludeDeveloperForms=%3

: For Bundle to be included in Build/Deploy:
: 4th Arg (AEMIncludeBundle) needs to be "bundle"
set AEMIncludeBundle=%4

: Define Do Not Deploy Target so that an AEM Deploy does not occur by default
: to the Active AEM TST-UAT Track.
: The Active AEM TST-UAT Track can be one of:
:   [dev06-aut] for aemosgidev06:4504 or [dev06-pub] for aemosgidev06:4505
:   as identified in the Portal Broker file "AppConf.resx" which can be found at
:       \\hqs-dmdyndb01\d$\inetpub\EDMSPWEB\App_GlobalResources\AppConf.resx
set vDNDTarget=dev06-pub

: Begin Check to ensure Deploy Taget is not the Do Not Deploy Target.
if not "%AEMProjectName%"=="%vDNDTarget%" goto main

:usage
@echo.
@echo The [%AEMProjectName%] Target is currently the Active AEM TST-UAT Track.
@echo Deployment to this Target is currently disabled.
@echo.

exit /B 1
: end Check to ensure an Argument was passed.

:main
@echo.
echo Deployment Project Name is: %AEMProjectName%
echo Deployment Type is: %AEMDeployType%
@echo.
echo Developers Adaptive Forms is Included in Deploy if "dev" was passed as the third argument to this Batch file
echo The third argument value passed was: %AEMIncludeDeveloperForms%
@echo.
echo POM Profile [-PautoInstallBundle] is Included in Deploy if "bundle" was passed as the forth argument to this Batch file
echo The forth argument value passed was: %AEMIncludeBundle%
@echo.

: Example Command being wrapped into this Batch file is for an Author:
: 	mvn clean install -Denv=carmdev-aut -PautoInstallPackage >carmdev-aut-buildlog.txt
: OR for Publisher:
:   mvn clean install -Denv=carmdev-pub -PautoInstallPackagePublish >carmdev-pub-buildlog.txt

set P0=mvn
: Set P1 to 'clean' if you want MVN invovked with the "clean" option.
:   The 'clean' option removes previously built artifacts. 
set P1=clean
set P2=install
set P3=-Denv=%AEMProjectName%

: For Authors
:   set P4=-PautoInstallPackage
: For Publishers
:   set P4=-PautoInstallPackagePublish

: Default is to use Next Line when Servlet has not changed (Default Build)
set P4=-P%AEMDeployType%

: Bundle Workflow
if "%AEMIncludeBundle%" == "bundle" goto IncludeBundle
if "%AEMIncludeBundle%" == "" goto skipDevBundle

:IncludeBundle
    @echo.
    echo Including POM Profile [-PautoInstallBundle] in Deployment...
    @echo on
: Only Use Next Line when a Servlet Change has occured that needs Building/Deploying
    set P4=-P%AEMDeployType% -PautoInstallBundle
    @echo off
    goto BundleIncluded

:skipDevBundle
@echo.
echo Excluding POM Profile [-PautoInstallBundle] in Deployment...

:BundleIncluded

set P5=%AEMProjectName%-buildlog.txt

: Developer Adpative Forms Workflow
: Developers Adaptive Forms will be Included in Deploy if "dev" was passed as the third argument to this Batch file
set vAEMResetFilter=false

if "%AEMIncludeDeveloperForms%" == "dev" goto IncludeDevForms
if "%AEMIncludeDeveloperForms%" == "" goto SkipDevForms

:IncludeDevForms
    set vAEMResetFilter=true
    @echo.
    echo Including Developer Adpative Forms in Deployment...
    @echo on
    copy /Y /Y ui.content\src\main\content\META-INF\vault\filterIncDev.xml ui.content\src\main\content\META-INF\vault\filter.xml
    @echo off
    goto AfterSkipDevFormsBlock

:SkipDevForms
    set vAEMResetFilter=true
    @echo.
    echo Excluding Developer Adpative Forms in Deployment...
    @echo on
    copy /Y /Y ui.content\src\main\content\META-INF\vault\filterNonDev.xml ui.content\src\main\content\META-INF\vault\filter.xml
    @echo off

:AfterSkipDevFormsBlock

@echo.
echo To execute the Maven Command Line below, allow this Batch file to run
echo by completing the "Press any key to continue . . ." 
echo or Press Ctrl-C to Exit and then Copy and Paste the text below:
@echo.
echo %P0% %P1% %P2% %P3% %P4% ^>^ %P5%

@echo.
pause

call %P0% %P1% %P2% %P3% %P4% > %P5%

@echo Appending Deployed Version information to Build Log.
@echo. >> %P5%
type ceciaemdeployedversion.txt >> %P5%

@echo Appending  Deployment Project Name and Type
@echo. >> %P5%
echo Deployment Project Name: %AEMProjectName% >> %P5%
echo Deployment Type: %P4% >> %P5%

@echo. >> %P5%

if "%vAEMResetFilter%" == "false" goto ResetFilterNotNeeded
    echo Reseting Filter to Include by Default Developer Adpative Forms so that Developers can Save their work in the Repository... >> %P5%
    @echo on
    copy /Y /Y ui.content\src\main\content\META-INF\vault\filterIncDev.xml ui.content\src\main\content\META-INF\vault\filter.xml


:ResetFilterNotNeeded

@echo.
@echo on
call tail -350 %P5% | grep INFO

@echo off