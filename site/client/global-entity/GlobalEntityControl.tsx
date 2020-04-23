import * as React from "react"
import * as ReactDOM from "react-dom"
import { computed, action } from "mobx"
import { observer } from "mobx-react"
import Select, { ValueType, components, OptionProps } from "react-select"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes"

import { countries } from "utils/countries"
import { isMultiSelect, sortBy } from "charts/Util"
import {
    GlobalEntitySelection,
    GlobalEntitySelectionEntity
} from "./GlobalEntitySelection"
import { bindUrlToWindow } from "charts/UrlBinding"
import { GlobalEntitySelectionUrl } from "./GlobalEntitySelectionUrl"

const Option = (props: OptionProps<GlobalEntitySelectionEntity>) => {
    return (
        <div>
            <components.Option {...props}>
                <input type="checkbox" checked={props.isSelected} readOnly />{" "}
                <label>{props.label}</label>
            </components.Option>
        </div>
    )
}

export interface GlobalEntityControlProps {
    globalEntitySelection: GlobalEntitySelection
}

@observer
export class GlobalEntityControl extends React.Component<
    GlobalEntityControlProps
> {
    @computed private get selectedCountries(): GlobalEntitySelectionEntity[] {
        return this.props.globalEntitySelection.selectedEntities
    }

    @computed private get allCountries(): GlobalEntitySelectionEntity[] {
        return sortBy(countries, country => country.name)
    }

    @action.bound setSelectedCountries(
        countries: GlobalEntitySelectionEntity[]
    ) {
        this.props.globalEntitySelection.selectedEntities = countries
    }

    private getOptionValue(country: GlobalEntitySelectionEntity) {
        return country.code
    }

    private getOptionLabel(country: GlobalEntitySelectionEntity) {
        return country.name
    }

    @action.bound private onChange(
        countries: ValueType<GlobalEntitySelectionEntity>
    ) {
        if (countries == null) return
        if (!isMultiSelect(countries)) {
            countries = [countries]
        }
        this.setSelectedCountries(Array.from(countries))
    }

    @action.bound private onRemove(
        countryToRemove: GlobalEntitySelectionEntity
    ) {
        this.setSelectedCountries(
            this.selectedCountries.filter(
                country => country !== countryToRemove
            )
        )
    }

    render() {
        return (
            <div className="global-entity-control">
                <div className="select-dropdown-container">
                    <Select
                        options={this.allCountries}
                        getOptionValue={this.getOptionValue}
                        getOptionLabel={this.getOptionLabel}
                        onChange={this.onChange}
                        value={this.selectedCountries}
                        components={{
                            IndicatorSeparator: null,
                            Option
                        }}
                        menuPlacement="bottom"
                        isClearable={false}
                        isMulti={true}
                        backspaceRemovesValue={false}
                        blurInputOnSelect={false}
                        closeMenuOnSelect={false}
                        controlShouldRenderValue={false}
                        hideSelectedOptions={false}
                        placeholder="Add a country to all charts..."
                    />
                </div>
                <div className="selected-items-container">
                    <div className="selected-items">
                        {this.selectedCountries.map(country => (
                            <div className="selected-item">
                                <div className="label">{country.name}</div>
                                <div
                                    className="control-icon"
                                    onClick={() => this.onRemove(country)}
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

export function runGlobalEntityControl(
    globalEntitySelection: GlobalEntitySelection
) {
    const element = document.querySelector("*[data-global-entity-control]")
    if (element) {
        element.classList.add("global-entity-control-container")
        ReactDOM.render(
            <GlobalEntityControl
                globalEntitySelection={globalEntitySelection}
            />,
            element
        )
        // We only want to bind the URL if a global control element exists
        const url = new GlobalEntitySelectionUrl(globalEntitySelection)
        url.populateFromQueryStr(window.location.search)
        bindUrlToWindow(url)
    }
}