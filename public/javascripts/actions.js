function setCategory(val) {
    var searchParams = new URLSearchParams(window.location.search)
    var cat = 'category'
    var page = 'page'

    if (searchParams.has(cat)) {
        searchParams.set(cat, val)
    } else {
        searchParams += "&" + cat + "=" + val
    }

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
        searchParams.set(page, '1')
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
        if (direct == -1)
            next = parseInt(searchParams.get(page)) + state
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