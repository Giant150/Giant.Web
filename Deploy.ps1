#https://github.com/ZEQP/ZEQP-PSDeploy
Start-Deploy -ComputerName 139.9.69.110 -WebSiteName WMSWeb -WebSitePort 8051 -ScriptBlock { npm run build:live } -OutputPath .\dist\