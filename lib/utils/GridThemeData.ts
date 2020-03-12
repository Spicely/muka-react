import { isNil } from 'lodash'
import Color from './Color'
import Padding from './Padding'

interface IGridThemeDataProps {
    gridColor?: Color
    width?: number | string
    itemHeight?: number | string
    imgWidth?: number | string
    imgHeight?: number | string
    fontSize?: number | string
}

export default class GridThemeData {

    constructor(data?: IGridThemeDataProps) {
        if (data) {
            if (data.gridColor) this.gridColor = data.gridColor
            if (!isNil(data.fontSize)) this.fontSize = data.fontSize
            if (!isNil(data.width)) this.width = data.width
            if (!isNil(data.itemHeight)) this.itemHeight = data.itemHeight
        }
    }

    public gridColor: Color = Color.fromRGB(255, 255, 255)

    public itemHeight: number | string = 80

    public fontSize: number | string = 10

    public width: number | string = '100%'

    public imgWidth: number | string = 35

    public imgHeight: number | string = 35

    public itemPadding: Padding = Padding.symmetric({ vertical: 10 })
}