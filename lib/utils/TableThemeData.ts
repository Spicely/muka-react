import { isNil, isBoolean } from 'lodash'
import Color from './Color'
import Border, { BorderStyle } from './Border'
import BorderRadius from './BorderRadius'

interface ITableThemeData {
    tableColor?: Color
    borderRadius?: BorderRadius
    border?: Border
    activeColor?: boolean
}

export default class TableThemeData {
    constructor(data?: ITableThemeData) {
        if (data) {
            if (data.tableColor) this.tableColor = data.tableColor
            if (!isNil(data.borderRadius)) this.borderRadius = data.borderRadius
            if (data.border) this.border = data.border
            if (isBoolean(data.activeColor)) this.activeColor = data.activeColor
        }
    }

    public tableColor: Color = Color.fromRGB(255, 255, 255)

    public border: Border = Border.all({
        width: 1,
        style: BorderStyle.solid,
        color: Color.fromRGB(217, 217, 217)
    })

    public activeColor?: Color

    public borderRadius?: BorderRadius

}