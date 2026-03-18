import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import type { Relation } from "typeorm";
import { OauthApplicationEntity } from "./application.entity.js";

@Entity("oauth-redirect-uri")
export class OauthRedirectURIEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  value!: string;

  @ManyToOne(() => OauthApplicationEntity, (application) => application, {
    onDelete: "CASCADE",
  })
  application!: Relation<OauthApplicationEntity>;
}
