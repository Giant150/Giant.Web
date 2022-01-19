self.Config = { BaseUrl: '', Token: '', WhseId: 'WH1', PageNo: 1, LastModifyTime: '2000-01-01', EntityName: null }
self.onmessage = function (e) {
    console.log('Cache Worker Para:', e)
    self.Config.PageNo = 1
    var { BaseUrl, Token, WhseId, LastModifyTime, EntityName } = e.data
    self.Config.BaseUrl = BaseUrl
    self.Config.Token = Token
    self.Config.WhseId = WhseId
    self.Config.LastModifyTime = LastModifyTime
    self.Config.EntityName = EntityName
    postMessage({ type: 'log', entity: self.Config.EntityName, data: JSON.stringify(self.Config) })
    self.GetData()
}
self.GetData = function () {
    fetch(`${self.Config.BaseUrl}/api/${self.Config.EntityName}/GetByWorker?whseId=${self.Config.WhseId}&pageNo=${self.Config.PageNo}&last=${self.Config.LastModifyTime}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${self.Config.Token}`
        }
    }).then(response => response.json())
        .then(data => {
            if (data.Success) postMessage({ type: 'result', entity: self.Config.EntityName, data: data.Data })
            if (data.Success && data.Data.length < 1000) {
                postMessage({ type: 'complete', entity: self.Config.EntityName, data: new Date().toJSON() })
            }
            if (data.Success && data.Data.length === 1000) {
                self.Config.PageNo++
                self.GetData()
            }
        })
}
