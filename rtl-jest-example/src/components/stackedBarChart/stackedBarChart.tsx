import * as React from 'react';
import * as R from 'ramda';
import * as d3 from 'd3';

import s from './stackedBarChart.styl';

const getMaxDomain: (property: string, array: object[]) => number = (prop, arr) => {
    const getValues = R.pluck(prop);
    const valuesArr = getValues(arr);
    const asc = (a, b) => b - a;
    const maxVal = R.sort(asc, valuesArr)[0];
    return maxVal;
};

interface IStackedBarChartProps {
    /**
    * Data array needed to render the chart. Must have properties label & value.
    **/
    data: object[];
    /**
    * Total Width value of component.
    **/
    containerWidth?: number;
    /**
     * Total Height value of component.
     **/
    containerHeight?: number;
    /**
    * Total Width value of component.
    **/
    width?: number;
    /**
    * Total Height value of component.
    **/
    height?: number;
    /**
    * Value used to increase/decrease the total height of the chart.
    **/
    scaleHeight?: number;
    /**
    * Value used to increase/decrease the total width of the chart.
     **/
    scaleWidth?: number;
    /**
    * Value used to rotate the Rect SVG elements. Valid numbers: 0 to 360, can take negative numbers as well.
    **/
    rotateStack?: number;
    /**
    * Value used to rotate the text SVG elements. Valid numbers: 0 to 360, can take negative numbers as well.
    **/
    rotateText?: number;
    /**
    * Value used to move the position of the graph along y-axis.
    **/
    translateY?: number;
    /**
    * Value used to move the position of the graph along x-axis.
    **/
    translateX?: number;
    /**
    * Color hex value, for example #5642A6. This value signals the start of the colorScale.
    **/
    colorStart?: string;
    /**
    * Color hex value, for example #D1F26D. This value signals the end of the colorScale.
    **/
    colorEnd?: string;
    /**
    * Value used to increase or decrease the padding around sections of bar chart.
    **/
    sectionPadding?: number;
    /**
    * Value used to determine amount of dashes for line SVG.
    **/
    lineDashWidth?: number;
    displayLabels?: boolean;
    /**
     * Used when we have no data for chart
     */
    loading?: boolean;
}

interface IStackedBarChartState {
    /**
    * An Array of Objects containing: x, y, height, width, fill, and key properties. This allows React to create the appropriate Rect SVG elements.
    **/
    StackedBarChartsArr: object[];
    /**
    * An Array of Objects containing: x, y, height, width, fill, and key properties. This allows React to create the appropriate Rect SVG elements.
    **/
    lineArr: object[],
    /**
    * An Array of Objects containing: x1, x2, y1, fill, and key properties. This allows React to create the appropriate Line SVG elements.
    **/
    valueText: object[];
    /**
    * An Array of Objects containing: x, y, textAnchor, text, and key properties. This allows React to create the appropriate Text SVG elements.
    **/
    labelText: object[];
}

class StackedBarChart extends React.Component<IStackedBarChartProps, IStackedBarChartState> {
    static defaultProps = {
        containerHeight: 350,
        containerWidth: 300,
        rotateStack: 0,
        rotateText: 0,
        translateY: 0,
        translateX: 0,
        scaleHeight: 1,
        scaleWidth: 1,
        colorStart: '#669EFF',
        colorEnd: '#1F4B99',
        sectionPadding: 4,
        lineDashWidth: 0,
        displayLabels: true,
        loading: false,
    }

    state = {
        StackedBarChartsArr: [],
        lineArr: [],
        valueText: [],
        labelText: [],
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        const { data, colorStart, colorEnd } = nextProps;
        if (!data) return {};

        const config = {
            f: d3.format('.1f'),
            margin: {top: 20, right: 10, bottom: 20, left: 10},
            width: 350,
            height: 200,
            barHeight: 100,
        }

        const total = d3.sum(data, d => d.value);
        const percentScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, config.width]);

        let cumulative = 0;
        const _data = data.map(d => {
            cumulative += (d.value * 100 / total);
            return {
                value: d.value,
                // want cumulative set to prior value (start of rect)
                cumulative: (cumulative - (d.value * 100 / total)),
                label: d.label,
                percent: (d.value * 100 / total),
            }
        });

        const {f, margin, width, height, barHeight } = config;
        const w = width - margin.left - margin.right;
        const h = height - margin.top - margin.bottom;
        const halfBarWidth = barHeight / 2;
        const maxValue = getMaxDomain('value', data);

        const colorIndex = d3.scaleLinear()
            .domain([0, data.length])
            .range([colorStart, colorEnd]);

        const StackedBarChartsArr: object[] = _data.map((d, index) => {
            return {
                x: ((h / 2) - halfBarWidth),
                y: percentScale(d.cumulative),
                height: ((percentScale((d.value * 100 / total)))),
                width: (config.barHeight),
                fill: colorIndex(index),
                key: _data.indexOf(d),
                total,
                value: d.value,
                percent: d.percent,
                heightPercent: (d.value * 100 / total)
            }
        });

        const lineArr: object[] = _data.map((d, index) => {
            return {
                x1: ((h / 2) + (halfBarWidth * 1.25)),
                x2: (h / 2) + (halfBarWidth * 1.25) + 90,
                y1: ((percentScale(d.cumulative) + (percentScale((d.value * 100 / total))) / 2) + 3),
                key: _data.indexOf(d),
            }
        });

        const labelText: object[] = _data.map((d, index) => {
            return {
                x: ((h / 2) + (halfBarWidth * 1.25)) + 0,
                y: ((percentScale(d.cumulative) + (percentScale((d.value * 100 / total))) / 2)) + 2.25,
                textAnchor: 'start',
                alignmentBaseline: 'baseline',
                text: d.label,
                key: _data.indexOf(d),
            }
        });

        const valueText: object[] = _data.map((d) => {
            return {
                x: ((h / 2) + (halfBarWidth * 1.25)) + 90,
                y: ((percentScale(d.cumulative) + (percentScale((d.value * 100 / total))) / 2)) + 2.25,
                textAnchor: 'end',
                alignmentBaseline: 'baseline',
                text: d.value,
                key: _data.indexOf(d),
            }
        });

        return {
            StackedBarChartsArr,
            lineArr,
            valueText,
            labelText,
        };
    }

    renderLoader = () => {
        const {
            containerHeight,
            containerWidth,
            scaleHeight,
            scaleWidth
        } = this.props;
        const wrapperStyles = {
            width: containerWidth * scaleWidth,
            height: containerHeight * scaleHeight
        }
        return (
            <div data-testid='stackedBar-loading' style={wrapperStyles} className={s['loader-stackedBar']}>
                <div />
                <div />
                <div />
            </div>
        )
    }

    render() {
        const {
            containerHeight,
            containerWidth,
            rotateStack,
            rotateText,
            scaleHeight,
            scaleWidth,
            translateY,
            translateX,
            sectionPadding,
            lineDashWidth,
            displayLabels,
            loading
        } = this.props;
        const {
            StackedBarChartsArr,
            lineArr,
            valueText,
            labelText
        } = this.state;
        return loading ? this.renderLoader() : (
            <React.Fragment>
                <svg width={containerWidth * scaleWidth} height={containerHeight * scaleHeight}>
                    <g
                        data-testid='stackedBar'
                        transform={`rotate(${rotateStack}) translate(${translateY} ${translateX})`}
                    >
                        {StackedBarChartsArr.map(d => (
                            <rect
                                className={s['rect-stack']}
                                x={d.x * scaleWidth}
                                y={d.y * scaleHeight}
                                width={d.width * scaleWidth}
                                height={d.height * scaleHeight}
                                key={d.key}
                                fill={d.fill}
                                stroke={'rgb(255,255,255)'}
                                strokeWidth={sectionPadding}
                                strokeOpacity={'1'}
                                style={{marginRight: '50px'}} />
                        ))}
                    </g>

                    { displayLabels && (
                    <g>
                        {lineArr.map(d => (
                            <line
                                className={s['line-stack']}
                                x1={d.x1 * scaleWidth}
                                y1={d.y1 * scaleHeight}
                                x2={d.x2 * scaleWidth}
                                y2={d.y1 * scaleHeight}
                                key={d.key}
                                stroke={'black'}
                                strokeWidth={1}
                                strokeDasharray={lineDashWidth} />
                        ))}
                    </g>)}

                    { displayLabels && (
                    <g
                        data-testid='stackedBar-text'
                        transform={`rotate(${rotateText}) translate(${translateY} ${translateX})`}
                    >
                        {valueText.map(d => (
                            <text
                                className={s['text-value']}
                                x={d.x * scaleWidth}
                                y={d.y * scaleHeight}
                                key={d.key}
                            >
                                <tspan
                                    textAnchor={d.textAnchor}
                                    alignmentBaseline={d.alignmentBaseline}
                                >
                                    {d.text}
                                </tspan>
                            </text>
                        ))}

                        {labelText.map(d => (
                            <text
                                className={s['text-label']}
                                x={d.x * scaleWidth}
                                y={d.y * scaleHeight}
                                key={d.key}
                            >
                                <tspan
                                    textAnchor={d.textAnchor}
                                    alignmentBaseline={d.alignmentBaseline}
                                >
                                    {d.text}
                                </tspan>
                            </text>
                        ))}
                    </g>)}
                </svg>
            </React.Fragment>
        );
    }
}

export default StackedBarChart;
