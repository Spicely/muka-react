import { isNumber } from 'lodash'
import Color from './Color'
import Border from './Border'
import IconThemeData from './IconThemeData'

interface IInputThemeDataProps {
    inputColor?: Color
    disabledColor?: Color
    height?: number
    fontSize?: number
    border?: Border
    hoverColor?: Color
    iconCloseTheme?: IconThemeData
}

export default class InputThemeData {

    constructor(data?: IInputThemeDataProps) {
        if (data) {
            if (data.inputColor) this.inputColor = data.inputColor
            if (data.disabledColor) this.disabledColor = data.disabledColor
            if (isNumber(data.height)) this.height = data.height
            if (isNumber(data.fontSize)) this.fontSize = data.fontSize
            if (data.hoverColor) this.hoverColor = data.hoverColor
            if (data.iconCloseTheme) this.iconCloseTheme = data.iconCloseTheme
        }
    }

    public fontSize: number = 12

    public inputColor: Color = Color.fromRGB(255, 255, 255)

    public border: Border = Border.all({
        width: 1,
        color: Color.fromRGB(232, 232, 232)
    })

    public hoverColor?: Color

    public iconCloseTheme: IconThemeData = new IconThemeData({
        color: Color.fromRGB(97, 97, 97),
        size: 13,
    })

    public height: number = 32

    public disabledColor: Color = Color.fromRGB(255, 255, 255)
}