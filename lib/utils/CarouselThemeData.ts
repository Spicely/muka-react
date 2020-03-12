import { isNil } from 'lodash'
import Color from './Color'

interface ICarouselThemeDataProps {
    carouselColor?: Color
    height?: number | string
    width?: number | string
    dotColor?: Color
    dotSize?: number
    dotBorderRadius?: number
}

export default class CarouselThemeData {

    constructor(data?: ICarouselThemeDataProps) {
        if (data) {
            if (data.carouselColor) this.carouselColor = data.carouselColor
            if (data.dotColor) this.dotColor = data.dotColor
            if (!isNil(data.height)) this.height = data.height
            if (!isNil(data.width)) this.width = data.width
            if (!isNil(data.dotSize)) this.dotSize = data.dotSize
            if (!isNil(data.dotBorderRadius)) this.dotBorderRadius = data.dotBorderRadius
        }
    }

    public carouselColor?: Color

    public height: number | string = 170

    public width?: number | string

    public dotColor?: Color

    public dotSize: number = 8

    public dotBorderRadius?: number = 2

}