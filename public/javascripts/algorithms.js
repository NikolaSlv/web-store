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

function cropLastWord(str) {
    const lastIndexOfSpace = str.lastIndexOf(' ');
    if (lastIndexOfSpace === -1) {
        return str;
    }
    return str.substring(0, lastIndexOfSpace);
}

module.exports.setSearchStr = setSearchStr
module.exports.cropLastWord = cropLastWord