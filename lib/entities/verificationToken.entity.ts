import {Entity} from "../database/decorators/entity.decorator";
import {BaseEntity} from "../database/baseEntity";
import {Column} from "../database/decorators/column.decorators";
import {Types} from "ydb-sdk";

@Entity()
export class VerificationToken extends BaseEntity {

    @Column(Types.UINT64, {primary: true})
    public id: number;

    @Column(Types.STRING)
    public token: number;

    @Column(Types.TIMESTAMP)
    public timestamp: Date;


    constructor(id: number, token: number, timestamp: Date) {
        super();
        this.id = id;
        this.token = token;
        this.timestamp = timestamp;
    }
}