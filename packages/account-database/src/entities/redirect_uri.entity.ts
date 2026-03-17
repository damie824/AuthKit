import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OauthApplicationEntity } from "./application.entity";

@Entity("oauth-redirect-uri")
export class OauthRedirectURIEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  value!: string;

  @ManyToOne(() => OauthApplicationEntity, (application) => application, {
    onDelete: "CASCADE",
  })
  application!: OauthApplicationEntity;
}
