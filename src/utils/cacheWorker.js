import storage from 'store'
import moment from 'moment'
export default {
    Name: 'zeqp_wms',
    Version: '202201211149',
    Size: 500 * 1024 * 1024,
    Database: null,
    Config: {},
    Workers: {},
    Drop(db) {
        console.log('Drop Table', db)
        storage.remove(`Worker_Bas_Sku_LastModifyTime`)
        storage.remove(`Worker_Bas_Loc_LastModifyTime`)
        db.transaction((ctx) => {
            ctx.executeSql('DROP TABLE IF EXISTS Bas_Sku')
            ctx.executeSql('DROP TABLE IF EXISTS Bas_Loc')
        })
    },
    Create(db) {
        console.log('Create Table', db)
        db.transaction((ctx) => {
            const skuSql = `CREATE TABLE IF NOT EXISTS Bas_Sku (
                    Id text NOT NULL,
                    WhseId text NOT NULL,
                    StorerId text NOT NULL,
                    Code text NOT NULL,
                    Name text NOT NULL,
                    Spec text,
                    LotStgId text,
                    BaseUom text,
                    Price real,
                    RotateBy text,
                    RotateType text,
                    AllocStgId text,
                    RackLife integer,
                    Status text NOT NULL,
                    Popular integer,
                    PRIMARY KEY (Id)
                )`
            ctx.executeSql(skuSql)
            const indexSkuSql = `CREATE INDEX Bas_Sku_QueryIndex
                ON Bas_Sku (
                    WhseId COLLATE NOCASE ASC,
                    StorerId COLLATE NOCASE ASC,
                    Code COLLATE NOCASE ASC,
                    Name COLLATE NOCASE ASC,
                    Popular COLLATE NOCASE DESC
                )`
            ctx.executeSql(indexSkuSql)
            const locSql = `CREATE TABLE IF NOT EXISTS Bas_Loc (
                Id text NOT NULL,
                WhseId text NOT NULL,
                Code text NOT NULL,
                Name text NOT NULL,
                ZoneName text,
                Type text NOT NULL,
                IsEmpty text,
                HasTray text,
                Status text NOT NULL,
                BindTrayId text,
                PRIMARY KEY (Id)
              )`
            ctx.executeSql(locSql)
            const indexLocSql = `CREATE INDEX Bas_Loc_QueryIndex
              ON Bas_Loc (
                WhseId COLLATE NOCASE ASC,
                Code COLLATE NOCASE ASC,
                Name COLLATE NOCASE ASC
              )`
            ctx.executeSql(indexLocSql)
        })
    },
    Start(init) {
        this.Config[init.EntityName] = init
        if (!this.Database) {
            const version = storage.get('Worker_Dababase_Version')
            if (version) {
                this.Database = window.openDatabase(this.Name, version, this.Name, this.Size)
                if (this.Database.version !== this.Version) {
                    this.Drop(this.Database)
                    this.Create(this.Database)
                    this.Database.changeVersion(this.Database.version, this.Version)
                    storage.set('Worker_Dababase_Version', this.Version)
                }
            } else {
                this.Database = window.openDatabase(this.Name, this.Version, this.Name, this.Size)
                this.Create(this.Database)
                storage.set('Worker_Dababase_Version', this.Version)
            }
            console.log('WebSqlDatabase', this.Database)
        }
        const worker = new Worker(`/Workers/CacheData.js?entity=${init.EntityName}&version=${this.Version}`)
        this.Workers[init.EntityName] = worker
        worker.onmessage = (msg) => {
            console.log('Worker Msg:', msg.data)
            var data = msg.data
            var entityName = data.entity
            if (data.type === 'complete') {
                var lastModifyTime = moment().add(-10, 'm').format('YYYY-MM-DD HH:mm:ss')
                storage.set(`Worker_${entityName}_LastModifyTime`, lastModifyTime)
                setTimeout(() => {
                    var config = this.Config[entityName]
                    var nextData = { WhseId: config.WhseId, BaseUrl: config.BaseUrl, Token: config.Token, LastModifyTime: lastModifyTime, EntityName: entityName }
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
