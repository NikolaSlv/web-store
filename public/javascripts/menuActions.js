var menu = document.getElementById('menu-list')
menu.style.maxHeight = "0px"

function toggleMenu() {
    if (menu.style.maxHeight == "0px") {
        menu.style.maxHeight = "200px"
    } else {
        menu.style.maxHeight = "0px"
    }
}