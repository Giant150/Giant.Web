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
$Session = New-PSSession -ComputerName 10.76.99.13 -Credential Administrator
$Session
if($Session.State -eq "Opened")
{
	Write-Host 'Successfully connected to the server' -ForegroundColor Green
	#站点名称
	$WebSiteName="WMSWeb"
	$WebSite=Invoke-Command -Session $Session -ScriptBlock {param($name) Get-Website -Name $name} -ArgumentList $WebSiteName
	$RemoteDestinationPath=$WebSite.PhysicalPath+"\"
	$ApplicationPool=$WebSite.ApplicationPool
	#远程服务器部署文件存放路径(默认为当前站点根目录的父级目录,可修改为其它路径)
	$RemotePath=$WebSite.PhysicalPath+"\..\"
	$RemoteZipPath=$RemotePath+$ZIPFileName

	Write-Host "Start copy files to the server:$RemotePath" -ForegroundColor Yellow
	Copy-Item $ZIPFilePath -Destination $RemotePath -ToSession $Session

	Write-Host "Stop the AppPool:$ApplicationPool" -ForegroundColor Yellow
	Invoke-Command -Session $Session -ScriptBlock {param($pool) Stop-WebAppPool -Name $pool} -ArgumentList $ApplicationPool
	while((Invoke-Command -Session $Session -ScriptBlock {param($pool) Get-WebAppPoolState -Name $pool} -ArgumentList $ApplicationPool).Value -ne "Stopped")
	{
		Write-Host "Waiting Stop the AppPool:$ApplicationPool" -ForegroundColor Yellow
		Start-Sleep -Seconds 1
	}
	Invoke-Command -Session $Session -ScriptBlock {param($pool) Get-WebAppPoolState -Name $pool} -ArgumentList $ApplicationPool

	Write-Host "Start Expand files on the server:$RemoteDestinationPath" -ForegroundColor Yellow
	Invoke-Command -Session $Session -ScriptBlock {param($p) Remove-Item -Path $p -Exclude "Log/*" -Recurse -Force} -ArgumentList $RemoteDestinationPath
	Invoke-Command -Session $Session -ScriptBlock {param($p,$dp) Expand-Archive -Path $p -DestinationPath $dp} -ArgumentList $RemoteZipPath,$RemoteDestinationPath

	Write-Host "Restart the AppPool:$ApplicationPool" -ForegroundColor Yellow
	Invoke-Command -Session $Session -ScriptBlock {param($pool) Start-WebAppPool -Name $pool} -ArgumentList $ApplicationPool

	Write-Host 'Disconnected from server' -ForegroundColor Yellow
	Disconnect-PSSession -Session $Session
}
else
{
	Write-Host 'Failed connected to the server' -ForegroundColor Red
}
Remove-Item -Path $ZIPFilePath
Write-Host 'Deploy Completed' -ForegroundColor Green