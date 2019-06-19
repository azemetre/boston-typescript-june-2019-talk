/*
    Define CSS Module
    used for import css module in .styl files
    imports will be a map of css classnames
*/
declare module '*.styl' {
    interface IClassNames {
        [className: string]: string;
    }
    const classNames: IClassNames;
    export = classNames;
}