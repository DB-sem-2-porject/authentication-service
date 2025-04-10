


export class NotAllowedEmailError extends Error {
    constructor(public readonly message: 'Email is not allowed') {
        super(message);
        this.name = 'NotAllowedEmailError';

        // Этот хак нужен для правильной работы прототипного наследования в JS
        Object.setPrototypeOf(this, NotAllowedEmailError.prototype);
    }
}
