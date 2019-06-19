import React from 'react';
import { render } from '@testing-library/react';
import StackedBarChart from '../stackedBarChart';

const portAvail = require('../../../data/devicePortAvailability.json');

test('renders a stacked bar with labels', async () => {
    const { getAllByText, getByTestId } = render(
        <StackedBarChart
            data={portAvail}
        />,
    );
    const rectGroup = getByTestId('stackedBar');
    expect(rectGroup.children.length).toBe(3);

    const textGroup = getByTestId('stackedBar-text');
    expect(textGroup.children.length).toBe(6);
    const freeTextLabel = getAllByText(/free/i);
    const inuseTextLabe = getAllByText(/inuse/i);
    const reservedTextLabel = getAllByText(/inuse/i);

    // jsdom expects an SVGElement but text > tspan is captured as array
    // verifying if selector exists, it's in the dom
    expect(freeTextLabel).toBeTruthy();
    expect(inuseTextLabe).toBeTruthy();
    expect(reservedTextLabel).toBeTruthy();
});
