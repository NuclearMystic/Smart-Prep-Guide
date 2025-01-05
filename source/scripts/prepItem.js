// PrepItem Class Definition
export class PrepItem {
    constructor(name, unitPrefix = "", isFrozen = false) {
        this.name = name;
        this.unitPrefix = unitPrefix;
        this.isFrozen = isFrozen;
    }
}
