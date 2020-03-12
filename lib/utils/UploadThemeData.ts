import { isNil } from 'lodash'
import Color from './Color'
import Border, { BorderStyle } from './Border'
import IconThemeData from './IconThemeData'
import BorderRadius from './BorderRadius'
import DialogThemeData from './DialogThemeData'

interface IUploadThemeDataProps {
    uploadColor?: Color
    borderRadius?: BorderRadius
    width?: number | string
    draggerHeight?: number | string
    border?: Border
    iconTheme?: IconThemeData
    fontSize?: number | string
    background?: Color
    itemWidth?: number | string
    itemHeight?: number | string
    closeIconTheme?: IconThemeData
    cropDialogTheme?: DialogThemeData
}

export default class UploadThemeData {
    constructor(data?: IUploadThemeDataProps) {
        if (data) {
            if (data.uploadColor) this.uploadColor = data.uploadColor
            if (!isNil(data.borderRadius)) this.borderRadius = data.borderRadius
            if (!isNil(data.width)) this.width = data.width
            if (!isNil(data.draggerHeight)) this.draggerHeight = data.draggerHeight
            if (!isNil(data.fontSize)) this.fontSize = data.fontSize
            if (data.border) this.border = data.border
            if (data.iconTheme) this.iconTheme = data.iconTheme
            if (data.closeIconTheme) this.closeIconTheme = data.closeIconTheme
            if (data.background) this.background = data.background
            if (!isNil(data.itemWidth)) this.itemWidth = data.itemWidth
            if (!isNil(data.itemHeight)) this.itemHeight = data.itemHeight
            if (data.cropDialogTheme) this.cropDialogTheme = data.cropDialogTheme
        }
    }

    public uploadColor?: Color

    public borderRadius?: BorderRadius

    public width?: number | string

    public draggerHeight: number | string = 172

    public itemWidth: number | string = 80

    public itemHeight: number | string = 80

    public fontSize: number | string = 18

    public background: Color = Color.fromRGB(255, 255, 255)

    public border: Border = Border.all({
        width: 1,
        style: BorderStyle.dashed,
        color: Color.fromRGB(217, 217, 217)
    })

    public iconTheme: IconThemeData = new IconThemeData({
        size: 20,
        color: Color.fromRGB(217, 217, 217),
    })

    public cropDialogTheme: DialogThemeData = new  DialogThemeData({
        width: 900,
        height: 600
    })

    public closeIconTheme: IconThemeData = new IconThemeData({
        size: 16,
        color: Color.fromRGBO(0, 0, 0, 0.6),
    })

    public draggerIconTheme: IconThemeData = new IconThemeData({
        size: 40,
        color: Color.fromRGBO(6, 147, 227, 0.7),
    })
}