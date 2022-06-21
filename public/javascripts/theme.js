var mode

function applyTheme() {
    mode = localStorage.getItem("mode");

    if (mode === 'dark') {
        var head  = document.getElementsByTagName('head')[0]
        var link  = document.createElement('link')

        link.id    = mode
        link.rel   = 'stylesheet'
        link.type  = 'text/css'
        link.href  = '../../stylesheets/' + mode + '.css'
        link.media = 'all'
        
        head.appendChild(link)
    }
}

function runThemeUpdates() {
    if (mode === 'dark') {
        document.getElementById("modeSwitch").checked = true
        document.getElementById('fPara').classList.remove("text-muted")
        document.getElementById('fLink').classList.remove("text-muted")
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

    if (mode === 'dark') {
        document.body.style.background = "#212121"
        document.body.style.color = "white"

        if (document.getElementById('imgBg1') != null)
            document.getElementById('imgBg1').classList.add("img-bg-dynamical")  
        if (document.getElementById('imgBg2') != null)
            document.getElementById('imgBg2').classList.add("img-bg-dynamical")
        if (document.getElementById('imgBg3') != null)
            document.getElementById('imgBg3').classList.add("img-bg-dynamical")

        document.getElementById('fPara').classList.remove("text-muted")
        document.getElementById('fLink').classList.remove("text-muted")

        if (document.getElementById('offcanvas') != null) {
            document.getElementById('offcanvas').style.backgroundColor = "#212121"
            document.getElementById('offcanvas').style.color = "white"
        }
        if (document.getElementsByName('catOption') != null) {
            var elementArray = document.getElementsByName('catOption')
            for (i = 0; i < elementArray.length; i++) {
                elementArray[i].style.backgroundColor = "#181818"
                elementArray[i].style.color = "white"
            }
        }

        if (document.getElementsByClassName('form-control') != null) {
            var elementArray = document.getElementsByClassName('form-control')
            for (i = 0; i < elementArray.length; i++) {
                elementArray[i].style.backgroundColor = "#e7e7e7"
            }
        }

        if (document.getElementById('modalContent') != null) {
            document.getElementById('modalContent').classList.add("modal-content-dynamical")
        }
    } else {
        document.body.style.background = "white"
        document.body.style.color = "black"

        if (document.getElementById('imgBg1') != null) {
            document.getElementById('imgBg1').classList.remove("img-bg-dynamical")
            document.getElementById('imgBg1').classList.remove("img-bg")
        }
        if (document.getElementById('imgBg2') != null) {
            document.getElementById('imgBg2').classList.remove("img-bg-dynamical")
            document.getElementById('imgBg2').classList.remove("img-bg")
        }
        if (document.getElementById('imgBg3') != null) {
            document.getElementById('imgBg3').classList.remove("img-bg-dynamical")
            document.getElementById('imgBg3').classList.remove("img-bg")
        }

        document.getElementById('fPara').classList.add("text-muted")
        document.getElementById('fLink').classList.add("text-muted")

        if (document.getElementById('offcanvas') != null) {
            document.getElementById('offcanvas').style.backgroundColor = "white"
            document.getElementById('offcanvas').style.color = "black"
        }
        if (document.getElementsByName('catOption') != null) {
            var elementArray = document.getElementsByName('catOption')
            for (i = 0; i < elementArray.length; i++) {
                elementArray[i].style.backgroundColor = "white"
                elementArray[i].style.color = "black"
            }
        }

        if (document.getElementsByClassName('form-control') != null) {
            var elementArray = document.getElementsByClassName('form-control')
            for (i = 0; i < elementArray.length; i++) {
                elementArray[i].style.backgroundColor = "white"
            }
        }

        if (document.getElementById('modalContent') != null) {
            document.getElementById('modalContent').classList.remove("modal-content-dynamical")
            document.getElementById('modalContent').style.backgroundColor = "white"
        }
    }
}