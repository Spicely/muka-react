import Color from './Color'
import Padding from './Padding'
import BorderRadius from './BorderRadius'
import IconThemeData from './IconThemeData'

interface IToastThemeDataProps {
    toastColor?: Color
    color?: Color
    padding?: Padding
    borderRadius?: BorderRadius
    iconTheme?: IconThemeData
}

export default class ToastThemeData {
    constructor(data?: IToastThemeDataProps) {
        if (data) {
            if (data.toastColor) this.toastColor = data.toastColor
            if (data.color) this.color = data.color
            if (data.padding) this.padding = data.padding
            if (data.borderRadius) this.borderRadius = data.borderRadius
            if (data.iconTheme) this.iconTheme = data.iconTheme
        }
    }

    public toastColor: Color = Color.fromRGBO(0, 0, 0, 0.7)

    public color: Color = Color.fromRGB(255, 255, 255)

    public padding: Padding = Padding.symmetric({
        horizontal: 15,
        vertical: 10
    })

    public borderRadius: BorderRadius = BorderRadius.all(3)

    public iconTheme: IconThemeData = new IconThemeData({
        color: Color.fromRGB(255, 255, 255),
        size: 30
    })

}