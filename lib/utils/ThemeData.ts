import { isNumber } from 'lodash'
import Color from './Color'
import ButtonThemeData from './ButtonThemeData'
import IconThemeData from './IconThemeData'
import InputThemeData from './InputThemeData'
import MenuThemeData from './MenuThemeData'
import RadioThemeData from './RadioThemeData'
import TabBarThemeData from './TabBarThemeData'

export type IUnit = 'px' | 'rem'

interface IThemeDataProps {
    primarySwatch?: Color
    errorColor?: Color
    dividerColor?: Color
    fontColor?: Color
    buttonTheme?: ButtonThemeData
    iconTheme?: IconThemeData
    borderRadius?: number
    unit?: IUnit
    dialogColor?: number
    navBarHeight?: number
    menuGroupHeight?: number
    ratio?: number
    inputTheme?: InputThemeData
    menuTheme?: MenuThemeData
    radioTheme?: RadioThemeData
    tabBarTheme?: TabBarThemeData
}

export default class ThemeData {

    constructor(data?: IThemeDataProps) {
        if (data) {
            if (data.primarySwatch) this.primarySwatch = data.primarySwatch
            if (data.buttonTheme) this.buttonTheme = data.buttonTheme
            if (data.iconTheme) this.iconTheme = data.iconTheme
            if (isNumber(data.borderRadius)) this.borderRadius = data.borderRadius
            if (data.unit) this.unit = data.unit
            if (data.errorColor) this.errorColor = data.errorColor
            if (data.dividerColor) this.dividerColor = data.dividerColor
            if (data.navBarHeight) this.navBarHeight = data.navBarHeight
            if (data.menuGroupHeight) this.menuGroupHeight = data.menuGroupHeight
            if (data.fontColor) this.fontColor = data.fontColor
            if (isNumber(data.navBarHeight)) this.navBarHeight = data.navBarHeight
            if(data.inputTheme) this.inputTheme = data.inputTheme
            if(data.menuTheme) this.menuTheme = data.menuTheme
            if(data.radioTheme) this.radioTheme = data.radioTheme
            if(data.tabBarTheme) this.tabBarTheme = data.tabBarTheme
            if (isNumber(data.ratio)) this.ratio = data.ratio
        }
    }

    public primarySwatch: Color = Color.fromRGBO(6, 147, 227, 1)

    public errorColor: Color = Color.fromRGBO(250, 0, 0, 1)

    public dividerColor: Color = Color.fromRGB(230, 230, 230)

    public fontColor: Color = Color.fromRGB(0, 0, 0)

    public buttonTheme: ButtonThemeData = new ButtonThemeData()

    public inputTheme: InputThemeData = new InputThemeData()

    public iconTheme: IconThemeData = new IconThemeData()

    public tabBarTheme: TabBarThemeData = new TabBarThemeData()

    public menuTheme: MenuThemeData = new MenuThemeData()

    public radioTheme: RadioThemeData = new RadioThemeData()

    public dialogColor: Color = Color.fromRGB(255, 255, 255)

    public navBarHeight: number = 48

    public menuGroupHeight: number = 45

    public unit: IUnit = 'rem'

    public ratio: number = 0.05

    public static unit: IUnit = 'rem'

    public static ratio: number = 0.05

    public borderRadius: number = 2
}