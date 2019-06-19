import 'jest-dom/extend-expect';
import '@testing-library/react/cleanup-after-each';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Dropdown from '../dropdown';

const bruceWillisMovies = [
    {
        name: 'Die Hard',
        value: 'Die Hard (1988)',
        disabled: false,
    },
    {
        name: 'Die Hard 2',
        value: 'Die Hard 2 (1990)',
        disabled: false,
    },
    {
        name: 'Pulp Fiction',
        value: 'Pulp Fiction (1994)',
        disabled: true,
    },
    {
        name: 'The Fifth Element',
        value: 'The Fifth Element (1997)',
        disabled: false,
    },
    {
        name: 'The Sixth Sense',
        value: 'The Sixth Sense (1999)',
        disabled: true,
    },
];

const optionsObj = { null: null };
bruceWillisMovies.map((option) => {
    optionsObj[option.name] = option;
    return option;
});

const DropdownWrapper = (props) => {
    const [selectedOption, setSelectedOption] = React.useState(props.selectedOption);

    React.useEffect(() => {
        setSelectedOption(props.selectedOption);
    }, [props.selectedOption]);

    const intermediateSetSelect = (option, index) => {
        // console.log('Index:', index, 'Name:', option.name, 'Value:', option.value);
        setSelectedOption(option);
    };

    return (
        <Dropdown
            name='Willis Film Select'
            size={props.size}
            disabled={props.disabled}
            placeholder={props.placeholder}
            options={props.options}
            selectedOption={selectedOption}
            onChange={intermediateSetSelect}
        />
    );
};

test('Dropdown toggles open', () => {
    const { getByTestId } = render(
        <DropdownWrapper
            size='medium'
            disabled={false}
            placeholder='Select Willis Film...'
            selectedOption={undefined}
            options={bruceWillisMovies}
        />,
    );
    const options = getByTestId('options-list');
    const header = getByTestId('dropdown-header');

    expect(options).not.toHaveClass('open');

    fireEvent.click(header);
    expect(options).toHaveClass('open');

    fireEvent.click(header);
    expect(options).not.toHaveClass('open');
});

test('Dropdown item selections - active && disabled', () => {
    const { getByTestId, getByText } = render(
        <DropdownWrapper
            size='medium'
            disabled={false}
            placeholder='Select Willis Film...'
            selectedOption={undefined}
            options={bruceWillisMovies}
        />,
    );
    const header = getByTestId('dropdown-header');
    expect(header).toHaveTextContent(/select willis film/i);
    fireEvent.click(header);
    const fifthEl = getByText(/the fifth element/i);
    const pulpFict = getByText(/pulp fiction/i);
    fireEvent.mouseDown(pulpFict);
    
    expect(header).not.toHaveTextContent(/pulp fiction/i);
    expect(header).toHaveTextContent(/select willis film/i);
    fireEvent.mouseDown(fifthEl);
    expect(header).toHaveTextContent(/the fifth element/i);
});

test('Dropdown can\'t toggle when disabled', () => {
    const { getByTestId } = render(
        <DropdownWrapper
            size='medium'
            disabled
            placeholder='Select Willis Film...'
            selectedOption={undefined}
            options={bruceWillisMovies}
        />,
    );
    const options = getByTestId('options-list');
    const header = getByTestId('dropdown-header');
    expect(options).not.toHaveClass('open');
    expect(header).toHaveClass('disabled');
    fireEvent.click(header);
    expect(header).not.toHaveClass('open');
});
