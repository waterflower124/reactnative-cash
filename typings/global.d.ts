declare type ErrorReasonParams = {}
declare interface ErrorReasons {
    [reasonCode: string]: ErrorReasonParams
}

declare type PromiseState<T, E = Error>
    = { _: 'loading' }
    | { _: 'failure', error: E }
    | { _: 'success', item: T }

declare interface EntityValidationError {
    field: string
    code: string
    params: {}
}

declare type Omit<T, K extends keyof T> =
    Pick<T, ({ [P in keyof T]: P } & { [P in K]: never } & { [x: string]: never, [x: number]: never })[keyof T]>
