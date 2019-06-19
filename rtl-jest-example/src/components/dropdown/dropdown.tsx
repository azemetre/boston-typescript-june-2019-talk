import * as React from 'react';
import cx from 'classnames';
import s from './dropdown.styl';

export enum Size {
    'small' = 'small',
    'medium' = 'medium',
    'large' = 'large',
}

interface IOption {
    name: string;
    value: string | number;
    disabled: boolean;
}

interface IDropdownProps {
    /**
     * Function called when any item is selected from the dropdown
     */
    onChange?: (option, index) => void;
    /**
     * Toggles whether the button is interactable (also changes styles)
     */
    disabled?: boolean;
    /**
     * Three presets (small, medium, large)
     */
    size: Size;
    /**
     * Name property of the "select" element
     */
    name: string;
    /**
     * Array of select objects containing properties: name, value, and disabled.
     */
    options: IOption[];
    /**
     * Default selection
     */
    selectedOption: IOption;
    /**
     * Text in the select box when no option is selected
     */
    placeholder: string;
}

interface IDropdownState {
    open: boolean;
}

class Dropdown extends React.Component<IDropdownProps, IDropdownState> {
    static defaultProps = {
        size: Size.medium,
        placeholder: 'Select...',
        disabled: false,
    };

    state = {
        open: false,
    }

    onBlur = () => {
        this.setState({
            open: false,
        });
    }

    onClick = () => {
        const { open } = this.state;
        this.setState({
            open: !open,
        });
    }

    onChange = (option, index) => (e) => {
        const { onChange } = this.props;
        this.setState({
            open: false,
        });
        onChange(option, index);
        e.stopPropagation();
    }

    onHeaderKeyPress = (e) => {
        if (e.charCode === 13 || e.charCode === 32) {
            this.onClick();
        }
    }

    render() {
        const {
            size,
            options,
            selectedOption,
            disabled,
            placeholder,
        } = this.props;
        const { open } = this.state;

        const containerClass = cx(
            s.container,
            s.list,
            {
                [s.disabled]: disabled,
                [s.open]: open,
            },
            s[size],
        );

        const headClass = cx(
            s.dropdown,
            s.head,
            {
                [s.disabled]: disabled,
                [s.open]: open,
                [s.empty]: selectedOption,
            },
            s[size],
        );

        const optionsClass = cx(
            s.dropdown,
            s.options,
            s.list,
            { [s.open]: open },
        );

        const arrowClass = cx(
            s['dropdown-arrow'],
            'material-icons',
            { [s.open]: open },
        );

        return (
            <ul
                className={containerClass}
                onBlur={this.onBlur}
            >
                <li
                    className={headClass}
                    onClick={disabled ? null : this.onClick}
                    tabIndex={disabled ? undefined : 0}
                    onKeyPress={this.onHeaderKeyPress}
                >
                    <span
                        className={headClass}
                        data-testid='dropdown-header'
                    >
                        {selectedOption ? selectedOption.name : placeholder}
                    </span>
                    <span
                        style={{ fontSize: 'calc(1em + 1rem)' }}
                        className={arrowClass}
                    >
                        keyboard_arrow_right
                    </span>
                </li>
                <ul className={optionsClass} data-testid='options-list'>
                    {
                        options.map((option, index) => (
                            option.disabled
                                ? (
                                    <li
                                        className={cx(s.dropdown, s.disabledItem)}
                                        key={`option-${option.name}-disabled`}
                                    >
                                        <span className={cx(s.dropdown, s.item)}>{option.name}</span>
                                    </li>
                                )
                                : (
                                    <li
                                        className={cx(s.dropdown, s.item,)}
                                        onMouseDown={this.onChange(option, index)}
                                        key={`option-${option.name}`}
                                    >
                                        <span
                                            className={cx(s.dropdown, s.item)}
                                            data-testid={`listItem-name-${index}`}
                                        >
                                            {option.name}
                                        </span>
                                    </li>
                                )
                        ))
                    }
                </ul>
            </ul>
        );
    }
}

export default Dropdown;
