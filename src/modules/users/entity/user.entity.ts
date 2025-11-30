import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from '../../workspaces/entity/member.entity';

@Index('users_user_id_uindex', ['userId'], { unique: true })
@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @Column({ name: 'user_id', type: 'varchar', length: 255 })
    userId: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @OneToMany(() => Member, (member) => member.user)
    members: Member[];
}
