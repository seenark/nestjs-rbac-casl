import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { CreateArticleDto } from "src/article/dto/create-article.dto";
import { UpdateArticleDto } from "src/article/dto/update-article.dto";
import { Article } from "src/article/entities/article.entity";
import { User } from "src/user/entities/user.entity";

export enum Actions {
  create = "create",
  read = "read",
  update = "update",
  delete = "delete",
  manage = "manage",
}

export type Subjects = InferSubjects<
  "all" | typeof Article | typeof CreateArticleDto | typeof UpdateArticleDto
>;
type AppAbility = MongoAbility<[Actions, Subjects]>;

@Injectable()
export class AbilityService {
  defineAbilityFor(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );
    if (user.isAdmin) {
      can(Actions.manage, "all");
      cannot(Actions.delete, Article, {
        authorId: {
          $not: {
            $eq: user.id,
          },
        },
      });
    } else {
      can(Actions.read, Article);
      can(Actions.create, CreateArticleDto);
      can(Actions.update, UpdateArticleDto, {
        authorId: user.id,
      });
    }

    return build({
      detectSubjectType: (subject) =>
        subject.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
