import React, { Component, ChangeEvent } from 'react'
import Cropper from 'react-easy-crop'
import axios from 'axios'
import { isFunction, isString, isObject } from 'lodash'
import styled, { css } from 'styled-components'
import CropImage from './cropImage'
import Dragger from './dragger'
import { Consumer } from '../ThemeProvider'
import Icon, { iconType } from '../Icon'
import Dialog from '../Dialog'
import Image from '../Image'
import { UploadThemeData, getUnit, transition, IValue } from '../utils'

export interface ICroppedArea {
    height: number
    width: number
    x: number
    y: number
}

interface IStyledProps {
    uploadTheme: UploadThemeData
}

const UploadView = styled.div<IStyledProps>`
    font-size: ${({ uploadTheme }) => getUnit(uploadTheme.fontSize)};
    background:${({ uploadTheme }) => uploadTheme.background.toString()};
`

const UploadIcon = styled(Icon)``

const UploadCloseIcon = styled(Icon) <IStyledProps>`
    position: absolute;
    right: ${getUnit(5)};
    top: ${getUnit(5)};
`

const UploadImage = styled(Image)`
    width: 100%;
`

interface IUloadItemProps extends IStyledProps {
    disabled: boolean
}

const UploadItem = styled.div<IUloadItemProps>`
    height: ${({ uploadTheme }) => getUnit(uploadTheme.itemHeight)};
    width: ${({ uploadTheme }) => getUnit(uploadTheme.itemWidth)};
    ${({ uploadTheme }) => uploadTheme.border.toString()};
    ${({ uploadTheme, theme }) => uploadTheme.borderRadius || theme.borderRadius};
    cursor: pointer;
    margin-right: ${getUnit(10)};
    margin-bottom: ${getUnit(5)};
    display: inline-block;
    vertical-align: middle;
    position: relative;
    ${transition(0.5)};
    :first-of-type {
        margin-left: 0;
    }
    
    :hover {
        ${({ disabled, uploadTheme, theme }) => {
        if (disabled) {
            return css`cursor: no-drop;`
        } else {
            return css`border-color: ${uploadTheme.uploadColor || theme.primarySwatch};
                        ${UploadIcon} {
                            fill: ${uploadTheme.uploadColor || theme.primarySwatch};
                        }
                    `
        }
    }}
    }
`

const UploadItemBox = styled.div`
    height: 100%;

    &.mk_picker_img {
        height: ${() => `calc(100% - ${getUnit(10)})`} ;
        width: ${() => `calc(100% - ${getUnit(10)})`} ;
        margin: ${getUnit(5)};
        box-sizing: border-box;
        overflow: hidden;
    }
`

interface IIconStyle {
    color?: string,
    fontSize?: string
}

interface ICropProps {
    cropShape?: 'rect' | 'round'
    cropSize?: {
        width?: number
        height?: number
    }
    showGrid?: boolean
    crossOrigin?: string
}

interface ICrop {
    x: number
    y: number
}

interface IFile {
    url: string | ArrayBuffer | null
    file?: File
    xhr?: any
    info: {
        progress: number,
        status: 'uploading' | 'done' | 'error'
    },
    data?: any
}

export interface IUploadProps {
    className?: string
    disabled?: boolean
    icon?: iconType | JSX.Element
    iconStyle?: IIconStyle
    multiple?: boolean
    onChange?: (files: IFile[]) => void
    crop?: boolean
    cropProps?: ICropProps
    maxLength?: number
    fileList?: IFile[]
    theme?: UploadThemeData
    fileTypes?: string[]
    headers?: IValue
    name?: string
    baserUrl?: string
    action?: string
    params?: IValue
    withCredentials?: boolean
    onFileTypeError?: () => void
    onUploadSuccess?: (val: IFile, data: any, files: IFile[]) => void
    onUploadError?: (val: IFile, data: any, files: IFile[]) => void
    onBeforeUpload?: (file: File) => (boolean | object | Promise<object | boolean>)
}

interface IState {
    files: IFile[]
    cropXY: ICrop,
    image: string
    aspect: number
    zoom: number
    visible: boolean
}

export default class Upload extends Component<IUploadProps, IState> {

    public static defaultProps: IUploadProps = {
        icon: 'md-add',
        iconStyle: {
            fontSize: '28px',
            color: '#bcbcbc'
        },
        fileTypes: [],
        onBeforeUpload: () => true
    }

    public static Dragger = Dragger

    public state: IState = {
        files: [],
        cropXY: { x: 0, y: 0 },
        image: '',
        aspect: 4 / 3,
        zoom: 1,
        visible: false
    }

    private filesList: IFile[] = []

    private index: number = 0

    private fileName: string = ''

    private croppedAreaPixels: ICroppedArea = {
        height: 0,
        width: 0,
        x: 0,
        y: 0
    }

    private croppedArea: ICroppedArea = {
        height: 0,
        width: 0,
        x: 0,
        y: 0
    }

    public componentDidMount() {
        const { fileList } = this.props
        const { files } = this.state
        this.setValue(fileList, files)
    }

    public UNSAFE_componentWillReceiveProps(nextProps: IUploadProps) {
        const { files } = this.state
        this.setValue(nextProps.fileList, files)
    }

    private fileNode: HTMLInputElement | null = null

    public render(): JSX.Element {
        const { className, multiple, crop, cropProps, disabled, theme, fileTypes } = this.props
        const { files, image, cropXY, aspect, zoom, visible } = this.state
        return (
            <Consumer>
                {
                    (val) => (
                        <UploadView
                            className={className}
                            uploadTheme={theme || val.theme.uploadTheme}
                        >
                            <input type="file" style={{ display: 'none' }} accept={(fileTypes || []).join(',')} ref={(e) => this.fileNode = e} multiple={crop ? false : multiple} onChange={this.handleFileChange} />
                            {
                                files.map((i: IFile, index: number) => {
                                    const iconTheme = theme ? theme.closeIconTheme : val.theme.uploadTheme.closeIconTheme
                                    if (!iconTheme.hoverColor) {
                                        iconTheme.hoverColor = theme ? theme.uploadColor ? theme.uploadColor : val.theme.primarySwatch : val.theme.primarySwatch
                                    }
                                    return (
                                        <UploadItem
                                            uploadTheme={theme || val.theme.uploadTheme}
                                            disabled={disabled || false}
                                            key={`$picker_${index}`}
                                        >
                                            <UploadItemBox
                                                className="flex_center mk_picker_img"
                                            >
                                                <UploadImage src={i.url} />
                                            </UploadItemBox>
                                            {
                                                !disabled && (
                                                    <UploadCloseIcon
                                                        uploadTheme={theme || val.theme.uploadTheme}
                                                        icon="md-close-circle"
                                                        onClick={this.handleFileRemove.bind(this, index)}
                                                        theme={iconTheme}
                                                    />
                                                )
                                            }
                                        </UploadItem>
                                    )
                                })
                            }
                            {this.getAddBox(theme || val.theme.uploadTheme)}
                            {(crop && !disabled) && (
                                <Dialog
                                    visible={visible}
                                    onClose={this.handleCropClose}
                                    onOk={this.handleOk}
                                    theme={theme ? theme.cropDialogTheme : val.theme.uploadTheme.cropDialogTheme}
                                >
                                    <Cropper
                                        {...cropProps}
                                        image={image}
                                        crop={cropXY}
                                        aspect={aspect}
                                        zoom={zoom}
                                        classes={{
                                            containerClassName: 'mk_upload_crop__container'
                                        }}
                                        style={{
                                            containerStyle: {
                                                position: 'relative',
                                                height: '500px'
                                            }
                                        }}
                                        onCropComplete={this.onCropComplete}
                                        onCropChange={this.onCropChange}
                                        onZoomChange={this.onZoomChange}
                                    />
                                </Dialog>
                            )}
                        </UploadView>
                    )
                }
            </Consumer>
        )
    }

    private getAddBox(theme: UploadThemeData): JSX.Element | undefined {
        const { icon, maxLength, disabled } = this.props
        const { files } = this.state
        if (!maxLength || maxLength > files.length) {
            return (
                <UploadItem
                    onClick={this.handleClick}
                    uploadTheme={theme}
                    disabled={disabled || false}
                >
                    <UploadItemBox className="flex_center">
                        {isString(icon) ? <UploadIcon icon={icon} theme={theme.iconTheme} /> : icon}
                    </UploadItemBox>
                </UploadItem>
            )
        }
        return undefined
    }

    private setValue(value: IFile[] | undefined, files: IFile[]) {
        if (value) {
            let status: boolean = false
            this.filesList = [...value]
            if (value.length && value.length === files.length) {
                status = value.every((i, index: number) => {
                    if (!files[index]) {
                        return false
                    }
                    return i.url === files[index].url
                })
            }
            if (!status) {
                this.setState({
                    files: value
                })
            }
        }
    }

    private handleClick = () => {
        const { disabled } = this.props
        if (this.fileNode && !disabled) {
            this.fileNode.click()
        }
    }

    private onCropChange = (crop: ICrop) => {
        this.setState({ cropXY: crop })
    }

    private onCropComplete = (croppedArea: ICroppedArea, croppedAreaPixels: ICroppedArea) => {
        this.croppedArea = croppedArea
        this.croppedAreaPixels = croppedAreaPixels
    }

    private onZoomChange = (zoom: number) => {
        this.setState({ zoom })
    }

    private handleCropClose = (val: boolean) => {
        this.setState({
            visible: val
        })
    }

    private handleFileRemove(index: number) {
        const { onChange } = this.props
        const { files } = this.state
        files.splice(index, 1)
        this.filesList.splice(index, 1)
        if (isFunction(onChange)) {
            onChange(files)
        }
        this.setState({
            files: [...files],
        })
    }

    private dataURLtoFile(dataurl: string, filename: string) {
        const arr = dataurl.split(',')
        const mime = ((arr[0] || '').match(/:(.*?);/) || [])[1]
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        const blob: any = new Blob([u8arr], { type: mime })
        if (/Edge/.test(navigator.userAgent)) {
            blob.lastModifiedDate = new Date()
            blob.name = filename
            blob.filename = filename
            return blob
        } else {
            const file = new File([blob], filename)
            return file
        }
    }

    private handleOk = async () => {
        const { onChange, onBeforeUpload } = this.props
        const { image, files } = this.state
        const croppedImage: any = await CropImage(image, this.croppedAreaPixels)
        const file = this.dataURLtoFile(croppedImage, this.fileName)
        const fileObj: IFile = {
            file,
            url: croppedImage,
            info: {
                progress: 0,
                status: 'uploading',
            }
        }
        if (isFunction(onBeforeUpload)) {
            const fn = onBeforeUpload(file)
            if (fn instanceof Promise) {
                fn.then((value) => {
                    if (value) {
                        const obj = this.uploadFile(fileObj, files.length, value)
                        this.filesList.push(obj)
                        this.setState({
                            visible: false,
                            files: [...this.filesList]
                        }, () => {
                            if (isFunction(onChange)) {
                                onChange(this.filesList)
                            }
                        })
                    }
                })
            } else if (fn) {
                const obj = this.uploadFile(fileObj, files.length)
                this.filesList.push(obj)
                this.setState({
                    visible: false,
                    files: [...this.filesList]
                }, () => {
                    if (isFunction(onChange)) {
                        onChange(this.filesList)
                    }
                })
            }
        }

    }

    private uploadFile = (fileObj: IFile, index: number, data?: true | IValue): IFile => {
        const { onUploadSuccess, onUploadError, headers, action, withCredentials, params, name } = this.props
        const formData = new FormData()
        if (isObject(params)) {
            Object.keys(params).forEach((i: any) => {
                formData.append(i, params[i])
            })
        }
        if (isObject(data)) {
            Object.keys(data).forEach((i: string) => {
                formData.append(i, data[i])
            })
        }
        formData.append(name || 'avatar', fileObj.file || '')
        if (action) {
            const xhr = axios({
                method: 'POST',
                headers,
                url: action,
                data: formData,
                withCredentials,
                onUploadProgress: (progressEvent) => {
                    const { fileList } = this.props
                    const complete = (progressEvent.loaded / progressEvent.total * 100) || 0
                    // tslint:disable-next-line: no-shadowed-variable
                    const { files } = this.state
                    if (files[index] && fileList) {
                        files[index].info = {
                            ...files[index].info,
                            progress: complete,
                            status: complete === 100 ? 'done' : 'uploading'
                        }
                        this.setState({
                            files: [...fileList]
                        })
                    }
                }
            }).then((response) => {
                // tslint:disable-next-line: no-shadowed-variable
                const { files } = this.state
                const { fileList } = this.props
                if (files[index] && fileList) {
                    files[index].data = response.data
                    this.setState({
                        files: [...fileList]
                    }, () => {
                        if (response.status === 200) {
                            if (isFunction(onUploadSuccess)) {
                                onUploadSuccess(files[index], response.data, files)
                            }
                        } else {
                            if (isFunction(onUploadError)) {
                                onUploadError(files[index], response.data, files)
                            }
                        }
                    })
                }
            }).catch(() => {
                const { fileList } = this.props
                const { files } = this.state
                if (files[index] && fileList) {
                    files[index].info = {
                        ...files[index].info,
                        progress: 100,
                        status: 'error'
                    }
                    this.setState({
                        files: [...fileList]
                    })
                }
            })
            fileObj.xhr = xhr
        }
        return fileObj
    }

    private readFile(file: File, index: number) {
        const { files } = this.state
        if (files[index] && file === files[index].file) {
            return undefined
        }
        const reader = new FileReader()
        reader.readAsDataURL(file)
        return new Promise((resolve) => {
            reader.onload = () => {
                const { crop } = this.props
                if (!crop) {
                    this.filesList[index].url = reader.result
                    this.setState({
                        files: [...this.filesList]
                    })
                } else {
                    let image: any = ''
                    let visible: boolean = false
                    if (reader.result) {
                        image = reader.result
                        visible = true
                    }
                    this.setState({
                        image,
                        visible
                    })
                }
                resolve()
            }
        })
    }

    private handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const { onChange } = this.props
        if (e.currentTarget.files) {
            const { crop, fileTypes, onFileTypeError, onBeforeUpload } = this.props
            const { files } = this.state
            const length = files.length
            const fileList = e.currentTarget.files
            if (crop) {
                this.index = length
                const _file = fileList.item(0)
                if (_file && fileTypes) {
                    if (!fileTypes.length || fileTypes.includes(_file.type) || fileTypes.some((i) => _file.name.includes(i))) {
                        this.fileName = _file.name
                        await this.readFile(_file, length)
                    } else {
                        if (isFunction(onFileTypeError)) {
                            onFileTypeError()
                        }
                    }
                }
            } else {
                const { maxLength } = this.props
                const fileLength = maxLength ? maxLength - length : fileList.length
                if (fileLength <= 0) {
                    return
                }
                for (let i = 0; i < fileLength; i++) {
                    const _file = fileList.item(i)
                    if (_file && fileTypes) {
                        if (!fileTypes.length || fileTypes.includes(_file.type) || fileTypes.some((i) => _file.name.includes(i))) {
                            const fileObj: IFile = {
                                file: _file,
                                url: '',
                                info: {
                                    progress: 0,
                                    status: 'uploading',
                                }
                            }
                            // this.filesList.push(fileObj)
                            if (isFunction(onBeforeUpload)) {
                                const fn = onBeforeUpload(_file)
                                if (fn instanceof Promise) {
                                    fn.then(async (value) => {
                                        if (value) {
                                            const obj = this.uploadFile(fileObj, length + i, value)
                                            this.filesList.push(obj)
                                            await this.readFile(_file, length + i)
                                            this.setState({
                                                visible: false,
                                                files: [...this.filesList]
                                            }, () => {
                                                if (isFunction(onChange)) {
                                                    onChange(this.filesList)
                                                }
                                            })
                                        }
                                    })
                                } else if (fn) {
                                    const obj = this.uploadFile(fileObj, files.length)
                                    this.filesList.push(obj)
                                    await this.readFile(_file, length + i)
                                    this.setState({
                                        visible: false,
                                        files: [...this.filesList]
                                    }, () => {
                                        if (isFunction(onChange)) {
                                            onChange(this.filesList)
                                        }
                                    })
                                }
                            }
                        } else {
                            if (isFunction(onFileTypeError)) {
                                onFileTypeError()
                            }
                        }
                    }
                }
            }
            if (isFunction(onChange)) {
                onChange(this.filesList)
            }
            // e.target.value = ''
        }
    }
}
