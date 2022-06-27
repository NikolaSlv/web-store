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

function verifyUser(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function verifyLoggedInUser(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

module.exports.setSearchStr = setSearchStr
module.exports.verifyUser = verifyUser
module.exports.verifyLoggedInUser = verifyLoggedInUser