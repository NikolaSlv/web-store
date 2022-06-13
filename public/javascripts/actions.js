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
}

function append() {
    var text = (document.getElementById("selected").value) + '\n' + 'Бройки: \n' + 'Кашони/Опаковки: \n\n'
    document.getElementById("info").value += text
    hideSearchModal()
}