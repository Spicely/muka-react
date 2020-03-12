import { isNil } from 'lodash'
import Color from './Color'
import Border, { BorderStyle } from './Border'

interface ITextareaThemeData {
    textareaColor?: Color
    borderRadius?: number | string
    width?: number | string
    height?: number | string
    border?: Border
    fontSize?: number | string
    hoverColor?: Color
    disabledBorderColor?: Color
}

export default class TextareaThemeData {
    constructor(data?: ITextareaThemeData) {
        if (data) {
            if (data.textareaColor) this.textareaColor = data.textareaColor
            if (!isNil(data.borderRadius)) this.borderRadius = data.borderRadius
            if (!isNil(data.width)) this.width = data.width
            if (!isNil(data.height)) this.height = data.height
            if (!isNil(data.fontSize)) this.fontSize = data.fontSize
            if (data.hoverColor) this.hoverColor = data.hoverColor
            if (data.border) this.border = data.border
            if (data.disabledBorderColor) this.disabledBorderColor = data.disabledBorderColor
        }
    }

    public textareaColor: Color = Color.fromRGB(255, 255, 255)

    public border: Border = Border.all({
        width: 1,
        style: BorderStyle.solid,
        color: Color.fromRGB(232, 232, 232)
    })

    public borderRadius?: number | string

    public disabledBorderColor?: Color

    public width: number | string = '100%'

    public height: number | string = 80

    public fontSize?: number | string

    public hoverColor?: Color

    
}