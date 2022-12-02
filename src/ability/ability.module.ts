import { Global, Module } from "@nestjs/common";
import { AbilityService } from "./ability.service";

@Global()
@Module({
  providers: [AbilityService],
  exports: [AbilityService],
})
export class AbilityModule {}
