import rgba from 'color-rgba'

export default class Color {
    public static fromRGBO(r: number, g: number, b: number, opacity: number): Color {
        return `rgb(${r},${g},${b},${opacity})`
    }

    public static fromRGB(r: number, g: number, b: number): Color {
        return `rgb(${r},${g},${b})`
    }

    public static setOpacity(color: string | Color, opacity: number): Color {
        const arr = rgba(color)
        return `rgb(${arr[0]},${arr[1]},${arr[2]},${opacity})`
    }
}