import { ForbiddenError } from "@casl/ability";
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
  UnauthorizedException,
  SetMetadata,
  UseGuards,
} from "@nestjs/common";
import { Rules } from "src/ability/ability.decorator";
import { AbilityGuard } from "src/ability/ability.guard";
import { AbilityService, Actions } from "src/ability/ability.service";
import { User } from "src/user/entities/user.entity";
import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { Article } from "./entities/article.entity";

@Controller("article")
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private abilityService: AbilityService,
  ) {}

  @Post()
  @UseGuards(AbilityGuard)
  @SetMetadata("ability", [
    {
      action: Actions.create,
      subject: CreateArticleDto,
    },
  ])
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Get()
  @UseGuards(AbilityGuard)
  @SetMetadata("ability", [
    {
      action: Actions.read,
      subject: Article,
    },
  ])
  findAll() {
    return "this is your article";
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.articleService.findOne(+id);
  }

  @Patch(":id")
  @UseGuards(AbilityGuard)
  // @SetMetadata("ability", [
  //   {
  //     action: Actions.update,
  //     subject: UpdateArticleDto,
  //   },
  // ])
  @Rules(
    {
      action: Actions.update,
      subject: UpdateArticleDto,
    },
    {
      action: Actions.create,
      subject: CreateArticleDto,
    },
  )
  update(@Param("id") id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.articleService.remove(+id);
  }
}
