function setSearchStr(str) {
    var searchArrDirty = (str.replace(/[\r\n' ']/gm, '| ')).split(' ')
    var searchArr = searchArrDirty.filter(element => {
        return element !== '' && element !== '|'
    })
    searchStr = searchArr.join("")
    if (searchStr[searchStr.length - 1] === '|') {
        searchStr = searchStr.slice(0, searchStr.length - 1)
    } else if (searchStr[0] === '|') {
        searchStr = searchStr.slice(1)
    }
    return searchStr
}

module.exports.setSearchStr = setSearchStr