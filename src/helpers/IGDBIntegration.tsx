import ImagePlaceholder from "../assets/images/Image_Placeholder.svg";

export default abstract class IGDBImageSize {
    static readonly COVER_SMALL_90_128 = "cover_small"

    static readonly SCREENSHOT_MED_569_320 = "screenshot_med"

    static readonly COVER_BIG_264_374 = "cover_big"

    static readonly LOGO_MED_284_160 = "logo_med"

    static readonly SCREENSHOT_BIG_889_500 = "screenshot_big"

    static readonly SCREENSHOT_HUGE_1280_720 = "screenshot_huge"

    static readonly THUMB_90_90 = "thumb"

    static readonly MICRO_35_35 = "micro"

    static readonly P720_1280_720 = "720p"

    static readonly P1080_1920_1080 = "1080p"
}

/**
 * Return a URL for an IGDB image with the given hash and size.
 *
 * @param {string} imageHash - The hash of the image.
 * @param {string} size - The size of the image.
 * @returns {string} The URL of the image.
 */
export function getIGDBImageURL(imageHash: string, size: string) {
    if (imageHash === null || imageHash === undefined || imageHash === "") {
        return ImagePlaceholder;
    }
    return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageHash}.png`;
}
