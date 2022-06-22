var mode
var head  = document.getElementsByTagName('head')[0]
var link

function applyTheme() {
    mode = localStorage.getItem("mode");
    if (mode === 'dark') {
        if (document.getElementById('dark') == null) {
            link  = document.createElement('link')
            link.id    = 'dark'
            link.rel   = 'stylesheet'
            link.type  = 'text/css'
            link.href  = '../../stylesheets/dark.css'
            link.media = 'all'
            head.appendChild(link)
        }
    } else {
        if (document.getElementById('dark') != null) {
            link.parentNode.removeChild(link);
        }
    }
}

function runThemeUpdates() {
    if (mode === 'dark') {
        document.getElementById("modeSwitch").checked = true
        document.getElementById('fPara').classList.remove("text-muted")
        document.getElementById('fLink').classList.remove("text-muted")
    } else {
        document.getElementById("modeSwitch").checked = false
        document.getElementById('fPara').classList.add("text-muted")
        document.getElementById('fLink').classList.add("text-muted")
    }
}

function switchMode() {
    if (mode != null && mode !== '') {
        if (mode === 'dark') {
            mode = 'light'
        } else {
            mode = 'dark'
        }
    } else {
        mode = 'dark'
    }
    localStorage.setItem("mode", mode);
    applyTheme()
    runThemeUpdates()
}