import { isNil } from 'lodash'
import Color from './Color'
import IconThemeData from './IconThemeData'

interface INavBarThemeDataProps {
    navBarColor?: Color
    height?: number | string
    width?: number | string
    iconTheme?: IconThemeData
    rightIconTheme?: IconThemeData
    color?: Color
}

export default class NavBarThemeData {

    constructor(data?: INavBarThemeDataProps) {
        if (data) {
            if (data.navBarColor) this.navBarColor = data.navBarColor
            if (!isNil(data.height)) this.height = data.height
            if (!isNil(data.width)) this.width = data.width
            if (data.iconTheme) this.iconTheme = data.iconTheme
            if (data.rightIconTheme) this.rightIconTheme = data.rightIconTheme
            if (data.color) this.color = data.color
        }
    }

    public navBarColor?: Color

    public color: Color = Color.fromRGB(0, 0, 0)

    public height: string | number = 48

    public width: string | number = '100%'

    public iconTheme: IconThemeData = new IconThemeData({
        color: Color.fromRGB(255, 255, 255)
    })

    public rightIconTheme: IconThemeData = new IconThemeData({
        color: Color.fromRGB(255, 255, 255)
    })
}