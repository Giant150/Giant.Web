this.body = {
    PageNo: 1,
    PageSize: 10,
    SortField: 'ModifyTime',
    SortOrder: 'desc',
    Search: {
        WhseId: 'WH1'
    }
}
this.config = { Host: '', Token: '' }
this.onmessage = function (e) {
    console.log('Sku Work:', e)
    var { WhseId, BaseUrl, Token } = e.data
    this.config.Host = BaseUrl
    this.config.Token = Token
    postMessage(this.config)
    this.body.Search.WhseId = WhseId
    this.GetData()
}

this.GetData = function () {
    postMessage(this.body)
    fetch(`${this.config.Host}/api/Bas_Sku/GetPage`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.Token}`
        },
        body: JSON.stringify(this.body)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data)
            if (data.Data.length === this.body.PageSize) {
                this.body.PageNo++
                this.GetData()
            }
            if (data.Success) { }
        })
}
