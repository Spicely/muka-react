import { BorderStyle } from './Border'
import { isNumber } from 'lodash'
import Color from './Color'

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
}

export default class RadioThemeData {

    constructor(data?: IRadioThemeDataProps) {
        if (data) {
            if (data.radioColor) this.radioColor = data.radioColor
            if (data.color) this.color = data.color
            if (isNumber(data.size)) this.size = data.size
            if (isNumber(data.fontSize)) this.fontSize = data.fontSize
            if (data.border) this.border = data.border
        }
    }

    public color: Color = Color.fromRGB(88, 88, 88)

    public radioColor?: Color

    public size: number = 18

    public fontSize: number = 12

    public border: IBorder = {
        width: 1,
        style: BorderStyle.solid,
        color: Color.fromRGB(180, 180, 180)
    }
}