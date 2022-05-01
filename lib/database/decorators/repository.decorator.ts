// import {Service as Repository} from "./service.decorator"
import {autoInjectable, singleton} from "tsyringe";

export const TARGET_ENTITY_TOKEN = Symbol('entity')


export function Repository(entity: any): ClassDecorator {

    return (target: any) => {
        target = autoInjectable()(target);
        singleton()(target);
        Reflect.defineMetadata(TARGET_ENTITY_TOKEN, entity, target);
    };
}