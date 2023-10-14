class PaceCalc {
    constructor(SecondsPerMile) {
        this._SecondsPerMile = SecondsPerMile;
        this._SecondsPerKilometer = this._SecondsPerMile / PaceCalc.mileToKMConversionConstant;
    }
    get MinutesPerKilometerFormatted() {
        return PaceCalc.formatDurationFromSeconds(this._SecondsPerKilometer);
    }
    get MinutesPerMileOriginal() {
        return parseFloat(this._InputPaceHMS).toFixed(2).replace('.', ':');
    }
    get MinutesPerMileFormatted() {
        return PaceCalc.formatDurationFromSeconds(this._SecondsPerMile);
    }
    get SecondsPerMile() {
        return this._SecondsPerMile;
    }
    get SecondsPerKilometer() {
        return this._SecondsPerKilometer;
    }
    get Estimated5KTotalTimeFormatted() {
        return PaceCalc.formatDurationFromSeconds(this._SecondsPerKilometer * 5);
    }
    get Estimated5KTotalTimeMinutesDecimal() {
        return (this._SecondsPerKilometer * 5) / 60;
    }
    get Estimated10TotalTimeFormatted() {
        return PaceCalc.formatDurationFromSeconds(this._SecondsPerKilometer * 10);
    }
    get MilesPerHour() {
        return 60 / (this._SecondsPerMile / 60);
    }
    get KmPerHour() {
        return 60 / (this._SecondsPerKilometer / 60);
    }
    static getNumber(stringValue) {
        const num = parseInt(stringValue);
        return isNaN(num) ? 0 : num;
    }
    static msStringToSeconds(mmss) {
        let seconds = 0;
        mmss = mmss.replace(':', '.');
        const timeParts = mmss.split('.');
        if (timeParts.length == 1) {
            seconds = this.getNumber(timeParts[0]) * 60;
        }
        else if (timeParts.length == 2) {
            let secondsString = timeParts[1] + "00";
            secondsString = secondsString.slice(0, 2);
            seconds = (this.getNumber(timeParts[0]) * 60) + this.getNumber(secondsString);
        }
        return seconds;
    }
    static formatDurationFromSeconds(seconds) {
        // 502 seconds
        const minutesDecimal = seconds / 60;
        // 8.36666667
        const minutesPortion = PaceCalc.precisionRoundMod(Math.floor(minutesDecimal), 0);
        // 8
        const secondsDecimal = (minutesDecimal - minutesPortion) * 60;
        // 22.000002
        const secondsPortion = PaceCalc.precisionRoundMod(secondsDecimal, 0);
        // 22
        // let timeString = new Date(seconds * 1000).toISOString().substring(11, 11 + 8);
        // timeString = timeString.replace(/^0(?:0:0?)?/, '');
        const secondsPadded = String(secondsPortion).padStart(2, '0');
        //2 = 02
        return `${minutesPortion}:${secondsPadded}`;
    }
    static calcPaceFromTotalTime(totalSeconds, km) {
        const secondsPerKM = totalSeconds / km;
        const secondsPerMile = secondsPerKM * this.mileToKMConversionConstant;
        return secondsPerMile;
    }
    static RoundUpToNearest(passednumber, roundto) {
        if (roundto == 0) {
            return passednumber;
        }
        else {
            let x = passednumber / roundto;
            if (Number.isInteger(x)) {
                x = x + .1;
            }
            return Math.ceil(x) * roundto;
        }
    }
    static RoundDownToNearest(passednumber, roundto) {
        if (roundto == 0) {
            return passednumber;
        }
        else {
            let x = passednumber / roundto;
            if (Number.isInteger(x)) {
                x = x - .1;
            }
            return Math.floor(x) * roundto;
        }
    }
    static precisionRoundMod(number, precision) {
        let factor = Math.pow(10, precision);
        let n = precision < 0 ? number : 0.01 / factor + number;
        return Math.round(n * factor) / factor;
    }
}
PaceCalc.mileToKMConversionConstant = 1.609344;
