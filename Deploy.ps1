Write-Host 'Build Starting' -ForegroundColor Yellow
$BuildScript={npm run build:live}
Invoke-Command -ScriptBlock $BuildScript
Write-Host 'Build Completed' -ForegroundColor Green

Write-Host 'Compress Starting' -ForegroundColor Yellow
$CurDateString=Get-Date -Format "yyyyMMddHHmmss"
$ZIPFileName="WMSWeb"+$CurDateString+".zip"
$CurPath=(Resolve-Path .).Path
$ZIPFilePath=$CurPath+"\"+$ZIPFileName
Compress-Archive -Path ".\dist\*" -DestinationPath $ZIPFilePath
Write-Host 'Compress Completed' -ForegroundColor Green

Write-Host 'Deploy Starting' -ForegroundColor Yellow
#$User = "WDeployAdmin"
#$Password = Read-Host -Prompt "Please enter the server password" -AsSecureString
#Write-Host 'Start connecting to the server' -ForegroundColor Yellow
#$Credential = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $User, $Password
$Session = New-PSSession -ComputerName 192.180.4.190 -Credential Administrator
$Session
Write-Host 'Successfully connected to the server' -ForegroundColor Green

$RemotePath="D:\Publish\"
$RemoteDestinationPath=$RemotePath+"WMSWeb\"
$RemoteZipPath=$RemotePath+$ZIPFileName

Write-Host 'Stop the AppPool' -ForegroundColor Yellow
Invoke-Command -Session $Session -ScriptBlock {Stop-WebAppPool -Name "WMSWeb"}
while((Invoke-Command -Session $Session -ScriptBlock {Get-WebAppPoolState -Name "WMSWeb"}).Value -ne "Stopped")
{
	Write-Host 'Waiting Stop the AppPool' -ForegroundColor Yellow
	Start-Sleep -Seconds 1
}
Invoke-Command -Session $Session -ScriptBlock {Get-WebAppPoolState -Name "WMSWeb"}

Write-Host 'Start copy files to the server' -ForegroundColor Yellow
Copy-Item $ZIPFilePath -Destination $RemotePath -ToSession $Session

Write-Host 'Start Expand files on the server' -ForegroundColor Yellow
Invoke-Command -Session $Session -ScriptBlock {param($p) Remove-Item -Path $p -Recurse -Force} -ArgumentList $RemoteDestinationPath
Invoke-Command -Session $Session -ScriptBlock {param($p,$dp) Expand-Archive -Path $p -DestinationPath $dp} -ArgumentList $RemoteZipPath,$RemoteDestinationPath

Write-Host 'Restart the AppPool' -ForegroundColor Yellow
Invoke-Command -Session $Session -ScriptBlock {Start-WebAppPool -Name "WMSWeb"}

Write-Host 'Disconnected from server' -ForegroundColor Yellow
Disconnect-PSSession -Session $Session

Remove-Item -Path $ZIPFilePath
Write-Host 'Deploy Completed' -ForegroundColor Green