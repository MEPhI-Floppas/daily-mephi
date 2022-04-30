import {Entity} from "../../decorators/db/entity.decorator";
import {declareType, Types} from "ydb-sdk";
import {BaseEntity} from "../../implementations/baseEntity";
import {Column} from "../../decorators/db/column.decorators";
import {ManyToMany} from "../../decorators/db/manyToMany.decorator";
import {OneToMany} from "../../decorators/db/oneToMany.decorator";
import {OneToOne} from "../../decorators/db/oneToOne.decorator";
import {Review} from "../reviews/reviews.entity";

@Entity()
export class Comment extends BaseEntity {

    @Column(Types.UINT64, {primary: true})
    public id: number;

    @Column(Types.STRING)
    public text: string;

    @Column(Types.DATETIME)
    public time: Date;

    @Column(Types.STRING)
    public user: string;

    @OneToOne(Comment)
    public parent: Comment | null;

    @Column(Types.UINT64)
    public reviewId: number;


    constructor(id: number, text: string, time: Date, user: string, parent: Comment | null, reviewId: number) {
        super();
        this.id = id;
        this.text = text;
        this.time = time;
        this.user = user;
        this.parent = parent;
        this.reviewId = reviewId;
    }
}

// export interface Comment {
//     id: string,
//     text: string,
//     time: Date,
//     user: string
//     parent: string | null,
//     children: Array<string>,
//     next: Array<string>
// }