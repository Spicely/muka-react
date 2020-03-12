import Border, { BorderStyle } from './Border'
import { isNil } from 'lodash'
import Color from './Color'
import IconThemeData from './IconThemeData'

interface IBorder {
    width: number
    style: BorderStyle
    color: Color
}

interface IRadioThemeDataProps {
    radioColor?: Color
    disabledColor?: Color
    size?: number
    color?: Color
    fontSize?: number
    border?: IBorder
    iconTheme?: IconThemeData
    hoverBorderColor?: Color
}

export default class RadioThemeData {

    constructor(data?: IRadioThemeDataProps) {
        if (data) {
            if (data.radioColor) this.radioColor = data.radioColor
            if (data.color) this.color = data.color
            if (!isNil(data.size)) this.size = data.size
            if (!isNil(data.fontSize)) this.fontSize = data.fontSize
            if (data.border) this.border = data.border
            if (data.iconTheme) this.iconTheme = data.iconTheme
            if (data.hoverBorderColor) this.hoverBorderColor = data.hoverBorderColor
        }
    }

    public color: Color = Color.fromRGB(88, 88, 88)

    public radioColor?: Color

    public size: number = 18

    public fontSize: number = 12

    public iconTheme: IconThemeData = new IconThemeData({
        color: Color.fromRGB(255, 255, 255),
        size: 18
    })

    public hoverBorderColor?: Color

    public border: Border = Border.all({
        width: 1,
        style: BorderStyle.solid,
        color: Color.fromRGB(180, 180, 180)
    })
}