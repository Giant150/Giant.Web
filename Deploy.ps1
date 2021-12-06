#https://github.com/ZEQP/ZEQP-PSDeploy
Start-Deploy -ComputerName 192.171.1.5 -WebSiteName WMSWeb -WebSitePort 8051 -ScriptBlock { npm run build:live } -OutputPath .\dist\
