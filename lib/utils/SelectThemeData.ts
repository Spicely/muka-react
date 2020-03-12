import { isNil } from 'lodash'
import Color from './Color'
import Border, { BorderStyle } from './Border'
import BorderRadius from './BorderRadius'
import IconThemeData from './IconThemeData'

interface ISelectThemeDataProps {
    selectColor?: Color
    borderRadius?: BorderRadius
    width?: number
    border?: Border
    height?: number | string
    iconTheme?: IconThemeData
}

export default class SelectThemeData {
    constructor(data?: ISelectThemeDataProps) {
        if (data) {
            if (!isNil(data.height)) this.height = data.height
            if (data.selectColor) this.selectColor = data.selectColor
            if (!isNil(data.borderRadius)) this.borderRadius = data.borderRadius
            if (!isNil(data.width)) this.width = data.width
            if (data.border) this.border = data.border
            if (data.iconTheme) this.iconTheme = data.iconTheme
        }
    }

    public height: number | string = 32

    public selectColor?: Color

    public border: Border = Border.all({
        width: 1,
        style: BorderStyle.solid,
        color: Color.fromRGB(232, 232, 232)
    })

    public borderRadius?: BorderRadius

    public width?: number

    public iconTheme = new IconThemeData({
        size: 14,
        color: Color.fromRGB(180, 179, 179),
    })
}