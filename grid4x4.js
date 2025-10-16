function layout() {
    const MAX_GRID = 4;
    return {
        name: "Grid 4x4",
        initialState: {
            mainPaneRatio: 0.5,
            mainPaneCount: 1,
        },
        commands: {
            shrinkMain: {
                description: "Shrink main pane ratio",
                updateState: (state) => {
                    return {...state, mainPaneRatio: Math.max(0.1, state.mainPaneRatio - 0.1)};
                }
            },
            expandMain: {
                description: "Expands main pane ratio",
                updateState: (state) => {
                    return {...state, mainPaneRatio: Math.min(.9, state.mainPaneRatio + 0.1)};
                }
            },
            increaseMain: {
                description: "Shrink main pane count",
                updateState: (state) => {
                    return {...state, mainPaneCount: Math.max(1, state.mainPaneCount - 1)};
                }
            },
            decreaseMain: {
                description: "Expands main pane count",
                updateState: (state) => {
                    return {...state, mainPaneCount: Math.min(4, state.mainPaneCount + 1)};
                }
            }
        },

        getFrameAssignments: (windows, screenFrame, state) => {
            const windowCount = windows.length;
            if (windowCount === 0) return {};

            if (windowCount === 1) {
                return {
                    [windows[0].id]: {
                        x: screenFrame.x,
                        y: screenFrame.y,
                        width: screenFrame.width,
                        height: screenFrame.height
                    }
                };
            }

            let mainPaneCount = Math.min((state.mainPaneCount ?? 1), windows.length, MAX_GRID);
            let mainPaneRatio = Math.min(0.9, Math.max(0.1, (state.mainPaneRatio ?? 0.5)));

            const data = {
                windowCount,
                mainPaneRatio,
                mainPaneCount,
                secondaryPaneCount: Math.max(0, Math.min(MAX_GRID, windows.length - mainPaneCount)),
                max_grid: MAX_GRID,
            };

            if (screenFrame.width < screenFrame.height) {
                return designPortrait(windows, screenFrame, data);
            }
            return designLandscape(windows, screenFrame, data);
        }
    }
}

function designPortrait(windows, screenFrame, data) {
    const mainH = Math.floor(screenFrame.height * data.mainPaneRatio);

    const mainPaneArea = {
        height: mainH,
        width: screenFrame.width,
        topY: screenFrame.y + screenFrame.height - mainH,
        topX: screenFrame.x,
        windowsCount: Math.min(data.mainPaneCount, windows.length, data.max_grid),
    };
    const secondaryPaneArea = {
        height: screenFrame.height - mainPaneArea.height,
        width: screenFrame.width,
        topY: screenFrame.y,
        topX: screenFrame.x,
        windowsCount: Math.min(data.max_grid, windows.length - mainPaneArea.windowsCount),
    };

    const mainWindows = windows.slice(0, mainPaneArea.windowsCount);
    const secondaryWindows = windows.slice(
        mainPaneArea.windowsCount,
        mainPaneArea.windowsCount + secondaryPaneArea.windowsCount
    );

    return {
        ...designSection({...mainPaneArea, windows: mainWindows}, true),
        ...designSection({...secondaryPaneArea, windows: secondaryWindows}),
    };
}

function designLandscape(windows, screenFrame, data) {
    const mainW = Math.floor(screenFrame.width * data.mainPaneRatio);

    const mainPaneArea = {
        height: screenFrame.height,
        width: mainW,
        topX: screenFrame.x,
        topY: screenFrame.y,
        windowsCount: Math.min(data.mainPaneCount, windows.length, data.max_grid),
    };
    const secondaryPaneArea = {
        height: screenFrame.height,
        width: screenFrame.width - mainPaneArea.width,
        topX: screenFrame.x + mainPaneArea.width, // ✅ fix
        topY: screenFrame.y,
        windowsCount: Math.min(data.max_grid, windows.length - mainPaneArea.windowsCount),
    };

    const mainWindows = windows.slice(0, mainPaneArea.windowsCount);
    const secondaryWindows = windows.slice(
        mainPaneArea.windowsCount,
        mainPaneArea.windowsCount + secondaryPaneArea.windowsCount
    );

    return {
        ...designSection({...mainPaneArea, windows: mainWindows}, true),
        ...designSection({...secondaryPaneArea, windows: secondaryWindows}),
    };
}

function designSection(area, isMain = false) {
    if (area.windowsCount === 0) return {};

    if (area.windowsCount === 1) {
        const w = area.windows[0];
        return {
            [w.id]: {isMain, x: area.topX, y: area.topY, width: area.width, height: area.height}
        };
    }

    if (area.windowsCount === 2) {
        const [w1, w2] = area.windows;
        return {
            [w1.id]: {isMain, x: area.topX, y: area.topY, width: area.width / 2, height: area.height},
            [w2.id]: {isMain, x: area.topX + area.width / 2, y: area.topY, width: area.width / 2, height: area.height},
        };
    }

    if (area.windowsCount === 3) {
        const [w1, w2, w3] = area.windows;
        return {
            [w1.id]: {isMain, x: area.topX, y: area.topY, width: area.width / 2, height: area.height},
            [w2.id]: {
                isMain,
                x: area.topX + area.width / 2,
                y: area.topY,
                width: area.width / 2,
                height: area.height / 2
            },
            [w3.id]: {
                isMain, x: area.topX + area.width / 2,
                y: area.topY + area.height / 2,
                width: area.width / 2,
                height: area.height / 2
            },
        };
    }

    if (area.windowsCount === 4) {
        const [w1, w2, w3, w4] = area.windows;
        return {
            [w1.id]: {isMain, x: area.topX, y: area.topY, width: area.width / 2, height: area.height / 2},
            [w2.id]: {
                isMain,
                x: area.topX,
                y: area.topY + area.height / 2,
                width: area.width / 2,
                height: area.height / 2
            },
            [w3.id]: {
                isMain,
                x: area.topX + area.width / 2,
                y: area.topY,
                width: area.width / 2,
                height: area.height / 2
            },
            [w4.id]: {
                isMain, x: area.topX + area.width / 2,
                y: area.topY + area.height / 2,
                width: area.width / 2,
                height: area.height / 2
            },
        };
    }

    return {};
}