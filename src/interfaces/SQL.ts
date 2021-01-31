export interface SQL {
    // rows needs to be a list of any so that
    // this interface can be used with all tables of different types
    rows?: any[];
    rowCount?: number;
    // could be SQL commands like INSERT, SELECT, etc.
    command?: string;
}
