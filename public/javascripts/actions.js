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