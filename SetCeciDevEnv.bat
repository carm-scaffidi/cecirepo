@echo off
: SetCeciDevEnv.bat (Working Directory <AzureDevOps>\cecirepo)
: 2022-04-07

: Begin Block to Assign Apps (Apllication Drive Letter) since it varies on Developer machines

: Initialize Variable that will be used in "If Statments" so that Test for a value is Predictable.
set AppsDrive=

: Assing Variable the potential Argument #1 that was used calling this Batch file.
set AppsDrive=%1

if "%AppsDrive%" == "" goto setDefaultDriveLetter
goto skipLabelsetDefaultDriveLetter

:setDefaultDriveLetter
set AppsDrive=C

:skipLabelsetDefaultDriveLetter

set AppsDir=%AppsDrive%:\Apps

@echo.
echo The Enviornment variables to support AEM Development/Deployment will be updated assuming the Dev Tools are in:
echo     %AppsDir%
@echo.
echo If this is not the case, run this Batch file again and provide the Drive letter used for the Apps folder as an Argument 

: End Block to Assign Apps (Apllication Drive Letter) since it varies on Developer machines

set GIT=%AppsDir%\git
set JAVA_HOME=%AppsDir%\Java\jdk1.8.0_251
set MAVEN_HOME=%AppsDir%\apache-maven-3.6.3

set OrigPath=%PATH%
set PATH=%JAVA_HOME%;%JAVA_HOME%\bin;%MAVEN_HOME%\bin;%GIT%\bin;%GIT%\usr\bin;%OrigPath%

if exist H:\buildenv\SetAEMDeployVars.bat call H:\buildenv\SetAEMDeployVars.bat
:call H:\buildenv\SetAEMDeployVars.bat

@echo.
call git --version
@echo.
call mvn --version
@echo.
java -version
@echo.
javac -version
@echo.

@echo off