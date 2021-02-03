export interface User {
    user_id: number,
    // have the option to use either format for first name variable
    firstName: string;
    first_name?: string;
    lastName: string;
    last_name?: string;
    password: string;
}
