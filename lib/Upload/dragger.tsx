import React, { Component, ChangeEvent, DragEvent, CSSProperties } from 'react'
import axios from 'axios'
import { isString, isArray, isNumber, isObject, isFunction } from 'lodash'
import styled, { css } from 'styled-components'
import { Consumer as ThemeConsumer } from '../ThemeProvider'
import { IValue, UploadThemeData, getRatioUnit, getUnit, transition, Color, IconThemeData } from '../utils'
import { Consumer } from '../ConfigProvider'
import Progress from '../Progress'
import Icon, { iconType } from '../Icon'

export interface IUploadFileListProps {
    file: File
    url?: string
    preUrl?: string
    xhr?: any
    info: {
        fileName?: string
        type?: string
        progress: number
        status: 'error' | 'done' | 'uploading'
    }
}

const UploadView = styled.div`
    width: 100%;
`

interface IUploadViewBoxProps {
    uploadTheme: UploadThemeData
}
/* height: ${({ uploadTheme }) => getUnit(uploadTheme.height)}; */
const UploadViewBox = styled.div<IUploadViewBoxProps>`
    border-radius: ${({ uploadTheme, theme }) => getUnit(uploadTheme.borderRadius || theme.borderRadius)};
    ${({ uploadTheme }) => css`${uploadTheme.border.toString()};`}
    
    background: #fafafa;
    position: relative;
    cursor: pointer;
    ${transition(0.5)};
    padding: ${getRatioUnit(16)} 0;
    :hover {
        border-color: ${({ uploadTheme, theme }) => uploadTheme.uploadColor || theme.primarySwatch};
    }
`

const UploadDefault = styled.div`
    text-align: center;
`

const UploadDefaultIcon = styled.div`
    margin: 0 0 ${getRatioUnit(20)};
`

const UploadDefaultTitle = styled.div`
    line-height: 1.5;
    margin: 0 0 ${getRatioUnit(4)};
    color: rgba(0, 0, 0, 0.85);
    font-size: ${getRatioUnit(16)};
`

const UploadDefaultLabel = styled.div`
    color: rgba(0, 0, 0, 0.45);
    font-size: ${getRatioUnit(14)};
    height: ${getRatioUnit(40)};
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
`

const UploadProView = styled.div`
    margin-top: ${getRatioUnit(10)};
`

const UploadProViewItemClose = styled.div`
    display:none;
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(50%, -50%);
`

const UploadProViewItem = styled.div<IUploadViewBoxProps>`
    margin-top: ${getRatioUnit(5)};
    position: relative;
    margin-right: ${getRatioUnit(10)};

    :first-child {
        margin-top: 0;
    }

    :hover {
        background: ${({ uploadTheme, theme }) => Color.setOpacity(uploadTheme.uploadColor || theme.primarySwatch, 0.3).toString()};
        ${UploadProViewItemClose} {
            display: block;
        }
    }
    
`

const UploadProViewItemIcon = styled.div`
    width: ${getRatioUnit(40)};
    height: ${getRatioUnit(40)};
    border: ${getRatioUnit(1)} solid #d9d9d9;
`

const UploadProViewItemProgress = styled.div`
    padding-left:  ${getRatioUnit(10)};
`

const IconClose = styled(Icon)`
    background: rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    :hover {
        fill: #fff;
    }
`
export interface IUploadProps {
    className?: string
    uploadViewClassName?: string
    icon?: iconType | JSX.Element
    title?: string | JSX.Element
    label?: string | JSX.Element
    action?: string
    multiple: boolean
    fileTypes?: string[]
    baserUrl?: string
    maxFileSize?: number
    maxLength?: number
    style?: CSSProperties
    name?: string
    withCredentials?: boolean
    data?: IValue
    headers?: IValue
    fileList?: IUploadFileListProps[]
    renderItem?: (val: IUploadFileListProps) => JSX.Element[] | null[] | undefined[]
    onUploadSuccess?: (val: IUploadFileListProps, data: any, files: IUploadFileListProps[]) => void
    onUploadError?: (val: IUploadFileListProps, data: any, files: IUploadFileListProps[]) => void
    onFileTypeError?: () => void
    onUploadItemClear?: (delVal: IUploadFileListProps, data: IUploadFileListProps[]) => void
    onBeforeUpload?: (file: File) => (boolean | object | Promise<object | boolean>)
    onMaxFileSizeError?: () => void
    theme?: UploadThemeData
}

interface IState {
    fileList: IUploadFileListProps[]
}

export default class Upload extends Component<IUploadProps, IState> {

    constructor(props: IUploadProps) {
        super(props)
        this.state.fileList = props.fileList || []
    }

    public static defaultProps: IUploadProps = {
        multiple: true,
        onBeforeUpload: () => true
    }

    private intNode: null | HTMLInputElement = null

    private types: string[] = ['image/png', 'image/jpeg', 'image/jpg']

    public state: IState = {
        fileList: []
    }

    public render(): JSX.Element {
        const { className, children, icon, title, label, multiple, uploadViewClassName, renderItem, style, fileTypes, theme } = this.props
        const { fileList } = this.state
        return (
            <ThemeConsumer>
                {
                    (init) => (
                        <Consumer>
                            {
                                (value) => {
                                    const iconProps = icon || (value.uploadDraggerProps && value.uploadDraggerProps.icon)
                                    const titleProps = title || (value.uploadDraggerProps && value.uploadDraggerProps.title)
                                    const labelProps = label || (value.uploadDraggerProps && value.uploadDraggerProps.label)
                                    return (
                                        <UploadView style={style}>
                                            <UploadViewBox
                                                uploadTheme={theme || init.theme.uploadTheme}
                                                className={className}
                                                onClick={this.handleClick}
                                                onDragOver={this.handleDropOver}
                                                onDrop={this.handleFileDrop}
                                            >
                                                {
                                                    children ? children : (
                                                        <UploadDefault>
                                                            <UploadDefaultIcon>
                                                                {isString(iconProps) ? (
                                                                    <Icon
                                                                        icon={iconProps || undefined}
                                                                        theme={theme ? theme.iconTheme : init.theme.uploadTheme.iconTheme}
                                                                    />
                                                                ) : iconProps}
                                                            </UploadDefaultIcon>
                                                            <UploadDefaultTitle>
                                                                {titleProps}
                                                            </UploadDefaultTitle>
                                                            <UploadDefaultLabel>
                                                                {labelProps}
                                                            </UploadDefaultLabel>
                                                        </UploadDefault>
                                                    )
                                                }
                                                <input style={{ display: 'none' }} type="file" multiple={multiple} ref={(e) => this.intNode = e} onChange={this.handleFileChange} accept={(fileTypes || []).join(',')} />
                                            </UploadViewBox>
                                            <UploadProView className={uploadViewClassName}>
                                                {
                                                    fileList.map((i, index: number) => {
                                                        if (isFunction(renderItem)) {
                                                            return renderItem(i)
                                                        } else {
                                                            if (!i.info.fileName && !i.info.type) {
                                                                return undefined
                                                            }
                                                            return (
                                                                <UploadProViewItem
                                                                    className="flex"
                                                                    uploadTheme={theme || init.theme.uploadTheme}
                                                                    key={index}
                                                                >
                                                                    <UploadProViewItemIcon className="flex_center">
                                                                        {
                                                                            this.getTypeView(i.info.type || '', i.preUrl)
                                                                        }
                                                                    </UploadProViewItemIcon>
                                                                    <UploadProViewItemProgress className="flex_1">
                                                                        <div>{i.info.fileName}</div>
                                                                        <Progress percent={i.info.progress} text={`${i.info.progress}%`} />
                                                                    </UploadProViewItemProgress>
                                                                    <UploadProViewItemClose>
                                                                        <IconClose
                                                                            icon="ios-close"
                                                                            onClick={this.handleItemClose.bind(this, index)}
                                                                            theme={new IconThemeData({ size: 16 })}
                                                                        />
                                                                    </UploadProViewItemClose>
                                                                </UploadProViewItem>
                                                            )
                                                        }
                                                    })
                                                }
                                            </UploadProView>
                                        </UploadView>
                                    )
                                }
                            }
                        </Consumer>
                    )
                }
            </ThemeConsumer>
        )
    }

    public UNSAFE_componentWillReceiveProps(nextProps: IUploadProps) {
        const { fileList } = this.state
        if (nextProps.fileList && fileList.length !== nextProps.fileList.length) {
            this.setState({
                fileList: nextProps.fileList
            })
        }
    }

    private handleClick = () => {
        if (this.intNode) {
            this.intNode.click()
        }
    }

    private getTypeView = (type: string, url?: string) => {
        if (type.includes('jpeg') || type.includes('png') || type.includes('jpg')) {
            return (
                <div
                    style={{
                        width: '100%', height: '100%', backgroundImage: `url(${url})`, backgroundSize: '100% auto',
                        backgroundPosition: 'center'
                    }}
                />
            )
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
        e.currentTarget.value = ''
    }

    private updLoadFiles = (files: FileList) => {
        const { fileTypes, maxLength, action, name, data, withCredentials, baserUrl, onUploadSuccess, onUploadError, onFileTypeError, headers, onBeforeUpload, maxFileSize, onMaxFileSizeError } = this.props
        let { fileList } = this.state
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i)
            if (file && (isNumber(maxLength) ? fileList.length < maxLength : true)) {
                if (isArray(fileTypes)) {
                    // tslint:disable-next-line: no-shadowed-variable
                    if (fileTypes.includes(file.type) || fileTypes.some((i) => file.name.includes(i))) {
                        if (maxFileSize && file.size >= maxFileSize) {
                            if (isFunction(onMaxFileSizeError)) {
                                onMaxFileSizeError()
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
                    } else {
                        if (isFunction(onFileTypeError)) {
                            onFileTypeError()
                        }
                    }
                } else {
                    if (maxFileSize && file.size >= maxFileSize) {
                        if (isFunction(onMaxFileSizeError)) {
                            onMaxFileSizeError()
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
        }
        fileList = fileList.map((i, index) => {
            if (i.url) {
                i.info = {
                    progress: 100,
                    status: 'done'
                }
                return i
            }
            const uplodaFile = (val: IValue | boolean) => {
                const formData = new FormData()
                if (isObject(val)) {
                    Object.keys(val).forEach((i: any) => {
                        formData.append(i, val[i])
                    })
                }
                formData.append(name || 'avatar', i.file)
                if (isObject(data)) {
                    Object.keys(data).forEach((i: any) => {
                        formData.append(i, data[i])
                    })
                }
                i.xhr = axios({
                    method: 'POST',
                    headers,
                    url: action,
                    data: formData,
                    withCredentials,
                    onUploadProgress: (progressEvent) => {
                        const complete = (progressEvent.loaded / progressEvent.total * 100) || 0
                        // tslint:disable-next-line: no-shadowed-variable
                        const { fileList } = this.state
                        if (fileList[index]) {
                            fileList[index].info = {
                                ...fileList[index].info,
                                progress: complete,
                                status: complete === 100 ? 'done' : 'uploading'
                            }
                            this.setState({
                                fileList: [...fileList]
                            })
                        }
                    }
                }).then((response) => {
                    // tslint:disable-next-line: no-shadowed-variable
                    const { fileList } = this.state
                    if (response.status === 200) {
                        if (isFunction(onUploadSuccess)) {
                            onUploadSuccess(i, response.data, fileList)
                        }
                    } else {
                        if (isFunction(onUploadError)) {
                            onUploadError(i, response.data, fileList)
                        }
                    }
                }).catch(() => {
                    const { fileList } = this.state
                    if (fileList[index]) {
                        fileList[index].info = {
                            ...fileList[index].info,
                            progress: 100,
                            status: 'error'
                        }
                        this.setState({
                            fileList: [...fileList]
                        })
                    }
                })
            }
            if (!i.xhr && isFunction(onBeforeUpload)) {
                const fn = onBeforeUpload(i.file)
                if (fn instanceof Promise) {
                    fn.then((value) => {
                        if (value) {
                            uplodaFile(value)
                        }
                    })
                } else if (fn) {
                    uplodaFile(fn)
                }
            }
            return i
        })
    }

    private handleItemClose = (index: number) => {
        const { onUploadItemClear } = this.props
        const { fileList } = this.state
        const data = fileList[index]
        fileList.splice(index, 1)
        if (isFunction(onUploadItemClear)) {
            onUploadItemClear(data, fileList)
        } else {
            this.setState({
                fileList: [...fileList]
            })
        }
    }
}
