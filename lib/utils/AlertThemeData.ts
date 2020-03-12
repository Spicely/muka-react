import Color from './Color'

interface IAlertThemeDataProps {
    alertColor?: Color
}

export default class AlertThemeData {

    constructor(data?: IAlertThemeDataProps) {
        if (data) {
            if (data.alertColor) this.alertColor = data.alertColor
        }
    }

    public alertColor?: Color
}