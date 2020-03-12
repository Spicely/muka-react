import { isNumber } from 'lodash'
import { getUnit } from './index'
import Color from './Color'

interface IBorderAll {
    width?: number
    color?: Color,
    style?: BorderStyle
}

export class BorderStyle {
    public static solid: BorderStyle = 'solid'
    public static none: BorderStyle = 'none'
    public static hidden: BorderStyle = 'hidden'
    public static dotted: BorderStyle = 'dotted'
    public static dashed: BorderStyle = 'dashed'
    public static double: BorderStyle = 'double'
    public static groove: BorderStyle = 'groove'
    public static ridge: BorderStyle = 'ridge'
    public static inset: BorderStyle = 'inset'
    public static outset: BorderStyle = 'outset'
    public static inherit: BorderStyle = 'inherit'
}

export default class Border {
    /**
     * 
     * @param {IBorderAll} data 边框数据
     */
    public static all(data: IBorderAll): Border {
        return `border:${getUnit((isNumber(data.width) ? data.width : 1))} ${data.style ? data.style.toString() : BorderStyle.none.toString()} ${data.color ? data.color.toString() : Color.fromRGBO(0, 0, 0, 0).toString()};`
    }

    public static none: Border = 'border: none'
}