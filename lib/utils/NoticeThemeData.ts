import { isNil } from 'lodash'
import Color from './Color'
import IconThemeData from './IconThemeData'
import Padding from './Padding'

interface INoticeThemeDataProps {
    noticerColor?: Color
    height?: number | string
    width?: number | string
    logoHeight?: number | string
    logoWidth?: number | string
    iconTheme?: IconThemeData
    color?: Color
    padding?: Padding
}

export default class NoticeThemeData {

    constructor(data?: INoticeThemeDataProps) {
        if (data) {
            if (data.noticerColor) this.noticerColor = data.noticerColor
            if (!isNil(data.height)) this.height = data.height
            if (!isNil(data.width)) this.width = data.width
            if (!isNil(data.logoHeight)) this.logoHeight = data.logoHeight
            if (!isNil(data.logoWidth)) this.logoWidth = data.logoWidth
            if (data.iconTheme) this.iconTheme = data.iconTheme
            if (data.color) this.color = data.color
        }
    }

    public noticerColor: Color = Color.fromRGB(255, 255, 255)

    public color: Color = Color.fromRGB(0, 0, 0)

    public height: string | number = 35

    public logoHeight?: string | number = 25

    public logoWidth?: string | number = 42

    public width: string | number = '100%'

    public padding: Padding = Padding.all(5)

    public iconTheme: IconThemeData = new IconThemeData({
        color: Color.fromRGB(255, 255, 255)
    })
}