import type API from '../lib/API';
import type PageEvent from '../lib/PageEvent';
import type CopyText from '../lib/components/CopyText';
import type Combobox from '../lib/components/form/element/combobox';
import type DropDown from '../lib/components/form/element/dropdown';
import type DropDownItem from '../lib/components/form/element/dropdownItem';
import type OnOffSwitch from '../lib/components/form/element/onOffSwitch';
import type Switch from '../lib/components/form/element/switch';

test('component declarations accept arbitrary props', () => {
    const props: {
        copyText: ConstructorParameters<typeof CopyText>[0];
        combobox: ConstructorParameters<typeof Combobox>[0];
        dropdown: ConstructorParameters<typeof DropDown>[0];
        dropdownItem: ConstructorParameters<typeof DropDownItem>[0];
        onOffSwitch: ConstructorParameters<typeof OnOffSwitch>[0];
        switch: ConstructorParameters<typeof Switch>[0];
    } = {
        copyText: {custom: true},
        combobox: {custom: true},
        dropdown: {custom: true},
        dropdownItem: {custom: true},
        onOffSwitch: {custom: true},
        switch: {custom: true},
    };
    expect(Object.keys(props)).toHaveLength(6);
});

test('API options accept an explicitly undefined parameter enhancer', () => {
    const args: Parameters<typeof API>[1] = {enhanceParameters: undefined};
    expect(args.enhanceParameters).toBeUndefined();
});

test('PageEvent declarations support calls and construction', () => {
    const createEvent: typeof PageEvent = jest.fn();
    createEvent('test', () => {});
    const event: InstanceType<typeof PageEvent> = new createEvent('test', () => {});
    expect(event).toBeDefined();
});
