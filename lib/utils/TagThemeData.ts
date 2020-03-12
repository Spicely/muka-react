import { isNil } from 'lodash'
import Color from './Color'
import Border, { BorderStyle } from './Border'

interface ITagThemeDataProps {
    tagColor?: Color
    borderRadius?: number | string
    width?: number
    border?: Border
}

export default class TagThemeData {
    constructor(data?: ITagThemeDataProps) {
        if (data) {
            if (data.tagColor) this.tagColor = data.tagColor
            if (!isNil(data.borderRadius)) this.borderRadius = data.borderRadius
            if (!isNil(data.width)) this.width = data.width
            if (data.border) this.border = data.border
        }
    }

    public tagColor?: Color

    public border: Border = Border.all({
        width: 1,
        style: BorderStyle.solid,
        color: Color.fromRGB(0, 0, 0)
    })

    public borderRadius?: number | string

    public width?: number
}