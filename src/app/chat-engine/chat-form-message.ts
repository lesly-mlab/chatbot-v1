export interface ChatFormMessage {
    id?: string
    type: String
    content?: String
    next?: String
    fieldType?: String
    source?: String
    options?: Array<ChatFormOption>
    image?: string
}

export interface ChatFormOption {
    text: String
    next: String
}