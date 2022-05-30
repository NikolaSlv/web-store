const rootStyles = window.getComputedStyle(document.documentElement)

if (rootStyles.getPropertyValue('--product-image-width-1200px') != null
&& rootStyles.getPropertyValue('--product-image-width-1200px') !== '') {
    ready()
} else {
    document.getElementById('main-css').addEventListener('load', ready)
}

function ready() {
    const imageWidth = parseFloat(rootStyles.getPropertyValue('--product-image-width-1200px'))
    const aspectRatio = parseFloat(rootStyles.getPropertyValue('--product-image-aspect-ratio'))
    const imageHeight = imageWidth / aspectRatio
    
    FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginImageResize,
        FilePondPluginFileEncode,
    )
    
    FilePond.setOptions({
        stylePanelAspectRatio: 1 / aspectRatio,
        imageResizeTargetWidth: imageWidth,
        imageResizeTargetHeight: imageHeight
    })
    
    FilePond.parse(document.body);
}