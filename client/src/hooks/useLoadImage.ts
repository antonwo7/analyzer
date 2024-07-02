import {useEffect, useState} from "react";

const useLoadImage = (src: string) => {
    const [isLoading, setLoading] = useState<boolean>(true)
    const [isError, setError] = useState<boolean>(false)
    const [isLoaded, setLoaded] = useState<boolean>(false)

    const {Image} = window
    let image = new Image()
    image.onload = e => {
        setLoading(false)
        setLoaded(true)
        setError(false)
    }

    image.onerror = () => {
        setLoading(false)
        setLoaded(false)
        setError(true)
    }

    const reload = () => {
        console.log('reload')
        let image = new Image()
        image.onload = e => {
            setLoading(false)
            setLoaded(true)
            setError(false)
        }

        image.onerror = () => {
            setLoading(false)
            setLoaded(false)
            setError(true)
        }

        const currentSrc = src

        setError(false)
        setLoaded(false)
        setLoading(true)

        src = ''
        src = currentSrc
    }

    useEffect(() => {
        if (!src || !Image) return;

        image.src = src

    }, [src])

    return { isLoading, isError, isLoaded, reload }
}

export default useLoadImage;