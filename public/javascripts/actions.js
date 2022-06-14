var menu = document.getElementById('menu-list')
menu.style.maxHeight = "0px"

function toggleMenu() {
    if (menu.style.maxHeight == "0px") {
        menu.style.maxHeight = "200px"
    } else {
        menu.style.maxHeight = "0px"
    }
}

function tablePagination(state, maxPage) {
    var searchParams = new URLSearchParams(window.location.search)
    var page = 'page'
    var next

    if (searchParams.has(page)) {
        next = parseInt(searchParams.get(page)) + state
        if (next < 1)
            next = 1
        if (next > maxPage)
            next = maxPage
        searchParams.set(page, next)
        history.replaceState(null, null, "?" + searchParams.toString())
    } else {
        next = 1 + state
        if (next < 1)
            next = 1
        if (next > maxPage)
            next = maxPage
        searchParams += "&page=" + next
        history.replaceState(null, null, "?" + searchParams.toString())
    }

    location.reload()
}

function sort(sortParamVal, sortTypeVal) {
    var searchParams = new URLSearchParams(window.location.search)
    var sortParam = 'sortParam'
    var sortType = 'sortType'
    var page = 'page'

    if (searchParams.has(sortParam) && searchParams.has(sortType)) {
        searchParams.set(sortParam, sortParamVal)
        searchParams.set(sortType, sortTypeVal)
        history.replaceState(null, null, "?" + searchParams.toString())
    } else if (!(searchParams.has(sortParam) || searchParams.has(sortType))) {
        searchParams += "&sortParam=" + sortParamVal
        searchParams += "&sortType=" + sortTypeVal
        history.replaceState(null, null, "?" + searchParams.toString())
    }

    if (searchParams.has(page)) {
        searchParams.set(page, 1)
        history.replaceState(null, null, "?" + searchParams.toString())
    }

    location.reload()
}

function showSearchModal() {
    document.getElementById("piecesPerUnit").value = ''
    document.getElementById("search-modal").style.display = "block"
}

function hideSearchModal() {
    document.getElementById("search-modal").style.display = "none"
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
}

function saveSelection() {
    document.getElementById("selected").value = document.activeElement.getAttribute('data-name')
    document.getElementById("piecesPerUnit").value = document.activeElement.getAttribute('data-count')
}

function append() {
    if (document.getElementById("piecesPerUnit").value === '') {
        alert('Моля, изберете продукт.')
        return
    }

    var piecesPerUnit = parseInt(document.getElementById("piecesPerUnit").value)
    var text
    var total
    var separator = '\n----------------\n'
    
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
    hideSearchModal()
}