import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UpdateArticleDto } from "src/article/dto/update-article.dto";
import { User } from "src/user/entities/user.entity";
import { AbilityService, Actions, Subjects } from "./ability.service";

export interface IAbility {
  action: Actions;
  subject: Subjects;
}

@Injectable()
export class AbilityGuard implements CanActivate {
  constructor(
    private abilityService: AbilityService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = new User();
    user.id = 2;
    user.fullname = "John";
    user.isAdmin = false;

    const rules = this.abilityService.defineAbilityFor(user);

    const abilities = this.reflector.get<IAbility[]>(
      "ability",
      context.getHandler(),
    );

    const ability1 = abilities[0];

    switch (ability1.subject) {
      case UpdateArticleDto:
        console.log("do update");
        const data = new UpdateArticleDto();
        data.authorId = req.body.authorId;
        data.content = req.body.content;
        const canDo = rules.can(ability1.action, data);
        if (!canDo) {
          throw new UnauthorizedException("asdfsj");
        }
      default:
        const canDo1 = rules.can(ability1.action, ability1.subject);
        console.log("can do gu", canDo1);
        if (!canDo1) {
          throw new ForbiddenException("forbidden");
        }
    }

    return true;
  }
}
