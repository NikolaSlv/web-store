var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
})

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

function setCategory(val) {
    var searchParams = new URLSearchParams(window.location.search)
    var cat = 'category'

    // Clear other params
    if (window.location.href.indexOf("title") > -1) {
        searchParams.set('title', '')
    }
    if (window.location.href.indexOf("description") > -1) {
        searchParams.set('description', '')
    }
    if (window.location.href.indexOf("minPricePerPiece") > -1) {
        searchParams.set('minPricePerPiece', '')
    }
    if (window.location.href.indexOf("maxPricePerPiece") > -1) {
        searchParams.set('maxPricePerPiece', '')
    }
    if (window.location.href.indexOf("sortParam") > -1) {
        searchParams.set('sortParam', '')
    }
    if (window.location.href.indexOf("sortType") > -1) {
        searchParams.set('sortType', '')
    }
    if (window.location.href.indexOf("page") > -1) {
        searchParams.set('page', '')
    }

    if (searchParams.has(cat)) {
        searchParams.set(cat, val)
    } else {
        searchParams += "&" + cat + "=" + val
    }

    history.replaceState(null, null, "?" + searchParams.toString())
    location.reload()
}

function sort(sortParamVal) {
    var searchParams = new URLSearchParams(window.location.search)
    var sortParam = 'sortParam'
    var sortType = 'sortType'
    var page = 'page'

    if (sortParamVal === 'pricePerPiece') {
        sortTypeVal = document.getElementById('selectPPP').value
    } else if (sortParamVal === 'pricePerUnit') {
        sortTypeVal = document.getElementById('selectPPU').value
    }

    if (searchParams.has(sortParam) && searchParams.has(sortType)) {
        searchParams.set(sortParam, sortParamVal)
        searchParams.set(sortType, sortTypeVal)
    } else if (!(searchParams.has(sortParam) || searchParams.has(sortType))) {
        searchParams += "&" + sortParam + "=" + sortParamVal
        searchParams += "&" + sortType + "=" + sortTypeVal
    }
    history.replaceState(null, null, "?" + searchParams.toString())

    if (window.location.href.indexOf("page") > -1) {
        searchParams.set(page, '1')
    }

    history.replaceState(null, null, "?" + searchParams.toString())
    location.reload()
}

function pagination(state, maxPage, direct) {
    var searchParams = new URLSearchParams(window.location.search)
    var page = 'page'
    var next

    if (searchParams.has(page)) {
        if (direct == -1) {
            var curr = parseInt(searchParams.get(page))
            if (!curr)
                curr = 1
            next = curr + state
        }
        else 
            next = direct
        if (next < 1)
            next = 1
        if (next > maxPage)
            next = maxPage
        searchParams.set(page, next)
    } else {
        if (direct == -1)
            next = 1 + state
        else 
            next = direct
        if (next < 1)
            next = 1
        if (next > maxPage)
            next = maxPage
        searchParams += "&" + page + "=" + next
    }

    history.replaceState(null, null, "?" + searchParams.toString())
    location.reload()
}

var lastPos = -1
function resetSelection() {
    document.getElementById("piecesPerUnit").value = ''
    if (lastPos != -1) {
        id = "sItem-" + lastPos
        document.getElementById(id).classList.remove("active")
        lastPos = -1
    }
}

function saveSelection(pos) {
    var id
    if (lastPos != -1) {
        id = "sItem-" + lastPos
        document.getElementById(id).classList.remove("active")
    }
    id = "sItem-" + pos
    document.getElementById(id).classList.add("active")
    lastPos = pos

    document.getElementById("selected").value = document.getElementById(id).getAttribute('data-name')
    document.getElementById("piecesPerUnit").value = document.getElementById(id).getAttribute('data-count')
}

function searchFilter() {
    var input, filter, ul, li, a, i, txtValue

    input = document.getElementById("userQuery")
    filter = input.value.toUpperCase()
    ul = document.getElementById("prodUL")
    li = ul.getElementsByTagName("li")

    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0]
        txtValue = a.textContent || a.innerText
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = ""
        } else {
            li[i].style.display = "none"
        }
    }
    
    hideExcessiveData()
}

function append() {
    if (document.getElementById("piecesPerUnit").value === '') {
        alert('Моля, изберете продукт.')
        return
    }

    var piecesPerUnit = parseInt(document.getElementById("piecesPerUnit").value)
    var text
    var total
    var separator = '\n\n'
    
    var units = prompt("Колко кашона/опаковки?")
    if (units === null) {
        document.getElementById("piecesPerUnit").value = ''
        return
    }
    units = Number(units)

    if (!(Number.isInteger(units) && units >= 0 && units != null && units != '')) {
        var pieces = prompt("Колко бройки?")
        if (pieces === null) {
            document.getElementById("piecesPerUnit").value = ''
            return
        }
        pieces = Number(pieces)
        units = null
    } else {
        var pieces = prompt("Колко допълнителни бройки?")
        if (pieces === null) {
            document.getElementById("piecesPerUnit").value = ''
            return
        }
        pieces = Number(pieces)
    }

    if (!(Number.isInteger(pieces) && pieces > 0)) {
        pieces = null
    }

    if (units == null && pieces == null) {
        text = (document.getElementById("selected").value) + '\n' + 'Бройки: ' + '[въведи]' + separator
    } else if (units != null && pieces == null) {
        total = units * piecesPerUnit
        text = (document.getElementById("selected").value) + '\n' + 'Бройки: ' + total + separator
    } else if (units == null && pieces != null) {
        text = (document.getElementById("selected").value) + '\n' + 'Бройки: ' + pieces + separator
    } else {
        total = units * piecesPerUnit + pieces
        text = (document.getElementById("selected").value) + '\n' + 'Бройки: ' + total + separator
    }

    document.getElementById("info").value += text
}

function submitSBar() {
    const val = document.getElementById('sbar').value
    var urlStr

    if (val == null || val === '') {
        window.history.pushState(null, null, 'products?allProducts=yes')
    } else {
        window.history.pushState(null, null, 'products?sbar=' + val)
    }

    urlStr = window.location.href
    urlStr = urlStr.replace(/products\/products/g, 'products')

    location.replace(urlStr)
}

var mListState = 1
const mList = document.getElementById('userList')
function showUserList() {
    if (mList != null) {
        if (mListState == 1) {
            mList.style.display = 'block'
        } else {
            mList.style.display = 'none'
        }
        mListState *= -1
    }
}

function enableUserEditing() {
    document.getElementById('emailEdit').disabled = false
    document.getElementById('nameEdit').disabled = false
    document.getElementById('businessNameEdit').disabled = false
    document.getElementById('addressEdit').disabled = false
    document.getElementById('phoneEdit').disabled = false

    document.getElementById('enableEdit').style.display = 'none'
    document.getElementById('changePassword').style.display = 'none'

    document.getElementById('backToProfile').style.display = ''
    document.getElementById('saveEdit').style.display = ''
}

function changePass() {
    document.getElementById('updatePass').value = 'yes'

    document.getElementById('gr1').style.display = 'none'
    document.getElementById('gr2').style.display = 'none'
    document.getElementById('gr3').style.display = 'none'
    document.getElementById('gr4').style.display = 'none'
    document.getElementById('gr5').style.display = 'none'

    document.getElementById('enableEdit').style.display = 'none'
    document.getElementById('changePassword').style.display = 'none'

    document.getElementById('backToProfile').style.display = ''
    document.getElementById('saveEdit').style.display = ''

    document.getElementById('passwordID').setAttribute('required', '')
    document.getElementById('passwordEditGroup').style.display = ''
    document.getElementById('passwordIDRep').setAttribute('required', '')
    document.getElementById('passwordEditGroupRepeat').style.display = ''
}

function goBackToProfile() {
    const updatingPass = document.getElementById('updatePass').value

    if (updatingPass === 'yes') {
        document.getElementById('updatePass').value = 'no'

        document.getElementById('gr1').style.display = ''
        document.getElementById('gr2').style.display = ''
        document.getElementById('gr3').style.display = ''
        document.getElementById('gr4').style.display = ''
        document.getElementById('gr5').style.display = ''

        document.getElementById('enableEdit').style.display = ''
        document.getElementById('changePassword').style.display = ''

        document.getElementById('backToProfile').style.display = 'none'
        document.getElementById('saveEdit').style.display = 'none'

        document.getElementById('passwordID').removeAttribute('required')
        document.getElementById('passwordEditGroup').style.display = 'none'
        document.getElementById('passwordIDRep').removeAttribute('required')
        document.getElementById('passwordEditGroupRepeat').style.display = 'none'
    } else {
        document.getElementById('emailEdit').disabled = true
        document.getElementById('nameEdit').disabled = true
        document.getElementById('businessNameEdit').disabled = true
        document.getElementById('addressEdit').disabled = true
        document.getElementById('phoneEdit').disabled = true
    
        document.getElementById('enableEdit').style.display = ''
        document.getElementById('changePassword').style.display = ''
    
        document.getElementById('backToProfile').style.display = 'none'
        document.getElementById('saveEdit').style.display = 'none'
    } 
}

function showPass() {
    const password = document.getElementById('passwordID')
    updatePassVisibility(password)
}

function showRepeatPass() {
    const password = document.getElementById('passwordIDRep')
    updatePassVisibility(password, true)
}

function updatePassVisibility(pass, repeat = false) {
    if (pass != null) {
        var eyeNoView
        var eyeView

        if (!repeat) {
            eyeNoView = document.getElementById('eyeNoView')
            eyeView = document.getElementById('eyeView')
        } else {
            eyeNoView = document.getElementById('eyeNoViewRep')
            eyeView = document.getElementById('eyeViewRep')
        }

        if (pass.type === 'password') {
            pass.type = 'text'
            eyeNoView.style.display = 'none'
            eyeView.style.display = ''
        } else {
            pass.type = 'password'
            eyeNoView.style.display = ''
            eyeView.style.display = 'none'
        }
    }
}

async function updateCategories() {
    var error = false

    await fetch("/admin/cat-delete", {
        method: "DELETE",
        headers: {'Content-Type': 'application/json'}
    })
    .then((res) => res.json())
    .then((data) => {
        if (!data.status) {
            alert("Възникна грешка при обновяването на категориите!")
            error = true
        }
    })
    if (error) {
        location.reload()
        return
    }

    await fetch("/admin/cat-renew", {
        method: "POST",
        headers: {'Content-Type': 'application/json'}
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.status) {
            alert("Категориите бяха успешно обновени!")
        } else {
            alert("Възникна грешка при обновяването на категориите!")
        }
    })

    location.reload()
}

async function verifyUser(userId) {
    confirm('Сигурни ли сте, че искате да потвърдите този потребител?')
    var status = false

    const url = "/admin/user-verify/" + userId
    await fetch(url, {
        method: "POST",
        headers: {'Content-Type': 'application/json'}
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.status) {
            alert("Потребителят бе успешно потвърден!")
            status = true
        } else {
            alert("Възникна грешка при потвърждението на потребителя!")
        }
    })

    if (status) {
        const btnAddress = 'verifyBtn' + userId
        const iconAddress = 'onVerifyIcon' + userId
        document.getElementById(btnAddress).style.display = 'none'
        document.getElementById(iconAddress).style.display = ''
    }
}