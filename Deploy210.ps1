#https://github.com/ZEQP/ZEQP-PSDeploy
Start-Deploy -ComputerName 192.171.1.5 -WebSiteName WMSWeb210 -WebSitePort 8061 -ScriptBlock { npm run build:live210 } -OutputPath .\dist\
