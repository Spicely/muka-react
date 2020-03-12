import { isNumber , isNil} from 'lodash'
import Color from './Color'
import Border, { BorderStyle } from './Border'
import IconThemeData from './IconThemeData'

interface IInputThemeDataProps {
    inputColor?: Color
    disabledColor?: Color
    height?: number | string
    fontSize?: number
    color?: Color
    width?: number | string
    border?: Border
    hoverColor?: Color
    iconCloseTheme?: IconThemeData
}

export default class InputThemeData {

    constructor(data?: IInputThemeDataProps) {
        if (data) {
            if (data.inputColor) this.inputColor = data.inputColor
            if (data.disabledColor) this.disabledColor = data.disabledColor
            if (!isNil(data.height)) this.height = data.height
            if (isNumber(data.fontSize)) this.fontSize = data.fontSize
            if (!isNil(data.width)) this.width = data.width
            if (data.color) this.color = data.color
            if (data.border) this.border = data.border
            if (data.hoverColor) this.hoverColor = data.hoverColor
            if (data.iconCloseTheme) this.iconCloseTheme = data.iconCloseTheme
        }
    }

    public fontSize?: number

    public color: Color = Color.fromRGB(18, 18, 18)

    public inputColor: Color = Color.fromRGB(255, 255, 255)

    public border?: Border = Border.all({
        width: 1,
        color: Color.fromRGB(232, 232, 232),
        style: BorderStyle.solid
    })

    public hoverColor?: Color

    public iconCloseTheme: IconThemeData = new IconThemeData({
        color: Color.fromRGB(97, 97, 97),
        size: 13,
    })

    public height: number | string = 32

    public width?: number | string

    public disabledColor: Color = Color.fromRGB(255, 255, 255)
}