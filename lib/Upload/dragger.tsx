import React, { Component, ChangeEvent, DragEvent, CSSProperties } from 'react'
import axios, { AxiosPromise } from 'axios'
import { isString, isArray, isNumber, isObject, isFunction } from 'muka'
import { getClassName, IValue } from '../utils'
import { Consumer } from '../ConfigProvider'
import Icon, { iconType } from '../Icon'
import Progress from '../Progress'

export interface IUploadProps {
    className?: string
    uploadViewClassName?: string
    icon?: iconType | JSX.Element
    iconColor?: string
    title?: string | JSX.Element
    label?: string | JSX.Element
    action?: string
    multiple: boolean
    fileTypes?: string[]
    baserUrl?: string
    maxLength?: boolean
    style?: CSSProperties
    name?: string
    withCredentials?: boolean
    data?: IValue
    fileList?: IUploadFileListProps[]
    renderItem?: (val: IUploadFileListProps) => JSX.Element[] | null[] | undefined[]
    onUploadSuccess?: (val: IUploadFileListProps, data: any) => void
}

interface IUploadFileListProps {
    file: File
    url?: string
    preUrl?: string
    xhr?: AxiosPromise
    info: {
        fileName?: string
        type?: string
        progress: number
        status: 'error' | 'done' | 'uploading'
    }
}

interface IState {
    fileList: IUploadFileListProps[]
}

const prefixClass = 'upload_dragger'

export default class Upload extends Component<IUploadProps, IState> {

    constructor(props: IUploadProps) {
        super(props)
        this.state.fileList = props.fileList || []
    }

    public static defaultProps: IUploadProps = {
        multiple: true
    }

    private intNode: null | HTMLInputElement = null

    private types: string[] = ['image/png', 'image/jpeg', 'image/jpg']

    public state: IState = {
        fileList: []
    }

    public render(): JSX.Element {
        const { className, children, icon, title, label, iconColor, multiple, uploadViewClassName, renderItem, style } = this.props
        const { fileList } = this.state
        return (
            <Consumer>
                {
                    (value) => {
                        const iconProps = icon || (value.uploadDraggerProps && value.uploadDraggerProps.icon)
                        const iconColorProps = iconColor || (value.uploadDraggerProps && value.uploadDraggerProps.iconColor)
                        const titleProps = title || (value.uploadDraggerProps && value.uploadDraggerProps.title)
                        const labelProps = label || (value.uploadDraggerProps && value.uploadDraggerProps.label)
                        return (
                            <div className={getClassName(`${prefixClass}`, className)} style={style}>
                                <div className={getClassName(`${prefixClass}__box`, className)} onClick={this.handleClick} onDragOver={this.handleDropOver} onDrop={this.handleFileDrop}>
                                    {
                                        children ? children : (
                                            <div className={getClassName(`${prefixClass}__box_default`)}>
                                                <div className={getClassName(`${prefixClass}__box_default__icon`)}>
                                                    {isString(iconProps) ? <Icon icon={iconProps} fontSize="40px" color={iconColorProps} /> : iconProps}
                                                </div>
                                                <div className={getClassName(`${prefixClass}__box_default__title`)}>
                                                    {titleProps}
                                                </div>
                                                <div className={getClassName(`${prefixClass}__box_default__label`)}>
                                                    {labelProps}
                                                </div>
                                            </div>
                                        )
                                    }
                                    <input style={{ display: 'none' }} type="file" multiple={multiple} ref={(e) => this.intNode = e} onChange={this.handleFileChange} />
                                </div>
                                <div className={getClassName(`${prefixClass}_upload__view`, uploadViewClassName)}>
                                    {
                                        fileList.map((i, index: number) => {
                                            if (isFunction(renderItem)) {
                                                return renderItem(i)
                                            } else {
                                                if (!i.info.fileName || !i.info.type) return
                                                return (
                                                    <div className={getClassName(`${prefixClass}_upload__view__item flex`)} key={index}>
                                                        <div className={getClassName(`${prefixClass}_upload__view__item__icon flex_center`)}>
                                                            {
                                                                this.getTypeView(i.info.type || '', i.preUrl)
                                                            }
                                                        </div>
                                                        <div className={getClassName(`${prefixClass}_upload__view__item__progress flex_1`)}>
                                                            <div>{i.info.fileName}</div>
                                                            <Progress percent={i.info.progress} text={`${i.info.progress}%`} />
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                            </div>
                        )
                    }
                }
            </Consumer>
        )
    }

    private handleClick = () => {
        if (this.intNode) {
            this.intNode.click()
        }
    }

    private getTypeView = (type: string, url?: string) => {
        if (type.includes('jpeg') || type.includes('png') || type.includes('jpg')) {
            return <div style={{
                width: '100%', height: '100%', backgroundImage: `url(${url})`, backgroundSize: '100% auto',
                backgroundPosition: 'center'
            }} />
        } else {
            return <Icon icon="md-document" color="rgba(0, 0, 0, 0.45)" />
        }
    }

    private handleDropOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    private handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const files = e.dataTransfer.files
        if (files) {
            this.updLoadFiles(files)
        }
    }

    private handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files
        if (files) {
            this.updLoadFiles(files)
        }
    }

    private updLoadFiles = (files: FileList) => {
        const { fileTypes, maxLength, action, name, data, withCredentials, baserUrl, onUploadSuccess } = this.props
        let { fileList } = this.state
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i)
            if (file && (isNumber(maxLength) ? fileList.length <= maxLength : true)) {
                if (isArray(fileTypes)) {
                    if (fileTypes.includes(file.type)) {
                        fileList.push({
                            file,
                            preUrl: this.types.includes(file.type) ? window.URL.createObjectURL(file) : '',
                            info: {
                                progress: 0,
                                status: 'uploading'
                            }
                        })
                    }
                } else {
                    fileList.push({
                        file,
                        preUrl: this.types.includes(file.type) ? window.URL.createObjectURL(file) : '',
                        info: {
                            fileName: file.name,
                            type: file.type,
                            progress: 0,
                            status: 'uploading'
                        }
                    })
                }
            }
        }
        fileList = fileList.map((i, index) => {
            if (i.url) {
                i.info = {
                    progress: 100,
                    status: 'done'
                }
                return i
            }
            const formData = new FormData()
            formData.append(name || 'avatar', i.file)
            if (isObject(data)) {
                Object.keys(data).map((i) => {
                    formData.append(i, data[i])
                })
            }
            if (!i.xhr) {
                i.xhr = axios({
                    baseURL: baserUrl,
                    method: 'POST',
                    url: action,
                    data: formData,
                    withCredentials,
                    onUploadProgress: (progressEvent) => {
                        const complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
                        const { fileList } = this.state
                        fileList[index].info = {
                            ...fileList[index].info,
                            progress: complete,
                            status: complete === 100 ? 'done' : 'uploading'
                        }
                        this.setState({
                            fileList: [...fileList]
                        }, async () => {
                            if (i.xhr && complete === 100) {
                                const data = await i.xhr
                                if (isFunction(onUploadSuccess)) {
                                    onUploadSuccess(i, data.data)
                                }
                            }
                        })
                    }
                })
            }
            return i
        })
    }
}