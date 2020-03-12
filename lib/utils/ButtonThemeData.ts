import { isNil } from 'lodash'
import Color from './Color'
import IconThemeData from './IconThemeData'
import Border, { BorderStyle } from './Border'
import BorderRadius from './BorderRadius'

interface IButtonThemeDataProps {
    buttonColor?: Color
    disabledColor?: Color
    color?: Color
    border?: Border
    errorColor?: Color
    disabledFontColor?: Color
    disabledBorderColor?: Color
    borderRadius?: BorderRadius
    height?: number | string
    width?: number | string
    iconTheme?: IconThemeData
    fontSize?: number | string
}

export default class ButtonThemeData {

    constructor(data?: IButtonThemeDataProps) {
        if (data) {
            if (data.buttonColor) this.buttonColor = data.buttonColor
            if (data.color) this.color = data.color
            if (data.errorColor) this.errorColor = data.errorColor
            if (data.disabledColor) this.disabledColor = data.disabledColor
            if (data.disabledFontColor) this.disabledFontColor = data.disabledFontColor
            if (data.disabledBorderColor) this.disabledBorderColor = data.disabledBorderColor
            if (data.iconTheme) this.iconTheme = data.iconTheme
            if (data.border) this.border = data.border
            if (!isNil(data.height)) this.height = data.height
            if (!isNil(data.width)) this.width = data.width
            if (data.borderRadius) this.borderRadius = data.borderRadius
            if (!isNil(data.fontSize)) this.fontSize = data.fontSize
        }
    }

    public color?: Color

    public buttonColor?: Color

    public errorColor?: Color

    public width?: number | string

    public height: number | string = 32

    public fontSize?: number | string

    public disabledColor: Color = Color.fromRGB(241, 241, 241)

    public disabledFontColor: Color = Color.fromRGBO(0, 0, 0, 0.45)

    public disabledBorderColor: Color = Color.fromRGB(223, 216, 216)

    public borderRadius?: BorderRadius

    public border: Border = Border.all({
        width: 1,
        style: BorderStyle.solid,
        color: Color.fromRGB(221, 221, 221)
    })

    public iconTheme: IconThemeData = new IconThemeData({
        size: 18,
        color: Color.fromRGB(255, 255, 255)
    })
}