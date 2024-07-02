const apiUrl = process.env['REACT_APP_API_URL']

export const endpoints = {
    usersGetAvatar: `${apiUrl}/users/get_avatar/`,
    galleryGetGalleryImage: `${apiUrl}/gallery/get_gallery_image/`,
    galleryGetGalleryVideo: `${apiUrl}/gallery/get_gallery_video/`,
    usersGetBackground: `${apiUrl}/users/get_background/`,
    authValidate: `${apiUrl}/auth/validate`,
    authLogin: `${apiUrl}/auth/login`,

    messagesGetConversations: `${apiUrl}/messages/get_conversation`,
}

