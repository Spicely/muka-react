import Color from './Color'
import IconThemeData from './IconThemeData'

interface IMenuThemeDataProps {
    menuColor?: Color
    disabledColor?: Color
    height?: number
    width?: number
    hoverIconColor?: Color
    iconTheme?: IconThemeData
    color?: Color
}

export default class MenuThemeData {

    constructor(data?: IMenuThemeDataProps) {
        if (data) {
            if (data.menuColor) this.menuColor = data.menuColor
            if (data.height) this.height = data.height
            if (data.width) this.width = data.width
            if (data.iconTheme) this.iconTheme = data.iconTheme
            if (data.hoverIconColor) this.hoverIconColor = data.hoverIconColor
            if (data.color) this.color = data.color
        }
    }

    public color: Color = Color.fromRGB(0, 0, 0)

    public menuColor: Color = Color.fromRGBO(255, 255, 255, 1)

    public height: number = 400

    public width: number = 160

    public iconTheme: IconThemeData = new IconThemeData({
        color: Color.fromRGB(204, 204, 204)
    })

    public hoverIconColor?: Color
}