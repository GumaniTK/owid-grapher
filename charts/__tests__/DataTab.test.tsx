#! /usr/bin/env yarn jest

import { setupChart } from "test/utils"
import { DataTab } from "charts/DataTab"
import { Bounds } from "charts/Bounds"

function setupDataTab(chartID: number, varIDs: number[]) {
    const chart = setupChart(chartID, varIDs)
    const bounds = Bounds.empty()
    return new DataTab({ bounds, chart })
}

function testIfDataTabMatchesSnapshot(
    dataTab: DataTab,
    done: jest.DoneCallback
) {
    const blob = dataTab.csvBlob
    const reader = new FileReader()
    reader.addEventListener("loadend", () => {
        expect(reader.result).toMatchSnapshot()
        done()
    })
    reader.readAsText(blob)
}

describe("DataTab data downloads", () => {
    test("one year-based variable", done => {
        const dataTab = setupDataTab(677, [104402])
        testIfDataTabMatchesSnapshot(dataTab, done)
    })

    test("one day-based variable, one year-based variable", done => {
        const dataTab = setupDataTab(4041, [142586, 2209, 123])
        testIfDataTabMatchesSnapshot(dataTab, done)
    })

    test("two day-based variables", done => {
        const dataTab = setupDataTab(4054, [142586, 142587, 123])
        testIfDataTabMatchesSnapshot(dataTab, done)
    })
})
