import { commonHttpErrors } from "./common.exception"
import { userHttpErrors } from "./user.exception"
import { assignmentHttpErrors } from "./assignment.exception"
import { classHttpErrors } from "./class.exception"

export const ERROR = {
  ...commonHttpErrors,
  ...userHttpErrors,
  ...assignmentHttpErrors,
  ...classHttpErrors
}
