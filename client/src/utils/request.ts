export function objectToFormData (data: any, files?: FileList) {
    const formData = new FormData();

    if (typeof data === 'object') {
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                formData.append(key, data[key])
            }
        }
    }

    if (files) {
        for (let i = 0; i < Object.keys(files).length; i++) {
            formData.append('file_' + i, files[i])
        }
    }

    return formData
}