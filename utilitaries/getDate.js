module.exports = {
    getDate: ()=>{
        const date = new Date()
        let minutes
        if (date.getMinutes() < 10) minutes = `0${date.getMinutes()}`
        else minutes = `${date.getMinutes()}`
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}  --  ${date.getHours()}: ${minutes}`;
    }
}