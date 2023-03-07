import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany} from "typeorm"
import { Lesson } from "./lesson";


@Entity({
    name:"COURSES"
})
export class Course {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    seqNo:number;

    @Column()
    title:string;

    @Column()
    iconUrl:string;

    @Column()
    url:string;

    @Column()
    longDescription:string;

    @Column()
    category:string;

    @OneToMany( () => Lesson, (lesson) => lesson.course)
    lessons: Lesson[];

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    lastUpdatedAt: Date;
}