import { isNil } from 'lodash'
import Color from './Color'

interface IColorsThemeDataProps {
    colorsColor?: Color
    height?: number | string
    width?: number | string
    dotColor?: Color
    dotSize?: number
    borderRadius?: number
}

export default class ColorsThemeData {

    constructor(data?: IColorsThemeDataProps) {
        if (data) {
            if (data.colorsColor) this.colorsColor = data.colorsColor
            if (!isNil(data.height)) this.height = data.height
            if (!isNil(data.width)) this.width = data.width
            if (!isNil(data.borderRadius)) this.borderRadius = data.borderRadius
        }
    }

    public colorsColor: Color = Color.fromRGB(255, 255, 255)

    public height: number | string = 30

    public width: number | string = 80

    public borderRadius?: number

}