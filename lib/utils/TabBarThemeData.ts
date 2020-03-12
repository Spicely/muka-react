import { isNil } from 'lodash'
import Color from './Color'
import Padding from './Padding'
import IconThemeData from './IconThemeData'

interface ITabBarThemeDataProps {
    tabBarColor?: Color
    height?: number | string
    width?: number | string
    itemPadding?: Padding
    itemHoverColor?: Color
    itemSelectColor?: Color
    tabViewPadding?: Padding
    activeBarColor?: Color
    iconTheme?: IconThemeData
}

export default class TabBarThemeData {
    constructor(data?: ITabBarThemeDataProps) {
        if (data) {
            if (data.tabBarColor) this.tabBarColor = data.tabBarColor
            if (!isNil(data.height)) this.height = data.height
            if (!isNil(data.width)) this.width = data.width
            if (data.itemPadding) this.itemPadding = data.itemPadding
            if (data.itemHoverColor) this.itemHoverColor = data.itemHoverColor
            if (data.itemSelectColor) this.itemSelectColor = data.itemSelectColor
            if (data.tabViewPadding) this.tabViewPadding = data.tabViewPadding
            if (data.activeBarColor) this.activeBarColor = data.activeBarColor
            if (data.iconTheme) this.iconTheme = data.iconTheme
        }
    }

    public tabBarColor: Color = Color.fromRGB(255, 255, 255)

    public height: number | string = 400

    public width: number | string = '100%'

    public itemPadding: Padding = Padding.symmetric({ horizontal: 10, vertical: 8 })

    public itemHoverColor?: Color

    public itemSelectColor?: Color

    public tabViewPadding: Padding = Padding.symmetric({ horizontal: 10, vertical: 8 })

    public activeBarColor?: Color

    public iconTheme: IconThemeData = new IconThemeData()
}