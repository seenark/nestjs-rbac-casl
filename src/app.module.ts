import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ArticleModule } from "./article/article.module";
import { UserModule } from "./user/user.module";
import { AbilityModule } from "./ability/ability.module";

@Module({
  imports: [ArticleModule, UserModule, AbilityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
