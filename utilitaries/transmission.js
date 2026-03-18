const CFG = require("../configs/config.json")
const { getRandomInt } = require('./tools');


String.prototype.replaceAt = function(index, replacement){
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

function getRandomObfuscator(characters){
    return characters.charAt(getRandomInt(0, characters.length))
}


module.exports = {
    filterMessage: (text) => {
        if (CFG.BANNED_WORDS_TRANSMISSION.some(v => text.includes(v))) return false;
        else return true
    },

    obfuscateMessage: (text) => {
        to_obfuscate = getRandomInt(0, text.length/3)
        index_list = []
        modified_text = ""
        for(let i = 0; i < to_obfuscate; i++){
            do{
                index = getRandomInt(0, text.length)
            }while(index in index_list)
            index_list.push(index)
            text = text.replaceAt(index, getRandomObfuscator('#$-/|"\'%'))
        }
        
        return text
    },

    getRandomObfuscator: getRandomObfuscator
}