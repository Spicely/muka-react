import React, { Component } from 'react'
import { Tree as ATree } from 'antd'
import { TreeProps } from 'antd/lib/tree'
import styled, { css } from 'styled-components'
import { Consumer } from '../ThemeProvider'
import { TreeThemeData, getUnit } from '../utils'

export interface ITreeProps extends TreeProps {
    theme?: TreeThemeData
}

const { TreeNode } = ATree

const LATree = styled(ATree) <{ treeTheme: TreeThemeData }>`
    .ant-tree-checkbox-checked .ant-tree-checkbox-inner {
        background-color: ${({ theme, treeTheme }) => treeTheme.treeColor || theme.primarySwatch};
        border-color: ${({ theme, treeTheme }) => treeTheme.treeColor || theme.primarySwatch};
    }
    .ant-tree-checkbox-inner {
        ${({theme, treeTheme}) => css`${treeTheme.borderRadius || theme.borderRadius}`}
    }
    .ant-tree-checkbox-checked::after {
        border: ${getUnit(1)} solid ${({ theme, treeTheme }) => treeTheme.treeColor || theme.primarySwatch};
    }
    .ant-tree-checkbox-wrapper:hover .ant-tree-checkbox-inner, .ant-tree-checkbox:hover .ant-tree-checkbox-inner, .ant-tree-checkbox-input:focus + .ant-tree-checkbox-inner {
        border-color: ${({ theme, treeTheme }) => treeTheme.treeColor || theme.primarySwatch};
    }
`

export default class Tree extends Component<ITreeProps, any> {

    public static TreeNode = TreeNode

    public render(): JSX.Element {
        const { theme } = this.props
        return (
            <Consumer>
                {
                    (init) => (
                        <LATree
                            {...this.props}
                            treeTheme={theme || init.theme.treeTheme}
                        />
                    )
                }
            </Consumer>

        )
    }
}