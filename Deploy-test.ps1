#https://github.com/ZEQP/ZEQP-PSDeploy
Start-Deploy -ComputerName 192.180.4.190 -WebSiteName WMSWeb -WebSitePort 8051 -ScriptBlock { npm run build:test } -OutputPath .\dist\
