import React, { Component, CSSProperties } from 'react'
import styled from 'styled-components'
import { Consumer } from '../ThemeProvider'
import { CardThemeData, getUnit } from '../utils'
import Image from '../Image'

export interface ICardProps {
    className?: string
    source?: string
    theme?: CardThemeData
    style?: CSSProperties
}

interface ICardViewProps {
    cardTheme: CardThemeData
}

const CardView = styled.div<ICardViewProps>`
    min-height: ${({ cardTheme }) => getUnit(cardTheme.height)};
    background: ${({ cardTheme }) => cardTheme.cardColor.toString()};
    width: 100%;
    ${({ cardTheme }) => cardTheme.borderRadius.toString()}
    overflow: hidden;
`

const CardImg = styled.div<ICardViewProps>`
    height: ${({ cardTheme }) => getUnit(cardTheme.height * 0.7)};
    display: block;
    margin: 0 auto;
    overflow: hidden;
`

const CardInfo = styled.div`
    padding: ${getUnit(5)};
`

export default class Card extends Component<ICardProps, any> {
    public render(): JSX.Element {
        const { className, source, children, theme, style } = this.props
        return (
            <Consumer>
                {
                    (init) => (
                        <CardView
                            className={className}
                            style={style}
                            cardTheme={theme || init.theme.cardTheme}
                        >
                            {source ? (
                                <CardImg
                                    cardTheme={theme || init.theme.cardTheme}
                                >
                                    <Image src={source} style={{ height: '100%', width: '100%' }} />
                                </CardImg>
                            ) : null}
                            <CardInfo>
                                {children}
                            </CardInfo>
                        </CardView>
                    )
                }
            </Consumer>
        )
    }
}
