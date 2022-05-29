function searchAlg(arr) {
    let searchArrDirty = (arr.replace(/[\r\n' ']/gm, '| ')).split(' ')
    let searchArr = searchArrDirty.filter(element => {
        return element !== '' && element !== '|'
    })
    searchArr = searchArr.join("")
    if (searchArr[searchArr.length - 1] === '|') {
        searchArr = searchArr.slice(0, searchArr.length - 1)
    } else if (searchArr[0] === '|') {
        searchArr = searchArr.slice(1)
    }
    return searchArr
}

module.exports.searchAlg = searchAlg