Write-Host 'Build Starting' -ForegroundColor Yellow
Invoke-Command -ScriptBlock { npm run build:live }
Write-Host 'Build Completed' -ForegroundColor Green

Write-Host 'Compress Starting' -ForegroundColor Yellow
$CurDateString = Get-Date -Format "yyyyMMddHHmmss"
$ZIPFileName = "WMSWeb$CurDateString.zip"
$CurPath = (Resolve-Path .).Path
$ZIPFilePath = "$CurPath\$ZIPFileName"
Compress-Archive -Path ".\dist\*" -DestinationPath $ZIPFilePath
Write-Host "Compress Completed $ZIPFilePath" -ForegroundColor Green

Write-Host 'Deploy Starting' -ForegroundColor Yellow
$Session = New-PSSession -ComputerName 192.180.4.190 -Credential Administrator
$Session
if ($Session.State -eq "Opened") {
	Write-Host 'Successfully connected to the server' -ForegroundColor Green
	#站点名称
	$WebSiteName = "WMSWeb"
	#远程服务器部署文件存放路径(默认为当前站点根目录的父级目录,可修改为其它路径)
	$RemotePath = "D:\Publish\"
	#站点监听端口
	$WebSitePort = 8051

	Write-Host "Start copy files to the server $RemotePath" -ForegroundColor Yellow
	Copy-Item $ZIPFilePath -Destination $RemotePath -ToSession $Session

	$WebSite = Invoke-Command -Session $Session -ScriptBlock { param($name) Get-Website -Name $name } -ArgumentList $WebSiteName
	if (!$WebSite) {
		#如果没有站点,就创建此站点
		Invoke-Command -Session $Session -ScriptBlock {
			Param($rootPath, $siteName, $port)
			$fullPath = "$rootPath$siteName"
			if (!(Test-Path -Path $fullPath)) {
				Write-Host "1.创建目录$fullPath" -ForegroundColor Yellow
				New-Item -Path $rootPath -Name $siteName -ItemType Directory
			}
			Write-Host "2.创建程序池$siteName" -ForegroundColor Yellow
			New-WebAppPool -Name $siteName
			Write-Host "设置程序池.Net CLR版本为无托管代码" -ForegroundColor Yellow
			#"":无托管代码,v4.0:.Net CLR版本为4.0
			Set-ItemProperty -Path "IIS:\AppPools\$siteName" -Name managedRuntimeVersion -Value ""

			Write-Host "3.创建站点$siteName" -ForegroundColor Yellow
			New-Website -Name $siteName -Port $port -PhysicalPath $fullPath -ApplicationPool $siteName
			Start-Website -Name $siteName

			Write-Host "4.打开防火墙端口$port" -ForegroundColor Yellow
			New-NetFirewallRule -Name "$siteName$port" -DisplayName "$siteName$port" -Action Allow -Protocol TCP -LocalPort $port -Direction Inbound

		} -ArgumentList $RemotePath, $WebSiteName, $WebSitePort
	}

	$RemoteDestinationPath = "$RemotePath$WebSiteName\"
	$ApplicationPool = $WebSiteName # $WebSite.ApplicationPool
	$RemoteZipPath = "$RemotePath$ZIPFileName"

	#部署系统
	Invoke-Command -Session $Session -ScriptBlock {
		Param($pool, $file, $path)
		Write-Host "Stop the AppPool:$pool" -ForegroundColor Yellow
		Stop-WebAppPool -Name $pool
		while ((Get-WebAppPoolState -Name $pool).Value -ne "Stopped") {
			Write-Host "Waiting Stop the AppPool:$pool" -ForegroundColor Yellow
			Start-Sleep -Seconds 1
		}
		Get-WebAppPoolState -Name $pool
		Write-Host "Start Expand files on the server:$path" -ForegroundColor Yellow
		Remove-Item -Path $path -Recurse -Force
		Expand-Archive -Path $file -DestinationPath $path -Force
		Write-Host "Restart the AppPool:$pool" -ForegroundColor Yellow
		Start-WebAppPool -Name $pool

	} -ArgumentList $ApplicationPool, $RemoteZipPath, $RemoteDestinationPath

	Write-Host 'Disconnected from server' -ForegroundColor Yellow
	Disconnect-PSSession -Session $Session
}
else {
	Write-Host 'Failed connected to the server' -ForegroundColor Red
}
Remove-Item -Path $ZIPFilePath
Write-Host 'Deploy Completed' -ForegroundColor Green