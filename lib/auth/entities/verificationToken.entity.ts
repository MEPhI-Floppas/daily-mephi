import {Entity} from "lib/database/decorators/entity.decorator";
import {BaseEntity} from "lib/database/baseEntity";
import {Column} from "lib/database/decorators/column.decorators";
import {Types} from "ydb-sdk";

@Entity()
export class VerificationToken extends BaseEntity {

    @Column(Types.STRING, {primary: true})
    public id: string;

    @Column(Types.STRING)
    public token: number;

    @Column(Types.TIMESTAMP)
    public timestamp: Date;


    constructor(id: string, token: number, timestamp: Date) {
        super();
        this.id = id;
        this.token = token;
        this.timestamp = timestamp;
    }
}