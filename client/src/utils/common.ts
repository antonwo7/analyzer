export function fileDownload(url: string, filename?: string) {
    let link = document.createElement('a')
    link.href = url
    link.target = '_blank'
    link.download = filename || getBaseName(url)
    link.dispatchEvent(new MouseEvent('click'))
}

export function getBaseName(url: string) {
    return url.substr(url.lastIndexOf("/") + 1)
}