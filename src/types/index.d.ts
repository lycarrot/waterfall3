import type { ComponentPublicInstance, FunctionalComponent } from "vue";
declare module "vue" {
  export type JSXComponent<Props = any> =
    | { new (): ComponentPublicInstance<Props> }
    | FunctionalComponent<Props>;
}
