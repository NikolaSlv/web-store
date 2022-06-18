const imageWidth = 200
const aspectRatio = 1
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