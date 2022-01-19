import storage from 'store'
import moment from 'moment'
export default {
    Database: null,
    Config: {},
    Workers: {},
    Start(init, creationCallback) {
        this.Config = init
        if (!this.Database) {
            const version = storage.get(`Worker_${init.EntityName}_Version`) || moment().format('YYYYMMDD')
            this.Database = window.openDatabase('wms', version, 'WMS Cache Data', 500 * 1024 * 1024, creationCallback)
            console.log('WebSqlDatabase', this.Database)
        }
        const worker = new Worker('/Workers/CacheData.js')
        this.Workers[init.EntityName] = worker
        worker.onmessage = (msg) => {
            console.log('Worker Msg:', msg.data)
            var data = msg.data
            var entityName = data.entity
            if (data.type === 'complete') {
                var lastModifyTime = moment().format('YYYY-MM-DD HH:mm:ss')
                storage.set(`Worker_${entityName}_LastModifyTime`, lastModifyTime)
                var version = moment().format('YYYYMMDD')
                if (this.Database.version !== version) {
                    this.Database.changeVersion(this.Database.version, version)
                    storage.set(`Worker_${entityName}_Version`, version)
                }
                setTimeout(() => {
                    var nextData = { WhseId: this.Config.WhseId, BaseUrl: this.Config.BaseUrl, Token: this.Config.Token, LastModifyTime: lastModifyTime, EntityName: this.Config.EntityName }
                    this.Workers[entityName].postMessage(nextData)
                }, 60 * 60 * 1000)
            }
            if (data.type === 'result') {
                this.Database.transaction((ctx) => {
                    for (let index = 0; index < data.data.length; index++) {
                        const element = data.data[index]
                        const columns = []
                        const values = []
                        for (const key in element) {
                            columns.push(key)
                            values.push(element[key])
                        }
                        const sql = `INSERT OR REPLACE INTO ${entityName} (${columns.join(',')}) VALUES (?${',?'.repeat(columns.length - 1)})`
                        ctx.executeSql(sql, values)
                    }
                })
            }
        }
        const last = storage.get(`Worker_${init.EntityName}_LastModifyTime`) || '2000-01-01 00:00:00'
        const workerInit = { WhseId: init.WhseId, BaseUrl: init.BaseUrl, Token: init.Token, LastModifyTime: last, EntityName: init.EntityName }
        console.log('CacheData Worker Init:', workerInit)
        worker.postMessage(workerInit)
    },
    Stop(entity) {
        console.log('Stop Cache Worker', entity)
        this.Workers[entity].terminate()
    }
}
