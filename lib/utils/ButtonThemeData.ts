import Color from './Color'

interface IButtonThemeDataProps {
    buttonColor?: Color
    disabledColor?: Color
    height?: number
}

export default class ButtonThemeData {

    constructor(data?: IButtonThemeDataProps) {
        if (data) {
            if (data.buttonColor) this.buttonColor = data.buttonColor
            if (data.disabledColor) this.disabledColor = data.disabledColor
            if (data.height) this.height = data.height
        }
    }

    public buttonColor: Color = Color.fromRGBO(6, 147, 227, 1)

    public height: number = 30

    public disabledColor: Color = Color.fromRGB(0, 0, 0)
}