/**
 * @typedef {object} YearMonthViewChangeEventDetail
 * @property {number} year
 * @property {number} monthIndex
 * @property {string} monthLabel
 */
/**
 * @extends {CustomEvent<YearMonthViewChangeEventDetail>}
 */
export class YearMonthViewChangeEvent extends CustomEvent<YearMonthViewChangeEventDetail> {
    static get EVENT_TYPE(): string;
    /**
     * @param {number} year
     * @param {number} monthIndex
     * @param {string} monthLabel
     * @param {CustomEventInit<YearMonthViewChangeEventDetail>} [options]
     */
    constructor(year: number, monthIndex: number, monthLabel: string, options?: CustomEventInit<YearMonthViewChangeEventDetail>);
    get year(): number;
    get monthIndex(): number;
    #private;
}
export type YearMonthViewChangeEventDetail = {
    year: number;
    monthIndex: number;
    monthLabel: string;
};
