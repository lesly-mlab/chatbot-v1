export interface Message {
    message?: String
    conversationId: String
    created?: any
    file?: String
    fileType?: String
    type?: String
    from: String
    options?: Array<any>;
    callback?: any
}