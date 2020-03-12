import { isNumber } from 'lodash'
import Color from './Color'
import NavBarThemeData from './NavBarThemeData'
import Padding from './Padding'

interface IDialogThemeDataProps {
    dialogColor?: Color
    navBarTheme?: NavBarThemeData
    borderRadius?: number
    width?: number | string
    height?: number | string
    minWidth?: number | string
    minHeight?: number | string
    padding?: Padding
}

export default class DialogThemeData {

    constructor(data?: IDialogThemeDataProps) {
        if (data) {
            if (data.dialogColor) this.dialogColor = data.dialogColor
            if (data.navBarTheme) this.navBarTheme = data.navBarTheme
            if (isNumber(data.borderRadius)) this.borderRadius = data.borderRadius
            if (data.height) this.height = data.height
            if (data.width) this.width = data.width
            if (data.minWidth) this.minWidth = data.minWidth
            if (data.minHeight) this.minHeight = data.minHeight
            if (data.padding) this.padding = data.padding
        }
    }

    public dialogColor: Color = Color.fromRGBO(255, 255, 255, 1)

    public width: number | string = 600

    public height: number | string = 400

    public minWidth?: number | string

    public minHeight?: number | string

    public borderRadius?: number

    public navBarTheme: NavBarThemeData = new NavBarThemeData({
        navBarColor: Color.fromRGB(255, 255, 255)
    })

    public padding: Padding = Padding.symmetric({ horizontal: 20, vertical: 10 })
}