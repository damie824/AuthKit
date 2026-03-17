import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OauthConnectEntity } from "./connect.entity";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  nickname!: string;

  @OneToMany(() => OauthConnectEntity, (connect) => connect.user)
  oauth_connects!: OauthConnectEntity[];
}
