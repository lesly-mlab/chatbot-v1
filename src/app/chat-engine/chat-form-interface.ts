import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

export interface ChatFormInterface {
    // optionsResult(key, value);
    callAction(action, formValues)
    dropdownList(id, formValues): Promise<Array<{name: string, value: string}>> | Observable<Array<{name: string, value: string}>> | Array<{name: string, value: string}>;
    dropdownEmpty();
}