import { ChatFormMessage } from "./chat-form-message";
import { ChatFormInterface } from "./chat-form-interface";

export class ChatForm {
    messages: Array<ChatFormMessage> = []
    private form: any = {}
    private formValues = {}
    private chatFormListener: ChatFormInterface;
    private currentMessageId: String;
    public currentMessage: ChatFormMessage;
    public messageListener

    constructor(json: any) {
        if (json) {
            this.form = json
        }
    }

    setFormValue(field, value) {
        this.formValues[field] = value
    }

    setListener(listener: ChatFormInterface) {
        this.chatFormListener = listener;
        console.log(this.chatFormListener)
    }

    sendFromJson(id, json) {
        const message: ChatFormMessage = {
            id: id,
            type: json['type'],
            content: json['content'],
            next: json['next'],
            fieldType: json['fieldType'],
            source: json['source'],
            options: json['options'],
            image: json['image']
        }

        this.messages.unshift(message)
        this.messageListener.newMessage()
    }

    start() {
        if (this.form.start) {
            this.nextMessage(this.form.start)
        } else {
            console.log('Form does not have starting point')
        }
    }

    sendImage(image: string, isReply?: Boolean, valueToSend?: string) {
        const message: ChatFormMessage = {
            type: isReply ? 'sent' : 'message',
            image: image
        }

        this.sendFromJson(null, message);

        if (isReply) {
            if (valueToSend) {
                this.formValues[this.currentMessage.id] = valueToSend;
            } else {
                this.formValues[this.currentMessage.id] = image;
            }
            
            if (this.currentMessage.next) {
                this.nextMessage(this.currentMessage.next)
            }
        }
    }

    sendMessage(text: String, isReply?: Boolean, valueToSend?: string) {
        const message: ChatFormMessage = {
            type: isReply ? 'sent' : 'message',
            content: text
        }

        this.sendFromJson(null, message);

        if (isReply) {
            if (valueToSend) {
                this.formValues[this.currentMessage.id] = valueToSend;
            } else {
                this.formValues[this.currentMessage.id] = text;
            }
            
            if (this.currentMessage.next) {
                this.nextMessage(this.currentMessage.next)
            }
        }
    }

    messageClicked() {
        console.log(this.currentMessage.fieldType)
        console.log(this.chatFormListener)
        switch (this.currentMessage.fieldType) {
            case 'dropdown':
                if (this.chatFormListener) {
                    return this.chatFormListener.dropdownList(this.currentMessage.id, this.formValues);
                }
                break
        }
        
    }

    nextMessage(id) {
        this.currentMessageId = id;
        const message = this.form[id]
        this.currentMessage = message
        message.id = id
        if (message) {
            switch (message.type) {
                case 'message':
                    this.plainMessage(message)
                    break
                case 'question':
                    this.question(id, message)
                    break
                case 'action':
                    this.handleAction(id)
                    break
                case 'options':
                    this.handleOptions(id, message)
                    break
                default:
                    console.log('Message type not recognized')
                    break
            }
        } else {
            console.log('Message does not exist')
        }
    }

    handleOptions(id, message) {
        this.sendFromJson(id, message)
    }

    handleAction(action) {
        if (this.chatFormListener) {
            this.chatFormListener.callAction(action, this.formValues)
        }
    }

    private plainMessage(message) {
        this.sendMessage(message.content)

        if (message.next) {
            this.nextMessage(message.next)
        }
    }

    optionSelected(option) {
        if (option.next) {
            this.sendMessage(option.text, true, option.value)
            this.nextMessage(option.next)
        }
    }

    private question(id, message: ChatFormMessage) {
        this.messages.unshift(message)
        switch (message.fieldType) {
            case 'text':
                break
            case 'date':
                break
            case 'dropdown':
                break
        }
    }
}