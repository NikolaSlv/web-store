function hideExcessiveData() {
    const MAX = 20
    ul = document.getElementById("prodUL")
    li = ul.getElementsByTagName("li")

    let curr = 1
    for (i = 0; i < li.length; i++) {
        if (curr > MAX) {
            li[i].style.display = 'none'
        } else {
            if (li[i].style.display == '') {
                curr++
            }
        }
    }
}

function updateSortIcons() {
    const listPPP = document.getElementById('selectPPP')
    var valPPP = listPPP.options[listPPP.selectedIndex].value

    if (valPPP === '-1') {
        document.getElementById('PPP-option1-icon').style.display = 'none'
        document.getElementById('PPP-option2-icon').style.display = ''
    } else {
        document.getElementById('PPP-option1-icon').style.display = ''
        document.getElementById('PPP-option2-icon').style.display = 'none'
    }

    const listPPU = document.getElementById('selectPPU')
    var valPPU = listPPU.options[listPPU.selectedIndex].value

    if (valPPU === '-1') {
        document.getElementById('PPU-option1-icon').style.display = 'none'
        document.getElementById('PPU-option2-icon').style.display = ''
    } else {
        document.getElementById('PPU-option1-icon').style.display = ''
        document.getElementById('PPU-option2-icon').style.display = 'none'
    }
}