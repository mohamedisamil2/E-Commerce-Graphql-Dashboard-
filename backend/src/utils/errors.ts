import pkg from "graphql"
const { GraphQLError } =pkg;



export class AuthenticationError extends GraphQLError{

    constructor(message = "Unauthorized") {
        super(message, {
            extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
        });
    }
}


export class ForbiddenError extends GraphQLError{
    constructor(message = "You dont have permission to perform this action") {
        super(message, {
            extensions: { code: "FORBIDDEN", http: { status: 403 } }
        });
    }
}


export class NotFoundError extends GraphQLError{
    constructor(message = "Not Found") {
        super(message, {
            extensions: { code: "NOT_FOUND", http: { status: 400 } }
        });
    }
}


export class ValidationError extends GraphQLError{
    constructor(message = "Invalid input") {
        super(message, {
            extensions: { code: "BAD_USER_INPUT", http: { status: 400 } }
        });
    }
}