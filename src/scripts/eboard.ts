/**
 * parse page for available eboard years and return array of valid eboard years
 * @returns availibleYears all of the eboard years
 */
function getAvailibleYears(): number[] {
    const availibleYears: number[] = [];

    document.querySelectorAll('[id^=eboard_]').forEach((element): void => {
        const reg = /\d+/g;
        const year: number = parseInt(element.id.match(reg)[0], 10);
        if (!Number.isNaN(year)) availibleYears.push(year);
    });

    if (!availibleYears) throw new Error('no eboard years found');
    return availibleYears;
}

/**
 * @param yearHash the url location specifying the focused eboard year e.g. http://rowanieee.org/eboard#2019
 * @returns selectedYear
 */
function getSelectedYear(yearHash: number, years: number[]): number {
    // if no year is specified in url, use the most recent year as default
    return yearHash || Math.max(...years);
}

/**
 * shows only the eboard for the selected year
 * @param selectedYear the eboard year to display
 * @param availibleYears all of the eboard years on the page
 */
function toggleEboard(selectedYear: number, availibleYears: number[]): void {
    document.getElementById('year').innerText = selectedYear.toString();
    availibleYears.forEach((availibleYear): void => {
        document.getElementById(`eboard_${availibleYear}`).style.display = (availibleYear === selectedYear) ? 'flex' : 'none';
    });
}

// Run whenever page fist loads or when selected eboard year changes
['DOMContentLoaded', 'hashchange'].map((event): void => window.addEventListener(event, async (): void => {
    const yearHash: number = parseInt(window.location.hash.substring(1), 10);
    const availibleYears: number[] = getAvailibleYears();
    const selectedYear: number = await getSelectedYear(yearHash, availibleYears);
    toggleEboard(selectedYear, availibleYears);
}));
