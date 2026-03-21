const CFG = require('../configs/config.json')

module.exports = {
    isWhitelist: async (TestId, DB) => {
        console.log("Run isWhitelist()")
        const doc = await DB.db(CFG.DBName).collection(CFG.WLTableName).findOne(
            {
                "$or": [
                { "discordId": TestId },
                { "steamId": TestId }
                ]
            }
        )
        if(!doc) return false;
        console.log("Document found in WL")
        return true;
    }
}