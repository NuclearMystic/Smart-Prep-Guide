// PrepItem Class Definition
export class PrepItem {
    constructor(name, unitPrefix = "", isFrozen = false) {
        if (!name || typeof name !== 'string') {
            throw new Error("Invalid name: A valid string is required.");
        }

        this.name = name.trim(); // Sanitize and trim the name
        this.unitPrefix = unitPrefix ? unitPrefix.trim() : ""; // Ensure unitPrefix is a trimmed string
        this.isFrozen = Boolean(isFrozen); // Coerce isFrozen to a boolean
    }
}
