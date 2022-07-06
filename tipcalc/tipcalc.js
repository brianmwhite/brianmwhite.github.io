class TipCalcResult {
    constructor() {
        this.originalTotal = 0;
        this.tip = 0;
        this.totalAmount = 0;
        this.actualPercent = 0;
    }
}
class TipCalc {
    constructor(TotalAmount) {
        this._InputValue = "";
        this._OriginalTotal = 0;
        this._TargetPercent = 0;
        this._ActualPercent = 0;
        this._TipAmount = 0;
        this._Nearest = 0;
        this._InputValue = TotalAmount;
        this._OriginalTotal = this.getNumber(TotalAmount);
    }
    get OriginalTotal() {
        return this._OriginalTotal;
    }
    get TipAmount() {
        return this._TipAmount;
    }
    get TotalAmount() {
        return this._OriginalTotal + this._TipAmount;
    }
    get TargetPercent() {
        return this._TargetPercent;
    }
    get ActualPercent() {
        let pct = (this._ActualPercent * 100).toFixed(2);
        return Number(pct);
    }
    get ActualPercentFormatted() {
        return this.ActualPercent + "%";
    }
    get Nearest() {
        return this._Nearest;
    }
    getNumber(stringValue) {
        const num = parseFloat(stringValue);
        return isNaN(num) ? 0 : num;
    }
    roundToTwo(num) {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    }
    createResultJson() {
        let result = new TipCalcResult();
        result.originalTotal = this._OriginalTotal;
        result.tip = this._TipAmount;
        result.totalAmount = this.TotalAmount;
        result.actualPercent = this.ActualPercent;
        return result;
    }
    calculateTip(percent, nearest = 0, roundTotal = false) {
        let floatPercent = percent / 100;
        this._TargetPercent = percent;
        this._Nearest = nearest;
        let tip = 0;
        tip = this._OriginalTotal * floatPercent;
        
        if (roundTotal == true) {
            let newTotal = this._OriginalTotal + tip;
            newTotal = Math.ceil(newTotal);

            if (nearest > 0) {
                newTotal = Math.ceil(newTotal / nearest) * nearest;
            }

            tip = newTotal - this._OriginalTotal;
            
        } else if (nearest > 0) {
            tip = Math.ceil(tip / nearest) * nearest;
        }

        tip = this.roundToTwo(tip);
        
        this._TipAmount = tip;
        this._ActualPercent = tip / this._OriginalTotal;
        return this.createResultJson();
    }
}
