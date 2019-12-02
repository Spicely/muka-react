import Color from './Color'

interface IIconThemeDataProps {
    color?: Color
    size?: number
    opacity?: number
    hoverColor?: Color
}

export default class IconThemeData {

    constructor(data?: IIconThemeDataProps) {
        if (data) {
            if (data.color) this.color = data.color
            if (data.opacity) this.opacity = data.opacity
            if (data.size) this.size = data.size
        }
    }

    public color: Color = Color.fromRGBO(115, 115, 115, 1)

    public size: number = 22

    public opacity: number = 1
}