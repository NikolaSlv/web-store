function updateSelectBox(id, valueToSelect) {  
    if (valueToSelect != null && valueToSelect !== '') {  
        var element = document.getElementById(id)
        element.value = valueToSelect
    }
}