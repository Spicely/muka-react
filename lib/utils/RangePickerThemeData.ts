import Color from './Color'
import BorderRadius from './BorderRadius'

interface IRangePickerThemeDataProps {
    rangePickerColor?: Color
    borderRadius?: BorderRadius
    height?: number | string
    hoverColor?: Color
}

export default class RangePickerThemeData {
    constructor(data?: IRangePickerThemeDataProps) {
        if (data) {
            if (data.height) this.height = data.height
            if (data.rangePickerColor) this.rangePickerColor = data.rangePickerColor
            if (data.borderRadius) this.borderRadius = data.borderRadius
            if (data.hoverColor) this.hoverColor = data.hoverColor
        }
    }

    public height: number | string = 30

    public rangePickerColor?: Color

    public borderRadius?: BorderRadius

    public hoverColor?: Color

}